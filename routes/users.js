const express = require("express");
const router = express.Router();
const UserDAO = require("../dao/UserDAO");
const authHelper = require("../helpers/auth");

const validationHelper = require("../helpers/validation");
const _omit = require("lodash/omit")
const multer = require("multer");

const upload = multer({
  dest: "public/images/users",
  limits: {
    fileSize: 1024 * 1024,
  },
});

/* GET users listing. */
router.get("/", authHelper.authMiddleware, async function (req, res, next) {
  let user = _omit(req.user, ['_password', 'registerConfirmed']);
  res.json(user);
});

router.put("/", authHelper.authMiddleware, upload.single("avatar"),
  validationHelper.updateUserValidation, async function (req, res, next) {
    let user = req.user;
    let userData = req.body
    let userDAO = new UserDAO();
    //seto os parametros
    for (let param in userData) {
      user[param] = userData[param]
    }
    if (req.file) user.photoUri = req.file.filename;
    let { changes } = await userDAO.update(user);

    res.json({ success: true, changes });
  });

router.delete("/photo", authHelper.authMiddleware, async function (req, res) {
  let user = req.user;
  //delete photo aqui
  user.photoUri = "";
  let userDAO = new UserDAO()
  //falta implementar
  userDAO.update(user);
});
module.exports = router;
