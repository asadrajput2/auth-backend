"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getPosts = getPosts;
exports.createPost = createPost;

var _config = _interopRequireDefault(require("../db/config"));

function getPosts(req, res) {
  _config["default"].query("SELECT * FROM posts ORDER BY added_on DESC").then(function (result) {
    if (result.rows) res.status(200).json(result.rows);
  })["catch"](function (err) {
    console.log("getPosts error: ", err);
    res.status(400).json("unable to get posts");
  });
}

function createPost(req, res) {
  var _req$body = req.body,
      title = _req$body.title,
      text = _req$body.text;
  var userId = req.userId;
  var timestamp = new Date();

  if (title && text && userId) {
    _config["default"].query("INSERT INTO posts (title, text, user_id, added_on) VALUES ($1, $2, $3, $4)", [title, text, userId, timestamp]).then(function (result) {
      if (result) {
        res.status(201).json({
          message: "success"
        });
      }
    })["catch"](function (err) {
      console.log("createPost error: ", err);
      res.status(400).json({
        message: "error",
        text: ""
      });
    });
  } else {
    res.status(400).json("details not filled properly");
  }
}