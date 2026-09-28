import React from 'react';
import { SimulationResponse } from '../../api/types.ts';
import { ArrowDownRight, ArrowUpRight, Clock, Users, Zap, CheckCircle2, TrendingDown } from 'lucide-react';

interface MetricComparisonCardsProps {
  simulationData: SimulationResponse | null;
}

export const MetricComparisonCards: React.FC<MetricComparisonCardsProps> = ({
  simulationData
}) => {
  if (!simulationData) return null;

  const { fifoResult, smartResult, waitReductionPercent, throughputDeltaPercent } = simulationData;

  return (
    <div className="space-y-6">
      {/* Top Banner: Improvement Delta */}
      <div className="bg-gradient-to-r from-emerald-950/60 via-stone-900 to-amber-950/60 border border-emerald-500/40 rounded-3xl p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5 mb-1">
            <Zap className="w-3.5 h-3.5 fill-emerald-400" />
            Rush Hour Relief Report
          </span>
          <h3 className="text-xl font-black text-white">
            {waitReductionPercent > 0 ? (
              <span>Smart Menu Nudges cut customer wait times by <strong className="text-emerald-400">-{waitReductionPercent}%</strong></span>
            ) : (
              <span>Your stations are smoothly balanced</span>
            )}
          </h3>
          <p className="text-xs text-stone-400 mt-1">
            Real impact of gently recommending fast-pour cold brew and drip coffee when your espresso machine gets backed up
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="bg-stone-900/90 border border-emerald-500/30 px-4 py-2.5 rounded-2xl text-center">
            <div className="text-xs text-stone-400">Faster Pickup</div>
            <div className="text-lg font-black text-emerald-400 flex items-center justify-center gap-1">
              <TrendingDown className="w-4 h-4" />
              <span>{waitReductionPercent}% less waiting</span>
            </div>
          </div>

          <div className="bg-stone-900/90 border border-amber-500/30 px-4 py-2.5 rounded-2xl text-center">
            <div className="text-xs text-stone-400">More Drinks Served</div>
            <div className="text-lg font-black text-amber-400 flex items-center justify-center gap-1">
              <ArrowUpRight className="w-4 h-4" />
              <span>+{throughputDeltaPercent}% output</span>
            </div>
          </div>
        </div>
      </div>

      {/* Side-by-Side Metric Comparison Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* FIFO Standard Policy */}
        <div className="bg-stone-900 border border-stone-800 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-stone-800">
            <div>
              <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">
                Without CafeFlow
              </span>
              <h4 className="text-lg font-extrabold text-stone-200">Unmanaged Rush (Everyone orders lattes)</h4>
            </div>
            <span className="text-xs bg-stone-800 text-stone-400 px-2.5 py-1 rounded-lg">
              Unbalanced
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-stone-950 p-3.5 rounded-2xl border border-stone-800/80">
              <div className="text-xs text-stone-400">Typical Customer Wait</div>
              <div className="text-xl font-bold text-stone-200 mt-1">
                {fifoResult.avgWaitTimeMinutes} mins
              </div>
            </div>

            <div className="bg-stone-950 p-3.5 rounded-2xl border border-stone-800/80">
              <div className="text-xs text-stone-400">Longest Wait (95% of guests)</div>
              <div className="text-xl font-bold text-stone-200 mt-1">
                {fifoResult.p95WaitTimeMinutes} mins
              </div>
            </div>

            <div className="bg-stone-950 p-3.5 rounded-2xl border border-stone-800/80">
              <div className="text-xs text-stone-400">Drinks Made per Hour</div>
              <div className="text-xl font-bold text-stone-200 mt-1">
                {fifoResult.throughputPerHour} drinks
              </div>
            </div>

            <div className="bg-stone-950 p-3.5 rounded-2xl border border-stone-800/80">
              <div className="text-xs text-stone-400">Customer Happiness</div>
              <div className="text-xl font-bold text-stone-200 mt-1">
                ⭐ {fifoResult.customerSatisfactionScore} / 5.0
              </div>
            </div>
          </div>

          {/* Utilization Bars */}
          <div className="space-y-2 pt-2">
            <div className="text-xs font-semibold text-stone-400">Kitchen Pressure:</div>
            <div>
              <div className="flex justify-between text-[11px] text-stone-400 mb-1">
                <span>Espresso Bar</span>
                <span className="font-mono text-rose-400">{fifoResult.stationUtilization.espresso}% (Overwhelmed Baristas)</span>
              </div>
              <div className="w-full bg-stone-950 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-rose-500 h-full rounded-full"
                  style={{ width: `${fifoResult.stationUtilization.espresso}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[11px] text-stone-400 mb-1">
                <span>Drip & Cold Tap</span>
                <span className="font-mono text-stone-400">{fifoResult.stationUtilization.batchBrew}% (Sitting Idle)</span>
              </div>
              <div className="w-full bg-stone-950 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-stone-600 h-full rounded-full"
                  style={{ width: `${fifoResult.stationUtilization.batchBrew}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Load-Aware Smart Policy */}
        <div className="bg-stone-900 border border-emerald-500/40 rounded-3xl p-6 shadow-xl space-y-4 relative">
          <div className="flex items-center justify-between pb-3 border-b border-stone-800">
            <div>
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">
                With CafeFlow Assistant
              </span>
              <h4 className="text-lg font-extrabold text-white">Smart Balanced Flow (Fast lane active)</h4>
            </div>
            <span className="text-xs bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2.5 py-1 rounded-lg">
              Low Stress
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-stone-950 p-3.5 rounded-2xl border border-emerald-500/20">
              <div className="text-xs text-stone-400">Typical Customer Wait</div>
              <div className="text-xl font-bold text-emerald-400 mt-1 flex items-center gap-1.5">
                <span>{smartResult.avgWaitTimeMinutes} mins</span>
                <span className="text-xs font-normal text-emerald-300">
                  (-{(fifoResult.avgWaitTimeMinutes - smartResult.avgWaitTimeMinutes).toFixed(1)}m faster)
                </span>
              </div>
            </div>

            <div className="bg-stone-950 p-3.5 rounded-2xl border border-emerald-500/20">
              <div className="text-xs text-stone-400">Longest Wait (95% of guests)</div>
              <div className="text-xl font-bold text-emerald-400 mt-1">
                {smartResult.p95WaitTimeMinutes} mins
              </div>
            </div>

            <div className="bg-stone-950 p-3.5 rounded-2xl border border-emerald-500/20">
              <div className="text-xs text-stone-400">Drinks Made per Hour</div>
              <div className="text-xl font-bold text-amber-400 mt-1">
                {smartResult.throughputPerHour} drinks
              </div>
            </div>

            <div className="bg-stone-950 p-3.5 rounded-2xl border border-emerald-500/20">
              <div className="text-xs text-stone-400">Customer Happiness</div>
              <div className="text-xl font-bold text-emerald-400 mt-1">
                ⭐ {smartResult.customerSatisfactionScore} / 5.0
              </div>
            </div>
          </div>

          {/* Utilization Bars */}
          <div className="space-y-2 pt-2">
            <div className="text-xs font-semibold text-stone-400">Kitchen Pressure (Healthy & Balanced):</div>
            <div>
              <div className="flex justify-between text-[11px] text-stone-400 mb-1">
                <span>Espresso Bar</span>
                <span className="font-mono text-amber-400">{smartResult.stationUtilization.espresso}% (Comfortable Pace)</span>
              </div>
              <div className="w-full bg-stone-950 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-amber-500 h-full rounded-full"
                  style={{ width: `${smartResult.stationUtilization.espresso}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[11px] text-stone-400 mb-1">
                <span>Drip & Cold Tap</span>
                <span className="font-mono text-emerald-400">{smartResult.stationUtilization.batchBrew}% (Active Fast Lane)</span>
              </div>
              <div className="w-full bg-stone-950 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-500 h-full rounded-full"
                  style={{ width: `${smartResult.stationUtilization.batchBrew}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 60-Minute Rush Progression Curve */}
      {simulationData.timelineSample && simulationData.timelineSample.length > 0 && (
        <div className="bg-stone-900 border border-stone-800 rounded-3xl p-6 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-stone-800">
            <div>
              <h4 className="font-bold text-white text-base">Peak Rush Queue Depth Over Time (60 mins)</h4>
              <p className="text-xs text-stone-400">Discrete-event queue backlog comparison across the simulated hour</p>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <span className="flex items-center gap-1.5 text-rose-400 font-semibold">
                <span className="w-3 h-1 bg-rose-500 rounded" /> FIFO Queue Depth
              </span>
              <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                <span className="w-3 h-1 bg-emerald-500 rounded" /> CafeFlow Smart Nudge
              </span>
            </div>
          </div>

          {/* Bar visualization of the timeline */}
          <div className="grid grid-cols-12 gap-2 h-36 items-end pt-4 px-2">
            {simulationData.timelineSample.map(sample => {
              const maxQ = Math.max(...simulationData.timelineSample.map(s => Math.max(s.fifoQueueLength, s.smartQueueLength)), 1);
              const fifoHeight = Math.min(100, Math.round((sample.fifoQueueLength / maxQ) * 100));
              const smartHeight = Math.min(100, Math.round((sample.smartQueueLength / maxQ) * 100));

              return (
                <div key={sample.minute} className="flex flex-col items-center h-full justify-end group">
                  <div className="w-full flex items-end justify-center gap-1 h-24">
                    <div
                      title={`FIFO: ${sample.fifoQueueLength} waiting`}
                      style={{ height: `${fifoHeight}%` }}
                      className="w-2.5 sm:w-3.5 bg-rose-500/80 hover:bg-rose-400 rounded-t transition-all"
                    />
                    <div
                      title={`Smart: ${sample.smartQueueLength} waiting`}
                      style={{ height: `${smartHeight}%` }}
                      className="w-2.5 sm:w-3.5 bg-emerald-500/90 hover:bg-emerald-400 rounded-t transition-all"
                    />
                  </div>
                  <span className="text-[10px] text-stone-400 font-mono mt-2">{sample.minute}m</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
