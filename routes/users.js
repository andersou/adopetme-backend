const express = require("express");
const router = express.Router();
const UserDAO = require("../dao/UserDAO");
const authHelper = require("../helpers/auth");
/* GET users listing. */
router.get("/", authHelper.authMiddleware, async function (req, res, next) {
  let userDAO = new UserDAO();
  let users = await userDAO.findById(req.userId);
  let user = users[0];
  res.json(user);
});

module.exports = router;
