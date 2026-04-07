import { pgTable, text, serial } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const symptomsTable = pgTable("symptoms", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  bodyPart: text("body_part").notNull(),
  commonCauses: text("common_causes").notNull(),
  treatments: text("treatments").notNull(),
  imageUrl: text("image_url"),
});

export const insertSymptomSchema = createInsertSchema(symptomsTable).omit({ id: true });
export type InsertSymptom = z.infer<typeof insertSymptomSchema>;
export type Symptom = typeof symptomsTable.$inferSelect;
