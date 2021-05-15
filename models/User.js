const bcrypt = require("bcrypt");

class User {
  constructor() {
    this.firstName = "";
    this.lastName = "";
    this.birthdayDate = new Date();
    this.phone = "";
    this.email = "";

    this.isAdmin = true;
    this._password = "";
    this.createdAt = new Date();
    this.isOnline = false;

    this.photoUri = "";
    this.facebookProfile = "";
    this.registerConfirmed = false;
    this.document = "";
    this.address = "";
    this.number = 0;
    this.complement = "";
    this.neighborhood = "";
    this.city = "";
    this.zipcode = "";
  }

  set password(newPassword) {
    this._password = bcrypt.hashSync(newPassword, 5);
  }
  get password() {
    return this._password;
  }

  async isPasswordValid(password) {
    return bcrypt.compare(password, this._password);
  }

  static fromJSON(json) {
    let user = new User();
    for (prop in user) {
      if (prop.startsWith("_")) {
        //propriedades privadas
        user[prop] = json[prop.substring(1)];
      } else user[prop] = json[prop];
    }
    return user;
  }
}
module.exports = User;
