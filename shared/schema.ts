import { pgTable, text, serial, integer, decimal } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const contractDeliveries = pgTable("contract_deliveries", {
  id: serial("id").primaryKey(),
  freezingType: text("freezing_type").notNull(), // 冷凍, 冷藏
  meatName: text("meat_name").notNull(),
  weightGrade: decimal("weight_grade", { precision: 10, scale: 1 }).notNull(),
  boxCount: integer("box_count").notNull(),
  pieceCount: integer("piece_count").notNull(),
  totalWeight: decimal("total_weight", { precision: 10, scale: 2 }).notNull(),
  avgWeight: decimal("avg_weight", { precision: 10, scale: 2 }).notNull(),
});

export const insertContractDeliverySchema = createInsertSchema(contractDeliveries).extend({
  weightGrade: z.string().regex(/^\d+(\.\d{1})?$/).or(z.number()),
  totalWeight: z.string().regex(/^\d+(\.\d{1,2})?$/).or(z.number()),
  avgWeight: z.string().regex(/^\d+(\.\d{1,2})?$/).or(z.number()),
  boxCount: z.number().int(),
  pieceCount: z.number().int(),
});

export type InsertContractDelivery = z.infer<typeof insertContractDeliverySchema>;
export type ContractDelivery = typeof contractDeliveries.$inferSelect;
