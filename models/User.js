const bcrypt = require("bcrypt");
const BaseModel = require("./BaseModel");
class User extends BaseModel {
  constructor() {
    super();
    this.id = null;
    this.firstName = "";
    this.lastName = "";
    this._birthdayDate = new Date();
    this.phone = "";
    this.email = "";
    this.sex = "N";

    this.isAdmin = true;
    this._password = "";
    this._createdAt = new Date();
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
    this.state = "";
    this.zipcode = "";
  }

  set password(newPassword) {
    this._password = bcrypt.hashSync(newPassword, 5);
  }
  get password() {
    return this._password;
  }

  set birthdayDate(newBirthdayDate) {
    this._birthdayDate =
      newBirthdayDate instanceof Date
        ? newBirthdayDate
        : new Date(newBirthdayDate);
  }
  get birthdayDate() {
    return this._birthdayDate;
  }
  async isPasswordValid(password) {
    return bcrypt.compare(password, this._password);
  }

  static bypassSetJsonProperties() {
    return ["_password"];
  }
}
module.exports = User;
