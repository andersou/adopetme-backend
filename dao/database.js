const ARQUIVO_DB = "../adopetme.db";
var path = require("path");
var Database = require("sqlite-async");
var db = new Database();
var dbOpened = null;
database = {
  async open() {
    if (dbOpened) {
      return dbOpened;
    }
    dbOpened = await db.open(path.join(__dirname, ARQUIVO_DB));
    // dbOpened.db = dbOpened.db.verbose();
    dbOpened.db.on("trace", (sql) => {
      console.log("executou: " + sql);
    });
    return dbOpened;
  },
  close() {
    return db.close();
  },
  //   run() {
  //     let args = arguments;
  //     return new Promise(function (res, rej) {
  //       database.open().run(...args, (err) => {
  //         if (err) rej(err);
  //         else res();
  //       });
  //     });
  //   },
};
module.exports = database;
