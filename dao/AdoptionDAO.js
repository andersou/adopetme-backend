const database = require("./database");
const PetPhoto = require("../models/PetPhoto");
class AdoptionDAO {
  async create() {
    let db = await database.open();
    return await db.run(
      "CREATE TABLE adoptions (id INTEGER PRIMARY KEY AUTOINCREMENT,petId INTEGER, adopterId INTEGER, createdAt DATETIME, cancelledAt DATETIME, approvedAt DATETIME, message TEXT, feedback TEXT, FOREIGN KEY(petId) REFERENCES pets(id),FOREIGN KEY(adopterId) REFERENCES users(id)) "
    );
  }
  async fetch() {
    // executa SQL
    let db = await database.open();
    let adoptions = [];
    await db.each("SELECT * FROM adoptions", (err, adoptionRow) => {
      if (!err) adoptions.push(PetPhoto.fromJSON(adoptionRow));
    });

    return petsPhotos;
  }
  async fetchPhotosFromPet(pet) {
    // executa SQL
    let db = await database.open();
    let petsPhotos = [];
    await db.each(
      "SELECT * FROM adoptions WHERE petId = ?",
      pet.id,
      (err, petRow) => {
        if (!err) petsPhotos.push(PetPhoto.fromJSON(petRow));
      }
    );

    return petsPhotos;
  }
  async removePhotosFromPet(pet) {
    let db = await database.open();
    if (pet.id)
      return await db.run("DELETE FROM adoptions WHERE petId = ? ", pet.id);
  }

  async insert(petPhoto) {
    let db = await database.open();
    return await db.run(
      "INSERT INTO adoptions ( petId , photoUri, createdAt) VALUES (?,?,?);",
      petPhoto.petId,
      petPhoto.photoUri,
      petPhoto.createdAt
    );
  }
}

module.exports = AdoptionDAO;
