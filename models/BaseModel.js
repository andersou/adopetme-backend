class BaseModel {
  constructor() {
    if (new.target === BaseModel) {
      throw new TypeError("Cannot construct instances directly");
    }
  }

  // propriedades especiais que não podem ser chamadas diretamentes e sim pela propriedade privada
  static bypassSetJsonProperties() {
    return [];
  }
  // propriedades que não devem ser setadas
  static bypassJsonProperties() {
    return [];
  }
  static fromJSON(json) {
    const bypassSetProperties = this.bypassSetJsonProperties();
    const bypassProperties = this.bypassJsonProperties();
    let instance = new this();
    for (let prop in instance) {
      if (prop.startsWith("_")) {
        if (bypassProperties.includes(prop)) {
          continue;
        } else if (bypassSetProperties.includes(prop)) {
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
