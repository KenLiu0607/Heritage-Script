import { type ContractDelivery, type InsertContractDelivery } from "@shared/schema";

export interface IStorage {
  getDeliveries(): Promise<ContractDelivery[]>;
  updateDelivery(id: number, delivery: Partial<InsertContractDelivery>): Promise<ContractDelivery>;
  createDelivery(delivery: InsertContractDelivery): Promise<ContractDelivery>;
}

export class MemStorage implements IStorage {
  private deliveries: Map<number, ContractDelivery>;
  private currentId: number;

  constructor() {
    this.deliveries = new Map();
    this.currentId = 1;
    
    // Seed some data
    this.createDelivery({
      freezingType: "冷凍",
      meatName: "大雞腿",
      weightGrade: "1.5",
      boxCount: 10,
      pieceCount: 100,
      totalWeight: "150.00",
      avgWeight: "1.50"
    });
  }

  async getDeliveries(): Promise<ContractDelivery[]> {
    return Array.from(this.deliveries.values());
  }

  async updateDelivery(id: number, update: Partial<InsertContractDelivery>): Promise<ContractDelivery> {
    const existing = this.deliveries.get(id);
    if (!existing) throw new Error("Delivery not found");
    const updated = { ...existing, ...update } as ContractDelivery;
    this.deliveries.set(id, updated);
    return updated;
  }

  async createDelivery(delivery: InsertContractDelivery): Promise<ContractDelivery> {
    const id = this.currentId++;
    const newDelivery: ContractDelivery = { ...delivery, id } as ContractDelivery;
    this.deliveries.set(id, newDelivery);
    return newDelivery;
  }
}

export const storage = new MemStorage();
