import { RegisterInput } from "../types/RegisterInput";
import { UserMutationResponse } from "../types/UserMutationResponse";
import { Resolver, Mutation, Arg } from "type-graphql";
import argon2 from "argon2";

import { User } from "../entities/User";

@Resolver()
export class UserResolver {
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
}
