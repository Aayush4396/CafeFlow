import React from 'react';
import { SimulationParams } from '../../api/types.ts';
import { Sliders, Users, Play, RefreshCw, Zap } from 'lucide-react';

interface ParameterControlsProps {
  params: SimulationParams;
  onChange: (updated: Partial<SimulationParams>) => void;
  onRunSimulation: () => void;
  isRunning: boolean;
}

export const ParameterControls: React.FC<ParameterControlsProps> = ({
  params,
  onChange,
  onRunSimulation,
  isRunning
}) => {
  return (
    <div className="bg-stone-900 border border-stone-800 rounded-3xl p-6 shadow-xl">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-stone-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
            <Sliders className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-white text-base">Store & Rush Simulator</h3>
            <p className="text-xs text-stone-400">See how shifting your staff or busy morning crowds affects customer wait times</p>
          </div>
        </div>

        <button
          onClick={onRunSimulation}
          disabled={isRunning}
          className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow-md active:scale-95 transition flex items-center gap-2 disabled:opacity-50"
        >
          {isRunning ? (
            <RefreshCw className="w-4 h-4 animate-spin" />
          ) : (
            <Play className="w-4 h-4 fill-white" />
          )}
          <span>{isRunning ? 'Calculating Rush...' : 'Calculate Rush Impact'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Customer Arrival Rate Slider */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="font-semibold text-stone-300">Morning Customer Rush</span>
            <span className="font-mono text-amber-400 font-bold bg-stone-950 px-2 py-0.5 rounded border border-stone-800">
              {params.arrivalRatePerHour} guests / hour
            </span>
          </div>
          <input
            type="range"
            min="30"
            max="260"
            step="10"
            value={params.arrivalRatePerHour}
            onChange={e => onChange({ arrivalRatePerHour: Number(e.target.value) })}
            className="w-full accent-amber-500 bg-stone-800 h-2 rounded-lg cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-stone-500">
            <span>30 (Quiet Afternoon)</span>
            <span>120 (Normal Morning)</span>
            <span>260 (Extreme Rush)</span>
          </div>
        </div>

        {/* Digital Adoption Rate Slider */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="font-semibold text-stone-300">Customers Ordering Ahead on App</span>
            <span className="font-mono text-blue-400 font-bold bg-stone-950 px-2 py-0.5 rounded border border-stone-800">
              {Math.round(params.digitalAdoptionRate * 100)}%
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={params.digitalAdoptionRate}
            onChange={e => onChange({ digitalAdoptionRate: Number(e.target.value) })}
            className="w-full accent-blue-500 bg-stone-800 h-2 rounded-lg cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-stone-500">
            <span>0% (All Register Walk-ins)</span>
            <span>50% (Half & Half)</span>
            <span>100% (All Mobile Pickup)</span>
          </div>
        </div>

        {/* Cashier Count */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="font-semibold text-stone-300">Front Register Staff</span>
            <span className="font-mono text-stone-200 font-bold bg-stone-950 px-2 py-0.5 rounded border border-stone-800">
              {params.cashierCount} Cashier{params.cashierCount > 1 ? 's' : ''}
            </span>
          </div>
          <input
            type="range"
            min="1"
            max="4"
            step="1"
            value={params.cashierCount}
            onChange={e => onChange({ cashierCount: Number(e.target.value) })}
            className="w-full accent-amber-500 bg-stone-800 h-2 rounded-lg cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-stone-500">
            <span>1 Cashier</span>
            <span>2 Cashiers</span>
            <span>4 Cashiers</span>
          </div>
        </div>

        {/* Espresso Baristas */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="font-semibold text-stone-300">Espresso Baristas on Bar</span>
            <span className="font-mono text-amber-400 font-bold bg-stone-950 px-2 py-0.5 rounded border border-stone-800">
              {params.baristaCountEspresso} Barista{params.baristaCountEspresso > 1 ? 's' : ''}
            </span>
          </div>
          <input
            type="range"
            min="1"
            max="5"
            step="1"
            value={params.baristaCountEspresso}
            onChange={e => onChange({ baristaCountEspresso: Number(e.target.value) })}
            className="w-full accent-amber-500 bg-stone-800 h-2 rounded-lg cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-stone-500">
            <span>1 Barista</span>
            <span>2 (Recommended)</span>
            <span>5 (Full Rush Crew)</span>
          </div>
        </div>

        {/* Batch & Cold Brew Baristas */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="font-semibold text-stone-300">Drip Coffee & Cold Tap Staff</span>
            <span className="font-mono text-emerald-400 font-bold bg-stone-950 px-2 py-0.5 rounded border border-stone-800">
              {params.baristaCountBrew} Staff
            </span>
          </div>
          <input
            type="range"
            min="1"
            max="3"
            step="1"
            value={params.baristaCountBrew}
            onChange={e => onChange({ baristaCountBrew: Number(e.target.value) })}
            className="w-full accent-emerald-500 bg-stone-800 h-2 rounded-lg cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-stone-500">
            <span>1 Staff</span>
            <span>2 Staff</span>
            <span>3 Staff</span>
          </div>
        </div>

        {/* Smart Load-Aware Nudge Toggle */}
        <div className="flex items-center justify-between p-3 rounded-2xl bg-stone-950 border border-stone-800">
          <div>
            <span className="text-xs font-bold text-white block">Smart Menu Balancing</span>
            <span className="text-[11px] text-stone-400">Gently nudges guests to quick cold/drip drinks during peaks</span>
          </div>
          <button
            type="button"
            onClick={() => onChange({ smartRoutingEnabled: !params.smartRoutingEnabled })}
            className={`w-12 h-6 flex items-center rounded-full p-1 transition duration-300 ${
              params.smartRoutingEnabled ? 'bg-emerald-600 justify-end' : 'bg-stone-700 justify-start'
            }`}
          >
            <div className="bg-white w-4 h-4 rounded-full shadow-md" />
          </button>
        </div>
      </div>
    </div>
  );
};
