import express from "express";
import { createPost, getPosts } from "../controllers/posts";
import { verifyAuth } from "../middlewares/verifyAuth";

const postRoutes = express.Router();

postRoutes.get("/", getPosts);

postRoutes.post("/create", [verifyAuth], createPost);

export default postRoutes;
