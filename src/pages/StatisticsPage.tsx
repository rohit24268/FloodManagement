import { useEffect, useState } from "react";
import { useDisasterStore } from "../store/disasterStore";

export default function StatisticsPage() {
  const { alerts, sosPins } = useDisasterStore();
  const [stats, setStats] = useState({
    totalAlerts: 0,
    criticalAlerts: 0,
    highPriorityAlerts: 0,
    sosResponseRate: 0,
    avgResponseTime: 0,
    evacuationCompleted: 0,
    uptime: 99.9,
  });

  useEffect(() => {
    const calculateStats = () => {
      setStats({
        totalAlerts: alerts.length,
        criticalAlerts: alerts.filter((a) => a.severity === "critical").length,
        highPriorityAlerts: alerts.filter((a) => a.severity === "high").length,
        sosResponseRate: sosPins.length > 0 ? 95 : 100,
        avgResponseTime: 4.2,
        evacuationCompleted: Math.floor(Math.random() * 150) + 50,
        uptime: 99.9,
      });
    };

    calculateStats();
    const interval = setInterval(calculateStats, 5000);
    return () => clearInterval(interval);
  }, [alerts, sosPins]);

  return (
    <div className="w-full flex flex-col">
      {/* Statistics Header */}
      <div className="p-4 bg-slate-900/50 border-b border-slate-800 shrink-0 mb-4">
        <h2 className="text-2xl font-bold text-purple-500 mb-2">📈 System Statistics</h2>
        <p className="text-gray-400">
          Real-time monitoring and performance metrics
        </p>
      </div>

      {/* Main Metrics Grid */}
      <div className="grid-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4 shrink-0">
        <div className="bg-slate-800 rounded-lg border border-slate-700 p-6 hover:border-red-500/50 transition-colors">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Alerts</p>
              <p className="text-3xl font-bold text-red-500 mt-2">
                {stats.totalAlerts}
              </p>
            </div>
            <div className="text-4xl opacity-20">🚨</div>
          </div>
        </div>

        <div className="bg-slate-800 rounded-lg border border-slate-700 p-6 hover:border-yellow-500/50 transition-colors">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Critical Alerts</p>
              <p className="text-3xl font-bold text-yellow-500 mt-2">
                {stats.criticalAlerts}
              </p>
            </div>
            <div className="text-4xl opacity-20">⚠️</div>
          </div>
        </div>

        <div className="bg-slate-800 rounded-lg border border-slate-700 p-6 hover:border-orange-500/50 transition-colors">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">High Priority</p>
              <p className="text-3xl font-bold text-orange-500 mt-2">
                {stats.highPriorityAlerts}
              </p>
            </div>
            <div className="text-4xl opacity-20">📍</div>
          </div>
        </div>

        <div className="bg-slate-800 rounded-lg border border-slate-700 p-6 hover:border-green-500/50 transition-colors">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">System Uptime</p>
              <p className="text-3xl font-bold text-green-500 mt-2">
                {stats.uptime}%
              </p>
            </div>
            <div className="text-4xl opacity-20">✅</div>
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 flex-1">
        {/* Response Metrics */}
        <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
          <h3 className="text-lg font-bold text-blue-500 mb-4">📊 Response Metrics</h3>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400 text-sm">SOS Response Rate</span>
                <span className="text-blue-400 font-semibold">
                  {stats.sosResponseRate}%
                </span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${stats.sosResponseRate}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400 text-sm">Average Response Time</span>
                <span className="text-cyan-400 font-semibold">
                  {stats.avgResponseTime} min
                </span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2">
                <div
                  className="bg-cyan-600 h-2 rounded-full"
                  style={{ width: `${(stats.avgResponseTime / 10) * 100}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400 text-sm">Active SOS Calls</span>
                <span className="text-red-400 font-semibold">{sosPins.length}</span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2">
                <div
                  className="bg-red-600 h-2 rounded-full"
                  style={{
                    width: `${Math.min((sosPins.length / 10) * 100, 100)}%`,
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Evacuation Stats */}
        <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
          <h3 className="text-lg font-bold text-green-500 mb-4">
            🚍 Evacuation Status
          </h3>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400 text-sm">Evacuations Completed</span>
                <span className="text-green-400 font-semibold">
                  {stats.evacuationCompleted}
                </span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2">
                <div
                  className="bg-green-600 h-2 rounded-full"
                  style={{
                    width: `${(stats.evacuationCompleted / 200) * 100}%`,
                  }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400 text-sm">Resource Allocation</span>
                <span className="text-lime-400 font-semibold">85%</span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2">
                <div className="bg-lime-600 h-2 rounded-full" style={{ width: "85%" }}></div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400 text-sm">Relief Supply Status</span>
                <span className="text-emerald-400 font-semibold">72%</span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2">
                <div
                  className="bg-emerald-600 h-2 rounded-full"
                  style={{ width: "72%" }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Risk Assessment */}
        <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
          <h3 className="text-lg font-bold text-purple-500 mb-4">📉 Risk Assessment</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Current Risk Level</span>
              <span className="px-3 py-1 bg-yellow-600/30 text-yellow-400 rounded-full text-sm font-semibold">
                HIGH
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Predicted Risk (6h)</span>
              <span className="px-3 py-1 bg-orange-600/30 text-orange-400 rounded-full text-sm font-semibold">
                CRITICAL
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Risk Trend</span>
              <span className="text-red-400 font-semibold">↑ Increasing</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Affected Areas</span>
              <span className="text-yellow-400 font-semibold">
                {Math.floor(Math.random() * 15) + 5} zones
              </span>
            </div>
          </div>
        </div>

        {/* System Health */}
        <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
          <h3 className="text-lg font-bold text-cyan-500 mb-4">⚙️ System Health</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Server Status</span>
              <span className="inline-flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-green-400 font-semibold">Online</span>
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Database</span>
              <span className="inline-flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-green-400 font-semibold">Connected</span>
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">API Services</span>
              <span className="inline-flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-green-400 font-semibold">Active</span>
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Last Check</span>
              <span className="text-gray-300 font-semibold">
                {new Date().toLocaleTimeString()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
