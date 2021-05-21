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
  async fetchAllAdoptionsRequestsFromAdopter(user) {
    // executa SQL
    let db = await database.open();
    let adoptions = [];
    await db.each(
      `SELECT * FROM adoptions WHERE adopterId = ? `,
      user.id,
      (err, adoptionRow) => {
        if (!err) adoptions.push(Adoption.fromJSON(adoptionRow));
      }
    );
    return adoptions;
  }
  async fetchAdoptionsFromAdopter(
    user,
    isCancelled = false,
    isApproved = false
  ) {
    // executa SQL
    let db = await database.open();
    let adoptions = [];
    await db.each(
      `SELECT * FROM adoptions WHERE adopterId = ? ${
        isCancelled ? "AND cancelledAt = NULL" : "AND cancelledAt != NULL"
      } ${isApproved ? "AND approvedAt = NULL" : "AND approvedAt != NULL"}`,
      user.id,
      (err, adoptionRow) => {
        if (!err) adoptions.push(Adoption.fromJSON(adoptionRow));
      }
    );

    return adoptions;
  }
  async fetchAdoptionsFromProtector(
    user,
    isCancelled = false,
    isApproved = false
  ) {
    // executa SQL
    let db = await database.open();
    let adoptions = [];
    await db.each(
      `SELECT * FROM adoptions WHERE petId IN (SELECT id FROM pets WHERE protectorId = ?) ${
        isCancelled ? "AND cancelledAt = NULL" : "AND cancelledAt != NULL"
      } ${isApproved ? "AND approvedAt = NULL" : "AND approvedAt != NULL"}`,
      user.id,
      (err, adoptionRow) => {
        if (!err) adoptions.push(Adoption.fromJSON(adoptionRow));
      }
    );

    return adoptions;
  }

  async fetchAdoptionRequestProtector(user) {
    return this.fetchAdoptionsFromProtector(user, false, false);
  }

  async fetchAdopterAdoptionRequest(user, pet) {
    let db = await database.open();
    return await db.get(
      "SELECT id FROM adoptions WHERE petId = ? AND adopterId = ?",
      pet.id,
      user.id
    );
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
