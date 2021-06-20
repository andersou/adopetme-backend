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
router.get("/my", authHelper.authMiddleware, async function (req, res, next) {
  console.log("oi");
  let petDAO = new PetDAO();
  let myPets = await petDAO.fetchFromProtector(req.user);
  for (let pet of myPets) await pet.loadPetPhotos();
  res.json(myPets);
});
router.get("/:id", authHelper.passiveAuthMiddleware, async function (req, res) {
  let petDAO = new PetDAO();
  let pet = null;
  try {
    pet = await petDAO.findById(req.params.id);
    await pet.loadPetPhotos();
    if (req.user) {
      await pet.hasRequestFromUser(req.user);
    }
  } catch (error) {
    return res.status(444).end();
  }
  await pet.loadProtector([
    "firstName",
    "facebookProfile",
    "photoUri",
    "city",
    "state",
    "protectorRating"
  ]);
  res.json(pet);
});

/* GET pets listing. */
router.get(
  "/",
  validationHelper.findPetsValidation,
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
    console.log(req.query);
    let pets = await petDAO.fetchPaginated(
      req.pagination.skipIndex,
      req.pagination.limit,
      req.query.filters,
      req.query.sort
    );
    for (let pet of pets) { await pet.loadPetPhotos(); await pet.loadProtector() };
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
        for (let file of req.files) {
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
router.put(
  "/:id",
  authHelper.authMiddleware,
  upload.array("photos", 6),
  validationHelper.updatePetValidation,
  async function (req, res, next) {
    let petData = req.body;
    let petId = req.params.id
    //carrego o pet
    //mesclo os dados
    //faço o update
    let petDAO = new PetDAO();
    let petPhotoDAO = new PetPhotoDAO();
    try {
      let pet = await petDAO.findById(petId)
      //se nao for o dono do pet

      if (pet.protectorId != req.user.id) {
        return res.status(401).end();
      }
      //seto os parametros
      for (let param in petData) {
        pet[param] = petData[param]
      }


      let { changes } = await petDAO.update(pet);

      if (req.files) {
        for (let file of req.files) {
          let petPhoto = new PetPhoto();
          petPhoto.petId = pet.id;
          petPhoto.photoUri = file.filename;
          petPhotoDAO.insert(petPhoto);
        }
      }

      res.json({ success: true, changes }).end();
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
      //falta remover arquivo servidor
      res.json({ success: true })
    } else {
      res.status(422).end();
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
      petPhotoDAO.removePhotosFromPet(pet);
      petDAO.removePet(pet);
    }

    res.json({ success: true }).end();
  } catch (error) {
    console.log(error);
    res.status(401).end();
  }
});
module.exports = router;
