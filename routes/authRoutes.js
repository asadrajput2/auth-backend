import express from "express";
import {
  changePassword,
  createUser,
  handleAuthVerification,
  login,
  logout,
  logoutAllSessions,
  refreshToken,
} from "../controllers/auth";
import {
  getGithubToken,
  getGithubUser,
  loginGithub,
} from "../controllers/githubAuth";
import { verifyAuth } from "../middlewares/verifyAuth";
import {
  validateLoginEmail,
  validateLoginPassword,
} from "../middlewares/verifyLogin";
import {
  checkEmailAlreadyExists,
  validateEmail,
  validatePassword,
} from "../middlewares/verifySignup";

const authRoutes = express.Router();

authRoutes.use("/", (req, res, next) => {
  console.log("authRoutes active");
  next();
});

authRoutes.get("/", (req, res) => {
  console.log("req.header", req.headers);
  res.send("fsdafsdsad");
});

authRoutes.post(
  "/create",
  [validateEmail, validatePassword, checkEmailAlreadyExists],
  createUser
);
  
authRoutes.post("/verify", [verifyAuth], handleAuthVerification);
authRoutes.post("/login", [validateLoginEmail, validateLoginPassword], login);
authRoutes.post("/refresh", refreshToken);
authRoutes.post("/logout", [verifyAuth], logout);
authRoutes.post("/changePassword", [verifyAuth], changePassword);
authRoutes.post("/github-login", [getGithubToken, getGithubUser], loginGithub);

export default authRoutes;
