import React, { useState } from 'react';
import { X, Clock, Check, Plus, Minus, AlertCircle } from 'lucide-react';
import { MenuItem, StationLoad } from '../../api/types.ts';

interface ItemModalProps {
  item: MenuItem | null;
  stationLoad?: StationLoad;
  onClose: () => void;
  onAddToCart: (item: MenuItem, quantity: number, options: Record<string, string>) => void;
}

export const ItemModal: React.FC<ItemModalProps> = ({
  item,
  stationLoad,
  onClose,
  onAddToCart
}) => {
  if (!item) return null;

  const [quantity, setQuantity] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    if (item.options?.sizes?.length) initial.size = item.options.sizes[0];
    if (item.options?.milks?.length) initial.milk = item.options.milks[0];
    if (item.options?.sweetness?.length) initial.sweetness = item.options.sweetness[0];
    return initial;
  });

  const isCongested = stationLoad?.status === 'CONGESTED';
  const waitMinutes = stationLoad?.estimatedWaitMinutes || 1;

  const handleAdd = () => {
    onAddToCart(item, quantity, selectedOptions);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-stone-900 border border-stone-800 rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header Image */}
        <div className="relative aspect-[16/9] w-full bg-stone-950">
          <img
            src={item.imageUrl}
            alt={item.name}
            className="w-full h-full object-cover"
          />
          <button
            onClick={onClose}
            className="absolute top-3 right-3 p-2 rounded-full bg-stone-950/70 hover:bg-stone-900 text-stone-300 hover:text-white border border-stone-700/50 backdrop-blur-md transition"
          >
            <X className="w-5 h-5" />
          </button>

          {isCongested && (
            <div className="absolute bottom-3 left-3 right-3 bg-amber-950/90 border border-amber-600/50 text-amber-200 text-xs px-3 py-2 rounded-xl backdrop-blur-md flex items-center gap-2 shadow-lg">
              <Clock className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Espresso Bar is busy right now (~{waitMinutes}m wait). If you're in a hurry, try our cold brew or drip coffee for instant pickup!</span>
            </div>
          )}
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-white mb-1">{item.name}</h2>
              <p className="text-xs text-stone-400 leading-relaxed">{item.description}</p>
            </div>
            <div className="text-right">
              <span className="text-xl font-black text-amber-400">
                ${(item.price * quantity).toFixed(2)}
              </span>
              <div className="text-[11px] text-stone-400 flex items-center gap-1 justify-end mt-0.5">
                <Clock className="w-3 h-3 text-emerald-400" />
                <span>Est. {waitMinutes}m prep</span>
              </div>
            </div>
          </div>

          {/* Customization Options */}
          {item.options?.sizes && (
            <div>
              <label className="text-xs font-semibold text-stone-300 uppercase tracking-wider block mb-2">
                Cup Size
              </label>
              <div className="grid grid-cols-3 gap-2">
                {item.options.sizes.map(size => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setSelectedOptions(prev => ({ ...prev, size }))}
                    className={`py-2 px-3 rounded-xl text-xs font-medium border text-center transition ${
                      selectedOptions.size === size
                        ? 'bg-amber-600 text-white border-amber-500 shadow-sm'
                        : 'bg-stone-850 text-stone-300 border-stone-700 hover:border-stone-600'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {item.options?.milks && (
            <div>
              <label className="text-xs font-semibold text-stone-300 uppercase tracking-wider block mb-2">
                Milk Choice
              </label>
              <div className="grid grid-cols-2 gap-2">
                {item.options.milks.map(milk => (
                  <button
                    key={milk}
                    type="button"
                    onClick={() => setSelectedOptions(prev => ({ ...prev, milk }))}
                    className={`py-2 px-3 rounded-xl text-xs font-medium border text-center transition ${
                      selectedOptions.milk === milk
                        ? 'bg-amber-600 text-white border-amber-500 shadow-sm'
                        : 'bg-stone-850 text-stone-300 border-stone-700 hover:border-stone-600'
                    }`}
                  >
                    {milk}
                  </button>
                ))}
              </div>
            </div>
          )}

          {item.options?.sweetness && (
            <div>
              <label className="text-xs font-semibold text-stone-300 uppercase tracking-wider block mb-2">
                Preparation Preference
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {item.options.sweetness.map(opt => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setSelectedOptions(prev => ({ ...prev, sweetness: opt }))}
                    className={`py-2 px-3 rounded-xl text-xs font-medium border text-center transition ${
                      selectedOptions.sweetness === opt
                        ? 'bg-amber-600 text-white border-amber-500 shadow-sm'
                        : 'bg-stone-850 text-stone-300 border-stone-700 hover:border-stone-600'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-5 border-t border-stone-800 bg-stone-900/60 flex items-center justify-between gap-4">
          {/* Quantity Stepper */}
          <div className="flex items-center gap-3 bg-stone-800 px-3 py-1.5 rounded-xl border border-stone-700">
            <button
              onClick={() => setQuantity(q => Math.max(1, q - 1))}
              className="text-stone-300 hover:text-white p-1"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="font-bold text-white text-sm w-4 text-center">{quantity}</span>
            <button
              onClick={() => setQuantity(q => Math.min(10, q + 1))}
              className="text-stone-300 hover:text-white p-1"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            onClick={handleAdd}
            className="flex-1 py-3 px-5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-sm shadow-md active:scale-98 transition flex items-center justify-center gap-2"
          >
            <span>Add to Tray</span>
            <span>•</span>
            <span>${(item.price * quantity).toFixed(2)}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
