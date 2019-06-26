import "reflect-metadata";

import gql from "graphql-tag";
import { Container } from "typedi";
import { buildSchema, buildTypeDefsAndResolvers } from "type-graphql";
import { UserFormResolver } from "./resolver";

import { ApolloClient } from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";
import { UserForm } from "./__generated__/UserForm";

const UserFormQuery = gql`
  query UserForm {
    userForm @client {
      firstName,
      lastName,
    }
  }
`;

const UpdateFirstNameMutation = gql`
  mutation UpdateFirstName($value: String!) {
    updateFirstName(value: $value) @client {
    }
  }
`;

async function main() {

  const cache = new InMemoryCache();

  Container.set(InMemoryCache, cache);

  const { resolvers, typeDefs } = await buildTypeDefsAndResolvers({
    resolvers: [UserFormResolver],
    container: Container,
  });

  const client = new ApolloClient({
    cache,
    typeDefs,
    resolvers: resolvers as any,
  });

  const result1 = await client.query<UserForm>({ query: UserFormQuery });
  console.log(result1.data.userForm);

  await client.mutate({
    mutation: UpdateFirstNameMutation,
    variables: {
      value: "Yosuke",
    }
  });

  const result2 = await client.query<UserForm>({ query: UserFormQuery });
  console.log(result2.data.userForm);
}

main();
