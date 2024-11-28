import { Pool } from "pg";
import { Kysely, PostgresDialect } from "kysely";
import { Database } from "./data";

const dialect = new PostgresDialect({
  pool: new Pool({
    database: process.env.POSTGRES_DATABASE,
    password: process.env.POSTGRES_PASSWORD,
    host: process.env.POSTGRES_HOST,
    user: process.env.POSTGRES_USER,
    port: process.env.POSTGRES_PORT ? +process.env.POSTGRES_PORT : 6543,
    max: 10,
  }),
});

export const db = new Kysely<Database>({
  dialect,
});
