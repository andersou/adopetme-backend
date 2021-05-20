var express = require("express");
var router = express.Router();
const multer = require("multer");
const PetDAO = require("../dao/PetDAO");
const Pet = require("../models/Pet");
const PetPhoto = require("../models/PetPhoto");
const validationHelper = require("../helpers/validation");
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
  upload.array("photos", 6),
  validationHelper.registerPetValidation,
  async function (req, res, next) {
    let petDAO = new PetDAO();
    let petPhotoDAO = new PetPhotoDAO();
    try {
      let petData = Pet.fromJSON(req.body);
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
module.exports = router;
