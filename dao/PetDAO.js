const database = require("./database");
const Pet = require("../models/Pet");
class PetDAO {
  async create() {
    let db = await database.open();
    await db.run("CREATE TABLE pets (name STRING);");
  }
  async fetch() {
    // executa SQL
    let db = await database.open();
    let pets = [];
    await db.each("SELECT * FROM pets", (err, pet) => {
      if (!err) pets.push(new Pet(pet.name));
    });

    return pets;
  }

  async insert(pet) {
    let db = await database.open();
    await db.run("INSERT INTO pets VALUES (?);", pet.name);
    return true;
  }
}

module.exports = PetDAO;
