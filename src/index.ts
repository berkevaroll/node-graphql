import "reflect-metadata";
import { buildSchema } from "type-graphql";
import express from "express";
import { graphqlHTTP } from "express-graphql";
import { MainResolver } from "./graphql/resolvers";

async function main() {
  const schema = await buildSchema({
    resolvers: [MainResolver],
    emitSchemaFile: true,
  });

  const app = express();

  app.use(
    "/graphql",
    graphqlHTTP({
      schema: schema,
      graphiql: true,
    })
  );

  app.listen(8000, () => {
    console.log(
      "Running a GraphQL API server at http://localhost:8000/graphql"
    );
  });
}

main();
