import React from 'react';
import { Clock, Play, CheckCircle2, CheckCheck, Smartphone, User } from 'lucide-react';
import { Order, OrderStatus } from '../../api/types.ts';

interface TicketCardProps {
  order: Order;
  onUpdateStatus: (orderId: string, nextStatus: OrderStatus) => void;
}

export const TicketCard: React.FC<TicketCardProps> = ({ order, onUpdateStatus }) => {
  const ageSeconds = Math.floor((Date.now() - order.createdAt) / 1000);
  const ageMins = Math.floor(ageSeconds / 60);

  const isOld = ageMins >= 5;
  const isModerate = ageMins >= 3;

  return (
    <div
      className={`rounded-2xl p-4 border transition-all duration-200 shadow-md flex flex-col justify-between ${
        order.status === 'READY'
          ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-100'
          : order.status === 'IN_PREP'
          ? 'bg-amber-950/20 border-amber-500/40 text-amber-100'
          : isOld
          ? 'bg-rose-950/20 border-rose-500/40 text-rose-100'
          : 'bg-stone-900 border-stone-800 text-stone-200'
      }`}
    >
      <div>
        {/* Header: Ticket ID & Age Timer */}
        <div className="flex items-center justify-between gap-2 mb-3 pb-2.5 border-b border-stone-800/80">
          <div className="flex items-center gap-2">
            <span className="font-mono font-bold text-sm text-white">
              #{order.id}
            </span>
            <span
              className={`text-[10px] font-semibold px-2 py-0.5 rounded-md flex items-center gap-1 ${
                order.channel === 'MOBILE'
                  ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                  : 'bg-stone-800 text-stone-300'
              }`}
            >
              {order.channel === 'MOBILE' ? (
                <>
                  <Smartphone className="w-2.5 h-2.5" />
                  Mobile
                </>
              ) : (
                <>
                  <User className="w-2.5 h-2.5" />
                  Walk-In
                </>
              )}
            </span>
          </div>

          <div
            className={`flex items-center gap-1 font-mono text-xs font-semibold px-2 py-0.5 rounded-md ${
              isOld
                ? 'bg-rose-500/20 text-rose-300'
                : isModerate
                ? 'bg-amber-500/20 text-amber-300'
                : 'text-stone-400'
            }`}
          >
            <Clock className="w-3 h-3" />
            <span>{ageMins}m {ageSeconds % 60}s</span>
          </div>
        </div>

        {/* Customer Name */}
        <div className="font-bold text-white text-sm mb-2.5">
          {order.customerName}
        </div>

        {/* Line Items */}
        <div className="space-y-2 mb-4">
          {order.items.map((item, idx) => (
            <div key={idx} className="text-xs bg-stone-950/60 p-2 rounded-xl border border-stone-800/60">
              <div className="flex justify-between font-semibold text-stone-100">
                <span>
                  <strong className="text-amber-400 mr-1.5">{item.quantity}x</strong>
                  {item.name}
                </span>
                <span className="text-stone-500 text-[10px]">~{item.prepTimeSeconds}s</span>
              </div>
              {item.selectedOptions && Object.keys(item.selectedOptions).length > 0 && (
                <div className="mt-1 flex flex-wrap gap-1 text-[11px] text-amber-300/80">
                  {Object.entries(item.selectedOptions).map(([key, val]) => (
                    <span key={key} className="bg-stone-900 px-1.5 py-0.5 rounded">
                      {val}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Action Progress Button - Large touch target for fast paced cafe hands */}
      <div className="pt-2">
        {order.status === 'QUEUED' && (
          <button
            onClick={() => onUpdateStatus(order.id, 'IN_PREP')}
            className="w-full py-3 px-4 rounded-xl bg-amber-600 hover:bg-amber-500 active:scale-98 text-white font-bold text-sm transition flex items-center justify-center gap-2 shadow-md"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>Start Drink Now</span>
          </button>
        )}

        {order.status === 'IN_PREP' && (
          <button
            onClick={() => onUpdateStatus(order.id, 'READY')}
            className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-98 text-white font-bold text-sm transition flex items-center justify-center gap-2 shadow-md animate-pulse"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Mark Ready for Pickup</span>
          </button>
        )}

        {order.status === 'READY' && (
          <button
            onClick={() => onUpdateStatus(order.id, 'FULFILLED')}
            className="w-full py-3 px-4 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 hover:text-white font-bold text-sm transition flex items-center justify-center gap-2 border border-stone-700 shadow-sm"
          >
            <CheckCheck className="w-4 h-4 text-emerald-400" />
            <span>Handed to Customer</span>
          </button>
        )}
      </div>
    </div>
  );
};
