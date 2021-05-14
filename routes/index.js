var express = require('express');
var http = require('http');
var router = express.Router();
var jwt = require('jsonwebtoken');
var SECRET = 'adopetme';

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/clientes', (req, res) => {
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
  res.end;
})

const server = http.createServer(app);
server.listen(3000);
module.exports = router;
