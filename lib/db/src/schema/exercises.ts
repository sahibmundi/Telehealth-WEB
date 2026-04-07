import { pgTable, text, serial, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const exercisesTable = pgTable("exercises", {
  id: serial("id").primaryKey(),
  patientId: integer("patient_id").notNull(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  sets: integer("sets"),
  reps: integer("reps"),
  duration: text("duration"),
  frequency: text("frequency"),
  videoUrl: text("video_url"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertExerciseSchema = createInsertSchema(exercisesTable).omit({ id: true, createdAt: true });
export type InsertExercise = z.infer<typeof insertExerciseSchema>;
export type Exercise = typeof exercisesTable.$inferSelect;
