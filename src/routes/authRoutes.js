"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = _interopRequireDefault(require("express"));

var _auth = require("../controllers/auth");

var _githubAuth = require("../controllers/githubAuth");

var _verifyAuth = require("../middlewares/verifyAuth");

var _verifyLogin = require("../middlewares/verifyLogin");

var _verifySignup = require("../middlewares/verifySignup");

var authRoutes = _express["default"].Router();

authRoutes.use("/", function (req, res, next) {
  console.log("authRoutes active");
  next();
});
authRoutes.get("/", function (req, res) {
  console.log("req.header", req.headers);
  res.send("fsdafsdsad");
});
authRoutes.post("/create", [_verifySignup.validateEmail, _verifySignup.validatePassword, _verifySignup.checkEmailAlreadyExists], _auth.createUser);
authRoutes.post("/verify", [_verifyAuth.verifyAuth], _auth.handleAuthVerification);
authRoutes.post("/login", [_verifyLogin.validateLoginEmail, _verifyLogin.validateLoginPassword], _auth.login);
authRoutes.post("/refresh", _auth.refreshToken);
authRoutes.post("/logout", [_verifyAuth.verifyAuth], _auth.logout);
authRoutes.post("/changePassword", [_verifyAuth.verifyAuth], _auth.changePassword);
authRoutes.post("/github-login", [_githubAuth.getGithubToken, _githubAuth.getGithubUser], _githubAuth.loginGithub);
var _default = authRoutes;
exports["default"] = _default;