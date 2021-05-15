const { check, validationResult } = require("express-validator");

function validationMiddleware(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  } else next();
}

const registerValidation = [
  check("email").isEmail(),
  check("firstName").isLength({ min: 3, max: 255 }),
  check("lastName").isLength({ min: 3, max: 255 }),
  check("birthdayDate").isDate().toDate(), // formato padrao YYYY/MM/DD
  check("password").isLength({ min: 8, max: 60 }).isStrongPassword(),
  check("document").isLength({ min: 11, max: 11 }),

  check("phone").optional().isMobilePhone(["pt-BR"]),
  check("facebookProfile").optional().isURL(),

  check("address").optional().isLength({ max: 255 }),
  check("number").optional().isNumeric(),
  check("complement").optional().isLength({ max: 64 }),
  check("neighborhood").optional().isLength({ max: 64 }),
  check("city").optional().isLength({ max: 64 }),
  check("zipcode").optional().isPostalCode(),
  validationMiddleware,
];

module.exports = {
  validationMiddleware,
  registerValidation,
};
