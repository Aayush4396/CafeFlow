import React, { useState } from 'react';
import { Sparkles, Bot, AlertTriangle, RefreshCw, CheckCircle2, ArrowRight } from 'lucide-react';
import { AiBottleneckAdvice } from '../../api/types.ts';
import { fetchAiBottleneckAdvice } from '../../api/client.ts';

interface AiDispatchAdvisorProps {
  initialAdvice: AiBottleneckAdvice | null;
}

export const AiDispatchAdvisor: React.FC<AiDispatchAdvisorProps> = ({ initialAdvice }) => {
  const [advice, setAdvice] = useState<AiBottleneckAdvice | null>(initialAdvice);
  const [isLoading, setIsLoading] = useState(false);

  const handleRefreshAdvice = async () => {
    try {
      setIsLoading(true);
      const res = await fetchAiBottleneckAdvice();
      setAdvice(res);
    } catch (err: unknown) {
      console.error('Failed to refresh AI advice:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-stone-900 border border-stone-800 rounded-3xl p-6 shadow-xl space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-stone-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-600 to-amber-400 flex items-center justify-center text-stone-950 shadow-inner">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-white text-base">Shift Lead Assistant</h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                Ready to Help
              </span>
            </div>
            <p className="text-xs text-stone-400">
              Clear, practical advice on shifting staff and managing morning crowds
            </p>
          </div>
        </div>

        <button
          onClick={handleRefreshAdvice}
          disabled={isLoading}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold border border-stone-700 transition"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-amber-400' : ''}`} />
          <span>Check Current Rush</span>
        </button>
      </div>

      {advice ? (
        <div className="space-y-5">
          {/* Executive Diagnosis */}
          <div className="bg-stone-950 p-4 rounded-2xl border border-stone-800/80">
            <div className="text-[11px] font-bold text-amber-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Kitchen Status Right Now
            </div>
            <p className="text-sm text-stone-200 leading-relaxed font-medium">
              {advice.summary}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Operational Directives */}
            <div className="bg-stone-950/70 p-4 rounded-2xl border border-stone-800 space-y-3">
              <div className="text-xs font-bold text-stone-300 uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Quick Steps to Keep Things Moving:
              </div>
              <ul className="space-y-2 text-xs text-stone-300">
                {advice.operationalActions.map((act, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-amber-400 font-bold">•</span>
                    <span>{act}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Staffing & Re-allocation advice */}
            <div className="bg-stone-950/70 p-4 rounded-2xl border border-stone-800 space-y-3">
              <div className="text-xs font-bold text-stone-300 uppercase tracking-wider">
                Recommended Staff Moves:
              </div>
              <div className="text-xs text-stone-300 bg-stone-900/80 p-3 rounded-xl border border-stone-800/80">
                <strong className="text-amber-300 block mb-1">Barista Move:</strong>
                {advice.staffingReallocation}
              </div>
              <div className="text-xs text-stone-300 bg-stone-900/80 p-3 rounded-xl border border-stone-800/80">
                <strong className="text-emerald-300 block mb-1">What the App is Doing:</strong>
                {advice.dynamicPricingOrNudgeHint}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-6 text-stone-500 text-xs">
          Click 'Check Current Rush' for real-time recommendations.
        </div>
      )}
    </div>
  );
};
