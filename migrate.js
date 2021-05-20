const Pet = require("./models/Pet");
const PetDAO = require("./dao/PetDAO");

const PetPhoto = require("./models/PetPhoto");
const PetPhotoDAO = require("./dao/PetPhotoDAO");

const User = require("./models/User");
const UserDAO = require("./dao/UserDAO");

const Adoption = require("./models/Adoption");
const AdoptionDAO = require("./dao/AdoptionDAO");

const faker = require("faker");
const fetch = require("node-fetch");

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
  console.log("Criando tabela usuário");
  await userDAO.create();

  //SEEDING
  for (adpetmeAdmin of adopetmeAdmins) {
    console.log("Criando usuario admin : " + adpetmeAdmin.nome);
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
      photoUri: faker.image.avatar(),
    });
    user.password = adpetmeAdmin.nome.toLowerCase() + "123";
    userDAO.insert(user);
  }

  //MIGRATION
  console.log("Criando tabela pets");
  await petDAO.create();
  //MIGRATION
  console.log("criando tabela pet_photos");
  await petPhotoDAO.create();
  // SEEDING USER COM PETS PARA ADOCAO COM IMAGENS
  for (let i = 0; i < 10; i++) {
    console.log("Alimentando banco com usuário :" + i);
    let user = User.fromJSON({
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      birthdayDate: faker.date.past(30),
      phone: faker.phone.phoneNumber(),
      email: faker.internet.email(),
      isAdmin: false,
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
      photoUri: faker.image.avatar(),
    });
    user.password = "12345678";
    let userId = (await userDAO.insert(user)).lastID;
    for (let j = 0; j < 10; j++) {
      console.log(`Alimentando usuário ${i} com animal para adoção ${j}`);
      let animal = faker.helpers.randomize(["Cat", "Dog"]);
      let resultPet = await petDAO.insert(
        Pet.fromJSON({
          protectorId: userId,
          name: animal == "Cat" ? faker.animal.cat() : faker.animal.dog(),
          birthdayDate: faker.date.past(5),
          size: faker.helpers.randomize([0, 1, 2, 3, 4]),
          specie: animal,
          simpleDescription: faker.lorem.paragraph(),
          detailedDescription: faker.lorem.text(3),
          sex: faker.helpers.randomize(["M", "F"]),
          createdAt: new Date(),
        })
      );
      let petId = resultPet.lastID;
      let photo = "";
      if (animal == "Dog")
        photo = (
          await (await fetch("https://dog.ceo/api/breeds/image/random")).json()
        ).message;
      else {
        photo =
          "https://cataas.com" +
          (await (await fetch("https://cataas.com/cat?json=true")).json()).url;
      }
      console.log("Adicionando foto para o pet " + j);
      petPhotoDAO.insert(
        PetPhoto.fromJSON({
          petId,
          photoUri: photo,
        })
      );
    }
  }

  //MIGRATION
  await adoptionDAO.create();
})();
