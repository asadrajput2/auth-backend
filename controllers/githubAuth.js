import db from "../db/config";
import fetch from "node-fetch";
import { createTokenPair } from "../utils/token";

export async function getGithubToken(req, res, next) {
  // console.log("github id", process.env.GITHUB_ID);
  // console.log("github secret", process.env.GITHUB_SECRET);

  const { code } = req.body;
  // console.log("CODE", code);

  const data = {
    client_id: process.env.GITHUB_ID,
    client_secret: process.env.GITHUB_SECRET,
    code,
  };

  if (code) {
    fetch(`https://github.com/login/oauth/access_token`, {
      method: "POST",
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then(async (response) => {
        const result = await response.json();
        if (response?.status === 200) {
          // console.log("token response: ", result);
          req.ghToken = result?.access_token;
          next();
        } else {
          res
            .status(500)
            .json("Something went wrong while authenticating with github");
        }
      })
      .catch((err) => {
        throw err;
      });
  } else {
    res
      .status(500)
      .json("Something went wrong while authenticating with github");
  }
}

export function getGithubUser(req, res, next) {
  const { ghToken } = req;
  if (ghToken) {
    fetch(`https://api.github.com/user`, {
      method: "GET",
      headers: { Authorization: `token ${ghToken}` },
    }).then(async (response) => {
      const result = await response.json();
      // console.log("user response: ", result);
      if (response?.status === 200) {
        req.ghUser = result;
        next();
      } else {
        res
          .status(500)
          .json("Something went wrong while getting user data from github");
      }
    });
  } else {
    res
      .status(500)
      .json("Something went wrong while getting user data from github");
  }
}

export function loginGithub(req, res) {
  const user = req.ghUser;
  const { email } = user;
  // check if user is already present in db
  db.query(
    `SELECT id, email FROM users WHERE email = $1`,
    [email],
    (err, qResult) => {
      if (err) throw err;
      if (qResult) {
        // console.log("qResults: ", qResult.rows[0]);
        // user already exists
        const { accessToken, refreshToken } = createTokenPair(
          qResult.rows[0].id
        );

        res.cookie("authtoken", accessToken, {
          httpOnly: true,
          domain: "localhost",
          path: "/",
          expire: 360000 + Date.now(),
        });
        res
          .status(200)
          .json({
            message: "success",
            accessToken,
            refreshToken,
            oauthLogin: true,
          });
      } else {
        // new user
        // save user without password
        const { email, name } = user;
        db.query(
          "INSERT INTO users (name, email) VALUES ($1, $2)",
          [name, email],
          (err, results) => {
            if (err) {
              throw err;
            }
            console.log("user created: ", results);
            res.status(201).json("user created successfully");
          }
        );
      }
    }
  );
}
