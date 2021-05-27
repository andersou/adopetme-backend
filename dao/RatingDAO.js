const database = require("./database");
const Rating = require("../models/Rating");
class RatingDAO {
  async create() {
    let db = await database.open();
    return await db.run(
      "CREATE TABLE ratings (id INTEGER PRIMARY KEY AUTOINCREMENT, fromId INTEGER, toId INTEGER, adoptionId INTEGER, score INTEGER, ratedAs INTEGER, createdAt DATETIME, FOREIGN KEY(fromId) REFERENCES users(id), FOREIGN KEY(toId) REFERENCES users(id), FOREIGN KEY(adoptionId) REFERENCES adoptions(id)) "
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

  async findById(id) {
    // executa SQL
    let db = await database.open();
    return Rating.fromJSON(
      await db.get("SELECT * FROM ratings WHERE id = ?", id)
    );
  }

  async insert(rating) {
    let db = await database.open();
    return await db.run(
      "INSERT INTO pet_photos ( adoptionId, toId, fromId, score,ratedAs, createdAt) VALUES (?,?,?,?,?,?);",
      rating.adoptionId,
      rating.toId,
      rating.fromId,
      rating.score,
      rating._ratedAs,
      rating.createdAt
    );
  }
}

module.exports = RatingDAO;
