import jwt, { Secret } from "jsonwebtoken";
import { User } from "../entities/User";

export const createToken = (user: User) => {
  return jwt.sign(
    {
      id: user.id,
    },
    process.env.ACCESS_TOKEN as Secret,
    {
      expiresIn: "15m",
    }
  );
};
