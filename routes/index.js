const express = require("express");
const UserDAO = require("../dao/UserDAO");
const User = require("../models/User");
const authHelper = require("../helpers/auth");
const mailerHelper = require("../helpers/mailer");
const validationHelper = require("../helpers/validation");
const multer = require("multer");
const fbSevice = require("../helpers/facebook");

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
    let user = null;
    try {
      user = await userDAO.findByEmail(req.body.email);
    } catch (error) {
      return res.status(401).end();
    }
    if (await user.isPasswordValid(req.body.password)) {
      if (!user.registerConfirmed) {
        return res.status(422).json({ err: "Favor, confirme seu email" });
      }
      const token = authHelper.signToken(user);
      return res.json({ auth: true, token });
    } else {
      res.status(401).end();
    }
  } catch (ex) {
    console.log(ex);
    res.status(403).end();
  }
});
router.post("/fb-login", async (req, res) => {
  try {

    let access_token = req.body.access_token
    let user = await fbSevice.getUser(access_token)
    if (user.id) {
      const token = authHelper.signToken(user);
      return res.json({ auth: true, token });
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
      if (req.file) userData.photoUri = req.file.filename;
      result = await userDAO.insert(userData);

      let user = await userDAO.findById(result.lastID);
      //gera o token e manda por email



      res.json({ success: true, userId: user.id }).end();
      try {
        await mailerHelper.sendConfirmEmail(user);
       
      } catch (error) {
        console.log(error);
      }
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
    let user = await userDAO.findById(req.userId);
    console.log(user);
    let { changes } = await userDAO.confirmEmail(user);
    if (changes > 0) {
      //res.json({ msg: "Confirmado com sucesso" }).end();
      res.redirect(process.env.FRONTEND_URL + "/#/confirmar-email")
    } else {
      // res
      //   .status(401)
      //   .json({ err: "Você pode já ter confirmado esse email." })
      //   .end();
      res.redirect(process.env.FRONTEND_URL)
    }
  }
);

module.exports = router;
