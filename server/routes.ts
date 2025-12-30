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
