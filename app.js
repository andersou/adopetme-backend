var express = require("express");
require("express-async-errors");
var apiRouter = express.Router();
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var cors = require("cors");
require("dotenv").config();
require('./helpers/qoveryEnv')() //autoset para as variaveis do qovery

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var petsRouter = require("./routes/pets");
var adoptionsRouter = require("./routes/adoptions");
var ratingsRouter = require("./routes/ratings");

var app = express();
app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
apiRouter.use("/", indexRouter);
apiRouter.use("/users", usersRouter);
apiRouter.use("/pets", petsRouter);
apiRouter.use("/adoptions", adoptionsRouter);
apiRouter.use("/ratings", ratingsRouter);

app.use("/api/v1", apiRouter);

module.exports = app;
