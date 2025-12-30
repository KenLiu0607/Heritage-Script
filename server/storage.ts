import { type ContractDelivery, type InsertContractDelivery, contractDeliveries } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  getDeliveries(): Promise<ContractDelivery[]>;
  updateDelivery(id: number, delivery: Partial<InsertContractDelivery>): Promise<ContractDelivery>;
  createDelivery(delivery: InsertContractDelivery): Promise<ContractDelivery>;
  createBatchDeliveries(deliveries: InsertContractDelivery[]): Promise<ContractDelivery[]>;
}

export class DatabaseStorage implements IStorage {
  async getDeliveries(): Promise<ContractDelivery[]> {
    return await db.select().from(contractDeliveries);
  }

  async updateDelivery(id: number, update: Partial<InsertContractDelivery>): Promise<ContractDelivery> {
    const [updated] = await db
      .update(contractDeliveries)
      .set(update)
      .where(eq(contractDeliveries.id, id))
      .returning();
    if (!updated) throw new Error("Delivery not found");
    return updated;
  }

  async createDelivery(delivery: InsertContractDelivery): Promise<ContractDelivery> {
    const [newDelivery] = await db
      .insert(contractDeliveries)
      .values(delivery)
      .returning();
    return newDelivery;
  }

  async createBatchDeliveries(deliveries: InsertContractDelivery[]): Promise<ContractDelivery[]> {
    return await db
      .insert(contractDeliveries)
      .values(deliveries)
      .returning();
  }
}

export const storage = new DatabaseStorage();
