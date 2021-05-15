"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createTokenPair = createTokenPair;
exports.verifyToken = verifyToken;
exports.removeTokens = removeTokens;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _jsonwebtoken = _interopRequireWildcard(require("jsonwebtoken"));

var _util = require("util");

var _redis = _interopRequireDefault(require("../cache/redis"));

var sismemberAsync = (0, _util.promisify)(_redis["default"].sismember).bind(_redis["default"]);

function createTokenPair(userId) {
  var expireTime = 60 * 5; // 5 mins

  var refreshExpireTime = 60 * 60 * 24 * 14; // 14 days

  var accessToken = _jsonwebtoken["default"].sign({
    id: userId,
    type: "access"
  }, process.env.TOKEN_SECRET, {
    expiresIn: expireTime
  });

  var refreshToken = _jsonwebtoken["default"].sign({
    id: userId,
    type: "refresh"
  }, process.env.TOKEN_SECRET, {
    expiresIn: "14d"
  }); // add tokens to cache


  _redis["default"].sadd("usertoken_".concat(userId), accessToken, function (err, res) {
    if (err) console.log("error in storing token: ", err);
  });

  _redis["default"].sadd("usertoken_".concat(userId), refreshToken, function (err, res) {
    if (err) console.log("error in storing refresh token: ", err);
  });

  _redis["default"].expire("usertoken_".concat(userId), refreshExpireTime);

  return {
    accessToken: accessToken,
    refreshToken: refreshToken
  };
}

function verifyToken(_x, _x2) {
  return _verifyToken.apply(this, arguments);
}

function _verifyToken() {
  _verifyToken = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(token, expectedType) {
    var _decoded;

    var decoded, tokenExists;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            console.log("token details: ", token, expectedType);
            _context.prev = 1;
            decoded = _jsonwebtoken["default"].verify(token, process.env.TOKEN_SECRET);
            _context.next = 9;
            break;

          case 5:
            _context.prev = 5;
            _context.t0 = _context["catch"](1);
            console.log("jwt verification error: ", _context.t0);
            return _context.abrupt("return", {
              error: _context.t0,
              tokenExpired: _context.t0.name === "TokenExpiredError"
            });

          case 9:
            if (!(((_decoded = decoded) === null || _decoded === void 0 ? void 0 : _decoded.type) !== expectedType)) {
              _context.next = 11;
              break;
            }

            return _context.abrupt("return", {
              success: false,
              error: "Invalid token type"
            });

          case 11:
            _context.next = 13;
            return sismemberAsync("usertoken_".concat(decoded.id), token);

          case 13:
            tokenExists = _context.sent;
            console.log("should return success true: ", tokenExists);
            return _context.abrupt("return", {
              success: !!tokenExists,
              decoded: tokenExists ? decoded : null
            });

          case 16:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[1, 5]]);
  }));
  return _verifyToken.apply(this, arguments);
}

function removeTokens(userId) {
  var removeAll = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  var accessToken = arguments.length > 2 ? arguments[2] : undefined;
  var refreshToken = arguments.length > 3 ? arguments[3] : undefined;

  if (removeAll) {
    // remove all tokens
    console.log("remove all tokens");

    _redis["default"].del("usertoken_".concat(userId), function (err, res) {
      if (err) console.log("error in removing tokens from cache: ", err);
    });
  } else {
    console.log("remove one token");

    _redis["default"].srem("usertoken_".concat(userId), accessToken, function (err, res) {
      if (err) console.log("error in removing token from cache: ", err);
    });

    _redis["default"].srem("usertoken_".concat(userId), refreshToken, function (err, res) {
      if (err) console.log("error in removing refresh token from cache: ", err);
    });
  }
}