const { check, validationResult } = require("express-validator");

function validationMiddleware(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  } else next();
}

const registerValidation = [check("email").isEmail(), validationMiddleware];

module.exports = {
  validationMiddleware,
  registerValidation,
};
