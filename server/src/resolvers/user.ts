import { RegisterInput } from "../types/RegisterInput";
import { LoginInput } from "../types/LoginInput";
import { UserMutationResponse } from "../types/UserMutationResponse";
import { Resolver, Mutation, Arg, Query } from "type-graphql";
import argon2 from "argon2";

import { User } from "../entities/User";
import { createToken } from "../utils/auth";

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
    @Arg("loginInput") loginInput: LoginInput
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
    return {
      code: 200,
      success: true,
      message: "Logged in successfully",
      user: existingUser,
      accessToken: createToken(existingUser),
    };
  }
}
