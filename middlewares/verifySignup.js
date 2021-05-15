import db from "../db/config";

export function validateEmail(req, res, next) {
  const email = req.body.email;
  if (
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(
      email
    )
  )
    next();
  else res.status(400).send("invalid email");
}

export function validatePassword(req, res, next) {
  const password = req.body.password;
  if (password?.length >= 8) next();
  else res.status(400).send("invalid password");
}

export function checkEmailAlreadyExists(req, res, next) {
  const email = req.body.email;
  db.query("SELECT email FROM users WHERE email = $1", [email])
    .then((results) => {
      if (results.rowCount) res.status(400).send("email already exists");
      else next();
    })
    .catch((err) => {
      console.log("checkEmailAlreadyExists error: ", err);
    });
}
