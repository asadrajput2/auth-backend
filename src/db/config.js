"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _pg = _interopRequireDefault(require("pg"));

var Pool = _pg["default"].Pool;
var db = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT
});
db.on("connect", function () {
  console.log("pg db connected");
});
db.on("error", function () {
  console.log("pg db connection error");
});
var _default = db;
exports["default"] = _default;