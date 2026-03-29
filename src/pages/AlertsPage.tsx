import { useDisasterStore } from "../store/disasterStore";
import AlertFeed from "../components/AlertFeed";
import type { Alert } from "../types/disaster";

export default function AlertsPage() {
  const { alerts, removeAlert } = useDisasterStore();

  const handleAlertSelect = (alert: Alert) => {
    console.log("Selected alert:", alert);
    // Can navigate to map with alert location
  };

  const handleAlertClose = (alertId: string) => {
    removeAlert(alertId);
  };

  return (
    <div className="w-full flex flex-col">
      {/* Alerts Header */}
      <div className="p-4 bg-slate-900/50 border-b border-slate-800 shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-red-500">🚨 Active Alerts</h2>
            <p className="text-gray-400 mt-1">
              {alerts.length === 0
                ? "No active alerts"
                : `${alerts.length} alert${alerts.length > 1 ? "s" : ""} requiring attention`}
            </p>
          </div>
          <div className="text-right">
            <div className="text-4xl font-bold text-red-400">{alerts.length}</div>
            <p className="text-xs text-gray-500">Total Active</p>
          </div>
        </div>
      </div>

      {/* Alert Statistics */}
      {alerts.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 shrink-0 bg-slate-900/30">
          <div className="bg-slate-800 rounded-lg border border-slate-700 p-4">
            <p className="text-xs text-gray-400 mb-2">Critical Alerts</p>
            <p className="text-2xl font-bold text-red-500">
              {alerts.filter((a) => a.severity === "critical").length}
            </p>
          </div>
          <div className="bg-slate-800 rounded-lg border border-slate-700 p-4">
            <p className="text-xs text-gray-400 mb-2">High Priority</p>
            <p className="text-2xl font-bold text-yellow-500">
              {alerts.filter((a) => a.severity === "high").length}
            </p>
          </div>
          <div className="bg-slate-800 rounded-lg border border-slate-700 p-4">
            <p className="text-xs text-gray-400 mb-2">Medium Priority</p>
            <p className="text-2xl font-bold text-orange-500">
              {alerts.filter((a) => a.severity === "medium").length}
            </p>
          </div>
        </div>
      )}

      {/* Alerts List */}
      <div className="p-4 flex-1">
        <div className="rounded-lg border border-slate-700 bg-slate-900">
          {alerts.length === 0 ? (
            <div className="h-64 flex items-center justify-center">
              <div className="text-center">
                <p className="text-6xl mb-4">✅</p>
                <p className="text-xl font-semibold text-green-400">All Clear</p>
                <p className="text-gray-400 mt-2">No active disaster alerts</p>
              </div>
            </div>
          ) : (
            <AlertFeed
              alerts={alerts}
              onAlertSelect={handleAlertSelect}
              onAlertClose={handleAlertClose}
            />
          )}
        </div>
      </div>

      {/* Filter/Action Panel */}
      {alerts.length > 0 && (
        <div className="p-4 bg-slate-900/30 border-t border-slate-800 shrink-0">
          <div className="bg-slate-800 rounded-lg border border-slate-700 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-300">
                  Last Alert: {new Date(alerts[0]?.timestamp || Date.now()).toLocaleTimeString()}
                </p>
              </div>
              <button
                onClick={() => {
                  alerts.forEach((alert) => removeAlert(alert.id));
                }}
                className="px-4 py-2 bg-red-600/20 text-red-400 rounded-lg hover:bg-red-600/30 transition-colors font-semibold"
              >
                Clear All Alerts
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
