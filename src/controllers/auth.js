"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createUser = createUser;
exports.login = login;
exports.refreshToken = refreshToken;
exports.handleAuthVerification = handleAuthVerification;
exports.logout = logout;
exports.logoutAllSessions = logoutAllSessions;
exports.changePassword = changePassword;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _bcrypt = _interopRequireDefault(require("bcrypt"));

var _config = _interopRequireDefault(require("../db/config"));

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

var _token = require("../utils/token");

var saltRounds = 10;

function createUser(_x, _x2) {
  return _createUser.apply(this, arguments);
}

function _createUser() {
  _createUser = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(req, res) {
    var _req$body, name, email, password, passwordHash;

    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _req$body = req.body, name = _req$body.name, email = _req$body.email, password = _req$body.password;
            _context.next = 3;
            return _bcrypt["default"].hash(password, saltRounds);

          case 3:
            passwordHash = _context.sent;

            _config["default"].query("INSERT INTO users (name, password, email) VALUES ($1, $2, $3)", [name, passwordHash, email], function (err, results) {
              if (err) {
                throw err;
              }

              console.log("user created: ", results);
              res.status(201).json("user created successfully");
            });

          case 5:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _createUser.apply(this, arguments);
}

function login(_x3, _x4) {
  return _login.apply(this, arguments);
}

function _login() {
  _login = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(req, res) {
    var _req$body2, email, password;

    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _req$body2 = req.body, email = _req$body2.email, password = _req$body2.password;

            _config["default"].query("SELECT id, password FROM users WHERE email = $1", [email], function (err, qResult) {
              if (err) throw err;

              _bcrypt["default"].compare(password, qResult.rows[0].password, function (err, result) {
                if (err) throw err;else {
                  if (result) {
                    var _createTokenPair = (0, _token.createTokenPair)(qResult.rows[0].id),
                        accessToken = _createTokenPair.accessToken,
                        _refreshToken2 = _createTokenPair.refreshToken;

                    res.cookie("authtoken", accessToken, {
                      httpOnly: true,
                      domain: "localhost",
                      path: "/",
                      expire: 360000 + Date.now()
                    });
                    res.status(200).json({
                      message: "success",
                      accessToken: accessToken,
                      refreshToken: _refreshToken2,
                      oauthLogin: false
                    });
                  } else res.status(401).json("Incorrect Password");
                }
              });
            });

          case 2:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));
  return _login.apply(this, arguments);
}

function refreshToken(_x5, _x6) {
  return _refreshToken.apply(this, arguments);
}

function _refreshToken() {
  _refreshToken = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(req, res) {
    var token, _yield$verifyToken, success, error, tokenExpired, decoded, _createTokenPair2, accessToken, _refreshToken3;

    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            token = req.headers.authorization;
            _context3.next = 3;
            return (0, _token.verifyToken)(token, "refresh");

          case 3:
            _yield$verifyToken = _context3.sent;
            success = _yield$verifyToken.success;
            error = _yield$verifyToken.error;
            tokenExpired = _yield$verifyToken.tokenExpired;
            decoded = _yield$verifyToken.decoded;

            if (error) {
              console.log("error in refresh token verification");
              res.status(401).json({
                auth: false,
                message: "unable to refresh token, redirect to login"
              });
            } else {
              if (success) {
                // remove old refresh token
                console.log("decoded: ", decoded);
                (0, _token.removeTokens)(decoded.id, false, token);

                if (decoded.type === "refresh") {
                  console.log("refresh token verified");
                  _createTokenPair2 = (0, _token.createTokenPair)(decoded.id), accessToken = _createTokenPair2.accessToken, _refreshToken3 = _createTokenPair2.refreshToken;
                  res.status(200).json({
                    message: "token refreshed successfully",
                    accessToken: accessToken,
                    refreshToken: _refreshToken3
                  });
                } else {
                  res.status(401).json({
                    message: "must be a refresh token"
                  });
                }
              } else {
                res.status(401).json({
                  auth: false,
                  message: "unable to refresh token, redirect to login"
                });
              }
            }

          case 9:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));
  return _refreshToken.apply(this, arguments);
}

