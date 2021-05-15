import { verifyToken } from "../utils/token";

export async function verifyAuth(req, res, next) {
  const token = req.headers.authorization;

  // console.log("token: ", req.headers.authorization);

  if (!token) {
    return res.status(401).json({ auth: false, message: "token not received" });
  }

  const { success, error, tokenExpired, decoded } = await verifyToken(
    token,
    "access"
  );
  // console.log("success and error: ", success, error, tokenExpired);

  if (error || !success) {
    if (tokenExpired) {
      console.log("user token expired");
      res.status(401).json({
        auth: false,
        message: "token expired",
      });
    }
    res.status(401).json({
      auth: false,
      message: "invalid token",
    });
  }

  if (success && decoded) {
    req.userId = decoded.id;
    next();
  } else {
    res.status(500).json("internal server error");
  }

  // try {
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
}
