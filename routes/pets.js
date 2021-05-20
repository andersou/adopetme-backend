var express = require("express");
var router = express.Router();
const multer = require("multer");
const PetDAO = require("../dao/PetDAO");
const Pet = require("../models/Pet");
const PetPhoto = require("../models/PetPhoto");
const validationHelper = require("../helpers/validation");
const authHelper = require("../helpers/auth");
const PetPhotoDAO = require("../dao/PetPhotoDAO");

const upload = multer({
  dest: "public/images",
  limits: {
    fileSize: 1024 * 1024,
  },
});
/* GET pets listing. */
router.get("/", async function (req, res, next) {
  let petDAO = new PetDAO();
  pets = await petDAO.fetch();
  res.json(pets);
});

// multer multiplos
// validacao
router.post(
  "/",
  authHelper.authMiddleware,
  upload.array("photos", 6),
  validationHelper.registerPetValidation,
  async function (req, res, next) {
    let petDAO = new PetDAO();
    let petPhotoDAO = new PetPhotoDAO();
    try {
      let petData = Pet.fromJSON(req.body);
      petData.protectorId = req.userId;

      let { lastID } = await petDAO.insert(petData);

      if (req.files) {
        for (let file in req.files) {
          let petPhoto = new PetPhoto();
          petPhoto.petId = lastID;
          petPhoto.photoUri = file.filename;
          petPhotoDAO.insert(petPhoto);
        }
      }

      res.json({ success: true, petId: lastID }).end();
    } catch (error) {
      console.log(error);
      res.status(401).end();
    }
  }
);
router.delete(
  "/photo/:id",
  authHelper.authMiddleware,
  async function (req, res) {
    let petDAO = new PetDAO();
    let petPhotoDAO = new PetPhotoDAO();
    let photo = (await petPhotoDAO.findById(req.params.id))[0];
    let pet = (await petDAO.findById(photo.petId))[0];
    if (pet.protectorId == req.userId) {
      petPhotoDAO.removePhoto(req.params.id);
    }
  }
);

router.delete("/:id", authHelper.authMiddleware, async function (req, res) {
  let petDAO = new PetDAO();
  let petPhotoDAO = new PetPhotoDAO();
  let petId = req.params.id;
  try {
    let pet = (await petDAO.findById(petId))[0];

    if (pet.protectorId == req.userId) {
      petDAO.removePet(pet);
      petPhotoDAO.removePhotosFromPet(pet);
    }

    res.json({ success: true }).end();
  } catch (error) {
    console.log(error);
    res.status(401).end();
  }
});
module.exports = router;
