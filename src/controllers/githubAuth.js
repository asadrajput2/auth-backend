"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getGithubToken = getGithubToken;
exports.getGithubUser = getGithubUser;
exports.loginGithub = loginGithub;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _config = _interopRequireDefault(require("../db/config"));

var _nodeFetch = _interopRequireDefault(require("node-fetch"));

var _token = require("../utils/token");

function getGithubToken(_x, _x2, _x3) {
  return _getGithubToken.apply(this, arguments);
}

function _getGithubToken() {
  _getGithubToken = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(req, res, next) {
    var code, data;
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            // console.log("github id", process.env.GITHUB_ID);
            // console.log("github secret", process.env.GITHUB_SECRET);
            code = req.body.code; // console.log("CODE", code);

            data = {
              client_id: process.env.GITHUB_ID,
              client_secret: process.env.GITHUB_SECRET,
              code: code
            };

            if (code) {
              (0, _nodeFetch["default"])("https://github.com/login/oauth/access_token", {
                method: "POST",
                headers: {
                  accept: "application/json",
                  "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
              }).then( /*#__PURE__*/function () {
                var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(response) {
                  var result;
                  return _regenerator["default"].wrap(function _callee2$(_context2) {
                    while (1) {
                      switch (_context2.prev = _context2.next) {
                        case 0:
                          _context2.next = 2;
                          return response.json();

                        case 2:
                          result = _context2.sent;

                          if ((response === null || response === void 0 ? void 0 : response.status) === 200) {
                            // console.log("token response: ", result);
                            req.ghToken = result === null || result === void 0 ? void 0 : result.access_token;
                            next();
                          } else {
                            res.status(500).json("Something went wrong while authenticating with github");
                          }

                        case 4:
                        case "end":
                          return _context2.stop();
                      }
                    }
                  }, _callee2);
                }));

                return function (_x5) {
                  return _ref2.apply(this, arguments);
                };
              }())["catch"](function (err) {
                throw err;
              });
            } else {
              res.status(500).json("Something went wrong while authenticating with github");
            }

          case 3:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));
  return _getGithubToken.apply(this, arguments);
}

function getGithubUser(req, res, next) {
  var ghToken = req.ghToken;

  if (ghToken) {
    (0, _nodeFetch["default"])("https://api.github.com/user", {
      method: "GET",
      headers: {
        Authorization: "token ".concat(ghToken)
      }
    }).then( /*#__PURE__*/function () {
      var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(response) {
        var result;
        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return response.json();

              case 2:
                result = _context.sent;

                // console.log("user response: ", result);
                if ((response === null || response === void 0 ? void 0 : response.status) === 200) {
                  req.ghUser = result;
                  next();
                } else {
                  res.status(500).json("Something went wrong while getting user data from github");
                }

              case 4:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }));

      return function (_x4) {
        return _ref.apply(this, arguments);
      };
    }());
  } else {
    res.status(500).json("Something went wrong while getting user data from github");
  }
}

function loginGithub(req, res) {
  var user = req.ghUser;
  var email = user.email; // check if user is already present in db

  _config["default"].query("SELECT id, email FROM users WHERE email = $1", [email], function (err, qResult) {
    if (err) throw err;

    if (qResult) {
      // console.log("qResults: ", qResult.rows[0]);
      // user already exists
      var _createTokenPair = (0, _token.createTokenPair)(qResult.rows[0].id),
          accessToken = _createTokenPair.accessToken,
          refreshToken = _createTokenPair.refreshToken;

      res.cookie("authtoken", accessToken, {
        httpOnly: true,
        domain: "localhost",
        path: "/",
        expire: 360000 + Date.now()
      });
      res.status(200).json({
        message: "success",
        accessToken: accessToken,
        refreshToken: refreshToken,
        oauthLogin: true
      });
    } else {
      // new user
      // save user without password
      var _email = user.email,
          name = user.name;

      _config["default"].query("INSERT INTO users (name, email) VALUES ($1, $2)", [name, _email], function (err, results) {
        if (err) {
          throw err;
        }

        console.log("user created: ", results);
        res.status(201).json("user created successfully");
      });
    }
  });
}