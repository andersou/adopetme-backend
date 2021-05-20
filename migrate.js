const Pet = require("./models/Pet");
const PetDAO = require("./dao/PetDAO");

const PetPhoto = require("./models/PetPhoto");
const PetPhotoDAO = require("./dao/PetPhotoDAO");

const User = require("./models/User");
const UserDAO = require("./dao/UserDAO");

const Adoption = require("./models/Adoption");
const AdoptionDAO = require("./dao/AdoptionDAO");

const faker = require("faker");

adopetmeAdmins = [
  {
    email: "ander@adopet.me",
    nome: "Anderson",
  },
  {
    email: "mathaus@adopet.me",
    nome: "Mathaus",
  },
  {
    email: "fred@adopet.me",
    nome: "Frederico",
  },
  {
    email: "pedrao@adopet.me",
    nome: "Pedro",
  },
  {
    email: "vitor@adopet.me",
    nome: "Vitor",
  },
];

faker.locale = "pt_BR";
let petDAO = new PetDAO();
let petPhotoDAO = new PetPhotoDAO();
let userDAO = new UserDAO();
let adoptionDAO = new AdoptionDAO();
(async () => {
  //MIGRATION
  await userDAO.create();

  //SEEDING
  for (adpetmeAdmin of adopetmeAdmins) {
    let user = User.fromJSON({
      firstName: adpetmeAdmin.nome,
      lastName: faker.name.lastName(),
      birthdayDate: faker.date.past(30),
      phone: faker.phone.phoneNumber(),
      email: adpetmeAdmin.email,
      isAdmin: true,
      createdAt: new Date(),
      isOnline: false,
      registerConfirmed: true,
      document: "0000000000",
      address: faker.address.streetName(),
      number: faker.datatype.number(),
      complement: faker.address.secondaryAddress(),
      neighborhood: faker.address.streetSuffix(),
      city: faker.address.city(),
      zipcode: faker.address.zipCode(),
    });
    user.password = adpetmeAdmin.nome.toLowerCase() + "123";
    userDAO.insert(user);
  }

  //MIGRATION
  await petDAO.create();

  //SEEDING
  // for (let i = 0; i < 50; i++) {
  //   petDAO.insert(
  //     new Pet(Math.random > 0.5 ? faker.animal.dog() : faker.animal.cat())
  //   );
  // }

  //MIGRATION
  await petPhotoDAO.create();

  //MIGRATION
  await adoptionDAO.create();
})();
