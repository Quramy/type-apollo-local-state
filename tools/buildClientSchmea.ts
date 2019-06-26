import "reflect-metadata";
import path from "path";
import { buildSchema } from "type-graphql";
import { UserFormResolver } from "../src/resolver";

async function main() {
  const schema = await buildSchema({
    resolvers: [UserFormResolver],
    emitSchemaFile: {
      path: path.resolve(__dirname, "../client_schema.graphql"),
    },
  });
}

main();
