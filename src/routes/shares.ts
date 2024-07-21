import { Request, Response, Router } from "express";
import { Client } from "pg";

const router = Router();

router.get("/shares", async (req: Request, res: Response) => {
  const client: Client = req.app.get("pgClient");
  const { latest } = req.query;

  let query = `
    SELECT * FROM shares
    ORDER BY date ASC
  `;

  if (latest === "true") {
    query = `
      SELECT * FROM shares
      ORDER BY date DESC
      LIMIT 1
    `;
  }

  try {
    const response = await client.query(query);
    res.send(response.rows);
  } catch (error) {
    res
      .status(500)
      .send({ error: "An error occurred while fetching shares data." });
  }
});

export default router;
