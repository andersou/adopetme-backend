const SPECIES_NAMES = {
  0: "Other",
  1: "Dog",
  2: "Cat ",
};

const SIZE_NAMES = {
  0: "Very Small",
  1: "Small",
  2: "Medium",
  3: "Large",
  4: "Extra Large",
};
class Pet {
  constructor() {
    this.id = 0;
    this.protector_id = 0;
    this.name = "";
    this.birthday_date = new Date();
    this._size = 0;
    this._specie = 0;
    this.simple_description = "";
    this.detailed_description = "";
    this.sex = "N";
    this.created_at = new Date();
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
}
module.exports = Pet;
