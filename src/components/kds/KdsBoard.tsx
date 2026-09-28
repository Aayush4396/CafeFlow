import React from 'react';
import { StationLoad, Order, OrderStatus } from '../../api/types.ts';
import { StationColumn } from './StationColumn.tsx';
import { Flame, CheckCircle, RefreshCw, AlertCircle } from 'lucide-react';

interface KdsBoardProps {
  stationLoads: StationLoad[];
  orders: Order[];
  onUpdateStatus: (orderId: string, nextStatus: OrderStatus) => void;
  onSimulateRush: () => void;
  onClearQueue: () => void;
  onRefresh: () => void;
  isRefreshing: boolean;
}

export const KdsBoard: React.FC<KdsBoardProps> = ({
  stationLoads,
  orders,
  onUpdateStatus,
  onSimulateRush,
  onClearQueue,
  onRefresh,
  isRefreshing
}) => {
  const activeOrders = orders.filter(o => o.status !== 'FULFILLED');
  const congestedStation = stationLoads.find(s => s.status === 'CONGESTED');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Top Banner Alert if Congestion Detected */}
      {congestedStation && (
        <div className="mb-6 p-4 rounded-2xl bg-amber-950/40 border border-amber-500/40 text-amber-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-300">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-white">
                Heads up: {congestedStation.displayName.split(' ')[0]} Bar is getting backed up ({congestedStation.estimatedWaitMinutes}m wait)
              </h4>
              <p className="text-xs text-amber-200/80">
                The customer app has automatically promoted quick-pour Batch & Cold Brew to ease your pressure.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onSimulateRush}
              className="px-3.5 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 text-xs font-semibold"
            >
              Test +5 Rush Tickets
            </button>
          </div>
        </div>
      )}

      {/* Main Multi-Station Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stationLoads.map(station => (
          <StationColumn
            key={station.stationType}
            station={station}
            orders={activeOrders}
            onUpdateStatus={onUpdateStatus}
          />
        ))}
      </div>
    </div>
  );
};
