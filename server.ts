import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { cafeState } from './src/backend/state.ts';
import { getLoadAwareRecommendations, getQuickPickupItems } from './src/backend/recommender.ts';
import { runDiscreteEventSimulation } from './src/backend/simulationEngine.ts';
import { getAiBottleneckAdvice } from './src/backend/geminiAdvisor.ts';
import type { SimulationParams } from './src/api/types.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

  // 1. Mandatory Top-Level Request Deserialization (Ordering Guarantee)
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // 2. API Routes: Menu & Recommendations
  app.get('/api/v1/menu', (_req: Request, res: Response) => {
    try {
      const menu = cafeState.getMenu();
      res.json({ success: true, menu });
    } catch (err: unknown) {
      res.status(500).json({ success: false, error: (err as Error).message });
    }
  });

  app.get('/api/v1/recommendations', (_req: Request, res: Response) => {
    try {
      const menu = cafeState.getMenu();
      const loads = cafeState.getStationLoads();
      const recommendations = getLoadAwareRecommendations(menu, loads);
      const quickPickup = getQuickPickupItems();

      res.json({
        success: true,
        recommendations,
        quickPickup,
        stationLoads: loads
      });
    } catch (err: unknown) {
      res.status(500).json({ success: false, error: (err as Error).message });
    }
  });

  // 3. API Routes: Station Loads & KDS Orders
  app.get('/api/v1/kds/stations', (_req: Request, res: Response) => {
    try {
      const loads = cafeState.getStationLoads();
      res.json({ success: true, loads });
    } catch (err: unknown) {
      res.status(500).json({ success: false, error: (err as Error).message });
    }
  });

  app.get('/api/v1/kds/orders', (_req: Request, res: Response) => {
    try {
      const orders = cafeState.getOrders();
      res.json({ success: true, orders });
    } catch (err: unknown) {
      res.status(500).json({ success: false, error: (err as Error).message });
    }
  });

  app.post('/api/v1/orders', (req: Request, res: Response) => {
    try {
      // Defensive Payload Ingestion (Null-Safe Destructuring)
      const body = (req.body && typeof req.body === 'object') ? req.body : {};
      const { customerName, channel, items } = body;

      if (!Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ success: false, error: 'Order must contain at least one item.' });
      }

      const order = cafeState.addOrder({
        customerName: typeof customerName === 'string' && customerName.trim() ? customerName.trim() : 'Guest',
        channel: channel === 'WALK_IN' ? 'WALK_IN' : 'MOBILE',
        items
      });

      res.status(201).json({ success: true, order });
    } catch (err: unknown) {
      res.status(400).json({ success: false, error: (err as Error).message });
    }
  });

  app.patch('/api/v1/orders/:id/status', (req: Request, res: Response) => {
    try {
      const orderId = req.params.id;
      const body = (req.body && typeof req.body === 'object') ? req.body : {};
      const { status } = body;

      if (!['QUEUED', 'IN_PREP', 'READY', 'FULFILLED'].includes(status)) {
        return res.status(400).json({ success: false, error: 'Invalid order status transition.' });
      }

      const updated = cafeState.updateOrderStatus(orderId, status);
      res.json({ success: true, order: updated });
    } catch (err: unknown) {
      res.status(404).json({ success: false, error: (err as Error).message });
    }
  });

  app.post('/api/v1/kds/simulate-rush', (_req: Request, res: Response) => {
    try {
      cafeState.simulateRush();
      res.json({ success: true, message: 'Simulated morning rush orders injected.' });
    } catch (err: unknown) {
      res.status(500).json({ success: false, error: (err as Error).message });
    }
  });

  app.post('/api/v1/kds/clear-queue', (_req: Request, res: Response) => {
    try {
      cafeState.clearQueue();
      res.json({ success: true, message: 'Active station queues cleared.' });
    } catch (err: unknown) {
      res.status(500).json({ success: false, error: (err as Error).message });
    }
  });

  // 4. API Routes: BPMN Simulation & Gemini Flow Advisor
  app.post('/api/v1/simulate', (req: Request, res: Response) => {
    try {
      const body = (req.body && typeof req.body === 'object') ? req.body : {};
      const params: SimulationParams = {
        arrivalRatePerHour: Math.max(10, Math.min(300, Number(body.arrivalRatePerHour) || 120)),
        cashierCount: Math.max(1, Math.min(6, Number(body.cashierCount) || 2)),
        baristaCountEspresso: Math.max(1, Math.min(6, Number(body.baristaCountEspresso) || 2)),
        baristaCountBrew: Math.max(1, Math.min(4, Number(body.baristaCountBrew) || 1)),
        baristaCountBakery: Math.max(1, Math.min(4, Number(body.baristaCountBakery) || 1)),
        digitalAdoptionRate: Math.max(0, Math.min(1, Number(body.digitalAdoptionRate) ?? 0.45)),
        smartRoutingEnabled: Boolean(body.smartRoutingEnabled ?? true),
        durationMinutes: 60
      };

      const result = runDiscreteEventSimulation(params);
      res.json({ success: true, result });
    } catch (err: unknown) {
      res.status(500).json({ success: false, error: (err as Error).message });
    }
  });

  app.get('/api/v1/advisor/bottleneck', async (_req: Request, res: Response) => {
    try {
      const loads = cafeState.getStationLoads();
      const advice = await getAiBottleneckAdvice(loads);
      res.json({ success: true, advice });
    } catch (err: unknown) {
      res.status(500).json({ success: false, error: (err as Error).message });
    }
  });

  // 5. Mount Vite in Development or Static Server in Production
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[CafeFlow Engine] Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('[CafeFlow Server Boot Error]', err);
  process.exit(1);
});
