const UserModel = require("../models/user");
const bcrypt = require("bcrypt");
const uuid = require("uuid");
const tokenService = require("./token");
const UserDto = require("../dtos/user");

class UserService {
  async registration(email, password, userAccounts) {
    const candidate = await UserModel.findOne({ email });
    if (candidate) {
      throw new Error("User with this email already exists");
    }
    const hashPassword = await bcrypt.hash(password, 3);
    const user = await UserModel.create({ email, password: hashPassword, userAccounts });
    const userDto = new UserDto(user);
    const tokens = tokenService.generateTokens({ ...userDto }); // {пара токенов}
    await tokenService.saveToken(userDto.id, tokens.refreshToken);

    return {
      ...tokens,
      user: userDto,
    };
  }
  async account(email, userAccounts) {
    const query = {email: email}
    const user = await UserModel.findOneAndUpdate(query, {userAccounts: userAccounts}, {new: true});
    const userDto = new UserDto(user);

    return userDto
  }
  async login(email, password) {
    const user = await UserModel.findOne({ email });
    if (!user) {
      throw new Error("User with this email does not exist");
    }
    const isPassEquals = await bcrypt.compare(password, user.password);
    if (!isPassEquals) {
      throw new Error("Wrong password");
    }
    const userDto = new UserDto(user);
    const token = tokenService.generateTokens({ ...userDto });
    await tokenService.saveToken(userDto.id, token.refreshToken);

    return {
      ...token,
      user: userDto,
    };
  }
  async logout(refreshToken) {
    const token = await tokenService.removeToken(refreshToken);
    return token;
  }
  async refresh(refreshToken) {
    if (!refreshToken) {
      throw new Error("You are not authorized");
    }
    const userData = tokenService.validateRefreshToken(refreshToken);
    const tokenFromDb = await tokenService.findToken(refreshToken);
    if (!userData || !tokenFromDb) {
      throw new Error("You are not authorized");
    }
    const user = await UserModel.findById(userData.id);
    const userDto = new UserDto(user);
    const token = tokenService.generateTokens({ ...userDto });
    await tokenService.saveToken(userDto.id, token.refreshToken);

    return {
      ...token,
      user: userDto,
    };
  }
  async getUsers(token) {
    const accessToken = token?.split(" ")[1];
    if (
      !token ||
      !accessToken ||
      !tokenService.validateAccessToken(accessToken)
    ) {
      throw new Error("You are not authorized");
    }
    const userList = await UserModel.find();
    return userList;
  }
}

module.exports = new UserService();
