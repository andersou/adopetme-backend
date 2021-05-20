const BaseModel = require("./BaseModel");

const RATED_AS = {
  0: "adopter",
  1: "protector",
};
class Rating extends BaseModel {
  constructor() {
    super();
    this.id = 0;
    this.fromId = 0;
    this.toId = 0;
    this.score = 0;
    this._ratedAs = 0; //related to "to" user
    this._createdAt = new Date();
    this.adoptionId = 0;
  }

  get ratedAs() {
    return RATED_AS[this._ratedAs];
  }

  set ratedAs(newRatedAs) {
    if (typeof newRatedAs == "number") {
      this._ratedAs = newRatedAs;
    } else {
      this._ratedAs = Object.keys(RATED_AS).find(
        (key) => RATED_AS[key] === newRatedAs
      );
    }
  }
}
module.exports = Rating;
