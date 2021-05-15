export function validateLoginEmail(req, res, next) {
  const email = req.body.email;
  if (
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(
      email
    )
  )
    next();
  else res.status(400).send("invalid email");
}

export function validateLoginPassword(req, res, next) {
  const password = req.body.password;
  if (password?.length >= 8) next();
  else res.status(400).send("invalid password");
}
