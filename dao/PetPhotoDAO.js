const database = require("./database");
const PetPhoto = require("../models/PetPhoto");
class PetPhotoDAO {
  async create() {
    let db = await database.open();
    return await db.run(
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

  async findById(id) {
    // executa SQL
    let db = await database.open();
    return await PetPhoto.fromJSON(
      db.get("SELECT * FROM pet_photos WHERE id = ?", id)
    );
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
  async removePhotosFromPet(pet) {
    let db = await database.open();
    if (pet.id)
      return await db.run("DELETE FROM pet_photos WHERE petId = ? ", pet.id);
  }

  async removePhoto(id) {
    let db = await database.open();
    if (id) return await db.run("DELETE FROM pet_photos WHERE id = ? ", id);
  }

  async insert(petPhoto) {
    let db = await database.open();
    return await db.run(
      "INSERT INTO pet_photos ( petId , photoUri, createdAt) VALUES (?,?,?);",
      petPhoto.petId,
      petPhoto.photoUri,
      petPhoto.createdAt
    );
  }
}

module.exports = PetPhotoDAO;
