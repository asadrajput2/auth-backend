import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoutes";
import postRoutes from "./routes/postRoutes";

dotenv.config();

if (!process.env.TOKEN_SECRET) {
  console.log(
    "\x1b[31m%s\x1b[0m",
    "You probably do not have an environment (.env) file configured!"
  );
}

const app = express();
app.use(cookieParser());
const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    optionsSuccessStatus: 200,
    credentials: true,
  })
);

app.get("/", (req, res) => {
  res.send("Got it");
});

app.use("/api/users", authRoutes);
app.use("/api/posts", postRoutes);

app.listen(PORT, () => {
  console.log("We're listening");
});
