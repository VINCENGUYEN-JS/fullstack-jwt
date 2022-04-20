require("dotenv").config();
import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "./entities/User";

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
};

main();
