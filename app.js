var express = require("express");
require("express-async-errors");
var apiRouter = express.Router();
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var cors = require("cors");
require("dotenv").config();

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var petsRouter = require("./routes/pets");

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

app.use("/api/v1", apiRouter);

module.exports = app;
