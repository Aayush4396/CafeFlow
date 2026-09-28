import {
  MenuItem,
  Order,
  StationLoad,
  ScoredRecommendation,
  SimulationParams,
  SimulationResponse,
  AiBottleneckAdvice
} from './types.ts';

export async function fetchMenu(): Promise<MenuItem[]> {
  const res = await fetch('/api/v1/menu');
  if (!res.ok) throw new Error('Failed to load menu');
  const data = await res.json();
  return data.menu;
}

export async function fetchRecommendations(): Promise<{
  recommendations: ScoredRecommendation[];
  quickPickup: ScoredRecommendation[];
  stationLoads: StationLoad[];
}> {
  const res = await fetch('/api/v1/recommendations');
  if (!res.ok) throw new Error('Failed to load recommendations');
  return res.json();
}

export async function fetchStationLoads(): Promise<StationLoad[]> {
  const res = await fetch('/api/v1/kds/stations');
  if (!res.ok) throw new Error('Failed to load station loads');
  const data = await res.json();
  return data.loads;
}

export async function fetchKdsOrders(): Promise<Order[]> {
  const res = await fetch('/api/v1/kds/orders');
  if (!res.ok) throw new Error('Failed to load active orders');
  const data = await res.json();
  return data.orders;
}

export async function submitOrder(orderPayload: {
  customerName: string;
  channel: 'MOBILE' | 'WALK_IN';
  items: Array<{
    menuItemId: string;
    quantity: number;
    selectedOptions?: Record<string, string>;
  }>;
}): Promise<Order> {
  const res = await fetch('/api/v1/orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(orderPayload)
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to place order');
  }
  const data = await res.json();
  return data.order;
}

export async function updateOrderStatus(orderId: string, status: Order['status']): Promise<Order> {
  const res = await fetch(`/api/v1/orders/${orderId}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status })
  });
  if (!res.ok) throw new Error('Failed to update order status');
  const data = await res.json();
  return data.order;
}

export async function triggerSimulatedRush(): Promise<void> {
  const res = await fetch('/api/v1/kds/simulate-rush', { method: 'POST' });
  if (!res.ok) throw new Error('Failed to simulate rush');
}

export async function triggerClearQueue(): Promise<void> {
  const res = await fetch('/api/v1/kds/clear-queue', { method: 'POST' });
  if (!res.ok) throw new Error('Failed to clear queue');
}

export async function runSimulation(params: SimulationParams): Promise<SimulationResponse> {
  const res = await fetch('/api/v1/simulate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params)
  });
  if (!res.ok) throw new Error('Simulation failed');
  const data = await res.json();
  return data.result;
}

export async function fetchAiBottleneckAdvice(): Promise<AiBottleneckAdvice> {
  const res = await fetch('/api/v1/advisor/bottleneck');
  if (!res.ok) throw new Error('Failed to fetch AI bottleneck advice');
  const data = await res.json();
  return data.advice;
}
