import { pgTable, text, serial, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const assessmentsTable = pgTable("assessments", {
  id: serial("id").primaryKey(),
  patientId: integer("patient_id").notNull(),
  chiefComplaint: text("chief_complaint").notNull(),
  history: text("history"),
  bodyChart: text("body_chart"),
  painIntensity: integer("pain_intensity").notNull().default(0),
  outcomeMeasures: text("outcome_measures"),
  posturalNotes: text("postural_notes"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertAssessmentSchema = createInsertSchema(assessmentsTable).omit({ id: true, createdAt: true });
export type InsertAssessment = z.infer<typeof insertAssessmentSchema>;
export type Assessment = typeof assessmentsTable.$inferSelect;
