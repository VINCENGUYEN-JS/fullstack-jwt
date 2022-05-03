import express from "express";
import jwt, { Secret } from "jsonwebtoken";
import { createToken, sendRefreshToken } from "../utils/auth";
import { User } from "../entities/User";
import { PayloadAuth } from "../types/PayloadAuth";

const router = express.Router();

router.get("/", async (req, res) => {
  const refreshToken = req.cookies[process.env.REFRESH_TOKEN_NAME as string];
  if (!refreshToken) {
    return res.status(401).end();
  }
  try {
    const decodedUser = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN as Secret
    ) as PayloadAuth;
    const existingUser = await User.findOne({ where: { id: decodedUser.id } });
    if (
      !existingUser ||
      existingUser.tokenVersion !== decodedUser.tokenVersion
    ) {
      return res.status(401).end();
    }
    sendRefreshToken(res, existingUser);
    return res.json({
      success: true,
      accessToken: createToken("accessToken", existingUser),
    });
  } catch (err) {
    return res.status(403).end();
  }
});

export default router;
