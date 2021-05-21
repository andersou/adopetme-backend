const express = require("express");
const UserDAO = require("../dao/UserDAO");
const AdoptionDAO = require("../dao/AdoptionDAO");
const User = require("../models/User");
const authHelper = require("../helpers/auth");
const mailerHelper = require("../helpers/mailer");
const validationHelper = require("../helpers/validation");
const PetDAO = require("../dao/PetDAO");

const router = express.Router();
router.use(authHelper.authMiddleware);
router.post("/", async function (req, res) {
  let petId = req.params.petId;
  let petDao = new PetDAO();
  let adoptionDAO = new AdoptionDAO()/
  
  let pet;
   
  if (!petId) {
    return res.status(422).end();
  }
  pet = await petDao.findById(petId);
  //é o dono do pet?!
  pet.protectorId == 
  //verifica se já não existe solicitação deste adotante para este pet
  if (hasRequested) {
    return res.status(420).end();
  }

  //cria a adoção
});

router.post("/adoption/:id/approve", async function (req, res) {
  let petId = req.params.petId;
  let adopterId = req.oarams.id;
  if (!petId) {
    return res.status(422).end();
  }
  //cancela as outras requisições que nao foram canceladas com feedback padrão
  //aprova essa
});
router.post("/adoption/:id/reject", async function (req, res) {
  let petId = req.params.petId;
  let adopterId = req.oarams.id;
  if (!petId) {
    return res.status(422).end();
  }
  //cancela esta requisição
});
router.get("/protector/requests", async function (req, res) {
  let userDAO = new UserDAO();
  let adoptionDAO = new AdoptionDAO();
  let adoptions = await adoptionDAO.fetchAdoptionRequestProtector(
     req.user
  );
  res.json(adoptions);
});
router.get("/adopter/requests", async function (req, res) {
  let userDAO = new UserDAO();
  let adoptionDAO = new AdoptionDAO();
  let adoptions = await adoptionDAO.fetchAllAdoptionsRequestsFromAdopter(
    req.user
  );
  res.json(adoptions);
});

module.exports = router;
