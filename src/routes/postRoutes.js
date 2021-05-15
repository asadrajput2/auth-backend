"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = _interopRequireDefault(require("express"));

var _posts = require("../controllers/posts");

var _verifyAuth = require("../middlewares/verifyAuth");

var postRoutes = _express["default"].Router();

postRoutes.get("/", _posts.getPosts);
postRoutes.post("/create", [_verifyAuth.verifyAuth], _posts.createPost);
var _default = postRoutes;
exports["default"] = _default;