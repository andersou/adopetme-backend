const BaseModel = require("./BaseModel");
const PetPhotoDAO = require("../dao/PetPhotoDAO");
const User = require("./User");
const _pick = require('lodash/pick')
const SPECIES_NAMES = {
  0: "Other",
  1: "Dog",
  2: "Cat",
};

const SIZE_NAMES = {
  0: "Very Small",
  1: "Small",
  2: "Medium",
  3: "Large",
  4: "Extra Large",
};
class Pet extends BaseModel {
  constructor() {
    super();
    this.id = 0;
    this.protectorId = 0;
    this.name = "";
    this._birthdayDate = new Date();
    this._size = 0;
    this._specie = 0;
    this.simpleDescription = "";
    this.detailedDescription = "";
    this.sex = "N";
    this._createdAt = new Date();
    this.petPhotos = [];
  }

  get size() {
    return SIZE_NAMES[this._size];
  }

  set size(newSize) {
    if (typeof newSize == "number") {
      this._size = newSize;
    } else {
      this._size = Object.keys(SIZE_NAMES).find(
        (key) => SIZE_NAMES[key] === newSize
      );
    }
  }

  get specie() {
    return SPECIES_NAMES[this._specie];
  }

  set specie(newSpecie) {
    if (typeof newSpecie == "number") {
      this._specie = newSpecie;
    } else {
      this._specie = Object.keys(SPECIES_NAMES).find(
        (key) => SPECIES_NAMES[key] === newSpecie
      );
    }
  }

  async loadPetPhotos() {
    let petPhotoDAO = new PetPhotoDAO();
    this.petPhotos = await petPhotoDAO.fetchPhotosFromPet(this);
  }

  async loadProtector(props = []) {
    const UserDAO = require("../dao/UserDAO");
    let userDAO = new UserDAO();
    let user = await userDAO.findById(this.protectorId);
    if (props.includes("protectorRating")) await user.loadProtectorRatings();
    if (props) { this.protectorData = _pick(user, props) } else {
      this.protectorData = user;
    }
  }

  async hasRequestFromUser(user) {
    const AdoptionDAO = require("../dao/AdoptionDAO");
    let adoptionDAO = new AdoptionDAO();
    this.hasRequested = !!(await adoptionDAO.fetchAdopterAdoptionRequest(
      user,
      this
    ));
    return this.hasRequested;
  }
  // async isAdopted() {
  //   const AdoptionDAO = require("../dao/AdoptionDAO");
  //   let adoptionDAO = new AdoptionDAO();
  //   return !!(await adoptionDAO.fetchPetAdoptionApproved(this));
  // }
  set birthdayDate(newBirthdayDate) {
    this._birthdayDate =
      newBirthdayDate instanceof Date
        ? newBirthdayDate
        : new Date(newBirthdayDate);
  }
  get birthdayDate() {
    return this._birthdayDate;
  }

  static bypassJsonProperties() {
    return ["petPhotos"];
  }
}
Pet.SIZE_NAMES = SIZE_NAMES;
Pet.SPECIES_NAMES = SPECIES_NAMES;

module.exports = Pet;
