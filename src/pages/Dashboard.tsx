import { useEffect, useState } from "react";
import { useDisasterStore } from "../store/disasterStore";
import { fetchWeatherData, getMockWeatherData } from "../services/weatherService";
import { calculateDisasterRisk } from "../utils/disasterCalculations";
import StatsCards from "../components/StatsCards";
import SOSButton from "../components/SOSButton";
import type { DisasterData, Alert } from "../types/disaster";

export default function Dashboard() {
  const { alerts, sosPins, addAlert, demoMode } = useDisasterStore();
  const [riskData, setRiskData] = useState<DisasterData[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    avgRainfall: 0,
    sosCount: 0,
    evacuationCenters: 0,
  });

  useEffect(() => {
    const generateDisasterData = async () => {
      try {
        let weatherData = null;
        
        if (demoMode) {
          // Use mock weather data in demo mode
          weatherData = getMockWeatherData(17.6601, 75.9064);
        } else {
          // Fetch real weather data from Open Meteo
          weatherData = await fetchWeatherData(17.6601, 75.9064);
        }

        const now = Date.now();
        const mockRiskData: DisasterData[] = Array.from({ length: 8 }, () => {
          let rainfall: number;
          let slope: number;
          let soilSaturation: number;

          if (demoMode) {
            // Use random demo data
            rainfall = Math.random() * 0.8;
            slope = Math.random() * 0.6;
            soilSaturation = Math.random() * 0.9;
          } else {
            // Use real weather data with some variation
            rainfall = weatherData?.rainfall || Math.random() * 0.5;
            slope = 0.3 + Math.random() * 0.3; // Typical slope for Solapur region
            soilSaturation = (weatherData?.humidity || Math.random()) * 0.8;
          }

          const riskScore = calculateDisasterRisk(rainfall, slope, soilSaturation);

          let riskLevel: "low" | "medium" | "high" | "critical" = "low";
          if (riskScore > 0.85) riskLevel = "critical";
          else if (riskScore > 0.7) riskLevel = "high";
          else if (riskScore > 0.5) riskLevel = "medium";

          return {
            latitude: 17.6601 + (Math.random() - 0.5) * 0.4,
            longitude: 75.9064 + (Math.random() - 0.5) * 0.4,
            rainfall,
            slope,
            soilSaturation,
            riskScore,
            riskLevel,
            timestamp: now,
          };
        });

        setRiskData(mockRiskData);

        const avgRainfall =
          mockRiskData.reduce((sum, d) => sum + d.rainfall, 0) /
          mockRiskData.length;
        setStats({
          avgRainfall: Math.round(avgRainfall * 100),
          sosCount: sosPins.length,
          evacuationCenters: 5,
        });

        const highRiskAreas = mockRiskData.filter((d) => d.riskScore > 0.7);
        if (highRiskAreas.length > 0 && alerts.length === 0) {
          highRiskAreas.forEach((area, index) => {
            const newAlert: Alert = {
              id: `alert-${index}`,
              type: "flood",
              title: `High Risk - Sector ${index + 1}`,
              message: `High flood risk detected. Risk Score: ${(area.riskScore * 100).toFixed(1)}%`,
              severity: "high",
              latitude: area.latitude,
              longitude: area.longitude,
              timestamp: now,
              active: true,
            };
            addAlert(newAlert);
          });
        }

        setLoading(false);
      } catch (error) {
        console.error("Error generating disaster data:", error);
        setLoading(false);
      }
    };

    generateDisasterData();
    const interval = setInterval(generateDisasterData, 30000);

    return () => clearInterval(interval);
  }, [alerts.length, sosPins.length, addAlert, demoMode]);

  return (
    <div className="w-full flex flex-col">
      {/* Stats Section */}
      <div className="bg-slate-900/50 border-b border-slate-800 p-4 shrink-0">
        <div className="max-w-full">
          <StatsCards
            averageRainfall={stats.avgRainfall / 100}
            activeSOS={stats.sosCount}
            evacuationCenters={stats.evacuationCenters}
            highRiskAreas={riskData.filter((d) => d.riskScore > 0.7).length}
          />
        </div>
      </div>

      {/* Main Dashboard Content */}
      <div className="flex-1 p-6">
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {/* System Overview Card */}
          <div className="bg-slate-800 rounded-lg border border-slate-700 p-6 hover:border-amber-500/50 transition-colors">
            <h3 className="text-lg font-bold text-amber-500 mb-4">📡 System Overview</h3>
            <div className="space-y-2 text-sm">
              <p>
                <span className="text-gray-400">Status:</span>{" "}
                <span className="text-green-400 font-semibold">Operational</span>
              </p>
              <p>
                <span className="text-gray-400">Monitoring Points:</span>{" "}
                <span className="text-blue-400 font-semibold">{riskData.length}</span>
              </p>
              <p>
                <span className="text-gray-400">Risk Detection:</span>{" "}
                <span className="text-yellow-400 font-semibold">Active</span>
              </p>
              <p>
                <span className="text-gray-400">Last Update:</span>{" "}
                <span className="text-gray-300">{new Date().toLocaleTimeString()}</span>
              </p>
            </div>
          </div>

          {/* Active Alerts Card */}
          <div className="bg-slate-800 rounded-lg border border-slate-700 p-6 hover:border-red-500/50 transition-colors">
            <h3 className="text-lg font-bold text-red-500 mb-4">🚨 Active Alerts</h3>
            <div className="space-y-2">
              <p className="text-3xl font-bold text-red-400">{alerts.length}</p>
              <p className="text-gray-400 text-sm">
                {alerts.length === 0
                  ? "No active alerts"
                  : `${alerts.length} alert${alerts.length > 1 ? "s" : ""} requiring attention`}
              </p>
              <div className="mt-4 space-y-1">
                {alerts.slice(0, 3).map((alert) => (
                  <p key={alert.id} className="text-xs text-yellow-400">
                    • {alert.title}
                  </p>
                ))}
                {alerts.length > 3 && (
                  <p className="text-xs text-gray-500">+ {alerts.length - 3} more</p>
                )}
              </div>
            </div>
          </div>

          {/* Emergency Response Card */}
          <div className="bg-slate-800 rounded-lg border border-slate-700 p-6 hover:border-orange-500/50 transition-colors">
            <h3 className="text-lg font-bold text-orange-500 mb-4">🆘 Emergency Response</h3>
            <div className="space-y-2">
              <p className="text-3xl font-bold text-orange-400">{sosPins.length}</p>
              <p className="text-gray-400 text-sm">
                {sosPins.length === 0 ? "No SOS calls" : `Active SOS call${sosPins.length > 1 ? "s" : ""}`}
              </p>
              <div className="mt-4">
                <SOSButton />
              </div>
            </div>
          </div>

          {/* Risk Distribution Card */}
          <div className="bg-slate-800 rounded-lg border border-slate-700 p-6 hover:border-purple-500/50 transition-colors">
            <h3 className="text-lg font-bold text-purple-500 mb-4">📊 Risk Distribution</h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-400 mb-1">Critical Risk</p>
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div
                    className="bg-red-600 h-2 rounded-full"
                    style={{
                      width: `${(riskData.filter((d) => d.riskScore > 0.85).length / riskData.length) * 100 || 0}%`,
                    }}
                  ></div>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1">High Risk</p>
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div
                    className="bg-yellow-600 h-2 rounded-full"
                    style={{
                      width: `${(riskData.filter((d) => d.riskScore > 0.7 && d.riskScore <= 0.85).length / riskData.length) * 100 || 0}%`,
                    }}
                  ></div>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1">Medium Risk</p>
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div
                    className="bg-orange-600 h-2 rounded-full"
                    style={{
                      width: `${(riskData.filter((d) => d.riskScore > 0.5 && d.riskScore <= 0.7).length / riskData.length) * 100 || 0}%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Links Card */}
          <div className="bg-slate-800 rounded-lg border border-slate-700 p-6 hover:border-green-500/50 transition-colors">
            <h3 className="text-lg font-bold text-green-500 mb-4">🔗 Quick Links</h3>
            <div className="space-y-2">
              <a href="/map" className="block text-sm text-blue-400 hover:text-blue-300">
                → View Map
              </a>
              <a href="/alerts" className="block text-sm text-yellow-400 hover:text-yellow-300">
                → View Alerts
              </a>
              <a href="/statistics" className="block text-sm text-purple-400 hover:text-purple-300">
                → View Statistics
              </a>
              <a href="/sos-response" className="block text-sm text-red-400 hover:text-red-300">
                → SOS Response
              </a>
            </div>
          </div>

          {/* Weather Data Card */}
          <div className="bg-slate-800 rounded-lg border border-slate-700 p-6 hover:border-blue-500/50 transition-colors">
            <h3 className="text-lg font-bold text-blue-500 mb-4">🌡️ Weather Data</h3>
            <div className="space-y-2 text-sm">
              <p>
                <span className="text-gray-400">Average Rainfall:</span>{" "}
                <span className="text-cyan-400 font-semibold">{stats.avgRainfall / 100} mm</span>
              </p>
              <p>
                <span className="text-gray-400">Evacuation Centers:</span>{" "}
                <span className="text-lime-400 font-semibold">{stats.evacuationCenters}</span>
              </p>
              <p>
                <span className="text-gray-400">Location:</span>{" "}
                <span className="text-indigo-400">Solapur, Maharashtra</span>
              </p>
              <p>
                <span className="text-gray-400">Coverage:</span>{" "}
                <span className="text-violet-400">0.4° radius</span>
              </p>
            </div>
          </div>
        </div>

        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-amber-500 mx-auto mb-4"></div>
              <p>Loading disaster data...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
