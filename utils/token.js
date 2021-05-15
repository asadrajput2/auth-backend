import jwt, { TokenExpiredError } from "jsonwebtoken";
import { promisify } from "util";
import cache from "../cache/redis";

const sismemberAsync = promisify(cache.sismember).bind(cache);

export function createTokenPair(userId) {
  const expireTime = 60 * 5; // 5 mins
  const refreshExpireTime = 60 * 60 * 24 * 14; // 14 days
  const accessToken = jwt.sign(
    {
      id: userId,
      type: "access",
    },
    process.env.TOKEN_SECRET,
    {
      expiresIn: expireTime,
    }
  );

  const refreshToken = jwt.sign(
    {
      id: userId,
      type: "refresh",
    },
    process.env.TOKEN_SECRET,
    {
      expiresIn: "14d",
    }
  );

  // add tokens to cache
  cache.sadd(`usertoken_${userId}`, accessToken, (err, res) => {
    if (err) console.log("error in storing token: ", err);
  });

  cache.sadd(`usertoken_${userId}`, refreshToken, (err, res) => {
    if (err) console.log("error in storing refresh token: ", err);
  });

  cache.expire(`usertoken_${userId}`, refreshExpireTime);

  return { accessToken, refreshToken };
}

export async function verifyToken(token, expectedType) {
  let decoded;
  let tokenExists;

  console.log("token details: ", token, expectedType);

  try {
    decoded = jwt.verify(token, process.env.TOKEN_SECRET);
  } catch (err) {
    console.log("jwt verification error: ", err);
    return {
      error: err,
      tokenExpired: err.name === "TokenExpiredError",
    };
  }

  if (decoded?.type !== expectedType)
    return {
      success: false,
      error: "Invalid token type",
    };

  tokenExists = await sismemberAsync(`usertoken_${decoded.id}`, token);

  console.log("should return success true: ", tokenExists);

  return {
    success: !!tokenExists,
    decoded: tokenExists ? decoded : null,
  };
}

export function removeTokens(
  userId,
  removeAll = false,
  accessToken,
  refreshToken
) {
  if (removeAll) {
    // remove all tokens
    console.log("remove all tokens");
    cache.del(`usertoken_${userId}`, (err, res) => {
      if (err) console.log("error in removing tokens from cache: ", err);
    });
  } else {
    console.log("remove one token");
    cache.srem(`usertoken_${userId}`, accessToken, (err, res) => {
      if (err) console.log("error in removing token from cache: ", err);
    });
    cache.srem(`usertoken_${userId}`, refreshToken, (err, res) => {
      if (err) console.log("error in removing refresh token from cache: ", err);
    });
  }
}
