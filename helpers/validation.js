const { check, validationResult } = require("express-validator");
const UserDAO = require("../dao/UserDAO");

function validationMiddleware(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  } else next();
}

const registerValidation = [
  check("email")
    .isEmail()
    .withMessage("Não é um email válido")
    .custom(async (value) => {
      let userDAO = new UserDAO();
      let user = null;
      try {
        user = await userDAO.findByEmail(value);
      } catch (error) {}
      if (user) throw new Error("email em uso");
    }),
  check("firstName")
    .isLength({ min: 3, max: 255 })
    .withMessage("Mínimo 3 caracteres"),
  check("lastName")
    .isLength({ min: 3, max: 255 })
    .withMessage("Mínimo 3 caracteres"),
  check("birthdayDate").isDate().toDate(), // formato padrao YYYY/MM/DD
  check("password")
    .isLength({ min: 8, max: 60 })
    .withMessage("Mínimo de 8 caracteres"),
  // .isStrongPassword()
  // .withMessage("Senha fraca"),
  check("document")
    .isLength({ min: 11, max: 11 })
    .withMessage("Documento inválido"),
  check("sex").isIn(["M", "F", "N"]).withMessage("Valor não permitido"),

  check("phone")
    .optional()
    .isMobilePhone(["pt-BR"])
    .withMessage("Telefone inválido"),
  check("facebookProfile")
    .optional()
    .isURL()
    .withMessage("O perfil do facebook tem que ser uma URL válida"),

  check("address")
    .optional()
    .isLength({ max: 255 })
    .withMessage("Máximo de 255 caracteres"),
  check("number")
    .optional()
    .isNumeric()
    .withMessage("Apenas números permitidos"),
  check("complement")
    .optional()
    .isLength({ max: 64 })
    .withMessage("Máximo 64 caracteres"),
  check("neighborhood")
    .optional()
    .isLength({ max: 64 })
    .withMessage("Máximo 64 caracteres"),
  check("city")
    .optional()
    .isLength({ max: 64 })
    .withMessage("Máximo 64 caracteres"),

  check("zipcode").optional().isPostalCode(["BR"]).withMessage("CEP inválido"),
  validationMiddleware,
];

const registerPetValidation = [
  check("name")
    .isLength({ min: 3, max: 255 })
    .withMessage("Mínimo 3 caracteres"),
  check("birthdayDate").isDate().toDate(), // formato padrao YYYY/MM/DD
  check("size")
    .isInt({ min: 0, max: 5 })
    .withMessage("Fora do range permitido")
    .toInt(),
  check("specie")
    .isInt({ min: 0, max: 2 })
    .withMessage("Fora do range permitido")
    .toInt(),
  check("simpleDescription")
    .isLength({ min: 3, max: 255 })
    .withMessage("Mínimo 3 caracteres, máximo 255"),
  check("detailedDescription")
    .isLength({ min: 3, max: 2048 })
    .withMessage("Mínimo 3 caracteres, máximo 2048"),
  check("sex").isIn(["M", "F", "N"]).withMessage("Valor não permitido"),
  validationMiddleware,
];

const findPetsValidation = [
  check("sort")
    .optional()
    .isIn(["DESC", "ASC"])
    .withMessage("Valor não permitido"),
  check("filters[sex]")
    .optional()
    .isIn(["M", "F", "N"])
    .withMessage("Valor não permitido"),
  check("filters[size]")
    .optional()
    .isInt({ min: 0, max: 5 })
    .withMessage("Fora do range permitido"),
  check("filters[specie]")
    .optional()
    .isInt({ min: 0, max: 2 })
    .withMessage("Fora do range permitido"),
  check("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Fora do range permitido"),
  check("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Fora do range permitido"),

  validationMiddleware,
];

module.exports = {
  validationMiddleware,
  registerValidation,
  registerPetValidation,
  findPetsValidation,
};
