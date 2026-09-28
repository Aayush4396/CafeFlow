import React from 'react';
import { Coffee, Flame, Utensils, AlertTriangle } from 'lucide-react';
import { StationLoad, Order, StationType, OrderStatus } from '../../api/types.ts';
import { TicketCard } from './TicketCard.tsx';

interface StationColumnProps {
  station: StationLoad;
  orders: Order[];
  onUpdateStatus: (orderId: string, nextStatus: OrderStatus) => void;
}

export const StationColumn: React.FC<StationColumnProps> = ({
  station,
  orders,
  onUpdateStatus
}) => {
  const stationOrders = orders.filter(o => o.targetStation === station.stationType);
  const queuedOrders = stationOrders.filter(o => o.status === 'QUEUED');
  const inPrepOrders = stationOrders.filter(o => o.status === 'IN_PREP');
  const readyOrders = stationOrders.filter(o => o.status === 'READY');

  const getStationIcon = (type: StationType) => {
    switch (type) {
      case 'ESPRESSO':
        return <Coffee className="w-5 h-5 text-amber-400" />;
      case 'BATCH_BREW':
        return <Flame className="w-5 h-5 text-sky-400" />;
      case 'BAKERY':
        return <Utensils className="w-5 h-5 text-orange-400" />;
    }
  };

  const isCongested = station.status === 'CONGESTED';

  return (
    <div className="bg-stone-950/60 rounded-3xl border border-stone-800 flex flex-col h-[calc(100vh-210px)] overflow-hidden shadow-xl">
      {/* Column Header */}
      <div className="p-4 border-b border-stone-800 bg-stone-900/90 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-stone-800 border border-stone-700">
            {getStationIcon(station.stationType)}
          </div>
          <div>
            <h3 className="font-bold text-white text-sm sm:text-base leading-tight">
              {station.displayName}
            </h3>
            <div className="flex items-center gap-2 text-xs text-stone-400 mt-0.5">
              <span>{station.workerCount} Staff</span>
              <span>•</span>
              <span className="font-mono">{station.totalBacklogSeconds}s backlog</span>
            </div>
          </div>
        </div>

        {/* Load Status Pill */}
        <div className="text-right">
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold border ${
              isCongested
                ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 animate-pulse'
                : station.status === 'MODERATE'
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
            }`}
          >
            {isCongested && <AlertTriangle className="w-3 h-3 text-rose-400" />}
            <span>{station.estimatedWaitMinutes}m wait</span>
          </span>
          <div className="text-[11px] text-stone-500 mt-0.5">
            {stationOrders.length} active tickets
          </div>
        </div>
      </div>

      {/* Ticket Stream */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {stationOrders.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 text-stone-600">
            <div className="w-12 h-12 rounded-2xl bg-stone-900 flex items-center justify-center mb-3">
              {getStationIcon(station.stationType)}
            </div>
            <p className="text-sm font-semibold text-stone-400">Queue is Clear</p>
            <p className="text-xs text-stone-600 mt-1">Ready for incoming mobile or counter tickets</p>
          </div>
        ) : (
          <>
            {/* IN PREPARATION SECTION */}
            {inPrepOrders.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                  <span>On The Bar ({inPrepOrders.length})</span>
                </div>
                {inPrepOrders.map(order => (
                  <TicketCard
                    key={order.id}
                    order={order}
                    onUpdateStatus={onUpdateStatus}
                  />
                ))}
              </div>
            )}

            {/* QUEUED SECTION */}
            {queuedOrders.length > 0 && (
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-2 text-xs font-bold text-stone-400 uppercase tracking-wider">
                  <span>Queued ({queuedOrders.length})</span>
                </div>
                {queuedOrders.map(order => (
                  <TicketCard
                    key={order.id}
                    order={order}
                    onUpdateStatus={onUpdateStatus}
                  />
                ))}
              </div>
            )}

            {/* READY FOR PICKUP SECTION */}
            {readyOrders.length > 0 && (
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span>Ready at Counter ({readyOrders.length})</span>
                </div>
                {readyOrders.map(order => (
                  <TicketCard
                    key={order.id}
                    order={order}
                    onUpdateStatus={onUpdateStatus}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
