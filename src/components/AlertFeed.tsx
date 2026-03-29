import { ChevronLeft, ChevronRight, Trash2 } from "lucide-react";
import AlertCard from "./AlertCard";
import { useDisasterStore } from "../store/disasterStore";
import type { Alert } from "../types/disaster";

interface AlertFeedProps {
  alerts: Alert[];
  onAlertSelect: (alert: Alert) => void;
  onAlertClose: (alertId: string) => void;
}

export default function AlertFeed({
  alerts,
  onAlertSelect,
  onAlertClose,
}: AlertFeedProps) {
  const { isSidebarOpen, toggleSidebar, selectedAlert } = useDisasterStore();

  const criticalAlerts = alerts.filter((a) => a.severity === "critical");
  const highAlerts = alerts.filter((a) => a.severity === "high");
  const otherAlerts = alerts.filter((a) => a.severity !== "critical" && a.severity !== "high");

  return (
    <>
      {/* Sidebar */}
      <div
        className={`
          fixed left-0 top-0 bottom-0 w-80 bg-slate-900 border-r border-slate-700
          transform transition-transform duration-300 z-40 overflow-hidden flex flex-col
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Header */}
        <div className="p-4 border-b border-slate-700 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-amber-500">ALERT FEED</h2>
            <p className="text-xs text-slate-400 mt-1">Real-time Threat Updates</p>
          </div>
          <button
            onClick={toggleSidebar}
            className="p-2 rounded hover:bg-slate-800 transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-slate-300" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {alerts.length === 0 ? (
            <div className="flex items-center justify-center h-full text-slate-400 text-sm">
              <p>No active alerts</p>
            </div>
          ) : (
            <>
              {/* Critical Alerts */}
              {criticalAlerts.length > 0 && (
                <div>
                  <h3 className="text-xs font-bold text-red-500 mb-2 uppercase tracking-wider">
                    Critical ({criticalAlerts.length})
                  </h3>
                  <div className="space-y-2">
                    {criticalAlerts.map((alert) => (
                      <AlertCard
                        key={alert.id}
                        alert={alert}
                        onClose={onAlertClose}
                        isSelected={selectedAlert?.id === alert.id}
                        onClick={() => onAlertSelect(alert)}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* High Alerts */}
              {highAlerts.length > 0 && (
                <div>
                  <h3 className="text-xs font-bold text-orange-500 mb-2 uppercase tracking-wider">
                    High ({highAlerts.length})
                  </h3>
                  <div className="space-y-2">
                    {highAlerts.map((alert) => (
                      <AlertCard
                        key={alert.id}
                        alert={alert}
                        onClose={onAlertClose}
                        isSelected={selectedAlert?.id === alert.id}
                        onClick={() => onAlertSelect(alert)}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Other Alerts */}
              {otherAlerts.length > 0 && (
                <div>
                  <h3 className="text-xs font-bold text-yellow-600 mb-2 uppercase tracking-wider">
                    Other ({otherAlerts.length})
                  </h3>
                  <div className="space-y-2">
                    {otherAlerts.map((alert) => (
                      <AlertCard
                        key={alert.id}
                        alert={alert}
                        onClose={onAlertClose}
                        isSelected={selectedAlert?.id === alert.id}
                        onClick={() => onAlertSelect(alert)}
                      />
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        {alerts.length > 0 && (
          <div className="p-4 border-t border-slate-700 flex gap-2">
            <button className="flex-1 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm rounded transition-colors flex items-center justify-center gap-2">
              <Trash2 className="w-4 h-4" />
              Clear All
            </button>
          </div>
        )}
      </div>

      {/* Toggle Button */}
      {!isSidebarOpen && (
        <button
          onClick={toggleSidebar}
          className="fixed left-0 top-4 z-30 p-2 bg-slate-900 rounded-r-lg border border-l-0 border-slate-700 hover:bg-slate-800 transition-colors"
        >
          <ChevronRight className="w-5 h-5 text-slate-300" />
        </button>
      )}
    </>
  );
}
