const express = require("express");
const UserDAO = require("../dao/UserDAO");
const User = require("../models/User");
const authHelper = require("../helpers/auth");
const mailerHelper = require("../helpers/mailer");
const validationHelper = require("../helpers/validation");
const multer = require("multer");

const upload = multer({
  dest: "public/images/users",
  limits: {
    fileSize: 1024 * 1024,
  },
});

const router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  res.json({ msg: "Welcome to adopetme api" }).end();
});

// router.get("/clientes", authHelper.authMiddleware, (req, res) => {
//   res.json([{ id: 1, nome: "mathaus" }]);
// });

router.post("/login", async (req, res) => {
  try {
    //Dados viriam do banco de dados, engessei para teste
    let userDAO = new UserDAO();
    let users = await userDAO.findByEmail(req.body.email);
    if (users.length > 0) {
      let user = users[0];
      if (await user.isPasswordValid(req.body.password)) {
        if (!user.registerConfirmed) {
          return res.status(422).json({ err: "Favor, confirme seu email" });
        }
        const token = authHelper.signToken(user);
        return res.json({ auth: true, token });
      } else {
        res.status(401).end();
      }
    } else {
      res.status(401).end();
    }
  } catch (ex) {
    console.log(ex);
    res.status(403).end();
  }
});

router.post(
  "/register",
  upload.single("avatar"),
  validationHelper.registerValidation,
  async (req, res) => {
    let userDAO = new UserDAO();
    try {
      let userData = User.fromJSON(req.body);
      userData.password = req.body.password; // fazer o hash
      if (req.file) user.photoUri = req.file.filename;
      result = await userDAO.insert(userData);

      let user = (await userDAO.findById(result.lastID));
      //gera o token e manda por email
      await mailerHelper.sendConfirmEmail(user);

      res.json({ success: true, userId: user.id }).end();
    } catch (error) {
      console.log(error);
      res.status(401).end();
    }
  }
);

router.post("/logout", authHelper.authMiddleware, function (req, res) {
  authHelper.putOnBlacklist(req.headers["x-access-token"]);
  res.end();
});

router.get(
  "/confirm-email/:token",
  authHelper.authEmailMiddleware,
  async function (req, res) {
    let userDAO = new UserDAO();
    console.log(req.userId);
    let user = (await userDAO.findById(req.userId));
    console.log(user);
    let { changes } = await userDAO.confirmEmail(user);
    if (changes > 0) {
      res.json({ msg: "Confirmado com sucesso" }).end();
    } else {
      res
        .status(401)
        .json({ err: "Você pode já ter confirmado esse email." })
        .end();
    }
  }
);

module.exports = router;
