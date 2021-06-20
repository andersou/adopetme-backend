const express = require("express");
const UserDAO = require("../dao/UserDAO");
const AdoptionDAO = require("../dao/AdoptionDAO");
const User = require("../models/User");
const Rating = require("../models/Rating");
const authHelper = require("../helpers/auth");
const mailerHelper = require("../helpers/mailer");
const validationHelper = require("../helpers/validation");
const PetDAO = require("../dao/PetDAO");
const Adoption = require("../models/Adoption");
const RatingDAO = require("../dao/RatingDAO");

const router = express.Router();
router.use(authHelper.authMiddleware);
router.post("/", async function (req, res) {
  let petId = req.body.petId;
  let message = req.body.message;
  let petDao = new PetDAO();
  let adoptionDAO = new AdoptionDAO();

  let pet;

  if (!petId) {
    return res.status(404).json({ msg: "É necessário informar petId" }).end();
  }
  pet = await petDao.findById(petId);
  //é o dono do pet?!
  if (pet.protectorId == req.user.id) {
    return res.status(403).json({ msg: "Esse pet é seu!" }).end();
  }
  if (!!(await adoptionDAO.fetchPetAdoptionApproved(this))) {
    return res.status(422).json({ msg: "Esse pet já foi adotado" }).end();
  }
  if (await pet.hasRequestFromUser(req.user)) {
    return res.status(420).json({ msg: "Não seja insistente :)" }).end();
  }

  //cria a adoção
  let { changes } = await adoptionDAO.insert(
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

router.post("/:id/approve", async function (req, res) {
  let adoptionId = req.params.id;
  let feedback = req.body.feedback;
  let adoptionDAO = new AdoptionDAO();
  let adoption = await adoptionDAO.findById(adoptionId);
  //já foi aprovada :)
  if (adoption.approvedAt) {
    return res.status(403).end();
  }

  let pet = await adoption.pet();

  //pet já adotado :(
  if (!!(await adoptionDAO.fetchPetAdoptionApproved(this))) {
    return res.status(422).json({ msg: "Esse pet já foi adotado" }).end();
  }
  //apenas o dono pode aprovar
  if (pet.protectorId == req.user.id) {
    //cancela as outras requisições que nao foram canceladas com feedback padrão
    await adoptionDAO.updatePetAdoptions(
      {
        feedback: "Esse pet foi adotado por outra pessoa.",
        cancelledAt: new Date(),
      },
      pet
    );
    //depois implementar email de aviso :)
    adoption.approvedAt = new Date();
    adoption.cancelledAt = null;
    adoption.feedback = feedback;
    await adoptionDAO.update(adoption);
    res.json({ sucess: true });
  } else {
    res.status(422).end();
  }

  //aprova essa
});

router.post("/:id/reject", async function (req, res) {
  let adoptionId = req.params.id;
  let feedback = req.body.feedback;
  let adoptionDAO = new AdoptionDAO();
  let adoption = await adoptionDAO.findById(adoptionId);

  if (adoption.rejectedAt) {
    return res.status(403).json({ msg: "Já foi rejeitada" }).end();
  }
  let pet = await adoption.pet();
  //nao precisa ver se ja foi adotado, pois quando alguem adota as outras sao rejeitadas e sairia
  //no if de cima

  //apenas o dono pode rejeitar
  if (pet.protectorId == req.user.id) {
    //depois implementar email de aviso :)
    adoption.approvedAt = null;
    adoption.cancelledAt = new Date();
    adoption.feedback = feedback;
    await adoptionDAO.update(adoption);
    res.json({ sucess: true });
  } else {
    res.status(422).end();
  }
  //cancela esta requisição
});
router.delete("/:id", async function (req, res) {
  let adoptionId = req.params.id;
  let adoptionDAO = new AdoptionDAO();
  let adoption = await adoptionDAO.findById(adoptionId);

  if ((adoption.adopterId == req.user.id) && !adoption.approvedAt) {
    //depois implementar email de aviso :)
    await adoptionDAO.remove(adoption);
    res.json({ sucess: true });
  } else {
    res.status(422).end();
  }
});
router.post(
  "/:adoptionId/rate",
  validationHelper.ratingValidation,
  async function (req, res) {
    let adoptionId = req.params.adoptionId;
    let adoptionDAO = new AdoptionDAO();
    let ratingDAO = new RatingDAO();
    let adoption = await adoptionDAO.findById(adoptionId);
    //validar se já não foi feito (adoptionId) e from (userId)
    try {
      await ratingDAO.findAdoptionFromUser(adoptionId, req.user.id);
      return res.status(422).json({ msg: "00 Erro ao processar a requisição" });
    } catch (error) {
      //se nao existir, joga exceção
    }

    //identificar se é uma adoção (approved_at != null)
    if (!adoption.approvedAt) {
      return res.status(422).json({ msg: "01 Erro ao processar a requisição" });
    }

    //identificar se o usuario é de uma das partes (adotante ou protetor)
    let isFromProtector = null;
    if (adoption.adopterId == req.user.id) {
      isFromProtector = false;
    } else if ((await adoption.protector()).id == req.user.id) {
      isFromProtector = true;
    } else {
      return res.status(422).json({ msg: "02 Erro ao processar a requisição" });
    }

    //criar rating
    let rating = Rating.fromJSON({
      fromId: req.user.id,
      toId: isFromProtector
        ? adoption.adopterId
        : (await adoption.protector()).id,
      score: req.body.score,
      ratedAs: isFromProtector ? "adopter" : "protector",
      adoptionId: adoptionId,
      message: req.body.message,
    });

    res.json(await ratingDAO.insert(rating));
  }
);
router.get("/protector/requests", async function (req, res) {
  let userDAO = new UserDAO();
  let adoptionDAO = new AdoptionDAO();
  let adoptions = await adoptionDAO.fetchAdoptionRequestProtector(req.user);
  for (const adoption of adoptions) {
    await adoption.pet()
    await adoption.adopter()
  }
  res.json(adoptions);
});
router.get("/adopter/requests", async function (req, res) {
  let userDAO = new UserDAO();
  let adoptionDAO = new AdoptionDAO();
  let adoptions = await adoptionDAO.fetchAllAdoptionsRequestsFromAdopter(
    req.user
  );
  for (const adoption of adoptions) {
    await adoption.pet()
    await adoption.protector()
  }
  res.json(adoptions);
});

router.get("/adopter", async function (req, res) {
  let userDAO = new UserDAO();
  let adoptionDAO = new AdoptionDAO();
  let adoptions = await adoptionDAO.fetchAdoptionsFromAdopter(req.user, {
    isApproved: true,
  });

  for (let adoption of adoptions) {
    await adoption.pet()
  }
  res.json(adoptions);
});

router.get("/protector", async function (req, res) {
  let userDAO = new UserDAO();
  let adoptionDAO = new AdoptionDAO();
  let adoptions = await adoptionDAO.fetchAdoptionsFromProtector(req.user, {
    isApproved: true,
  });
  res.json(adoptions);
});
module.exports = router;
