import { login } from "@app/api/login";
import { getMovements } from "@app/api/movements";
import { getShare } from "@app/api/share";
import { MovementData as DatabaseMovementData } from "@app/types/database/movements";
import { MovementData } from "@app/types/responses/movements";
import { Request, Response, Router } from "express";
import { Client } from "pg";

const router = Router();

router.post("/load", async (req: Request, res: Response) => {
  const client: Client = req.app.get("pgClient");

  await client.query(`
      CREATE TABLE IF NOT EXISTS movements (
          id SERIAL PRIMARY KEY,
          external_id VARCHAR(255) UNIQUE,
          movement_date DATE,
          clp_amount INTEGER,
          shares_amount FLOAT,
          fundsFlow VARCHAR(255),
          is_employer_payment BOOLEAN DEFAULT FALSE
      );
    `);

  await client.query(`
    CREATE TABLE IF NOT EXISTS shares (
      id SERIAL PRIMARY KEY,
      share_value FLOAT,
      date DATE UNIQUE
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
    return;
  }

  const share = await getShare(token);
  if (!share) {
    res.status(500).send("Share not found");
    return;
  }

  const movementDataToInsert = movements.map((movement: MovementData) => ({
    external_id: movement["@id"],
    movement_date: new Date(
      parseInt(movement.FecAcreditacion.toString().slice(0, 4)),
      parseInt(movement.FecAcreditacion.toString().slice(4, 6)) - 1,
      parseInt(movement.FecAcreditacion.toString().slice(6, 8)),
    ).toISOString(),
    clp_amount: movement.ValMlMvto,
    shares_amount:
      typeof movement.ValCuoMvto === "string"
        ? parseFloat(movement.ValCuoMvto.replace(",", "."))
        : movement.ValCuoMvto,
    fundsFlow: movement.TipoImputacion === "ABO" ? "CREDIT" : "CHARGE",
    is_employer_payment: movement.CodMvto === "110101 Cotizacion Normal",
  }));

  const shareDataToInsert = {
    share_value: parseFloat(share.valorCuota),
    date: new Date(
      parseInt(share.fechaValorCuota.slice(6, 10)),
      parseInt(share.fechaValorCuota.slice(3, 5)) - 1,
      parseInt(share.fechaValorCuota.slice(0, 2)),
    ).toISOString(),
  };

  const values = movementDataToInsert.map((movement: DatabaseMovementData) => {
    return `('${movement.external_id}', '${movement.movement_date}', '${movement.clp_amount}', '${movement.shares_amount}', '${movement.fundsFlow}', '${movement.is_employer_payment}')`;
  });

  await client
    .query(
      `
    INSERT INTO movements (external_id, movement_date, clp_amount, shares_amount, fundsFlow, is_employer_payment)
    VALUES ${values}
    ON CONFLICT (external_id) DO UPDATE
    SET
      movement_date = EXCLUDED.movement_date,
      clp_amount = EXCLUDED.clp_amount,
      shares_amount = EXCLUDED.shares_amount,
      fundsFlow = EXCLUDED.fundsFlow,
      is_employer_payment = EXCLUDED.is_employer_payment;
      `,
    )
    .catch((error) => {
      console.error(error);
      res.status(500).send("Error loading movements");
    });

  await client
    .query(
      `
    INSERT INTO shares (share_value, date)
    VALUES ('${shareDataToInsert.share_value}', '${shareDataToInsert.date}')
    ON CONFLICT (date) DO UPDATE
    SET
      share_value = EXCLUDED.share_value;
    `,
    )
    .catch((error) => {
      console.error(error);
      res.status(500).send("Error loading share");
    });

  res.send("Data loaded");
});

export default router;
