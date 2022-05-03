import { RegisterInput } from "../types/RegisterInput";
import { LoginInput } from "../types/LoginInput";
import { UserMutationResponse } from "../types/UserMutationResponse";
import { Resolver, Mutation, Arg, Query, Ctx, ID } from "type-graphql";
import argon2 from "argon2";

import { User } from "../entities/User";
import { createToken, sendRefreshToken } from "../utils/auth";
import { Context } from "../types/Context";

@Resolver()
export class UserResolver {
  @Query((_returns) => [User])
  async users(): Promise<User[]> {
    return await User.find();
  }

  @Mutation(() => UserMutationResponse)
  async register(
    @Arg("registerInput")
    registerInput: RegisterInput
  ): Promise<UserMutationResponse> {
    const { username, password } = registerInput;

    const existingUser = await User.findOne({ where: { username: username } });
    if (existingUser) {
      return {
        code: 400,
        success: false,
        message: "Duplicated username",
      };
    }
    const hasedPassword = await argon2.hash(password);

    const newUser = User.create({
      username,
      password: hasedPassword,
    });

    await newUser.save();

    return {
      code: 200,
      success: true,
      message: "User registration successful",
      user: newUser,
    };
  }

  @Mutation(() => UserMutationResponse)
  async login(
    @Arg("loginInput") loginInput: LoginInput,
    @Ctx() { res }: Context
  ): Promise<UserMutationResponse> {
    const { username, password } = loginInput;
    const existingUser = await User.findOne({ where: { username: username } });
    if (!existingUser) {
      return {
        code: 401,
        success: false,
        message: "User not found",
      };
    }
    const isPasswordValid = await argon2.verify(
      existingUser.password,
      password
    );

    if (!isPasswordValid) {
      return {
        code: 401,
        success: false,
        message: "Incorrect password",
      };
    }

    sendRefreshToken(res, existingUser);

    return {
      code: 200,
      success: true,
      message: "Logged in successfully",
      user: existingUser,
      accessToken: createToken("accessToken", existingUser),
    };
  }

  @Mutation(() => UserMutationResponse)
  async logout(
    @Arg("userId", (_type) => ID) userId: number,
    @Ctx() { res }: Context
  ): Promise<UserMutationResponse> {
    const existingUser = await User.findOne({ where: { id: userId } });
    if (!existingUser) {
      return {
        code: 401,
        success: false,
        message: "User not found",
      };
    }
    existingUser.tokenVersion += 1;

    await existingUser.save();
    res.clearCookie(process.env.REFRESH_TOKEN_NAME as string);
    return {
      code: 200,
      success: true,
      message: "Logged out successfully",
    };
  }
}
