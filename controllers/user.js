const UserService = require("../service/user");

class UserController {
  async registration(req, res) {
    try {
      const { email, password, userAccounts} = req.body;
      const userData = await UserService.registration(email, password, userAccounts );
      res.cookie("refreshToken", userData.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });
      return res.json(userData);
    } catch (error) {
      res.status(400).send(error.message);
    }
  }

  async addAccounts(req, res) {
    try {
      const { email, userAccounts } = req.body;
      const userData = await UserService.account(email, userAccounts );
      
      return res.json(userData);
    } catch (error) {
      res.status(400).send(error.message);
    }
  }

  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const userData = await UserService.login(email, password);
      res.cookie("refreshToken", userData.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });
      return res.json(userData);
    } catch (error) {
      res.send(error.message);
    }
  }

  async logout(req, res, next) {
    try {
      const refreshToken = req.header('token');
      const token = await UserService.logout(refreshToken);
      res.clearCookie("refreshToken");
      return res.json(token);
    } catch (error) {}
  }

  async refresh(req, res, next) {
    try {
      const refreshToken = req.header('token');
      const userData = await UserService.refresh(refreshToken);
      res.cookie("refreshToken", userData.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });
      return res.json(userData);
    } catch (error) {}
  }

  async getUsers(req, res) {
    try {
      const token = req.header("Authorization");
      const userList = await UserService.getUsers(token);
      res.json(userList);
    } catch (error) {
      res.status(401).json({ error: error.message });
    }
  }
}

module.exports = new UserController();
