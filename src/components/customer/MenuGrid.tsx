import React from 'react';
import { Clock, Plus, Zap, AlertTriangle } from 'lucide-react';
import { MenuItem, StationLoad } from '../../api/types.ts';

interface MenuGridProps {
  menuItems: MenuItem[];
  stationLoads: StationLoad[];
  selectedCategory: string;
  onSelectItem: (item: MenuItem) => void;
  onQuickAdd?: (item: MenuItem) => void;
}

export const MenuGrid: React.FC<MenuGridProps> = ({
  menuItems,
  stationLoads,
  selectedCategory,
  onSelectItem,
  onQuickAdd
}) => {
  const loadMap = new Map<string, StationLoad>();
  stationLoads.forEach(l => loadMap.set(l.stationType, l));

  const filteredItems = selectedCategory === 'all'
    ? menuItems
    : menuItems.filter(item => item.category === selectedCategory || item.stationType.toLowerCase() === selectedCategory);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {filteredItems.map(item => {
        const station = loadMap.get(item.stationType);
        const waitMinutes = station ? station.estimatedWaitMinutes : 1;
        const isCongested = station?.status === 'CONGESTED';
        const isModerate = station?.status === 'MODERATE';

        return (
          <div
            key={item.id}
            onClick={() => onSelectItem(item)}
            className="group cursor-pointer bg-stone-900/80 hover:bg-stone-850 rounded-2xl p-4 border border-stone-800 hover:border-amber-500/50 transition-all duration-200 shadow-sm flex flex-col justify-between"
          >
            <div>
              <div className="relative aspect-[16/10] rounded-xl overflow-hidden mb-3.5 bg-stone-950">
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />

                {/* Station Tag & Live Wait Badge */}
                <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                  <span className="bg-stone-950/80 backdrop-blur-md text-stone-200 text-xs font-semibold px-2.5 py-0.5 rounded-lg border border-stone-700/60">
                    {item.stationType === 'ESPRESSO' ? 'Espresso' : item.stationType === 'BATCH_BREW' ? 'Fast Pour' : 'Bakery'}
                  </span>
                </div>

                <div
                  className={`absolute top-2.5 right-2.5 text-xs font-semibold px-2.5 py-0.5 rounded-lg border backdrop-blur-md shadow-sm flex items-center gap-1 ${
                    isCongested
                      ? 'bg-rose-950/80 text-rose-300 border-rose-600/40'
                      : isModerate
                      ? 'bg-amber-950/80 text-amber-300 border-amber-600/40'
                      : 'bg-emerald-950/80 text-emerald-300 border-emerald-600/40'
                  }`}
                >
                  {isCongested ? (
                    <AlertTriangle className="w-3 h-3 text-rose-400" />
                  ) : (
                    <Clock className="w-3 h-3 text-emerald-400" />
                  )}
                  <span>Ready in ~{waitMinutes}m</span>
                </div>
              </div>

              <div className="flex items-start justify-between gap-3 mb-2">
                <h3 className="font-bold text-stone-100 group-hover:text-amber-400 transition text-base">
                  {item.name}
                </h3>
                <span className="font-extrabold text-stone-100 text-base">
                  ${item.price.toFixed(2)}
                </span>
              </div>

              <p className="text-xs text-stone-400 line-clamp-2 mb-3">
                {item.description}
              </p>

              {/* Tag Pills */}
              <div className="flex flex-wrap gap-1.5 mb-3">
                {item.tags.map(tag => (
                  <span
                    key={tag}
                    className="text-[11px] font-medium text-stone-400 bg-stone-800/80 px-2 py-0.5 rounded-md"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-stone-800 flex items-center justify-between gap-2">
              <span className="text-xs text-stone-400 font-mono">
                ${item.price.toFixed(2)}
              </span>

              <div className="flex items-center gap-2">
                {onQuickAdd && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onQuickAdd(item);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold transition flex items-center gap-1 shadow-sm active:scale-95"
                    title="Quick 1-tap add with default options"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Quick Add</span>
                  </button>
                )}

                <button
                  type="button"
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold transition"
                >
                  <span>Customize</span>
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
