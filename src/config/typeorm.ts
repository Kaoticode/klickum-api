import { registerAs } from "@nestjs/config";
import { config as dotenvConfig } from "dotenv";
import { join } from "path";
import { DataSource, DataSourceOptions } from "typeorm";
import * as process from "node:process";

dotenvConfig({ path: ".env" });

const sslParameters = () => {
  if (process.env.STAGE === "production" || "") {
    return { rejectUnauthorized: false };
  }
  return {};
};


const config = {
  type: "postgres",
  host: `${process.env.DB_HOST}`,
  port: `${process.env.DB_PORT}`,
  username: `${process.env.DB_USERNAME}`,
  password: `${process.env.DB_PASSWORD}`,
  database: `${process.env.DB_NAME}`,
  entities: [join(__dirname, "../**/**.entity{.ts,.js}")],
  migrations: [join(__dirname, "../migrations/*{.ts,.js}")],
  autoLoadEntities: true,
  synchronize: true,
  ssl: process.env.STAGE === "production" || "",
  extra: sslParameters()
};
console.log(process.env.STAGE);


export default registerAs("typeorm", () => config);
export const connectionSource = new DataSource(config as DataSourceOptions);
