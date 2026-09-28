import { GoogleGenAI } from '@google/genai';
import type { StationLoad, AiBottleneckAdvice } from '../api/types.ts';

// Mandatory Resilient Fallback Ladder
const MODEL_FALLBACK_LADDER = [
  'gemini-3.6-flash',
  'gemini-3.1-flash-lite',
  'gemini-flash-latest',
  'gemini-3.7-flash'
] as const;

export async function getAiBottleneckAdvice(stationLoads: StationLoad[]): Promise<AiBottleneckAdvice> {
  const apiKey = process.env.GEMINI_API_KEY;

  // Prepare fallback heuristic if API key is not yet set or external call fails
  const fallbackAdvice = generateHeuristicAdvice(stationLoads);

  if (!apiKey) {
    return fallbackAdvice;
  }

  const ai = new GoogleGenAI({ apiKey });

  const metricsSummary = stationLoads.map(load => ({
    station: load.displayName,
    type: load.stationType,
    activeOrders: load.activeOrdersCount,
    backlogSeconds: load.totalBacklogSeconds,
    waitMinutes: load.estimatedWaitMinutes,
    status: load.status,
    staffCount: load.workerCount
  }));

  const prompt = `You are the Lead Cafe Operations & Flow Optimization AI for CafeFlow.
Analyze the following real-time station metrics and queue backlogs:

<station_metrics>
${JSON.stringify(metricsSummary, null, 2)}
</station_metrics>

Provide an immediate operational bottleneck diagnosis and queue alleviation response in JSON format.
Respond with pure JSON conforming to this schema without Markdown backticks:
{
  "summary": "1-2 sentence executive operational diagnosis",
  "criticalStation": "ESPRESSO" | "BATCH_BREW" | "BAKERY" | "NONE",
  "operationalActions": [
    "action 1: immediate barista move",
    "action 2: menu steering / promotional shift",
    "action 3: prep batch adjustment"
  ],
  "staffingReallocation": "Concrete recommendation on moving staff between stations",
  "dynamicPricingOrNudgeHint": "Customer recommendation strategy (e.g. prioritize Cold Brew)",
  "confidenceScore": 0.94
}`;

  // Execute using Resilient Fallback Ladder
  for (const modelName of MODEL_FALLBACK_LADDER) {
    try {
      const response = await ai.models.generateContent({
        model: modelName,
        contents: prompt,
        config: {
          temperature: 0.2,
          responseMimeType: 'application/json'
        }
      });

      if (response && response.text) {
        const parsed = JSON.parse(response.text.trim()) as AiBottleneckAdvice;
        return {
          ...parsed,
          confidenceScore: parsed.confidenceScore || 0.92
        };
      }
    } catch (err: unknown) {
      console.warn(`[CafeFlow AI Advisor] Model ${modelName} failed or unavailable. Attempting next in ladder...`, (err as Error)?.message || err);
      // Continue to next model in the fallback ladder
    }
  }

  // Graceful degradation to heuristic if all models in the ladder encounter rate limits or network issues
  return fallbackAdvice;
}

function generateHeuristicAdvice(loads: StationLoad[]): AiBottleneckAdvice {
  const espresso = loads.find(l => l.stationType === 'ESPRESSO');
  const batch = loads.find(l => l.stationType === 'BATCH_BREW');
  const bakery = loads.find(l => l.stationType === 'BAKERY');

  if (espresso && espresso.status === 'CONGESTED') {
    return {
      summary: `Espresso bar is critically congested with ${espresso.activeOrdersCount} queued tickets and ${espresso.estimatedWaitMinutes}m wait. Batch and bakery stations have excess capacity.`,
      criticalStation: 'ESPRESSO',
      operationalActions: [
        'Temporarily cross-train Bakery runner to steam secondary milk pitchers',
        'Trigger customer app banner nudging Nitro Cold Brew and Iced Hibiscus Tea with < 2 min wait badge',
        'Batch grind single-origin espresso doses for incoming ticket queue'
      ],
      staffingReallocation: 'Shift 1 staff member from Bakery/POS to support Espresso bar milk texturing & cup assembly.',
      dynamicPricingOrNudgeHint: 'Nudge Batch Brew and Nitro Cold Brew to the top carousel; apply zero wait badge.',
      confidenceScore: 0.89
    };
  }

  if (bakery && bakery.status === 'CONGESTED') {
    return {
      summary: `Toaster and warm bakery queue is bottlenecking checkout flow.`,
      criticalStation: 'BAKERY',
      operationalActions: [
        'Pre-slice morning bagels and croissants into warming tray',
        'Prompt customers ordering cold drinks toward room-temperature pastries',
        'Designate a dedicated packaging runner'
      ],
      staffingReallocation: 'Keep 2 baristas on espresso; assign floater to bakery packaging.',
      dynamicPricingOrNudgeHint: 'Prioritize grab-and-go cold pastries over toasted items.',
      confidenceScore: 0.87
    };
  }

  return {
    summary: 'All stations are operating within optimal capacity bands. Queue flow is balanced across Espresso, Batch, and Bakery.',
    criticalStation: 'NONE',
    operationalActions: [
      'Maintain standard FIFO + load-aware carousel rotation',
      'Pre-brew next batch of Ethiopian filter coffee in 15 minutes',
      'Ensure milk refrigerators and syrup pumps are replenished'
    ],
    staffingReallocation: 'Standard station distribution: 2 on Espresso Bar, 1 on Batch/Cold Tap, 1 on Bakery.',
    dynamicPricingOrNudgeHint: 'Promote seasonal signature drinks in the customer tray for maximum ticket margin.',
    confidenceScore: 0.95
  };
}
