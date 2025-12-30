import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertContractDeliverySchema } from "@shared/schema";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  app.get("/api/deliveries", async (_req, res) => {
    const deliveries = await storage.getDeliveries();
    res.json(deliveries);
  });

  app.post("/api/deliveries/batch", async (req, res) => {
    const items = req.body;
    if (!Array.isArray(items)) {
      return res.status(400).json({ error: "Invalid input" });
    }
    try {
      const createdItems = await storage.createBatchDeliveries(items);
      res.json(createdItems);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.patch("/api/deliveries/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const result = insertContractDeliverySchema.partial().safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ error: result.error });
    }
    const updated = await storage.updateDelivery(id, result.data);
    res.json(updated);
  });

  return httpServer;
}
