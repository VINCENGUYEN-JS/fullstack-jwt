import { MiddlewareFn } from "type-graphql";
import { AuthenticationError } from "apollo-server-express";
import jwt, { Secret } from "jsonwebtoken";

import { Context } from "../types/Context";
import { PayloadAuth } from "../types/PayloadAuth";

export const checkAuth: MiddlewareFn<Context> = ({ context }, next) => {
  try {
    const accessToken = context.req.header("Authorization")?.split(" ")[1];
    if (!accessToken) {
      throw new AuthenticationError(
        "Not authenticated to perform graphQL operation"
      );
    }

    const decodedUser = jwt.verify(
      accessToken,
      process.env.ACCESS_TOKEN as Secret
    ) as PayloadAuth;

    context.user = decodedUser;

    return next();
  } catch (err) {
    throw new AuthenticationError((err as Error).message);
  }
};
