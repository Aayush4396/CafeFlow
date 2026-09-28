import React from 'react';
import { Sparkles, Clock, ArrowRight, Zap } from 'lucide-react';
import { MenuItem, ScoredRecommendation } from '../../api/types.ts';

interface RecommendedCarouselProps {
  recommendations: ScoredRecommendation[];
  onSelectItem: (item: MenuItem) => void;
}

export const RecommendedCarousel: React.FC<RecommendedCarouselProps> = ({
  recommendations,
  onSelectItem
}) => {
  if (recommendations.length === 0) return null;

  return (
    <section className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30">
            <Zap className="w-4 h-4 fill-amber-400/30" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-stone-100 flex items-center gap-2">
              Recommended for Quick Pickup
            </h2>
            <p className="text-xs text-stone-400">
              Dynamically prioritized to bypass congested cafe stations
            </p>
          </div>
        </div>

        <span className="hidden sm:inline-flex items-center gap-1 text-xs font-medium text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Fast Lane Active
        </span>
      </div>

      {/* Horizontal Carousel */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {recommendations.slice(0, 4).map(({ item, badgeText, estimatedWaitMinutes, score, reasons }) => {
          return (
            <div
              key={item.id}
              onClick={() => onSelectItem(item)}
              className="group cursor-pointer bg-stone-900/90 hover:bg-stone-850 rounded-2xl p-4 border border-stone-800 hover:border-amber-500/40 transition-all duration-200 shadow-sm hover:shadow-lg hover:-translate-y-0.5 flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-[4/3] rounded-xl overflow-hidden mb-3 bg-stone-950">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  {badgeText && (
                    <div className="absolute top-2.5 left-2.5 bg-stone-900/90 backdrop-blur-md text-emerald-300 text-xs font-semibold px-2.5 py-1 rounded-lg border border-emerald-500/40 shadow-sm flex items-center gap-1.5">
                      <Zap className="w-3 h-3 text-emerald-400 fill-emerald-400" />
                      {badgeText}
                    </div>
                  )}

                  <div className="absolute bottom-2.5 right-2.5 bg-stone-950/80 backdrop-blur-md text-stone-200 text-xs font-semibold px-2 py-0.5 rounded-md border border-stone-700/60">
                    Est. {estimatedWaitMinutes}m
                  </div>
                </div>

                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <h3 className="font-semibold text-stone-100 group-hover:text-amber-400 transition text-sm sm:text-base line-clamp-1">
                    {item.name}
                  </h3>
                  <span className="font-bold text-stone-200 text-sm">
                    ${item.price.toFixed(2)}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 mb-2">
                  <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-300 border border-amber-500/25">
                    Score: {score} pts
                  </span>
                  {reasons[0] && (
                    <span className="text-[10px] text-stone-400 truncate max-w-[130px]">
                      • {reasons[0]}
                    </span>
                  )}
                </div>

                <p className="text-xs text-stone-400 line-clamp-2 mb-3">
                  {item.description}
                </p>
              </div>

              <div className="pt-2 border-t border-stone-800/80 flex items-center justify-between text-xs text-stone-400">
                <span className="flex items-center gap-1 text-emerald-400 font-medium">
                  <Clock className="w-3 h-3" />
                  Tap to Customize
                </span>
                <span className="w-6 h-6 rounded-full bg-stone-800 group-hover:bg-amber-500 group-hover:text-stone-950 flex items-center justify-center transition-all">
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
