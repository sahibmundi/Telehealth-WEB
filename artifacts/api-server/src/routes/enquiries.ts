import { Router, type IRouter } from "express";
import { db, enquiriesTable } from "@workspace/db";
import { CreateEnquiryBody } from "@workspace/api-zod";

const router: IRouter = Router();

router.post("/enquiries", async (req, res): Promise<void> => {
  const parsed = CreateEnquiryBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [enquiry] = await db
    .insert(enquiriesTable)
    .values({
      name: parsed.data.name,
      email: parsed.data.email,
      phone: parsed.data.phone ?? null,
      message: parsed.data.message,
      type: parsed.data.type,
    })
    .returning();

  res.status(201).json({ ...enquiry, createdAt: enquiry.createdAt.toISOString() });
});

export default router;
