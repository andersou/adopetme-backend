const express = require("express");
const router = express.Router();
const multer = require("multer");
const PetDAO = require("../dao/PetDAO");
const Pet = require("../models/Pet");
const PetPhoto = require("../models/PetPhoto");
const validationHelper = require("../helpers/validation");
const authHelper = require("../helpers/auth");
const PetPhotoDAO = require("../dao/PetPhotoDAO");

const upload = multer({
  dest: "public/images/pets",
  limits: {
    fileSize: 1024 * 1024,
  },
});
router.get("/:id", async function (req, res) {
  let petDAO = new PetDAO();
  let pet = null;
  try {
    pet = await petDAO.findById(req.params.id);
    await pet.loadPetPhotos();
  } catch (error) {
    return res.status(444).end();
  }
  res.json(pet);
});
/* GET pets listing. */
router.get(
  "/",
  function (req, res, next) {
    let page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    let skipIndex = 0;
    if (page > 0) skipIndex = (page - 1) * limit;
    req.pagination = {
      page,
      limit,
      skipIndex,
    };
    next();
  },
  async function (req, res, next) {
    let petDAO = new PetDAO();
    let pets = await petDAO.fetchPaginated(
      req.pagination.skipIndex,
      req.pagination.limit
    );
    for (let pet of pets) await pet.loadPetPhotos();
    let count = await petDAO.countPets();
    let pageCount = Math.ceil(count / req.pagination.limit);
    res.json({
      pageCount,
      itemsCount: count,
      actualPage: req.pagination.page,
      consts: { species: Pet.SPECIES_NAMES, sizes: Pet.SIZE_NAMES },
      data: pets,
    });
  }
);

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
      petData.protectorId = req.user.id;

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
    let photo = await petPhotoDAO.findById(req.params.id);
    let pet = await petDAO.findById(photo.petId);
    if (pet.protectorId == req.user.id) {
      petPhotoDAO.removePhoto(req.params.id);
    }
  }
);

// router.post(
//   "/:id/photo",
//   authHelper.authMiddleware,
//   async function (req, res) {
//     let petDAO = new PetDAO();
//     let petPhotoDAO = new PetPhotoDAO();
//     let photo = (await petPhotoDAO.findById(req.params.id))[0];
//     let pet = (await petDAO.findById(photo.petId))[0];
//     if (pet.protectorId == req.userId) {
//       petPhotoDAO.removePhoto(req.params.id);
//     }
//   }
// );

router.delete("/:id", authHelper.authMiddleware, async function (req, res) {
  let petDAO = new PetDAO();
  let petPhotoDAO = new PetPhotoDAO();
  let petId = req.params.id;
  try {
    let pet = await petDAO.findById(petId);

    if (pet.protectorId == req.user.id) {
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
