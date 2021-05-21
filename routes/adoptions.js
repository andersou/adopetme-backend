const express = require("express");
const UserDAO = require("../dao/UserDAO");
const AdoptionDAO = require("../dao/AdoptionDAO");
const User = require("../models/User");
const authHelper = require("../helpers/auth");
const mailerHelper = require("../helpers/mailer");
const validationHelper = require("../helpers/validation");
const PetDAO = require("../dao/PetDAO");
const Adoption = require("../models/Adoption");

const router = express.Router();
router.use(authHelper.authMiddleware);
router.post("/", async function (req, res) {
  let petId = req.body.petId;
  let message = req.body.message;
  let petDao = new PetDAO();
  let adoptionDAO = new AdoptionDAO();

  let pet;

  if (!petId) {
    return res.status(422).end();
  }
  pet = await petDao.findById(petId);
  //é o dono do pet?!
  if (pet.protectorId == req.user.id) {
    return res.status(403).end();
  }

  if (await adoptionDAO.fetchAdopterAdoptionRequest(req.user, pet)) {
    return res.status(420).end();
  }

  //cria a adoção
  let { changes } = adoptionDAO.insert(
    Adoption.fromJSON({
      petId,
      adopterId: req.user.id,
      // createdAt: new Date(),
      cancelledAt: null,
      approvedAt: null,
      message,
      feedback: null,
    })
  );
  if (changes) {
    res.json({ success: true }).end();
  } else res.json({ success: false }).end();
});

router.post("/adoption/:id/approve", async function (req, res) {
  let petId = req.params.petId;
  let adopterId = req.params.id;
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
  let adoptions = await adoptionDAO.fetchAdoptionRequestProtector(req.user);
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
