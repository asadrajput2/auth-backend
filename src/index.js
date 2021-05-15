"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _dotenv = _interopRequireDefault(require("dotenv"));

var _express = _interopRequireDefault(require("express"));

var _cors = _interopRequireDefault(require("cors"));

var _cookieParser = _interopRequireDefault(require("cookie-parser"));

var _authRoutes = _interopRequireDefault(require("./routes/authRoutes"));

var _postRoutes = _interopRequireDefault(require("./routes/postRoutes"));

_dotenv["default"].config();

if (!process.env.TOKEN_SECRET) {
  console.log("\x1b[31m%s\x1b[0m", "You probably do not have an environment (.env) file configured!");
}

var app = (0, _express["default"])();
app.use((0, _cookieParser["default"])());
var PORT = process.env.PORT || 8080;
app.use(_express["default"].json());
app.use((0, _cors["default"])({
  origin: process.env.FRONTEND_URL,
  optionsSuccessStatus: 200,
  credentials: true
}));
app.get("/", function (req, res) {
  res.send("Got it");
});
app.use("/api/users", _authRoutes["default"]);
app.use("/api/posts", _postRoutes["default"]);
app.listen(PORT, function () {
  console.log("We're listening");
});