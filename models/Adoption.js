const BaseModel = require("./BaseModel");
const UserDAO = require("../dao/UserDAO");
const PetDAO = require("../dao/PetDAO");

const _pick = require('lodash/pick')
const User = require('./User');
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
    this.petData = await petDAO.findById(this.petId);
    await this.petData.loadPetPhotos()
    return this.petData
  }

  async adopter(props = User.NOT_SENSIBLE_DATA) {
    let userDAO = new UserDAO();
    this.adopterData = await userDAO.findById(this.adopterId);
    await this.adopterData.loadAdopterRatings()
    if (props) this.adopterData = _pick(this.adopterData, ["adopterRating", ...props])
    return this.adopterData
  }

  async protector(props = User.NOT_SENSIBLE_DATA) {
    let pet = await this.pet();
    let userDAO = new UserDAO();
    this.protectorData = await userDAO.findById(pet.protectorId)
    await this.protectorData.loadProtectorRatings()
    if (props) this.protectorData = _pick(this.protectorData, ["protectorRating", ...props])
    return this.protectorData;
  }

  async loadHasRated(fromUserId) {

    const RatingDAO = require("../dao/RatingDAO");
    const ratingDAO = new RatingDAO()
    this.hasRated = await ratingDAO.hasRated(this.id, fromUserId);
    return this.hasRated;
  }
}
module.exports = Adoption;
