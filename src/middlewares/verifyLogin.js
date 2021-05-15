"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.validateLoginEmail = validateLoginEmail;
exports.validateLoginPassword = validateLoginPassword;

function validateLoginEmail(req, res, next) {
  var email = req.body.email;
  if (/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email)) next();else res.status(400).send("invalid email");
}

function validateLoginPassword(req, res, next) {
  var password = req.body.password;
  if ((password === null || password === void 0 ? void 0 : password.length) >= 8) next();else res.status(400).send("invalid password");
}