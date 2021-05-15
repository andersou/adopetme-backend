const { check, validationResult } = require("express-validator");

function validationMiddleware(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  } else next();
}

const registerValidation = [
  check("email").isEmail().withMessage("Não é um email válido"),
  check("firstName")
    .isLength({ min: 3, max: 255 })
    .withMessage("Mínimo 3 caracteres"),
  check("lastName")
    .isLength({ min: 3, max: 255 })
    .withMessage("Mínimo 3 caracteres"),
  check("birthdayDate").isDate().toDate(), // formato padrao YYYY/MM/DD
  check("password")
    .isLength({ min: 8, max: 60 })
    .withMessage("Mínimo de 8 caracteres")
    .isStrongPassword()
    .withMessage("Senha fraca"),
  check("document")
    .isLength({ min: 11, max: 11 })
    .withMessage("Documento inválido"),

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

module.exports = {
  validationMiddleware,
  registerValidation,
};
