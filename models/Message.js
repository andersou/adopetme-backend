const BaseModel = require("./BaseModel");
class Message extends BaseModel {
  constructor() {
    super();
    this.id = 0;
    this.fromId = 0;
    this.toId = 0;
    this.readed = false;
    this.createdAt = new Date();
    this.message = "";
  }
}
module.exports = Message;
