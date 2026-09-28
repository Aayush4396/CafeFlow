import React from 'react';
import { StationLoad } from '../../api/types.ts';

interface BpmnFlowCanvasProps {
  stationLoads: StationLoad[];
  digitalAdoptionRate: number;
}

export const BpmnFlowCanvas: React.FC<BpmnFlowCanvasProps> = ({
  stationLoads,
  digitalAdoptionRate
}) => {
  const espresso = stationLoads.find(s => s.stationType === 'ESPRESSO');
  const batch = stationLoads.find(s => s.stationType === 'BATCH_BREW');
  const bakery = stationLoads.find(s => s.stationType === 'BAKERY');

  const espressoCongested = espresso?.status === 'CONGESTED';
  const mobilePct = Math.round(digitalAdoptionRate * 100);
  const counterPct = 100 - mobilePct;

  return (
    <div className="bg-stone-950 rounded-3xl p-6 border border-stone-800 shadow-xl overflow-x-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-white text-base">Live Cafe Flow & Station Map</h3>
            <span className="text-xs bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full font-semibold">
              Automatic Load Balancing Active
            </span>
          </div>
          <p className="text-xs text-stone-400 mt-0.5">
            How customer orders travel from counter & mobile app into your 3 kitchen stations
          </p>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5 text-stone-300">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-ping" />
            <span>Mobile App Orders ({mobilePct}%)</span>
          </div>
          <div className="flex items-center gap-1.5 text-stone-300">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span>Walk-In Register ({counterPct}%)</span>
          </div>
        </div>
      </div>

      {/* SVG Diagram Canvas */}
      <div className="relative min-w-[760px] py-4">
        <svg viewBox="0 0 860 300" className="w-full h-auto text-stone-300">
          <defs>
            <marker id="arrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 1 L 8 5 L 0 9 z" fill="#78716c" />
            </marker>
            <marker id="arrow-blue" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 1 L 8 5 L 0 9 z" fill="#3b82f6" />
            </marker>
            <marker id="arrow-amber" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 1 L 8 5 L 0 9 z" fill="#d97706" />
            </marker>
          </defs>

          {/* 1. START EVENT */}
          <circle cx="50" cy="150" r="22" fill="#292524" stroke="#eab308" strokeWidth="2.5" />
          <text x="50" y="154" textAnchor="middle" fill="#fef08a" fontSize="10" fontWeight="bold">ARRIVE</text>
          <text x="50" y="190" textAnchor="middle" fill="#a8a29e" fontSize="11">Customer</text>

          {/* Gateway: Channel Split */}
          <path d="M 75 150 L 130 150" stroke="#78716c" strokeWidth="2" markerEnd="url(#arrow)" />

          {/* Exclusive Gateway (Diamond) */}
          <polygon points="150,125 175,150 150,175 125,150" fill="#1c1917" stroke="#3b82f6" strokeWidth="2" />
          <text x="150" y="153" textAnchor="middle" fill="#93c5fd" fontSize="13" fontWeight="bold">X</text>
          <text x="150" y="115" textAnchor="middle" fill="#93c5fd" fontSize="11" fontWeight="600">Channel</text>

          {/* Top Branch: Mobile App Bypass */}
          <path d="M 150 125 L 150 65 L 290 65" stroke="#3b82f6" strokeWidth="2" strokeDasharray="4 4" markerEnd="url(#arrow-blue)" />
          <text x="210" y="55" fill="#93c5fd" fontSize="10" fontWeight="bold">Mobile Bypass ({mobilePct}%)</text>

          {/* Bottom Branch: Walk-in Cashier Queue */}
          <path d="M 150 175 L 150 235 L 200 235" stroke="#d97706" strokeWidth="2" markerEnd="url(#arrow-amber)" />
          <text x="180" y="255" fill="#fcd34d" fontSize="10" fontWeight="bold">Walk-in ({counterPct}%)</text>

          {/* Cashier Task Box */}
          <rect x="200" y="205" width="105" height="55" rx="8" fill="#1c1917" stroke="#d97706" strokeWidth="2" />
          <text x="252" y="228" textAnchor="middle" fill="#fef3c7" fontSize="11" fontWeight="bold">Cashier POS</text>
          <text x="252" y="244" textAnchor="middle" fill="#a8a29e" fontSize="9">Queue: ~40s</text>

          {/* Routing to Load-Aware Dispatch Gateway */}
          <path d="M 305 235 L 350 235 L 350 165" stroke="#78716c" strokeWidth="2" />
          <path d="M 290 65 L 350 65 L 350 135" stroke="#3b82f6" strokeWidth="2" />

          {/* Load-Aware Steering Gateway (Diamond) */}
          <polygon points="350,135 375,150 350,165 325,150" fill="#1c1917" stroke="#10b981" strokeWidth="2" />
          <text x="350" y="154" textAnchor="middle" fill="#6ee7b7" fontSize="10" fontWeight="bold">AI</text>
          <text x="350" y="125" textAnchor="middle" fill="#6ee7b7" fontSize="11" fontWeight="bold">Load-Aware Nudge</text>

          {/* Paths to 3 Stations */}
          {/* Station 1: Espresso (Top) */}
          <path d="M 375 145 L 430 85 L 460 85" stroke={espressoCongested ? '#f43f5e' : '#78716c'} strokeWidth="2" markerEnd="url(#arrow)" />
          <rect x="460" y="55" width="145" height="60" rx="10" fill="#1c1917" stroke={espressoCongested ? '#f43f5e' : '#eab308'} strokeWidth="2" />
          <text x="532" y="78" textAnchor="middle" fill="#fef08a" fontSize="11" fontWeight="bold">Espresso Bar</text>
          <text x="532" y="93" textAnchor="middle" fill="#a8a29e" fontSize="10">2 Baristas | ~150s prep</text>
          <text x="532" y="107" textAnchor="middle" fill={espressoCongested ? '#f43f5e' : '#6ee7b7'} fontSize="9" fontWeight="bold">
            Queue: {espresso?.activeOrdersCount || 0} ({espresso?.estimatedWaitMinutes || 0}m)
          </text>

          {/* Station 2: Batch Brew & Cold Tap (Middle) */}
          <path d="M 375 150 L 460 150" stroke="#10b981" strokeWidth="2" markerEnd="url(#arrow)" />
          <rect x="460" y="125" width="145" height="55" rx="10" fill="#1c1917" stroke="#10b981" strokeWidth="2" />
          <text x="532" y="148" textAnchor="middle" fill="#6ee7b7" fontSize="11" fontWeight="bold">Batch Brew & Tap</text>
          <text x="532" y="162" textAnchor="middle" fill="#a8a29e" fontSize="10">1 Barista | ~25s prep</text>
          <text x="532" y="174" textAnchor="middle" fill="#6ee7b7" fontSize="9" fontWeight="bold">
            Queue: {batch?.activeOrdersCount || 0} ({batch?.estimatedWaitMinutes || 0}m)
          </text>

          {/* Station 3: Bakery & Food (Bottom) */}
          <path d="M 375 155 L 430 215 L 460 215" stroke="#78716c" strokeWidth="2" markerEnd="url(#arrow)" />
          <rect x="460" y="190" width="145" height="55" rx="10" fill="#1c1917" stroke="#f97316" strokeWidth="2" />
          <text x="532" y="213" textAnchor="middle" fill="#fdba74" fontSize="11" fontWeight="bold">Bakery & Warm Oven</text>
          <text x="532" y="227" textAnchor="middle" fill="#a8a29e" fontSize="10">1 Staff | ~45s prep</text>
          <text x="532" y="239" textAnchor="middle" fill="#fdba74" fontSize="9" fontWeight="bold">
            Queue: {bakery?.activeOrdersCount || 0} ({bakery?.estimatedWaitMinutes || 0}m)
          </text>

          {/* Merge to Fulfillment */}
          <path d="M 605 85 L 650 85 L 680 145" stroke="#78716c" strokeWidth="2" />
          <path d="M 605 150 L 680 150" stroke="#78716c" strokeWidth="2" />
          <path d="M 605 215 L 650 215 L 680 155" stroke="#78716c" strokeWidth="2" />

          {/* Hand-off Task */}
          <rect x="690" y="125" width="90" height="50" rx="8" fill="#1c1917" stroke="#3b82f6" strokeWidth="2" />
          <text x="735" y="148" textAnchor="middle" fill="#93c5fd" fontSize="11" fontWeight="bold">Pickup Counter</text>
          <text x="735" y="162" textAnchor="middle" fill="#a8a29e" fontSize="9">Bag & Call</text>

          {/* End Event */}
          <path d="M 780 150 L 815 150" stroke="#78716c" strokeWidth="2" markerEnd="url(#arrow)" />
          <circle cx="830" cy="150" r="18" fill="#1c1917" stroke="#10b981" strokeWidth="3.5" />
          <text x="830" y="154" textAnchor="middle" fill="#6ee7b7" fontSize="9" fontWeight="black">DONE</text>
        </svg>
      </div>
    </div>
  );
};
