module.exports = class UserDto {
  email;
  id;
  userAccounts;
  isActivated;

  constructor(model) {
    this.email = model.email;
    this.id = model._id;
    this.isActivated = model.isActivated;
    this.userAccounts = model.userAccounts;
  }
}
