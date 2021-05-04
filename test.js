const Pet = require("./models/Pet");
const PetDAO = require("./dao/PetDAO");

const faker = require("faker");
faker.locale = "pt_BR";
let petDAO = new PetDAO();
(async () => {
  //MIGRATION
  await petDAO.create();

  //SEEDING
  for (let i = 0; i < 50; i++) {
    petDAO.insert(
      new Pet(Math.random > 0.5 ? faker.animal.dog() : faker.animal.cat())
    );
  }
})();
