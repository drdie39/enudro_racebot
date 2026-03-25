import express from 'express';
import pino from 'pino';
import pinoHttp from 'pino-http';
import { z } from 'zod';
import { defaultConfig } from './config/defaults.js';
import { MonitorService } from './core/state/monitor.js';
import { InMemoryStateStore } from './core/state/store.js';

const logger = pino({ name: 'api' });
const app = express();
app.use(express.json());
app.use(pinoHttp({ logger }));

const store = new InMemoryStateStore();
store.updateConfig(defaultConfig);
const clients = new Set<express.Response>();
const emit = (): void => {
  const payload = JSON.stringify(store.getState(), (_k, v) => (v instanceof Set ? Array.from(v) : v));
  for (const c of clients) c.write(`data: ${payload}\n\n`);
};
const monitor = new MonitorService(store, emit);

const configSchema = z.object({
  sessionIdOrUrl: z.string(),
  identity: z.object({ driverName: z.string().optional(), carNumber: z.string().optional(), preferredCarId: z.string().optional() }),
  pollingIntervalMs: z.number().min(1000),
  duplicateCooldownMs: z.number().min(0),
  pitStopThresholdPct: z.number().min(1).max(200),
  ambiguousMap: z.record(z.string()),
  demoMode: z.boolean(),
  discord: z.object({
    mode: z.enum(['none', 'webhook', 'bot']),
    webhookUrl: z.string().optional(),
    botToken: z.string().optional(),
    channelId: z.string().optional(),
    teamRoleId: z.string().optional()
  })
});

app.get('/health', (_req, res) => res.json({ ok: true }));
app.get('/api/state', (_req, res) => res.json(store.getState()));
app.get('/api/events', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  clients.add(res);
  emit();
  req.on('close', () => clients.delete(res));
});

app.put('/api/settings', (req, res) => {
  const parsed = configSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json(parsed.error.flatten());
  store.updateConfig(parsed.data);
  if (store.getState().status.running) monitor.start();
  emit();
  res.json({ ok: true });
});

app.post('/api/watch/start', (_req, res) => {
  monitor.start();
  emit();
  res.json({ ok: true });
});

app.post('/api/watch/stop', (_req, res) => {
  monitor.stop();
  emit();
  res.json({ ok: true });
});

const port = Number(process.env.PORT ?? 4000);
app.listen(port, () => logger.info({ port }, 'Backend running'));
