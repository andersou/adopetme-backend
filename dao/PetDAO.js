const database = require("./database");
const Pet = require("../models/Pet");
class PetDAO {
  async create() {
    let db = await database.open();
    await db.run(
      "CREATE TABLE pets (id INTEGER PRIMARY KEY AUTOINCREMENT, protector_id INTEGER, name VARCHAR(255), birthday_date DATE, size INTEGER, specie INTEGER, simple_description VARCHAR(255), detailed_description TEXT, sex CHARACTER, created_at DATETIME, FOREIGN KEY(protector_id) REFERENCES users(id)) "
    );
  }
  async fetch() {
    // executa SQL
    let db = await database.open();
    let pets = [];
    await db.each("SELECT * FROM pets", (err, petRow) => {
      if (!err) pets.push(Pet.fromJSON(petRow));
    });

    return pets;
  }

  async insert(pet) {
    let db = await database.open();
    return await db.run(
      "INSERT INTO pets ( protector_id , name , birthday_date, size, specie , simple_description, detailed_description, sex, created_at) VALUES (?,?,?,?,?,?,?,?,?);",
      pet.protector_id,
      pet.name,
      pet.birthday_date,
      pet._size,
      pet._specie,
      pet.simple_description,
      pet.detailed_description,
      pet.sex,
      pet.created_at
    );
  }
}

module.exports = PetDAO;