function handleAuthVerification(_x7, _x8) {
  return _handleAuthVerification.apply(this, arguments);
}

function _handleAuthVerification() {
  _handleAuthVerification = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(req, res) {
    return _regenerator["default"].wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            if (req.userId) res.status(200).json({
              message: "success"
            });

          case 1:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4);
  }));
  return _handleAuthVerification.apply(this, arguments);
}

function logout(_x9, _x10) {
  return _logout.apply(this, arguments);
}

function _logout() {
  _logout = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5(req, res) {
    var userId, _req$body3, accessToken, refreshToken;

    return _regenerator["default"].wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            userId = req.userId;
            _req$body3 = req === null || req === void 0 ? void 0 : req.body, accessToken = _req$body3.accessToken, refreshToken = _req$body3.refreshToken;
            (0, _token.removeTokens)(userId, false, accessToken, refreshToken); // res.cookie("authtoken", "", { expire: new Date(0) });

            res.status(200).json({
              message: "success"
            }); // Todo: logout user

          case 4:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5);
  }));
  return _logout.apply(this, arguments);
}

function logoutAllSessions(_x11, _x12, _x13) {
  return _logoutAllSessions.apply(this, arguments);
}

function _logoutAllSessions() {
  _logoutAllSessions = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee6(req, res, next) {
    var userId, _req$body4, accessToken, refreshToken;

    return _regenerator["default"].wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            userId = req.userId;
            _req$body4 = req === null || req === void 0 ? void 0 : req.body, accessToken = _req$body4.accessToken, refreshToken = _req$body4.refreshToken;
            (0, _token.removeTokens)(userId, true, accessToken, refreshToken); // res.cookie("authtoken", "", { expire: new Date(0) });

            next(); // res.status(200).json("logged out successfully");
            // Todo: logout user

          case 4:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee6);
  }));
  return _logoutAllSessions.apply(this, arguments);
}

function changePassword(_x14, _x15) {
  return _changePassword.apply(this, arguments);
}

function _changePassword() {
  _changePassword = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee8(req, res) {
    var _req$body5, oldPassword, newPassword, userId;

    return _regenerator["default"].wrap(function _callee8$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            _req$body5 = req.body, oldPassword = _req$body5.oldPassword, newPassword = _req$body5.newPassword;
            userId = req.userId;

            _config["default"].query("SELECT id, password FROM users WHERE id = $1", [userId], function (err, qResult) {
              if (err) throw err;
              if (!qResult.rows[0].password) res.status(400).json({
                message: "error",
                error: "logged in with oauth"
              });

              _bcrypt["default"].compare(oldPassword, qResult.rows[0].password, /*#__PURE__*/function () {
                var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee7(err, result) {
                  var passwordHash;
                  return _regenerator["default"].wrap(function _callee7$(_context7) {
                    while (1) {
                      switch (_context7.prev = _context7.next) {
                        case 0:
                          if (!err) {
                            _context7.next = 4;
                            break;
                          }

                          throw err;

                        case 4:
                          if (!result) {
                            _context7.next = 13;
                            break;
                          }

                          (0, _token.removeTokens)(userId, true);
                          _context7.next = 8;
                          return _bcrypt["default"].hash(newPassword, saltRounds);

                        case 8:
                          passwordHash = _context7.sent;

                          _config["default"].query("UPDATE users SET password = $1 where id = $2", [passwordHash, userId], function (err, results) {
                            if (err) {
                              throw err;
                            }

                            console.log("password changed: ", results);
                          });

                          res.status(200).send({
                            message: "success"
                          });
                          _context7.next = 14;
                          break;

                        case 13:
                          res.status(401).json("Incorrect Password");

                        case 14:
                        case "end":
                          return _context7.stop();
                      }
                    }
                  }, _callee7);
                }));

                return function (_x16, _x17) {
                  return _ref.apply(this, arguments);
                };
              }());
            });

          case 3:
          case "end":
            return _context8.stop();
        }
      }
    }, _callee8);
  }));
  return _changePassword.apply(this, arguments);
}