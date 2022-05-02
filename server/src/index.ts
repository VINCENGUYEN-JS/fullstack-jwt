require("dotenv").config();
import { createServer } from "http";
import express from "express";
import "reflect-metadata";
import {
  ApolloServerPluginDrainHttpServer,
  ApolloServerPluginLandingPageGraphQLPlayground,
} from "apollo-server-core";
import cookieParser from "cookie-parser";
import { DataSource } from "typeorm";
import cors from "cors";

import { User } from "./entities/User";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { GreetingResolver } from "./resolvers/greeting";
import { UserResolver } from "./resolvers/user";
import refreshTokenRouter from "./routes/refreshTokenRouter";

const main = async () => {
  const AppDataSource = new DataSource({
    type: "postgres",
    database: "jwt-authentication",
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    logging: true,
    synchronize: true,
    entities: [User],
  });
  await AppDataSource.initialize().catch((err) =>
    console.log("Error starting server", err)
  );

  const app = express();
  const httpServer = createServer(app);

  app.use(cors({ origin: "http://localhost:3000", credentials: true }));

  app.use(cookieParser());

  app.use("/refresh_token", refreshTokenRouter);

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      validate: false,
      resolvers: [GreetingResolver, UserResolver],
    }),
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      ApolloServerPluginLandingPageGraphQLPlayground,
    ],
    context: ({ req, res }) => {
      return { req, res };
    },
  });

  await apolloServer.start();

  apolloServer.applyMiddleware({
    app,
    cors: {
      origin: "http://localhost:3000",
      credentials: true,
    },
  });

  const PORT = process.env.PORT || 4000;

  await new Promise((resolve) =>
    httpServer.listen({ port: PORT }, resolve as () => void)
  );

  // Typically, http://localhost:4000/graphql
  console.log(
    `SERVER STARTED ON PORT ${PORT}. GRAPHQL ENDPOINT ON http://localhost:${PORT}${apolloServer.graphqlPath}`
  );
};

main();
