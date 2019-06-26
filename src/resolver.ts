import gql from "graphql-tag";
import { Service } from "typedi";
import { InMemoryCache } from "apollo-cache-inmemory";
import { Resolvers } from "apollo-client";
import {
  Int,
  Arg,
  Ctx,
  ObjectType,
  Field,
  Resolver,
  Query,
  Mutation,
} from "type-graphql";

@ObjectType()
class UserForm {
  @Field() firstName: string = "";
  @Field() lastName: string = "";
  @Field(() => Int) age: number = 0;
  readonly __typename = "UserForm";
}

@Service()
@Resolver(UserForm)
export class UserFormResolver {

  private readonly userFormNodeId = "userForm";

  constructor(
    private readonly cache: InMemoryCache,
  ) {
    const userForm = new UserForm();
    this.cache.writeData({ data: { userForm } });
  }

  @Query(() => UserForm, { name: "userForm" })
  getUserForm(@Ctx() ctx: any) {
    const ret = this.cache.readQuery<{ userForm: UserForm }>({
      query: gql`
        {
          userForm {
            firstName,
            lastName,
            age,
          }
        }
      `,
    });
    return ret && ret.userForm;
  }

  @Mutation(returns => UserForm)
  resetForm() {
    const userForm = new UserForm();
    this.cache.writeData({ data: { userForm } });
    return userForm;
  }

  @Mutation(returns => UserForm)
  updateFirstName(@Arg("value") value: string, @Ctx() ctx: any) {
    const userForm = this.getUserForm(ctx);
    if (!userForm) return;
    userForm.firstName = value;
    this.cache.writeData({ data: { userForm } });
    return userForm;
  }
}
