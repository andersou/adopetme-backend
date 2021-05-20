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

router.delete("/photo", authHelper.authMiddleware, async function (req, res) {
  let userDAO = new UserDAO();
  let user = (await userDAO.findById(req.userId))[0];
  //delete photo aqui

  user.photoUri = "";
  //falta implementar
  userDAO.update(user);
});
module.exports = router;
