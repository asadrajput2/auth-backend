import db from "../db/config";

export function getPosts(req, res) {
  db.query("SELECT * FROM posts ORDER BY added_on DESC")
    .then((result) => {
      if (result.rows) res.status(200).json(result.rows);
    })
    .catch((err) => {
      console.log("getPosts error: ", err);
      res.status(400).json("unable to get posts");
    });
}

export function createPost(req, res) {
  const { title, text } = req.body;
  const userId = req.userId;
  const timestamp = new Date();
  if (title && text && userId) {
    db.query(
      "INSERT INTO posts (title, text, user_id, added_on) VALUES ($1, $2, $3, $4)",
      [title, text, userId, timestamp]
    )
      .then((result) => {
        if (result) {
          res.status(201).json({ message: "success" });
        }
      })
      .catch((err) => {
        console.log("createPost error: ", err);
        res.status(400).json({ message: "error", text: "" });
      });
  } else {
    res.status(400).json("details not filled properly");
  }
}
