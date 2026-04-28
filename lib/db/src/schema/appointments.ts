import { pgTable, text, serial, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const appointmentsTable = pgTable("appointments", {
  id: serial("id").primaryKey(),
  patientId: integer("patient_id").notNull(),
  patientName: text("patient_name").notNull(),
  serviceType: text("service_type").notNull(),
  sessionDate: text("session_date"),
  sessionTime: text("session_time"),
  duration: integer("duration").notNull().default(60),
  status: text("status").notNull().default("pending"),
  sessionLink: text("session_link"),
  physiotherapist: text("physiotherapist"),
  notes: text("notes"),
  preferredDate: text("preferred_date"),
  reason: text("reason"),
  sessionMode: text("session_mode"),
  rejectionReason: text("rejection_reason"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const insertAppointmentSchema = createInsertSchema(appointmentsTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertAppointment = z.infer<typeof insertAppointmentSchema>;
export type Appointment = typeof appointmentsTable.$inferSelect;
