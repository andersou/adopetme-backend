const express = require("express");
const UserDAO = require("../dao/UserDAO");
const authHelper = require("../helpers/auth");
const validationHelper = require("../helpers/validation");
const multer = require("multer");

const upload = multer({
  dest: "public/images",
  limits: {
    fileSize: 1024 * 1024,
  },
});

const router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

router.get("/clientes", authHelper.authMiddleware, (req, res) => {
  res.json([{ id: 1, nome: "mathaus" }]);
});

router.post("/login", async (req, res) => {
  try {
    //Dados viriam do banco de dados, engessei para teste
    let userDAO = new UserDAO();
    let users = await userDAO.findByEmail(req.body.email);
    if (users.length > 0) {
      let user = users[0];
      if (await user.isPasswordValid(req.body.password)) {
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
    res.json(req.file).end();
  }
);

router.post("/logout", authHelper.authMiddleware, function (req, res) {
  authHelper.putOnBlacklist(req.headers["x-access-token"]);
  res.end();
});

module.exports = router;
