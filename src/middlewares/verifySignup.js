"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.validateEmail = validateEmail;
exports.validatePassword = validatePassword;
exports.checkEmailAlreadyExists = checkEmailAlreadyExists;

var _config = _interopRequireDefault(require("../db/config"));

function validateEmail(req, res, next) {
  var email = req.body.email;
  if (/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email)) next();else res.status(400).send("invalid email");
}

function validatePassword(req, res, next) {
  var password = req.body.password;
  if ((password === null || password === void 0 ? void 0 : password.length) >= 8) next();else res.status(400).send("invalid password");
}

function checkEmailAlreadyExists(req, res, next) {
  var email = req.body.email;

  _config["default"].query("SELECT email FROM users WHERE email = $1", [email]).then(function (results) {
    if (results.rowCount) res.status(400).send("email already exists");else next();
  })["catch"](function (err) {
    console.log("checkEmailAlreadyExists error: ", err);
  });
}