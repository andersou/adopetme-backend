const bcrypt = require("bcrypt");
const BaseModel = require("./BaseModel");
class PetPhoto extends BaseModel {
  constructor() {
    super();
    this.id = 0;
    this.petId = 0;
    this.photoUri = "";
  }
}
module.exports = PetPhoto;
