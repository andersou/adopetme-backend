const database = require("./database");
const Rating = require("../models/Rating");
class RatingDAO {
  async create() {
    let db = await database.open();
    return await db.run(
      "CREATE TABLE ratings (id INTEGER PRIMARY KEY AUTOINCREMENT, fromId INTEGER, toId INTEGER, adoptionId INTEGER, score INTEGER, ratedAs INTEGER, createdAt DATETIME, message VARCHAR(255), FOREIGN KEY(fromId) REFERENCES users(id), FOREIGN KEY(toId) REFERENCES users(id), FOREIGN KEY(adoptionId) REFERENCES adoptions(id)) "
    );
  }
  async fetch() {
    // executa SQL
    let db = await database.open();
    let ratings = [];
    await db.each("SELECT * FROM ratings", (err, row) => {
      if (!err) ratings.push(Rating.fromJSON(row));
    });

    return ratings;
  }
  async fetchProtectorReceivedRatings(userId) {
    // executa SQL
    let db = await database.open();
    let ratings = [];
    await db.each(
      "SELECT * FROM ratings WHERE toId = ? AND ratedAs = 1 ",
      userId,
      (err, row) => {
        if (!err) ratings.push(Rating.fromJSON(row));
      }
    );

    return ratings;
  }
  async fetchAdopterReceivedRatings(userId) {
    // executa SQL
    let db = await database.open();
    let ratings = [];
    await db.each(
      "SELECT * FROM ratings WHERE toId = ? AND ratedAs = 0 ",
      userId,
      (err, row) => {
        if (!err) ratings.push(Rating.fromJSON(row));
      }
    );

    return ratings;
  }
  async findById(id) {
    // executa SQL
    let db = await database.open();
    return Rating.fromJSON(
      await db.get("SELECT * FROM ratings WHERE id = ?", id)
    );
  }

  async findAdoptionFromUser(adoptionId, userId) {
    // executa SQL
    let db = await database.open();
    return Rating.fromJSON(
      await db.get(
        "SELECT * FROM ratings WHERE adoptionId = ? AND fromId = ? ;",
        adoptionId,
        userId
      )
    );
  }

  async insert(rating) {
    let db = await database.open();
    return await db.run(
      "INSERT INTO ratings ( adoptionId, toId, fromId, score,ratedAs, createdAt, message) VALUES (?,?,?,?,?,?,?);",
      rating.adoptionId,
      rating.toId,
      rating.fromId,
      rating.score,
      rating._ratedAs,
      rating.createdAt,
      rating.message
    );
  }
}

module.exports = RatingDAO;
