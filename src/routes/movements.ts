import { Request, Response, Router } from "express";
import { Client } from "pg";

const router = Router();

router.get("/movements", async (req: Request, res: Response) => {
  const client: Client = req.app.get("pgClient");
  const response = await client.query(`
    SELECT * FROM movements
    ORDER BY movement_date ASC;
  `);
  res.send(response.rows);
});

export default router;
