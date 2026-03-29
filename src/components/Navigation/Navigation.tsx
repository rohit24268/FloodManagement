import { Link, useLocation } from "react-router-dom";
import { useDisasterStore } from "../../store/disasterStore";

export default function Navigation() {
  const location = useLocation();
  const { alerts, sosPins, demoMode, toggleDemoMode } = useDisasterStore();

  const navItems = [
    { path: "/", label: "📊 Dashboard", icon: "📊" },
    { path: "/map", label: "🗺️ Map & Forecast", icon: "🗺️" },
    { path: "/alerts", label: "🚨 Active Alerts", badge: alerts.length },
    { path: "/statistics", label: "📈 Statistics", icon: "📈" },
    { path: "/sos-response", label: "🆘 SOS Response", badge: sosPins.length },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-slate-900/80 border-b border-slate-700 shrink-0">
      <div className="px-4 py-2">
        <div className="flex gap-1 flex-wrap justify-between items-center">
          <div className="flex gap-1 flex-wrap">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-4 py-2 font-semibold transition-all border-b-2 relative ${
                  isActive(item.path)
                    ? "text-amber-500 border-amber-500"
                    : "text-gray-400 border-transparent hover:text-gray-200 hover:border-gray-600"
                }`}
              >
                {item.label}
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                    {item.badge}
                  </span>
                )}
              </Link>
            ))}
          </div>
          <button
            onClick={toggleDemoMode}
            className={`px-4 py-2 font-semibold rounded-lg transition-all text-sm border-2 ${
              demoMode
                ? "bg-red-900/30 border-red-600 text-red-300 hover:bg-red-900/50"
                : "bg-green-900/30 border-green-600 text-green-300 hover:bg-green-900/50"
            }`}
          >
            {demoMode ? "🔴 Demo Mode" : "🟢 Real Data"}
          </button>
        </div>
      </div>
    </nav>
  );
}
