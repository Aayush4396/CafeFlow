import React from 'react';
import { Coffee, MonitorDot, Activity, RefreshCw, Shield, User, ChefHat, BarChart3 } from 'lucide-react';
import { StationLoad } from '../../api/types.ts';

export type ActiveTab = 'CUSTOMER' | 'KDS' | 'SIMULATION';
export type UserRole = 'CUSTOMER' | 'BARISTA' | 'MANAGER';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  stationLoads: StationLoad[];
  onRefresh: () => void;
  isRefreshing: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  userRole,
  setUserRole,
  stationLoads,
  onRefresh,
  isRefreshing
}) => {
  const congestedStation = stationLoads.find(s => s.status === 'CONGESTED');

  const handleRoleChange = (newRole: UserRole) => {
    setUserRole(newRole);
    // If switching to customer, enforce customer view
    if (newRole === 'CUSTOMER') {
      setActiveTab('CUSTOMER');
    } else if (newRole === 'BARISTA' && activeTab === 'SIMULATION') {
      setActiveTab('KDS');
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-stone-900 border-b border-stone-800 text-stone-100 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 to-amber-400 flex items-center justify-center text-stone-950 shadow-inner">
              <Coffee className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold tracking-tight text-lg text-white">CafeFlow</span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  Smart Cafe Assistant
                </span>
              </div>
              <p className="text-xs text-stone-400 hidden sm:block">Automated Kitchen Balancing & Queue Smoother</p>
            </div>
          </div>

          {/* Role-Guarded Navigation Tabs */}
          <nav className="flex items-center gap-1 sm:gap-2 bg-stone-950 p-1.5 rounded-xl border border-stone-800">
            {/* Always accessible to all roles */}
            <button
              onClick={() => setActiveTab('CUSTOMER')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'CUSTOMER'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-stone-400 hover:text-stone-200 hover:bg-stone-900'
              }`}
            >
              <Coffee className="w-4 h-4" />
              <span>Customer Menu</span>
            </button>

            {/* Barista KDS: Guarded for BARISTA & MANAGER only */}
            {(userRole === 'BARISTA' || userRole === 'MANAGER') && (
              <button
                onClick={() => setActiveTab('KDS')}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all relative ${
                  activeTab === 'KDS'
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'text-stone-400 hover:text-stone-200 hover:bg-stone-900'
                }`}
              >
                <MonitorDot className="w-4 h-4" />
                <span>Barista Station</span>
                {congestedStation && (
                  <span className="w-2 h-2 rounded-full bg-rose-500 absolute -top-0.5 -right-0.5 animate-pulse" />
                )}
              </button>
            )}

            {/* Simulation Dashboard: Guarded for MANAGER only */}
            {userRole === 'MANAGER' && (
              <button
                onClick={() => setActiveTab('SIMULATION')}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  activeTab === 'SIMULATION'
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'text-stone-400 hover:text-stone-200 hover:bg-stone-900'
                }`}
              >
                <Activity className="w-4 h-4" />
                <span>Rush & Traffic Planner</span>
              </button>
            )}
          </nav>

          {/* Right Section: RBAC Role Toggle & Refresh */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Role Permission Guard Switcher */}
            <div className="flex items-center gap-1.5 bg-stone-950 p-1 rounded-xl border border-stone-800 text-xs">
              <span className="text-[10px] uppercase font-bold text-stone-500 px-1.5 hidden md:inline">Role:</span>
              <button
                onClick={() => handleRoleChange('CUSTOMER')}
                title="Customer Mode (Public Menu View Only)"
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-medium transition ${
                  userRole === 'CUSTOMER'
                    ? 'bg-stone-800 text-amber-400 font-bold border border-amber-500/30'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                <User className="w-3 h-3" />
                <span>Customer</span>
              </button>

              <button
                onClick={() => handleRoleChange('BARISTA')}
                title="Barista Mode (Kitchen Display System Access)"
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-medium transition ${
                  userRole === 'BARISTA'
                    ? 'bg-stone-800 text-amber-400 font-bold border border-amber-500/30'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                <ChefHat className="w-3 h-3" />
                <span>Barista</span>
              </button>

              <button
                onClick={() => handleRoleChange('MANAGER')}
                title="Manager Mode (Simulator, Store Analytics & AI Advisor)"
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-medium transition ${
                  userRole === 'MANAGER'
                    ? 'bg-stone-800 text-amber-400 font-bold border border-amber-500/30'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                <BarChart3 className="w-3 h-3" />
                <span>Manager</span>
              </button>
            </div>

            <button
              onClick={onRefresh}
              disabled={isRefreshing}
              title="Sync Queue State"
              className="p-2 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white border border-stone-700 transition"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-amber-400' : ''}`} />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
