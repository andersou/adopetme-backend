const express = require("express");
const http = require("http");
const jwt = require("jsonwebtoken");
const UserDAO = require("../dao/UserDAO");
const authHelper = require("../helpers/auth");

const router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

router.get("/clientes", authHelper.authMiddleware, (req, res) => {
  res.json([{ id: 1, nome: "mathaus" }]);
});

router.post("/login", async (req, res) => {
  //Dados viriam do banco de dados, engessei para teste
  let userDAO = new UserDAO();
  let users = await userDAO.findByEmail(req.body.email);
  if (users.length > 0) {
    let user = users[0];
    if (await user.isPasswordValid(req.body.password)) {
      const token = auth.signToken(user);
      return res.json({ auth: true, token });
    } else {
      res.status(401).end();
    }
  } else {
    res.status(401).end();
  }
});

router.post("/logout", function (req, res) {
  authHelper.putOnBlacklist(req.headers["x-access-token"]);
  res.end();
});

module.exports = router;
