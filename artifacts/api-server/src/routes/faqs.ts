import { Router, type IRouter } from "express";
import { asc } from "drizzle-orm";
import { db, faqsTable } from "@workspace/db";

const router: IRouter = Router();

router.get("/faqs", async (_req, res): Promise<void> => {
  const faqs = await db.select().from(faqsTable).orderBy(asc(faqsTable.order));
  res.json(faqs);
});

export default router;
