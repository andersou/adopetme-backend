const database = require("./database");
const PetPhoto = require("../models/PetPhoto");
class PetPhotoDAO {
  async create() {
    let db = await database.open();
    await db.run(
      "CREATE TABLE pet_photos (id INTEGER PRIMARY KEY AUTOINCREMENT, petId INTEGER, photoUri VARCHAR(255), createdAt DATETIME, FOREIGN KEY(petId) REFERENCES pets(id)) "
    );
  }
  async fetch() {
    // executa SQL
    let db = await database.open();
    let petsPhotos = [];
    await db.each("SELECT * FROM pet_photos", (err, petRow) => {
      if (!err) petsPhotos.push(PetPhoto.fromJSON(petRow));
    });

    return petsPhotos;
  }
  async fetchPhotosFromPet(pet) {
    // executa SQL
    let db = await database.open();
    let petsPhotos = [];
    await db.each(
      "SELECT * FROM pet_photos WHERE petId = ?",
      pet.id,
      (err, petRow) => {
        if (!err) petsPhotos.push(PetPhoto.fromJSON(petRow));
      }
    );

    return petsPhotos;
  }
  async insert(petPhoto) {
    let db = await database.open();
    return await db.run(
      "INSERT INTO pets ( petId , photoUri, createdAt) VALUES (?,?,?);",
      petPhoto.petId,
      petPhoto.photoUri,
      petPhoto.createdAt
    );
  }
}

module.exports = PetPhotoDAO;
