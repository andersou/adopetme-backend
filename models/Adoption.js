const BaseModel = require("./BaseModel");
const UserDAO = require("../dao/UserDAO");
const PetDAO = require("../dao/PetDAO");
class Adoption extends BaseModel {
  constructor() {
    super();
    this.id = 0;
    this.petId = 0;
    this.adopterId = 0;
    this._createdAt = new Date();
    this.cancelledAt = null;
    this.approvedAt = null;

    this.message = ""; //mensagem quando solicita
    this.feedback = ""; //mensagem quando reprova
  }

  async pet() {
    let petDAO = new PetDAO();
    return await petDAO.findById(this.petId);
  }

  async adopter() {
    let userDAO = new UserDAO();
    return await userDAO.findById(this.adopterId);
  }

  async protector() {
    let pet = await this.pet();
    let userDAO = new UserDAO();
    return await userDAO.findById(pet.protectorId);
  }
}
module.exports = Adoption;
