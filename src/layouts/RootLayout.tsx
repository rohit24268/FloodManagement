import { Outlet } from "react-router-dom";
import Navigation from "../components/Navigation/Navigation.tsx";
import { useDisasterStore } from "../store/disasterStore";

export default function RootLayout() {
  const { alerts, sosPins } = useDisasterStore();

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-gray-100">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-linear-to-r from-slate-900 to-slate-800 border-b border-amber-500/20 p-4 shrink-0">
        <div className="max-w-full flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-amber-500">
              🚨 Disaster Response & Flood Prediction Dashboard
            </h1>
            <p className="text-gray-400 mt-1">
              Real-time monitoring system for flood and landslide risk assessment
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm text-gray-400">System Status</p>
              <p className="text-lg font-semibold text-green-400">ACTIVE</p>
            </div>
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <div className="sticky top-28 z-20 bg-slate-900/95 backdrop-blur border-b border-slate-700">
        <Navigation />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <Outlet />
      </div>

      {/* SOS Button - Fixed Position */}
      {sosPins.length > 0 && (
        <div className="fixed bottom-24 right-6 z-40 bg-red-600 text-white px-4 py-2 rounded-lg">
          <p className="font-semibold">{sosPins.length} Active SOS Calls</p>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-700 p-4 shrink-0">
        <div className="text-center text-sm text-gray-500">
          <p>
            Disaster Response System | Last updated:{" "}
            {new Date().toLocaleTimeString()} | Alerts: {alerts.length} | SOS
            Calls: {sosPins.length}
          </p>
        </div>
      </footer>
    </div>
  );
}
