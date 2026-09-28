import React from 'react';
import { ShoppingBag, ArrowRight, Trash2, Clock, Zap } from 'lucide-react';
import { OrderItem, StationLoad } from '../../api/types.ts';

interface DynamicTrayProps {
  items: OrderItem[];
  stationLoads: StationLoad[];
  onRemoveItem: (index: number) => void;
  onCheckout: () => void;
  isSubmitting: boolean;
}

export const DynamicTray: React.FC<DynamicTrayProps> = ({
  items,
  stationLoads,
  onRemoveItem,
  onCheckout,
  isSubmitting
}) => {
  if (items.length === 0) return null;

  const totalCount = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = items.reduce((sum, i) => sum + (i.price * i.quantity), 0);

  // Compute aggregated wait time based on highest backlog station in tray
  const stationsInTray = Array.from(new Set(items.map(i => i.stationType)));
  const relevantLoads = stationLoads.filter(l => stationsInTray.includes(l.stationType));
  const maxWaitMins = relevantLoads.length > 0
    ? Math.max(...relevantLoads.map(l => l.estimatedWaitMinutes))
    : 2;

  const hasHighWait = maxWaitMins >= 4;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-stone-900/95 backdrop-blur-md border-t border-stone-800 p-4 shadow-2xl animate-in slide-in-from-bottom duration-300">
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Tray Summary & Line Item Badges */}
        <div className="flex-1 w-full flex items-center justify-between sm:justify-start gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-600 flex items-center justify-center text-white shadow-md relative">
              <ShoppingBag className="w-6 h-6" />
              <span className="absolute -top-1.5 -right-1.5 bg-white text-stone-950 text-xs font-black w-5 h-5 rounded-full flex items-center justify-center shadow">
                {totalCount}
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-white text-lg">
                  ${totalPrice.toFixed(2)}
                </span>
                <span className="text-xs text-stone-400">({totalCount} items)</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs">
                {hasHighWait ? (
                  <span className="text-amber-400 font-medium flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    Est. Pickup: ~{maxWaitMins} mins
                  </span>
                ) : (
                  <span className="text-emerald-400 font-medium flex items-center gap-1">
                    <Zap className="w-3.5 h-3.5 fill-emerald-400" />
                    Fast Lane Pickup: ~{maxWaitMins} mins
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Quick Item Preview Strip */}
          <div className="hidden md:flex items-center gap-2 overflow-x-auto max-w-sm pl-4 border-l border-stone-800">
            {items.map((item, idx) => (
              <div
                key={`${item.menuItemId}-${idx}`}
                className="flex items-center gap-1.5 bg-stone-800/80 px-2.5 py-1 rounded-lg text-xs text-stone-300 border border-stone-700/60"
              >
                <span className="font-semibold">{item.quantity}x</span>
                <span className="truncate max-w-[100px]">{item.name}</span>
                <button
                  onClick={() => onRemoveItem(idx)}
                  className="text-stone-400 hover:text-rose-400 ml-1"
                  title="Remove"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={onCheckout}
          disabled={isSubmitting}
          className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-sm shadow-lg active:scale-95 transition flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {isSubmitting ? (
            <span>Routing Order...</span>
          ) : (
            <>
              <span>Place Mobile Order</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};
