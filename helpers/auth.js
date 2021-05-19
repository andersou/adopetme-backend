const jwt = require("jsonwebtoken");
let blacklist = [];
const JWT_SECRET = process.env.JWT_SECRET;

const JWT_MAIL_SECRET = process.env.JWT_MAIL_SECRET;

function authMiddleware(req, res, next) {
  const token = req.headers["x-access-token"];
  const index = blacklist.findIndex((item) => item === token);
  if (index !== -1) return res.status(401).end();

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    //erro nos casos de token ausente ou inválido
    if (err) return res.status(401).end();

    //guardando requisição p/ uso posterior
    req.userId = decoded.userId;
    next();
  });
}

function putOnBlacklist(token) {
  blacklist.push(token);
}

function signToken(user) {
  return jwt.sign({ userId: user.id }, JWT_SECRET, {
    expiresIn: 5 * 60 * 60 /* horas */,
  });
}
function signEmailToken(user) {
  return jwt.sign({ userId: user.id }, JWT_MAIL_SECRET, {
    expiresIn: 72 * 60 * 60 /* 72 horas */,
  });
}
function authEmailMiddleware(req, res, next) {
  const token = req.params.token;

  jwt.verify(token, JWT_MAIL_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ err: "token inválido" }).end();
    console.log(decoded);
    req.userId = decoded.userId;
    next();
  });
}
module.exports = {
  authMiddleware,
  putOnBlacklist,
  signToken,
  signEmailToken,
  authEmailMiddleware,
};
