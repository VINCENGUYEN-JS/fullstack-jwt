import { Resolver, Query } from "type-graphql";

@Resolver()
export class GreetingResolver {
  @Query()
  hello(): string {
    return "hello world";
  }
}
