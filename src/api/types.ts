export type StationType = 'ESPRESSO' | 'BATCH_BREW' | 'BAKERY';

export interface MenuItem {
  id: string;
  name: string;
  category: 'coffee' | 'cold_brew' | 'tea' | 'bakery' | 'food';
  stationType: StationType;
  basePrepTimeSeconds: number; // e.g. 180s for Espresso, 30s for Batch, 45s for Bakery
  price: number;
  marginWeight: number; // 0 to 1 scale for profitability
  basePopularity: number; // 0 to 100
  description: string;
  imageUrl: string;
  tags: string[];
  options?: {
    sizes?: string[];
    milks?: string[];
    sweetness?: string[];
  };
}

export interface OrderItem {
  menuItemId: string;
  name: string;
  stationType: StationType;
  prepTimeSeconds: number;
  price: number;
  quantity: number;
  selectedOptions?: Record<string, string>;
}

export type OrderStatus = 'QUEUED' | 'IN_PREP' | 'READY' | 'FULFILLED';
export type OrderChannel = 'MOBILE' | 'WALK_IN';

export interface Order {
  id: string;
  customerName: string;
  channel: OrderChannel;
  items: OrderItem[];
  status: OrderStatus;
  createdAt: number; // Unix timestamp ms
  prepStartedAt?: number;
  readyAt?: number;
  totalPrice: number;
  totalEstimatedPrepTime: number; // seconds
  targetStation: StationType;
}

export interface StationLoad {
  stationType: StationType;
  displayName: string;
  activeOrdersCount: number;
  totalBacklogSeconds: number;
  estimatedWaitMinutes: number;
  status: 'OPTIMAL' | 'MODERATE' | 'CONGESTED';
  workerCount: number;
}

export interface ScoreBreakdown {
  basePopularity: number;
  queuePenalty: number;
  marginBonus: number;
  contextualBoost: number;
  finalScore: number;
}

export interface ScoredRecommendation {
  item: MenuItem;
  score: number;
  breakdown: ScoreBreakdown;
  stationWaitSeconds: number;
  estimatedWaitMinutes: number;
  reasons: string[];
  badgeText?: string;
  isQuickPickup: boolean;
}

export interface SimulationParams {
  arrivalRatePerHour: number; // e.g., 60 to 240 customers/hr
  cashierCount: number; // 1 to 4
  baristaCountEspresso: number; // 1 to 6
  baristaCountBrew: number; // 1 to 3
  baristaCountBakery: number; // 1 to 3
  digitalAdoptionRate: number; // 0.0 to 1.0 (mobile orders %)
  smartRoutingEnabled: boolean; // load-aware nudge active
  durationMinutes: number; // simulated timeframe, default 60 mins
}

export interface SimulationMetricComparison {
  policy: 'FIFO_STANDARD' | 'LOAD_AWARE_SMART';
  totalCustomersServed: number;
  avgWaitTimeMinutes: number;
  p95WaitTimeMinutes: number;
  throughputPerHour: number;
  stationUtilization: {
    espresso: number; // 0 to 100%
    batchBrew: number;
    bakery: number;
  };
  congestionIncidents: number;
  customerSatisfactionScore: number; // 1.0 to 5.0
}

export interface SimulationResponse {
  fifoResult: SimulationMetricComparison;
  smartResult: SimulationMetricComparison;
  waitReductionPercent: number;
  throughputDeltaPercent: number;
  timelineSample: Array<{
    minute: number;
    fifoQueueLength: number;
    smartQueueLength: number;
  }>;
}

export interface AiBottleneckAdvice {
  summary: string;
  criticalStation: StationType | 'NONE';
  operationalActions: string[];
  staffingReallocation: string;
  dynamicPricingOrNudgeHint: string;
  confidenceScore: number;
}
