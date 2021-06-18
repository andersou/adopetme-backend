const database = require("./database");
const Pet = require("../models/Pet");
class PetDAO {
  async create() {
    let db = await database.open();
    return await db.run(
      "CREATE TABLE pets (id INTEGER PRIMARY KEY AUTOINCREMENT, protectorId INTEGER, name VARCHAR(255), birthdayDate DATE, size INTEGER, specie INTEGER, simpleDescription VARCHAR(255), detailedDescription TEXT, sex CHARACTER, createdAt DATETIME, FOREIGN KEY(protectorId) REFERENCES users(id)) "
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
  async fetchFromProtector(protector) {
    // executa SQL
    let db = await database.open();
    let pets = [];
    await db.each(
      "SELECT * FROM pets WHERE protectorId = ?",
      protector.id,
      (err, petRow) => {
        if (!err) pets.push(Pet.fromJSON(petRow));
      }
    );

    return pets;
  }
  async fetchPaginated(
    skip,
    limit = 10,
    filters = {},
    sortByBirthdayDate = false
  ) {
    // executa SQL
    let db = await database.open();
    let pets = [];

    let filtersClauses = [];
    for (let filter in filters) {
      filtersClauses.push(` ${filter} = '${filters[filter]}' `);
    }
    let filtersSQL = `WHERE ${filtersClauses.join("AND")}`;

    let orderSQL = "";
    if (sortByBirthdayDate) {
      orderSQL = ` ORDER BY birthdayDate ${sortByBirthdayDate}`;
    }
    let sql = `SELECT * FROM pets ${filtersClauses.length > 0 ? filtersSQL : ""
      }  ${orderSQL} LIMIT ? OFFSET ?`;
    console.log(sql);
    await db.each(sql, limit, skip, (err, petRow) => {
      if (!err) pets.push(Pet.fromJSON(petRow));
    });

    return pets;
  }
  async findById(id) {
    // executa SQL
    let db = await database.open();
    return Pet.fromJSON(await db.get("SELECT * FROM pets WHERE id = ?", id));
  }

  async countPets() {
    // executa SQL
    let db = await database.open();
    return (await db.get("SELECT COUNT(id) as counter FROM pets")).counter;
  }

  async removePet(pet) {
    let db = await database.open();
    if (pet.id) return await db.run("DELETE FROM pets WHERE id = ? ", pet.id);
  }

  async insert(pet) {
    let db = await database.open();
    return await db.run(
      "INSERT INTO pets ( protectorId , name , birthdayDate, size, specie , simpleDescription, detailedDescription, sex, createdAt) VALUES (?,?,?,?,?,?,?,?,?);",
      pet.protectorId,
      pet.name,
      pet.birthdayDate,
      pet._size,
      pet._specie,
      pet.simpleDescription,
      pet.detailedDescription,
      pet.sex,
      pet.createdAt
    );
  }

  async update(pet) {
    let db = await database.open();
    if (pet.id)
      return await db.run(
        "UPDATE pets SET name=? , birthdayDate=?, size=?, specie=? , simpleDescription=?, detailedDescription=?, sex=? WHERE id= ?;",
        pet.name,
        pet.birthdayDate,
        pet._size,
        pet._specie,
        pet.simpleDescription,
        pet.detailedDescription,
        pet.sex,
        pet.id
      );
  }
}

module.exports = PetDAO;
