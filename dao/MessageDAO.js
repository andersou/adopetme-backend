const database = require("./database");
const Message = require("../models/Message");
class MessageDAO {
  async create() {
    let db = await database.open();
    return await db.run(
      "CREATE TABLE messages (id INTEGER PRIMARY KEY AUTOINCREMENT, fromId INTEGER, toId INTEGER,readed BOOLEAN DEFAULT FALSE, message TEXT, createdAt DATETIME, FOREIGN KEY(fromId) REFERENCES users(id), FOREIGN KEY(toId) REFERENCES users(id)) "
    );
  }
  async fetch() {
    // executa SQL
    let db = await database.open();
    let messages = [];
    await db.each("SELECT * FROM messages", (err, row) => {
      if (!err) messages.push(Message.fromJSON(row));
    });

    return messages;
  }

  async findById(id) {
    // executa SQL
    let db = await database.open();
    return Message.fromJSON(
      await db.get("SELECT * FROM messages WHERE id = ?", id)
    );
  }

  async insert(message) {
    let db = await database.open();
    return await db.run(
      "INSERT INTO messages (  toId, fromId, message, createdAt) VALUES (?,?,?,?);",
      message.toId,
      message.fromId,
      message.message,
      message.createdAt
    );
  }
}

module.exports = MessageDAO;
