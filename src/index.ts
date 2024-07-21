import dotenv from "dotenv";
import express from "express";
import { Client } from "pg";

import loadRouter from "@app/routes/load";
import movementsRouter from "@app/routes/movements";
import rootRouter from "@app/routes/root";
import sharesRouter from "@app/routes/shares";

dotenv.config();
const app = express();
const port = 3000;

let client;
if (process.env.DATABASE_URL) {
  client = new Client({
    connectionString: process.env.DATABASE_URL,
  });
} else {
  client = new Client({
    user: process.env.POSTGRES_USER,
    host: process.env.POSTGRES_HOST,
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PASSWORD,
    port: 5432,
  });
}
client.connect();

app.set("pgClient", client);

app.use("/", rootRouter);
app.use("/", loadRouter);
app.use("/", movementsRouter);
app.use("/", sharesRouter);

app.listen(port, () => {
  console.info(`Server is running at http://localhost:${port}`);
});
