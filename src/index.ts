import dotenv from "dotenv";
import express, { Request, Response } from "express";
import { Client } from "pg";
import { login } from "./api/login";
import { getMovements } from "./api/movements";
import { MovementData as DatabaseMovementData } from "./types/database/movements";
import { MovementData } from "./types/responses/movements";

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

app.get("/", (req: Request, res: Response) => {
  res.send("Hello, World!");
});

app.post("/load", async (req: Request, res: Response) => {
  await client.query(`
      CREATE TABLE IF NOT EXISTS movements (
          id SERIAL PRIMARY KEY,
          external_id VARCHAR(255) UNIQUE,
          movement_date DATE,
          value INTEGER,
          fundsFlow VARCHAR(255),
          is_employer_payment BOOLEAN DEFAULT FALSE
      );
    `);
  const token = await login();
  if (!token) {
    res.status(500).send("Login failed");
    return;
  }
  const movements = await getMovements(token);
  if (!movements) {
    res.status(500).send("Movements not found");
  }
  const dataToInsert = movements?.map((movement: MovementData) => {
    return {
      external_id: movement["@id"],
      movement_date: new Date(
        parseInt(movement.FecAcreditacion.toString().slice(0, 4)),
        parseInt(movement.FecAcreditacion.toString().slice(4, 6)),
        parseInt(movement.FecAcreditacion.toString().slice(6, 8)),
      ).toISOString(),
      value: movement.ValMlMvto,
      fundsFlow: movement.TipoImputacion === "ABO" ? "CREDIT" : "CHARGE",
      is_employer_payment: movement.CodMvto === "110101 Cotizacion Normal",
    };
  });

  const values = dataToInsert?.map((movement: DatabaseMovementData) => {
    return `('${movement.external_id}', '${movement.movement_date}', 
            '${movement.value}', '${movement.fundsFlow}', 
            '${movement.is_employer_payment}')`;
  });

  await client.query(`
    INSERT INTO movements (external_id, movement_date, value, fundsFlow, is_employer_payment)
    VALUES ${values}
    ON CONFLICT (external_id) DO UPDATE
    SET
      movement_date = EXCLUDED.movement_date,
      value = EXCLUDED.value,
      fundsFlow = EXCLUDED.fundsFlow,
      is_employer_payment = EXCLUDED.is_employer_payment;
  `);

  res.send("Movements loaded");
});

app.get("/movements", async (req: Request, res: Response) => {
  const response = await client.query(`
    SELECT * FROM movements
    ORDER BY movement_date ASC;
  `);
  res.send(response.rows);
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
