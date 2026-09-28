import React, { useState, useEffect } from 'react';
import { StationLoad, SimulationParams, SimulationResponse, AiBottleneckAdvice, ScoredRecommendation } from '../../api/types.ts';
import { BpmnFlowCanvas } from './BpmnFlowCanvas.tsx';
import { ParameterControls } from './ParameterControls.tsx';
import { MetricComparisonCards } from './MetricComparisonCards.tsx';
import { AiDispatchAdvisor } from './AiDispatchAdvisor.tsx';
import { FormulaSandbox } from './FormulaSandbox.tsx';
import { runSimulation, fetchAiBottleneckAdvice } from '../../api/client.ts';

interface SimulationDashboardProps {
  stationLoads: StationLoad[];
  recommendations?: ScoredRecommendation[];
}

export const SimulationDashboard: React.FC<SimulationDashboardProps> = ({
  stationLoads,
  recommendations = []
}) => {
  const [params, setParams] = useState<SimulationParams>({
    arrivalRatePerHour: 130,
    cashierCount: 2,
    baristaCountEspresso: 2,
    baristaCountBrew: 1,
    baristaCountBakery: 1,
    digitalAdoptionRate: 0.50,
    smartRoutingEnabled: true,
    durationMinutes: 60
  });

  const [simulationData, setSimulationData] = useState<SimulationResponse | null>(null);
  const [advice, setAdvice] = useState<AiBottleneckAdvice | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  const executeSimulation = async (currParams: SimulationParams) => {
    try {
      setIsRunning(true);
      const [simResult, aiAdvice] = await Promise.all([
        runSimulation(currParams),
        fetchAiBottleneckAdvice().catch(() => null)
      ]);
      setSimulationData(simResult);
      if (aiAdvice) setAdvice(aiAdvice);
    } catch (err: unknown) {
      console.error('Simulation run failed:', err);
    } finally {
      setIsRunning(false);
    }
  };

  useEffect(() => {
    executeSimulation(params);
  }, []);

  const handleParamChange = (updated: Partial<SimulationParams>) => {
    const next = { ...params, ...updated };
    setParams(next);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* 1. Interactive BPMN Canvas Flow Visualizer */}
      <BpmnFlowCanvas
        stationLoads={stationLoads}
        digitalAdoptionRate={params.digitalAdoptionRate}
      />

      {/* 2. Simulation Sliders & Parameter Controls */}
      <ParameterControls
        params={params}
        onChange={handleParamChange}
        onRunSimulation={() => executeSimulation(params)}
        isRunning={isRunning}
      />

      {/* 3. Metric Comparison Analytics (FIFO vs Load-Aware) */}
      <MetricComparisonCards simulationData={simulationData} />

      {/* 4. Real-Time Formula Sandbox & Scoring Inspector */}
      {recommendations.length > 0 && (
        <FormulaSandbox recommendations={recommendations} />
      )}

      {/* 5. Gemini AI Flow & Bottleneck Advisor */}
      <AiDispatchAdvisor initialAdvice={advice} />
    </div>
  );
};
