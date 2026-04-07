import { pgTable, text, serial, timestamp, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const progressTable = pgTable("progress", {
  id: serial("id").primaryKey(),
  patientId: integer("patient_id").notNull(),
  date: text("date").notNull(),
  painIntensity: integer("pain_intensity").notNull(),
  notes: text("notes"),
  exercisesCompleted: boolean("exercises_completed").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertProgressSchema = createInsertSchema(progressTable).omit({ id: true, createdAt: true });
export type InsertProgress = z.infer<typeof insertProgressSchema>;
export type Progress = typeof progressTable.$inferSelect;
