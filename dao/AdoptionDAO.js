const database = require("./database");
const PetPhoto = require("../models/PetPhoto");
const Adoption = require("../models/Adoption");
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

  async fetchAdoptionsFromAdopter(user, isCancelled, isApproved) {
    // executa SQL
    let db = await database.open();
    let adoptions = [];
    await db.each(
      `SELECT * FROM adoptions WHERE adopterId = ? ${
        isCancelled ? "AND cancelledAt = NULL" : ""
      } ${isApproved ? "AND approvedAt = NULL" : ""}`,
      pet.id,
      (err, adoptionRow) => {
        if (!err) adoptions.push(Adoption.fromJSON(adoptionRow));
      }
    );

    return adoptions;
  }

  async insert(adoption) {
    let db = await database.open();
    return await db.run(
      "INSERT INTO adoptions ( petId , adopterId , createdAt , cancelledAt , approvedAt , message , feedback) VALUES (?,?,?,?,?,?,?);",
      adoption.petId,
      adoption.adopterId,
      adoption.createdAt,
      adoption.cancelledAt,
      adoption.approvedAt,
      adoption.message,
      adoption.feedback
    );
  }
}

module.exports = AdoptionDAO;
