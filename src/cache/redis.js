"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _redis = _interopRequireDefault(require("redis"));

var _dotenv = _interopRequireDefault(require("dotenv"));

_dotenv["default"].config();

var cache = _redis["default"].createClient({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  password: process.env.REDIS_PASSWORD
});

cache.on("error", function (err) {
  return console.log("error in redis connection: ", err);
});
cache.on("connect", function () {
  return console.log("redis connected");
});
var _default = cache;
exports["default"] = _default;