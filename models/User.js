const bcrypt = require("bcrypt");

class User {
  constructor() {
    this.firstName = "";
    this.lastName = "";
    this._birthdayDate = new Date();
    this.phone = "";
    this.email = "";

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
    this.zipcode = "";
  }

  set password(newPassword) {
    this._password = bcrypt.hashSync(newPassword, 5);
  }
  get password() {
    return this._password;
  }

  set createdAt(newCreatedAt) {
    this._createdAt =
      newCreatedAt instanceof Date ? newCreatedAt : new Date(newCreatedAt);
  }
  get createdAt() {
    return this._createdAt;
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

  static fromJSON(json) {
    const bypassProperties = ["_password"];
    let user = new User();
    for (let prop in user) {
      if (prop.startsWith("_")) {
        //propriedades privadas
        if (bypassProperties.includes(prop)) {
          user[prop] = json[prop.substring(1)];
        } else {
          let propName = prop.substring(1);
          user[propName] = json[propName];
        }
      } else user[prop] = json[prop];
    }
    return user;
  }
}
module.exports = User;
