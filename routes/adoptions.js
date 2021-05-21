const express = require("express");
const UserDAO = require("../dao/UserDAO");
const AdoptionDAO = require("../dao/AdoptionDAO");
const User = require("../models/User");
const authHelper = require("../helpers/auth");
const mailerHelper = require("../helpers/mailer");
const validationHelper = require("../helpers/validation");

const router = express.Router();
router.use(authHelper.authMiddleware);
router.post("/", async function (req, res) {
  let petId = req.params.petId;

  if (!petId) {
    return res.status(422).end();
  }
  //verifica se já não existe solicitação deste adotante para este pet
  if (hasRequested) {
    return res.status(420).end();
  }
});
router.get("/protector/requests", async function (req, res) {
  let userDAO = new UserDAO();
  let adoptionDAO = new AdoptionDAO();
  let adoptions = await adoptionDAO.fetchAdoptionRequestProtector(
    await userDAO.findById(req.userId)
  );
  res.json(adoptions);
});
router.get("/adopter/requests", async function (req, res) {
  let userDAO = new UserDAO();
  let adoptionDAO = new AdoptionDAO();
  let adoptions = await adoptionDAO.fetchAllAdoptionsRequestsFromAdopter(
    await userDAO.findById(req.userId)
  );
  res.json(adoptions);
});

module.exports = router;
