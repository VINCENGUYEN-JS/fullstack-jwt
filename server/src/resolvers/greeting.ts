import { checkAuth } from "../middleware/checkAuth";
import { Resolver, Query, UseMiddleware, Ctx } from "type-graphql";
import { PayloadAuth } from "../types/PayloadAuth";
import { User } from "../entities/User";
@Resolver()
export class GreetingResolver {
  @Query((_returns) => String)
  @UseMiddleware(checkAuth)
  async hello(@Ctx() context: PayloadAuth): Promise<string> {
    const user = context.user;
    const existingUser = await User.findOne({ where: { id: user.id } });
    return `hello ${existingUser ? existingUser.username : "World"}`;
  }
}
