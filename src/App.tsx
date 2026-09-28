import React, { useState, useEffect } from 'react';
import { Navbar, ActiveTab, UserRole } from './components/layout/Navbar.tsx';
import { QuickStatsBar } from './components/layout/QuickStatsBar.tsx';
import { CustomerView } from './components/customer/CustomerView.tsx';
import { KdsBoard } from './components/kds/KdsBoard.tsx';
import { SimulationDashboard } from './components/simulation/SimulationDashboard.tsx';
import {
  MenuItem,
  Order,
  StationLoad,
  ScoredRecommendation,
  OrderStatus
} from './api/types.ts';
import {
  fetchMenu,
  fetchRecommendations,
  fetchStationLoads,
  fetchKdsOrders,
  updateOrderStatus,
  triggerSimulatedRush,
  triggerClearQueue
} from './api/client.ts';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('CUSTOMER');
  const [userRole, setUserRole] = useState<UserRole>('MANAGER'); // Defaults to Manager for demo testing, switchable to Customer/Barista
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [stationLoads, setStationLoads] = useState<StationLoad[]>([]);
  const [recommendations, setRecommendations] = useState<ScoredRecommendation[]>([]);
  const [quickPickup, setQuickPickup] = useState<ScoredRecommendation[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [errorBanner, setErrorBanner] = useState<string | null>(null);

  const loadAllData = async () => {
    try {
      setIsRefreshing(true);
      setErrorBanner(null);
      const [menuData, recData, ordersData] = await Promise.all([
        fetchMenu(),
        fetchRecommendations(),
        fetchKdsOrders()
      ]);

      setMenu(menuData);
      setRecommendations(recData.recommendations);
      setQuickPickup(recData.quickPickup);
      setStationLoads(recData.stationLoads);
      setOrders(ordersData);
    } catch (err: unknown) {
      console.error('Failed to load initial cafe state:', err);
      setErrorBanner((err as Error).message || 'Failed to connect to cafe engine');
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadAllData();

    // Polling interval to keep queues and ticket aging fresh every 6s
    const timer = setInterval(() => {
      fetchRecommendations().then(rec => {
        setStationLoads(rec.stationLoads);
        setRecommendations(rec.recommendations);
        setQuickPickup(rec.quickPickup);
      }).catch(() => {});

      fetchKdsOrders().then(ords => {
        setOrders(ords);
      }).catch(() => {});
    }, 6000);

    return () => clearInterval(timer);
  }, []);

  const handleUpdateOrderStatus = async (orderId: string, nextStatus: OrderStatus) => {
    try {
      const updated = await updateOrderStatus(orderId, nextStatus);
      setOrders(prev => prev.map(o => o.id === updated.id ? updated : o));

      // Refresh station backlogs
      const loads = await fetchStationLoads();
      setStationLoads(loads);
    } catch (err: unknown) {
      alert(`Status update error: ${(err as Error).message}`);
    }
  };

  const handleSimulateRush = async () => {
    try {
      await triggerSimulatedRush();
      await loadAllData();
    } catch (err: unknown) {
      alert(`Rush simulation error: ${(err as Error).message}`);
    }
  };

  const handleClearQueue = async () => {
    try {
      await triggerClearQueue();
      await loadAllData();
    } catch (err: unknown) {
      alert(`Clear queue error: ${(err as Error).message}`);
    }
  };

  const handleOrderPlaced = (newOrder: Order) => {
    setOrders(prev => [newOrder, ...prev]);
    // Immediately reload recommendations to re-penalize the saturated station
    fetchRecommendations().then(rec => {
      setStationLoads(rec.stationLoads);
      setRecommendations(rec.recommendations);
      setQuickPickup(rec.quickPickup);
    }).catch(() => {});
  };

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col font-sans selection:bg-amber-500 selection:text-stone-950">
      {/* 1. Global Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        userRole={userRole}
        setUserRole={setUserRole}
        stationLoads={stationLoads}
        onRefresh={loadAllData}
        isRefreshing={isRefreshing}
      />

      {/* 2. Global Ticker Bar */}
      <QuickStatsBar
        stationLoads={stationLoads}
        userRole={userRole}
        onSimulateRush={handleSimulateRush}
        onClearQueue={handleClearQueue}
      />

      {/* 3. Error Banner */}
      {errorBanner && (
        <div className="bg-rose-900/50 border-b border-rose-700/50 p-3 text-center text-xs text-rose-200">
          <span>{errorBanner}</span>
          <button onClick={loadAllData} className="ml-3 underline font-bold">Retry</button>
        </div>
      )}

      {/* 4. Active View Content */}
      <main className="flex-1">
        {activeTab === 'CUSTOMER' && (
          <CustomerView
            menu={menu}
            stationLoads={stationLoads}
            recommendations={recommendations}
            quickPickup={quickPickup}
            onOrderPlaced={handleOrderPlaced}
          />
        )}

        {activeTab === 'KDS' && (
          <KdsBoard
            stationLoads={stationLoads}
            orders={orders}
            onUpdateStatus={handleUpdateOrderStatus}
            onSimulateRush={handleSimulateRush}
            onClearQueue={handleClearQueue}
            onRefresh={loadAllData}
            isRefreshing={isRefreshing}
          />
        )}

        {activeTab === 'SIMULATION' && (
          <SimulationDashboard stationLoads={stationLoads} />
        )}
      </main>
    </div>
  );
}
