# Rotas desenvolvidas

Todas rotas com prefixo /api/v1

Rotas com * requerem autenticação (X-Access-Token no cabeçalho)



| HTTP Verb |              Rota              | Parâmetros                                              | Arquivo      | Descrição                                          |
| --------- | :----------------------------: | ------------------------------------------------------- | ------------ | -------------------------------------------------- |
| GET       |               /                |                                                         | index.js     | Rota de bem vindo da api                           |
| POST      |             /login             | email e password                                        | index.js     | Rota de login, retorna o token                     |
| POST      |           /register            | todos parametros do usuário e mais o avatar (multipart) | index.js     | Rota de registro de usuario no sistema             |
| POST      |           /logout *            |                                                         | index.js     | Rota de logout                                     |
| GET       |     /confirm-email/:token      | :token como route parameter                             | index.js     | confirma o cadastro de usuário                     |
| GET       |            /users *            |                                                         | users.js     | retorna o perfil do usuário logado                 |
| DELETE    |         /users/photo *         |                                                         | users.js     | remove a foto do usuário                           |
| GET       |           /pets/:id            | :id do pet como parametro na rota                       | pets.js      | retorna os detalhes de um pet                      |
| GET       |             /pets              | aceita os parametros limit e page na query              | pets.js      |
| POST      |            /pets *             | aceita parametros do modelo                             | pets.js      | adiciona um pet ao usuario                         |
| DELETE    |       /pets/photo/:id *        | parametro de rota :id da PetPhoto à ser excluida        | pets.js      | exclui determinada foto do pet                     |
| DELETE    |          /pets/:id *           | :id do Pet na rota                                      | pets.js      | deleta um pet                                      |
| POST      |          /adoptions *          | parametros do modelo no corpo (json)                    | adoptions.js | cria uma solicitação adoção                        |
| POST      |    /adoptions/:id/approve *    | :id da solicitação de adoção na rota                    | adoptions.js | aprova uma solicitação de adoção                   |
| POST      |    /adoptions/:id/reject *     | :id da solicitação de adoção na rota                    | adoptions.js | aprova uma solicitação de adoção                   |
| GET       | /adoption/protector/requests * |                                                         | adoptions.js | retorna lista de solicitação de adoção ao protetor |
| GET       |  /adoption/adopter/requests *  |                                                         | adoptions.js | retorna lista de solicitação de adoção ao protetor |

## index.js (/)

- GET /
- POST /login
- POST /register
- POST /logout
- GET /confirm-email/:token

## users.js (/users)

- GET /users
- DELETE /users/photo

## pets.js (/pets)

- GET /pets/:id
- GET /pets
- POST /pets
- DELETE /pets/photo/:id
- DELETE /pets/:id

## adoptions (/adoptions)

- POST /adoptions
- POST /adoptions/:id/approve
- POST /adoptions/:id/reject
- GET /adoption/protector/requests
- GET /adoption/adopter/requests