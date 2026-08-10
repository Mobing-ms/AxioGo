import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useWorkspace } from '../../context/WorkspaceContext';
import { RoleBadge } from '../common/RoleBadge';
import { FLEET_KPIS, TELEMETRY_ACTIVITY_DATA, AI_INSIGHT_CARDS } from '../../services/analyticsService';
import {
  Truck,
  Users,
  Wrench,
  ShieldAlert,
  Bot,
  ArrowRight,
  RefreshCw,
  Activity,
  CheckCircle2,
  AlertTriangle,
  Layers,
  Sparkles
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export const DashboardView = ({ setActivePage }) => {
  const { currentRole } = useAuth();
  const { activeWorkspace, activeFilters, setActiveFilters } = useWorkspace();

  const iconMap = {
    Truck: Truck,
    Users: Users,
    Wrench: Wrench,
    ShieldAlert: ShieldAlert
  };

  return (
    <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto font-mono text-left">

      {/* Command Center Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8 pb-6 border-b border-axio-border">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-axio-green animate-pulse" />
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-wide">
              AUTOMOTIVE COMMAND CENTER
            </h1>
            <RoleBadge role={currentRole} />
          </div>
          <p className="text-xs text-axio-text-secondary">
            Workspace: <span className="text-white font-semibold">{activeWorkspace}</span> | Status: <span className="text-axio-green">Databricks Synced</span>
          </p>
        </div>

        {/* Global Filter Bar */}
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={activeFilters.dateRange}
            onChange={(e) => setActiveFilters(prev => ({ ...prev, dateRange: e.target.value }))}
            className="bg-axio-panel border border-axio-border rounded px-3 py-1.5 text-xs text-white focus:outline-none"
          >
            <option>Last 24 Hours</option>
            <option>Last 7 Days</option>
            <option>Last 30 Days</option>
            <option>Q3 YTD</option>
          </select>

          <select
            value={activeFilters.vehicleGroup}
            onChange={(e) => setActiveFilters(prev => ({ ...prev, vehicleGroup: e.target.value }))}
            className="bg-axio-panel border border-axio-border rounded px-3 py-1.5 text-xs text-white focus:outline-none"
          >
            <option>All Vehicle Groups</option>
            <option>Vehicle Group A (Heavy Transport)</option>
            <option>Vehicle Group B (Regional Freight)</option>
            <option>Vehicle Group C (Last-Mile Delivery)</option>
          </select>

          <button
            onClick={() => setActivePage('axis')}
            className="flex items-center gap-1.5 px-4 py-1.5 bg-axio-red hover:bg-red-600 text-white rounded font-bold text-xs transition-colors shadow-md shadow-axio-red/20"
          >
            <Bot className="w-3.5 h-3.5" />
            <span>ASK AXIS</span>
          </button>
        </div>
      </div>

      {/* 4 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {FLEET_KPIS.map((kpi) => {
          const IconComp = iconMap[kpi.icon] || Truck;
          return (
            <div key={kpi.id} className="p-5 bg-axio-panel border border-axio-border hover:border-axio-border-bright rounded-lg relative overflow-hidden group">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] text-axio-muted uppercase tracking-wider font-semibold">
                  {kpi.title}
                </span>
                <div className="p-2 rounded bg-axio-card border border-axio-border text-axio-cyan group-hover:border-axio-cyan/18 transition-colors">
                  <IconComp className="w-4 h-4" />
                </div>
              </div>

              <div className="text-2xl font-black text-white mb-1 font-sans">{kpi.value}</div>

              <div className="flex items-center justify-between text-[10px]">
                <span className="text-axio-muted">{kpi.subtitle}</span>
                <span className={`font-bold ${kpi.positive ? 'text-axio-green' : 'text-axio-red'}`}>
                  {kpi.change}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Telemetry Chart & Side Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">

        {/* Main Chart Column */}
        <div className="lg:col-span-8 p-6 bg-axio-panel border border-axio-border rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Activity className="w-4 h-4 text-axio-cyan" />
                <span>FLEET TELEMETRY ACTIVITY & NETWORK LAG</span>
              </h2>
              <p className="text-[11px] text-axio-muted">Real-time IoT stream aggregated via Databricks Gold Layer</p>
            </div>
            <button
              onClick={() => setActivePage('analytics')}
              className="text-xs text-axio-cyan hover:underline flex items-center gap-1"
            >
              <span>DEEP ANALYTICS</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {/* Recharts Area Chart */}
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={TELEMETRY_ACTIVITY_DATA}>
                <defs>
                  <linearGradient id="gradUnits" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#20D6D2" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#20D6D2" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#202731" />
                <XAxis dataKey="time" stroke="#7F8B98" fontSize={11} />
                <YAxis stroke="#7F8B98" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: '#090C11', borderColor: '#202731', fontSize: '11px' }} />
                <Area type="monotone" dataKey="activeUnits" stroke="#20D6D2" fillOpacity={1} fill="url(#gradUnits)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Data Quality & System Health Side Panel */}
        <div className="lg:col-span-4 p-6 bg-axio-panel border border-axio-border rounded-lg flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-axio-green" />
              <span>DATA QUALITY & FRESHNESS</span>
            </h3>

            <div className="space-y-4">
              <div className="p-3 bg-axio-bg border border-axio-border rounded">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-axio-muted">OVERALL QUALITY SCORE</span>
                  <span className="text-axio-green font-bold">98.4%</span>
                </div>
                <div className="w-full bg-axio-card h-2 rounded-full overflow-hidden">
                  <div className="bg-axio-green h-full w-[98.4%]" />
                </div>
              </div>

              <div className="p-3 bg-axio-bg border border-axio-border rounded">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-axio-muted">TELEMETRY STREAM LAG</span>
                  <span className="text-axio-cyan font-bold">4.2 ms</span>
                </div>
                <div className="w-full bg-axio-card h-2 rounded-full overflow-hidden">
                  <div className="bg-axio-cyan h-full w-[94%]" />
                </div>
              </div>

              <div className="p-3 bg-axio-bg border border-axio-border rounded">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-axio-muted">UNITY CATALOG SYNC</span>
                  <span className="text-white font-bold">OPTIMAL</span>
                </div>
                <span className="text-[10px] text-axio-muted">Last verified 2 minutes ago</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setActivePage('axis')}
            className="w-full mt-4 py-2.5 bg-axio-card hover:bg-axio-hover border border-axio-red/18 hover:border-axio-red text-white text-xs font-bold rounded flex items-center justify-center gap-2 transition-all"
          >
            <Bot className="w-4 h-4 text-axio-red" />
            <span>ANALYZE WITH AXIS</span>
          </button>
        </div>

      </div>

      {/* AI Insights Showcase Cards */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-axio-red" />
            <span>AXIS DETECTED FLEET INSIGHTS</span>
          </h3>
          <span className="text-[10px] text-axio-muted">AUTOMATICALLY SYNTHESIZED BY ANALYTICS AGENT</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {AI_INSIGHT_CARDS.map((ins) => (
            <div key={ins.id} className="p-5 bg-axio-panel border border-axio-border rounded-lg text-left">
              <div className="flex items-center justify-between mb-2">
                <span className={`text-[9px] px-2 py-0.5 rounded font-bold border ${ins.severity === 'HIGH' ? 'bg-axio-red/10 border-axio-red/15 text-axio-red' :
                    ins.severity === 'MEDIUM' ? 'bg-amber-500/10 border-amber-500/15 text-amber-400' :
                      'bg-axio-green/10 border-axio-green/15 text-axio-green'
                  }`}>
                  {ins.severity} PRIORITY
                </span>
                <span className="text-[10px] text-axio-muted">{ins.domain}</span>
              </div>

              <h4 className="font-bold text-xs text-white mb-2 font-sans">{ins.title}</h4>
              <p className="text-[11px] text-axio-text-secondary leading-relaxed mb-3 font-sans">{ins.description}</p>

              <div className="pt-3 border-t border-axio-border flex items-center justify-between text-[10px]">
                <span className="text-axio-muted truncate max-w-[180px]">{ins.suggestedAction}</span>
                <button onClick={() => setActivePage('axis')} className="text-axio-cyan font-bold hover:underline">
                  ASK AXIS →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
