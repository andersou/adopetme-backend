const database = require("./database");
const User = require("../models/User");
//let UserDAO = require("./dao/UserDAO"); let userDAO = new UserDAO();
class UserDAO {
  async create() {
    let db = await database.open();
    return await db.run(
      "CREATE TABLE users (id INTEGER PRIMARY KEY AUTOINCREMENT, firstName VARCHAR(255) NOT NULL ,lastName VARCHAR(255) NOT NULL , phone VARCHAR(24),birthdayDate DATE,email VARCHAR(255) NOT NULL UNIQUE ,isAdmin BOOLEAN DEFAULT FALSE,password VARCHAR(60)  NOT NULL ,createdAt DATETIME,isOnline BOOLEAN,photoUri VARCHAR(255),facebookProfile VARCHAR(255),registerConfirmed BOOLEAN DEFAULT FALSE,document VARCHAR(16)  NOT NULL ,address VARCHAR(255),number INTEGER,complement VARCHAR(64),neighborhood VARCHAR(64),city VARCHAR(64),zipcode INTEGER,sex CHARACTER, state CHARACTER(2))"
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

  async findByEmail(email) {
    // executa SQL
    let db = await database.open();
    return User.fromJSON(
      await db.get("SELECT * FROM users WHERE email = ?", email)
    );
  }
  async findById(id) {
    // executa SQL
    let db = await database.open();
    return User.fromJSON(await db.get("SELECT * FROM users WHERE id = ?", id));
  }
  async confirmEmail(user) {
    let db = await database.open();
    return await db.run(
      "UPDATE users SET registerConfirmed = TRUE WHERE id = ?;",
      user.id
    );
  }

  async insert(user) {
    let db = await database.open();
    return await db.run(
      "INSERT INTO  users  ( firstName ,lastName , phone,birthdayDate ,email,isAdmin ,password ,createdAt ,isOnline ,photoUri ,facebookProfile ,registerConfirmed,document ,address ,number ,complement ,neighborhood ,city ,zipcode, sex , state) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?);",
      user.firstName,
      user.lastName,
      user.phone,
      user.birthdayDate,
      user.email,
      user.isAdmin,
      user.password,
      user.createdAt,
      user.isOnline,
      user.photoUri,
      user.facebookProfile,
      user.registerConfirmed,
      user.document,
      user.address,
      user.number,
      user.complement,
      user.neighborhood,
      user.city,
      user.zipcode,
      user.sex,
      user.state
    );
  }
  async update(user) {
    let db = await database.open();
    if (user.id)
      return await db.run(
        "UPDATE  users SET firstName=? ,lastName=? , phone=?,birthdayDate=? ,email=?,isAdmin=? ,password=? ,photoUri=? ,facebookProfile=?,document =?,address =?,number =?,complement=? ,neighborhood =?,city =?,zipcode=?, sex =?, state=? WHERE id = ?;",
        user.firstName,
        user.lastName,
        user.phone,
        user.birthdayDate,
        user.email,
        user.isAdmin,
        user.password,
        user.photoUri,
        user.facebookProfile,
        user.document,
        user.address,
        user.number,
        user.complement,
        user.neighborhood,
        user.city,
        user.zipcode,
        user.sex,
        user.state,
        user.id
      );
  }
}

module.exports = UserDAO;
