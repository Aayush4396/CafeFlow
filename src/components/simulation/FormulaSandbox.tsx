import React, { useState } from 'react';
import { Calculator, ArrowRight, Sparkles, AlertCircle, Info, CheckCircle2 } from 'lucide-react';
import { ScoredRecommendation } from '../../api/types.ts';

interface FormulaSandboxProps {
  recommendations: ScoredRecommendation[];
}

export const FormulaSandbox: React.FC<FormulaSandboxProps> = ({ recommendations }) => {
  const [testBacklog, setTestBacklog] = useState(180); // in seconds
  const [selectedItemName, setSelectedItemName] = useState<string>(
    recommendations[0]?.item.name || 'Artisan Vanilla Bean Latte'
  );

  const selectedRec = recommendations.find(r => r.item.name === selectedItemName) || recommendations[0];

  if (!selectedRec) return null;

  const item = selectedRec.item;
  const popularity = item.basePopularity;
  const marginWeight = item.marginWeight;
  const prepTime = item.basePrepTimeSeconds;

  // Real-time recalculation based on interactive test backlog
  let queuePenalty = testBacklog * 0.1;
  if (testBacklog > 240) {
    queuePenalty *= 1.35;
  }

  const marginBonus = marginWeight * 20;
  let contextualBoost = 0;
  if (testBacklog < 60 && prepTime <= 45) {
    contextualBoost += 18;
  }
  if (item.category === 'cold_brew' || item.stationType === 'BATCH_BREW') {
    if (testBacklog < 90) {
      contextualBoost += 12;
    }
  }

  const simulatedScore = Math.max(0, popularity - queuePenalty + marginBonus + contextualBoost);
  const estWaitMins = Number((testBacklog / 60).toFixed(1));

  return (
    <div className="bg-stone-900 border border-stone-800 rounded-3xl p-6 shadow-xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-stone-800">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-white text-base">Mathematical Scoring & Penalty Inspector</h3>
            <p className="text-xs text-stone-400">
              Interactive test harness for the load-penalized recommendation algorithm
            </p>
          </div>
        </div>

        {/* Item Selector */}
        <select
          value={selectedItemName}
          onChange={e => setSelectedItemName(e.target.value)}
          className="bg-stone-950 border border-stone-700 rounded-xl px-3 py-1.5 text-xs text-stone-200 focus:outline-none focus:border-amber-500 font-medium"
        >
          {recommendations.map(r => (
            <option key={r.item.id} value={r.item.name}>
              {r.item.name} ({r.item.stationType})
            </option>
          ))}
        </select>
      </div>

      {/* Mathematical Formula Formula Card */}
      <div className="bg-stone-950 p-4 rounded-2xl border border-stone-800 font-mono text-xs text-stone-300 overflow-x-auto">
        <div className="text-[11px] font-bold text-amber-400 uppercase tracking-widest mb-1.5 font-sans flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5" />
          Active Scoring Equation
        </div>
        <div className="text-amber-200 text-sm py-1 font-semibold">
          Score(i) = BasePopularity - Penalty(Backlog_s) + (Margin × 20) + ContextBoost
        </div>
        <div className="text-stone-400 text-[11px] mt-1">
          Where Penalty(w) = w × 0.1 (multiplied by 1.35x when backlog &gt; 240s)
        </div>
      </div>

      {/* Interactive Backlog Slider */}
      <div className="space-y-3 bg-stone-950/60 p-4 rounded-2xl border border-stone-800/80">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-stone-200">
            Simulate Station Backlog for {item.stationType}:
          </span>
          <span className="font-mono font-bold text-amber-400 bg-stone-900 px-2.5 py-1 rounded-lg border border-stone-800">
            {testBacklog}s (~{estWaitMins} mins wait)
          </span>
        </div>

        <input
          type="range"
          min="0"
          max="480"
          step="15"
          value={testBacklog}
          onChange={e => setTestBacklog(Number(e.target.value))}
          className="w-full accent-amber-500 bg-stone-800 h-2.5 rounded-lg cursor-pointer"
        />

        <div className="flex justify-between text-[10px] text-stone-500 font-mono">
          <span>0s (Empty Bar)</span>
          <span>120s (Moderate)</span>
          <span>240s (Bottleneck Threshold)</span>
          <span>480s (Severe Saturation)</span>
        </div>
      </div>

      {/* Formula Output Decomposition Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-stone-950 p-3.5 rounded-2xl border border-stone-800">
          <div className="text-[11px] text-stone-400 font-semibold">Base Popularity</div>
          <div className="text-lg font-bold text-stone-100 mt-1 font-mono">
            {popularity}
          </div>
          <div className="text-[10px] text-stone-500 mt-0.5">Static affinity</div>
        </div>

        <div className="bg-stone-950 p-3.5 rounded-2xl border border-stone-800">
          <div className="text-[11px] text-rose-400 font-semibold">Queue Penalty (-)</div>
          <div className="text-lg font-bold text-rose-400 mt-1 font-mono">
            -{queuePenalty.toFixed(1)}
          </div>
          <div className="text-[10px] text-stone-500 mt-0.5">
            {testBacklog > 240 ? '1.35x Surge Active' : 'Linear 0.1x'}
          </div>
        </div>

        <div className="bg-stone-950 p-3.5 rounded-2xl border border-stone-800">
          <div className="text-[11px] text-emerald-400 font-semibold">Margin Bonus (+)</div>
          <div className="text-lg font-bold text-emerald-400 mt-1 font-mono">
            +{marginBonus.toFixed(1)}
          </div>
          <div className="text-[10px] text-stone-500 mt-0.5">{Math.round(marginWeight * 100)}% margin</div>
        </div>

        <div className="bg-stone-950 p-3.5 rounded-2xl border border-stone-800">
          <div className="text-[11px] text-blue-400 font-semibold">Context Boost (+)</div>
          <div className="text-lg font-bold text-blue-400 mt-1 font-mono">
            +{contextualBoost.toFixed(1)}
          </div>
          <div className="text-[10px] text-stone-500 mt-0.5">
            {contextualBoost > 0 ? 'Fast tap promotion' : 'No bonus'}
          </div>
        </div>
      </div>

      {/* Final Score Comparison */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30">
        <div>
          <span className="text-xs font-bold text-amber-300 uppercase tracking-wider block">
            Simulated Dynamic Score
          </span>
          <span className="text-2xl font-black text-amber-400 font-mono">
            {simulatedScore.toFixed(1)} pts
          </span>
          <span className="text-xs text-stone-400 ml-2">
            (Live in-app score: {selectedRec.score.toFixed(1)} pts)
          </span>
        </div>

        <div className="text-xs text-stone-300">
          {simulatedScore >= 80 ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Eligible for Top Carousel Spotlight
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-rose-500/20 text-rose-300 border border-rose-500/30 font-semibold">
              <AlertCircle className="w-4 h-4 text-rose-400" />
              Demoted from Top Recommendations
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
