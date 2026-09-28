import React from 'react';
import { Clock, Users, Flame, CheckCircle, Zap } from 'lucide-react';
import { StationLoad } from '../../api/types.ts';
import { UserRole } from './Navbar.tsx';

interface QuickStatsBarProps {
  stationLoads: StationLoad[];
  userRole: UserRole;
  onSimulateRush: () => void;
  onClearQueue: () => void;
}

export const QuickStatsBar: React.FC<QuickStatsBarProps> = ({
  stationLoads,
  userRole,
  onSimulateRush,
  onClearQueue
}) => {
  const totalActive = stationLoads.reduce((sum, s) => sum + s.activeOrdersCount, 0);

  return (
    <div className="bg-stone-900/90 border-b border-stone-800 text-stone-300 py-2.5 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
        {/* Real-time Station Load Pills */}
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-xs font-semibold text-stone-400 uppercase tracking-wider flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            Kitchen Station Wait:
          </span>

          {stationLoads.map(station => {
            const isCongested = station.status === 'CONGESTED';
            const isModerate = station.status === 'MODERATE';

            const badgeBg = isCongested
              ? 'bg-rose-500/20 text-rose-200 border-rose-500/40 shadow-sm'
              : isModerate
              ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
              : 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30';

            const dotColor = isCongested
              ? 'bg-rose-500 animate-ping'
              : isModerate
              ? 'bg-amber-500'
              : 'bg-emerald-500';

            const friendlyName = station.stationType === 'ESPRESSO'
              ? 'Espresso Bar'
              : station.stationType === 'BATCH_BREW'
              ? 'Drip & Cold Tap'
              : 'Bakery Oven';

            return (
              <div
                key={station.stationType}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium border ${badgeBg} transition`}
              >
                <span className={`w-2 h-2 rounded-full ${dotColor}`} />
                <span className="font-bold text-white">{friendlyName}</span>
                <span className="text-stone-500">•</span>
                <span className="font-semibold">{station.activeOrdersCount} {station.activeOrdersCount === 1 ? 'ticket' : 'tickets'}</span>
                <span className="text-stone-300 font-mono">({station.estimatedWaitMinutes}m wait)</span>
              </div>
            );
          })}
        </div>

        {/* Global Controls & Simulation Buttons (Only visible to Baristas & Managers) */}
        {(userRole === 'BARISTA' || userRole === 'MANAGER') && (
          <div className="flex items-center gap-2">
            <button
              onClick={onSimulateRush}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 transition active:scale-95 shadow-sm"
              title="Adds 5 morning rush drink orders to test queue balancing"
            >
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              <span>Simulate Rush (+5 Drinks)</span>
            </button>

            <button
              onClick={onClearQueue}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white border border-stone-700 transition"
              title="Reset waiting tickets back to clean state"
            >
              <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
              <span>Clear Completed</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
