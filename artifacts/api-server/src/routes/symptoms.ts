import { Router, type IRouter } from "express";
import { db, symptomsTable } from "@workspace/db";

const router: IRouter = Router();

router.get("/symptoms", async (_req, res): Promise<void> => {
  const symptoms = await db.select().from(symptomsTable);
  res.json(symptoms);
});

export default router;
