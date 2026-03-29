import { useEffect, useState } from "react";
import { useDisasterStore } from "../store/disasterStore";
import { fetchWeatherData, getMockWeatherData } from "../services/weatherService";
import { calculateDisasterRisk } from "../utils/disasterCalculations";
import Map from "../components/Map";
import MediaController from "../components/MediaController";
import SOSButton from "../components/SOSButton";
import type { DisasterData } from "../types/disaster";

export default function MapPage() {
  const { currentTimeStep, setCurrentTimeStep, sosPins, demoMode } = useDisasterStore();
  const [riskData, setRiskData] = useState<DisasterData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const generateDisasterData = async () => {
      try {
        let weatherData = null;
        
        if (demoMode) {
          weatherData = getMockWeatherData(17.6601, 75.9064);
        } else {
          weatherData = await fetchWeatherData(17.6601, 75.9064);
        }

        const now = Date.now();
        const mockRiskData: DisasterData[] = Array.from({ length: 12 }, () => {
          let rainfall: number;
          let slope: number;
          let soilSaturation: number;

          if (demoMode) {
            rainfall = Math.random() * 0.8;
            slope = Math.random() * 0.6;
            soilSaturation = Math.random() * 0.9;
          } else {
            rainfall = weatherData?.rainfall || Math.random() * 0.5;
            slope = 0.3 + Math.random() * 0.3;
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
        setLoading(false);
      } catch (error) {
        console.error("Error generating disaster data:", error);
        setLoading(false);
      }
    };

    generateDisasterData();
    const interval = setInterval(generateDisasterData, 30000);

    return () => clearInterval(interval);
  }, [demoMode]);

  return (
    <div className="w-full flex flex-col">
      {/* Map Container */}
      {loading ? (
        <div className="w-full h-96 bg-slate-900 rounded-lg border border-slate-700 flex items-center justify-center m-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-amber-500 mx-auto mb-4"></div>
            <p>Loading map data...</p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-4 p-4">
          <div className="w-full h-96 rounded-lg overflow-hidden border border-slate-700 shadow-lg">
            <Map
              riskData={riskData}
              sosPins={sosPins}
              currentTimeStep={currentTimeStep}
            />
          </div>

          {/* Timeline/Media Controller */}
          <div className="bg-slate-900 rounded-lg border border-slate-700 p-4 shrink-0">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-amber-500">📹 Flood Spread Timeline</h3>
                <p className="text-sm text-gray-400">
                  12-hour flood prediction forecast
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-blue-400">
                  {currentTimeStep}h
                </p>
                <p className="text-xs text-gray-500">
                  {new Date(Date.now() + currentTimeStep * 3600000).toLocaleTimeString()}
                </p>
              </div>
            </div>
            <MediaController
              maxTimeSteps={12}
              onTimeStepChange={setCurrentTimeStep}
            />
          </div>

          {/* Legend and Info */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-slate-800 rounded-lg p-3 border border-slate-700">
              <p className="text-xs text-gray-400">Critical Risk</p>
              <div className="flex items-center gap-2 mt-2">
                <div className="w-4 h-4 bg-red-600 rounded"></div>
                <p className="font-semibold text-red-400">&gt; 85%</p>
              </div>
            </div>
            <div className="bg-slate-800 rounded-lg p-3 border border-slate-700">
              <p className="text-xs text-gray-400">High Risk</p>
              <div className="flex items-center gap-2 mt-2">
                <div className="w-4 h-4 bg-yellow-600 rounded"></div>
                <p className="font-semibold text-yellow-400">70-85%</p>
              </div>
            </div>
            <div className="bg-slate-800 rounded-lg p-3 border border-slate-700">
              <p className="text-xs text-gray-400">Medium Risk</p>
              <div className="flex items-center gap-2 mt-2">
                <div className="w-4 h-4 bg-orange-600 rounded"></div>
                <p className="font-semibold text-orange-400">50-70%</p>
              </div>
            </div>
            <div className="bg-slate-800 rounded-lg p-3 border border-slate-700">
              <p className="text-xs text-gray-400">Low Risk</p>
              <div className="flex items-center gap-2 mt-2">
                <div className="w-4 h-4 bg-green-600 rounded"></div>
                <p className="font-semibold text-green-400">&lt; 50%</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SOS Button */}
      <div className="fixed bottom-24 right-6 z-50">
        <SOSButton />
      </div>
    </div>
  );
}
