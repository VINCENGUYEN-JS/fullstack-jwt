import jwt, { Secret } from "jsonwebtoken";
import { User } from "../entities/User";

import { Response } from "express";

export const createToken = (
  type: "accessToken" | "refreshToken",
  user: User
) => {
  return jwt.sign(
    {
      id: user.id,
    },
    type === "accessToken"
      ? (process.env.ACCESS_TOKEN as Secret)
      : (process.env.REFRESH_TOKEN as Secret),
    {
      expiresIn: type === "accessToken" ? "5m" : "60m",
    }
  );
};

export const sendRefreshToken = (res: Response, user: User) => {
  res.cookie(
    process.env.REFRESH_TOKEN_NAME as string,
    createToken("refreshToken", user),
    { httpOnly: true, secure: true, sameSite: "lax" }
  );
};
