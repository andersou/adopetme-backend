let blacklist = [];

function authMiddleware(req, res, next) {
  const token = req.headers["x-access-token"];
  const index = blacklist.findIndex((item) => item === token);
  if (index !== -1) return res.status(401).end();

  jwt.verify(token, SECRET, (err, decoded) => {
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

module.exports = { authMiddleware, putOnBlacklist };
