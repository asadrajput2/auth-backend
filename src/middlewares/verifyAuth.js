"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.verifyAuth = verifyAuth;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _token = require("../utils/token");

function verifyAuth(_x, _x2, _x3) {
  return _verifyAuth.apply(this, arguments);
}

function _verifyAuth() {
  _verifyAuth = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(req, res, next) {
    var token, _yield$verifyToken, success, error, tokenExpired, decoded;

    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            token = req.headers.authorization; // console.log("token: ", req.headers.authorization);

            if (token) {
              _context.next = 3;
              break;
            }

            return _context.abrupt("return", res.status(401).json({
              auth: false,
              message: "token not received"
            }));

          case 3:
            _context.next = 5;
            return (0, _token.verifyToken)(token, "access");

          case 5:
            _yield$verifyToken = _context.sent;
            success = _yield$verifyToken.success;
            error = _yield$verifyToken.error;
            tokenExpired = _yield$verifyToken.tokenExpired;
            decoded = _yield$verifyToken.decoded;

            // console.log("success and error: ", success, error, tokenExpired);
            if (error || !success) {
              if (tokenExpired) {
                console.log("user token expired");
                res.status(401).json({
                  auth: false,
                  message: "token expired"
                });
              }

              res.status(401).json({
                auth: false,
                message: "invalid token"
              });
            }

            if (success && decoded) {
              req.userId = decoded.id;
              next();
            } else {
              res.status(500).json("internal server error");
            } // try {
            //   jwt.verify(token, process.env.TOKEN_SECRET, (err, decoded) => {
            //     if (err) {
            //       console.log(
            //         "jwt verification error: ",
            //         err instanceof TokenExpiredError
            //       );
            //       return res.status(401).json({ message: "auth token invalid" });
            //     }
            //     console.log("decoded: ", decoded);
            //     req.userId = decoded.id;
            //     next();
            //   });
            // } catch (err) {
            //   console.log("token verification error: ", err);
            // }


          case 12:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _verifyAuth.apply(this, arguments);
}