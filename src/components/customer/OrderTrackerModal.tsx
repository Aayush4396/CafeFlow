import React from 'react';
import { CheckCircle2, Clock, MapPin, Coffee, X } from 'lucide-react';
import { Order } from '../../api/types.ts';

interface OrderTrackerModalProps {
  order: Order | null;
  onClose: () => void;
}

export const OrderTrackerModal: React.FC<OrderTrackerModalProps> = ({
  order,
  onClose
}) => {
  if (!order) return null;

  const steps = [
    { key: 'QUEUED', label: 'Order Received', desc: 'Routed to optimal station' },
    { key: 'IN_PREP', label: 'In Preparation', desc: 'Barista crafting your items' },
    { key: 'READY', label: 'Ready for Pickup', desc: 'At counter pickup window' },
    { key: 'FULFILLED', label: 'Completed', desc: 'Enjoy your coffee!' }
  ];

  const currentIdx = steps.findIndex(s => s.key === order.status);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-stone-900 border border-stone-800 rounded-3xl max-w-md w-full p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full bg-stone-800 text-stone-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
            <Coffee className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-white text-lg">Order #{order.id}</h3>
              <span className="text-xs px-2 py-0.5 rounded-full bg-stone-800 text-stone-300 font-mono">
                {order.channel}
              </span>
            </div>
            <p className="text-xs text-stone-400">For {order.customerName}</p>
          </div>
        </div>

        {/* Status Tracker */}
        <div className="space-y-6 mb-6">
          {steps.map((step, idx) => {
            const isCompleted = idx < currentIdx;
            const isCurrent = idx === currentIdx;

            return (
              <div key={step.key} className="flex items-start gap-3.5 relative">
                {idx < steps.length - 1 && (
                  <div
                    className={`absolute left-4 top-8 bottom-0 w-0.5 -ml-[1px] ${
                      idx < currentIdx ? 'bg-amber-500' : 'bg-stone-800'
                    }`}
                  />
                )}
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border transition ${
                    isCompleted
                      ? 'bg-amber-500 text-stone-950 border-amber-500'
                      : isCurrent
                      ? 'bg-amber-600/30 text-amber-400 border-amber-500 animate-pulse'
                      : 'bg-stone-850 text-stone-500 border-stone-800'
                  }`}
                >
                  {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                </div>
                <div className="pt-0.5">
                  <h4
                    className={`text-sm font-semibold ${
                      isCurrent
                        ? 'text-amber-400'
                        : isCompleted
                        ? 'text-stone-200'
                        : 'text-stone-500'
                    }`}
                  >
                    {step.label}
                  </h4>
                  <p className="text-xs text-stone-400">{step.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Order Details Preview */}
        <div className="bg-stone-950/70 rounded-2xl p-4 border border-stone-800/80 mb-5 text-xs text-stone-300 space-y-2">
          <div className="font-semibold text-stone-400 uppercase tracking-wider text-[11px] mb-1">
            Ticket Items:
          </div>
          {order.items.map((item, i) => (
            <div key={i} className="flex justify-between items-center">
              <span>
                {item.quantity}x {item.name}
              </span>
              <span className="font-mono text-stone-400">
                ${(item.price * item.quantity).toFixed(2)}
              </span>
            </div>
          ))}
          <div className="pt-2 border-t border-stone-800 flex justify-between font-bold text-white text-sm">
            <span>Total Paid</span>
            <span className="text-amber-400">${order.totalPrice.toFixed(2)}</span>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 font-semibold text-sm transition"
        >
          Close Status View
        </button>
      </div>
    </div>
  );
};
