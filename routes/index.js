const express = require("express");
const http = require("http");
const jwt = require("jsonwebtoken");
const UserDAO = require("../dao/UserDAO");
const router = express.Router();
const SECRET = "adopetme";

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

function verificaJWT(req, res, next) {
  const token = req.headers["x-access-token"];
  const index = blacklist.findIndex((item) => item === token);
  if (index !== -1) return res.status(401).end();

  jwt.verify(token, SECRET, (err, decoded) => {
    //erro nos casos de token ausente ou inválido
    if (err) return res.status(401).end();

    //guardando requisição p/ uso posterior
    req.userId = decoded.userId;
    next();
  });
}
router.get("/clientes", verificaJWT, (req, res) => {
  res.json([{ id: 1, nome: "mathaus" }]);
});

router.post("/login", async (req, res) => {
  //Dados viriam do banco de dados, engessei para teste
  let userDAO = new UserDAO();
  let users = await userDAO.findByEmail(req.body.email);
  if (users.length > 0) {
    let user = users[0];
    if (await user.isPasswordValid(req.body.password)) {
      const token = jwt.sign({ userId: 1 }, SECRET, { expiresIn: 300 });
      return res.json({ auth: true, token });
    } else {
      res.status(401).end();
    }
  } else {
    res.status(401).end();
  }
});

router.post("/logout", function (req, res) {
  blacklist.push(req.headers["x-access-token"]);
  res.end;
});

module.exports = router;
