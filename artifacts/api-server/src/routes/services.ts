import { Router, type IRouter } from "express";
import { db, servicesTable } from "@workspace/db";

const router: IRouter = Router();

router.get("/services", async (_req, res): Promise<void> => {
  const services = await db.select().from(servicesTable);
  res.json(services);
});

export default router;
