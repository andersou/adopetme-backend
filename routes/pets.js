var express = require("express");
var router = express.Router();
const PetDAO = require("../dao/PetDAO");

/* GET pets listing. */
router.get("/", async function (req, res, next) {
  let petDAO = new PetDAO();
  pets = await petDAO.fetch();
  res.json(pets);
});

module.exports = router;
