const database = require("./database");
const User = require("../models/User");
class UserDAO {
  async create() {
    let db = await database.open();
    await db.run(
      "CREATE TABLE users (id INTEGER PRIMARY KEY AUTOINCREMENT, firstName VARCHAR(255),lastName VARCHAR(255), phone VARCHAR(24),birthdayDate DATE,email VARCHAR(255),isAdmin BOOLEAN,password VARCHAR(60),createdAt DATETIME,isOnline BOOLEAN,photoUri VARCHAR(255),facebookProfile VARCHAR(255),registerConfirmed BOOLEAN,document VARCHAR(16),address VARCHAR(255),number INTEGER,complement VARCHAR(255),neighborhood VARCHAR(32),city VARCHAR(64),zipcode INTEGER)"
    );
  }
  async fetch() {
    // executa SQL
    let db = await database.open();
    let users = [];
    await db.each("SELECT * FROM users", (err, userRow) => {
      if (!err) users.push(User.fromJSON(userRow));
    });

    return users;
  }

  async insert(user) {
    let db = await database.open();
    return await db.run(
      "INSERT INTO ( firstName ,lastName , phone,birthdayDate ,email,isAdmin ,password ,createdAt ,isOnline ,photoUri ,facebookProfile ,registerConfirmed,document ,address ,number ,complement ,neighborhood ,city ,zipcode ) users VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?);",
      user.firstName,
      user.lastName,
      user.phone,
      user.birthdayDate,
      user.email,
      user.isAdmin,
      user.password,
      user.createdAt,
      user.isOnline,
      user.photoURI,
      user.facebookProfile,
      user.registerConfirmed,
      user.document,
      user.address,
      user.number,
      user.complement,
      user.neighborhood,
      user.city,
      user.zipcode
    );
  }
}

module.exports = PetDAO;
