import bcrypt from "bcrypt";
import db from "../db/config";
import jwt from "jsonwebtoken";
import {
  createToken,
  createTokenPair,
  removeTokens,
  verifyToken,
} from "../utils/token";
const saltRounds = 10;

export async function createUser(req, res) {
  const { name, email, password } = req.body;

  const passwordHash = await bcrypt.hash(password, saltRounds);

  db.query(
    "INSERT INTO users (name, password, email) VALUES ($1, $2, $3)",
    [name, passwordHash, email],
    (err, results) => {
      if (err) {
        throw err;
      }
      console.log("user created: ", results);
      res.status(201).json("user created successfully");
    }
  );
}

export async function login(req, res) {
  const { email, password } = req.body;
  db.query(
    "SELECT id, password FROM users WHERE email = $1",
    [email],
    (err, qResult) => {
      if (err) throw err;
      bcrypt.compare(password, qResult.rows[0].password, (err, result) => {
        if (err) throw err;
        else {
          if (result) {
            const { accessToken, refreshToken } = createTokenPair(
              qResult.rows[0].id
            );

            res.cookie("authtoken", accessToken, {
              httpOnly: true,
              domain: "localhost",
              path: "/",
              expire: 360000 + Date.now(),
            });
            res.status(200).json({
              message: "success",
              accessToken,
              refreshToken,
              oauthLogin: false,
            });
          } else res.status(401).json("Incorrect Password");
        }
      });
    }
  );
}

export async function refreshToken(req, res) {
  const token = req.headers.authorization;

  const { success, error, tokenExpired, decoded } = await verifyToken(
    token,
    "refresh"
  );

  if (error) {
    console.log("error in refresh token verification");
    res.status(401).json({
      auth: false,
      message: "unable to refresh token, redirect to login",
    });
  } else {
    if (success) {
      // remove old refresh token
      console.log("decoded: ", decoded);
      removeTokens(decoded.id, false, token);

      if (decoded.type === "refresh") {
        console.log("refresh token verified");
        const { accessToken, refreshToken } = createTokenPair(decoded.id);
        res.status(200).json({
          message: "token refreshed successfully",
          accessToken,
          refreshToken,
        });
      } else {
        res.status(401).json({
          message: "must be a refresh token",
        });
      }
    } else {
      res.status(401).json({
        auth: false,
        message: "unable to refresh token, redirect to login",
      });
    }
  }
}

export async function handleAuthVerification(req, res) {
  if (req.userId) res.status(200).json({ message: "success" });
}

export async function logout(req, res) {
  const { userId } = req;
  const { accessToken, refreshToken } = req?.body;
  removeTokens(userId, false, accessToken, refreshToken);
  // res.cookie("authtoken", "", { expire: new Date(0) });
  res.status(200).json({ message: "success" });
  // Todo: logout user
}

export async function logoutAllSessions(req, res, next) {
  const { userId } = req;
  const { accessToken, refreshToken } = req?.body;
  removeTokens(userId, true, accessToken, refreshToken);
  // res.cookie("authtoken", "", { expire: new Date(0) });
  next();
  // res.status(200).json("logged out successfully");
  // Todo: logout user
}

export async function changePassword(req, res) {
  const { oldPassword, newPassword } = req.body;
  const { userId } = req;

  db.query(
    "SELECT id, password FROM users WHERE id = $1",
    [userId],
    (err, qResult) => {
      if (err) throw err;

      if (!qResult.rows[0].password)
        res.status(400).json({
          message: "error",
          error: "logged in with oauth",
        });

      bcrypt.compare(
        oldPassword,
        qResult.rows[0].password,
        async (err, result) => {
          if (err) throw err;
          else {
            if (result) {
              removeTokens(userId, true);

              const passwordHash = await bcrypt.hash(newPassword, saltRounds);

              db.query(
                "UPDATE users SET password = $1 where id = $2",
                [passwordHash, userId],
                (err, results) => {
                  if (err) {
                    throw err;
                  }
                  console.log("password changed: ", results);
                }
              );

              res.status(200).send({
                message: "success",
              });
            } else res.status(401).json("Incorrect Password");
          }
        }
      );
    }
  );
}
