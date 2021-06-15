const express = require("express");
const RatingDAO = require("../dao/RatingDAO");
const router = express.Router();
const authHelper = require("../helpers/auth");
router.use(authHelper.authMiddleware);

router.get("/protector", async (req, res) => {
  let ratingDAO = new RatingDAO();
  res.json(await ratingDAO.fetchProtectorReceivedRatings(req.user.id));
});

router.get("/adopter", async (req, res) => {
  let ratingDAO = new RatingDAO();
  res.json(await ratingDAO.fetchAdopterReceivedRatings(req.user.id));
});

module.exports = router;
