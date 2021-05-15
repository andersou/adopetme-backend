var express = require('express');
var http = require('http');
var jwt = require('jsonwebtoken');

var router = express.Router();
var SECRET = 'adopetme';

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

function verificaJWT(req, res, next){
  const token = req.headers['x-access-token'];
  const index = blacklist.findIndex(item => item === token);
  if(index !== -1) return res.status(401).end();


  jwt.verify(token, SECRET, (err, decoded) => {
    //erro nos casos de token ausente ou inválido
    if(err) return res.status(401).end();

    //guardando requisição p/ uso posterior
    req.userId = decoded.userId;
    next();
  })
}
router.get('/clientes', verificaJWT, (req, res) => {
  res.json([{id:1, nome:'mathaus'}]);
})

router.post('/login', (req, res) => {
  //Dados viriam do banco de dados, engessei para teste
  if(req.body.user === 'user@contato.com' && req.body.password === '123'){
  const token = jwt.sign({userId: 1}, SECRET, {expiresIn: 300});
  return res.json({auth: true, token});
  }

  res.status(401).end();
})

router.post('/logout', function(req,res) {
  blacklist.push(req.headers['x-access-token']);
  res.end;
})

const server = http.createServer(app);
server.listen(3000);
module.exports = router;
