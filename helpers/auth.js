let blacklist = [];
const JWT_SECRET = process.env.JWT_SECRET;

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
module.exports = { authMiddleware, putOnBlacklist };
