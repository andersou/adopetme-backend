class BaseModel {
  constructor() {
    if (new.target === BaseModel) {
      throw new TypeError("Cannot construct instances directly");
    }
  }
  static bypassJsonProperties() {
    return [];
  }
  static fromJSON(json) {
    const bypassProperties = this.bypassJsonProperties();
    let instance = new this();
    for (let prop in instance) {
      if (prop.startsWith("_")) {
        //propriedades privadas
        if (bypassProperties.includes(prop)) {
          instance[prop] = json[prop.substring(1)];
        } else {
          let propName = prop.substring(1);
          instance[propName] = json[propName];
        }
      } else instance[prop] = json[prop];
    }
    return instance;
  }
}
module.exports = BaseModel;
