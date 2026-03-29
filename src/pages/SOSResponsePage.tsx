import { useState } from "react";
import { useDisasterStore } from "../store/disasterStore";
import SOSButton from "../components/SOSButton";

export default function SOSResponsePage() {
  const { sosPins, setMapCenter } = useDisasterStore();
  const [selectedSOS, setSelectedSOS] = useState<string | null>(null);
  const [responseStatus, setResponseStatus] = useState<Record<string, string>>({});

  const handleViewOnMap = (latitude: number, longitude: number) => {
    setMapCenter([latitude, longitude]);
  };

  const handleToggleResponse = (sosId: string) => {
    setResponseStatus((prev) => ({
      ...prev,
      [sosId]: prev[sosId] === "responding" ? "resolved" : "responding",
    }));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "responding":
        return "bg-blue-600/20 text-blue-400";
      case "resolved":
        return "bg-green-600/20 text-green-400";
      default:
        return "bg-red-600/20 text-red-400";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "responding":
        return "Responding";
      case "resolved":
        return "Resolved";
      default:
        return "Urgent";
    }
  };

  return (
    <div className="w-full flex flex-col">
      {/* Header */}
      <div className="p-4 bg-slate-900/50 border-b border-slate-800 shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-red-600 mb-1">
              🆘 SOS Response Management
            </h2>
            <p className="text-gray-400">
              {sosPins.length === 0
                ? "No active SOS calls"
                : `${sosPins.length} active SOS call${sosPins.length > 1 ? "s" : ""} requiring dispatch`}
            </p>
          </div>
          <div className="text-right">
            <div className="text-4xl font-bold text-red-500">{sosPins.length}</div>
            <p className="text-xs text-gray-500">Active Calls</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 shrink-0 bg-slate-900/30">
        <button className="bg-slate-800 rounded-lg border border-slate-700 p-4 hover:border-red-500/50 transition-colors text-left">
          <p className="text-gray-400 text-sm mb-2">Emergency Dispatch</p>
          <p className="text-2xl font-bold text-red-500">
            {Math.floor(Math.random() * 5) + 1}
          </p>
          <p className="text-xs text-gray-500 mt-1">Units Available</p>
        </button>

        <button className="bg-slate-800 rounded-lg border border-slate-700 p-4 hover:border-orange-500/50 transition-colors text-left">
          <p className="text-gray-400 text-sm mb-2">Response Time</p>
          <p className="text-2xl font-bold text-orange-500">4.2 min</p>
          <p className="text-xs text-gray-500 mt-1">Average</p>
        </button>

        <button className="bg-slate-800 rounded-lg border border-slate-700 p-4 hover:border-green-500/50 transition-colors text-left">
          <p className="text-gray-400 text-sm mb-2">Success Rate</p>
          <p className="text-2xl font-bold text-green-500">98%</p>
          <p className="text-xs text-gray-500 mt-1">This Month</p>
        </button>
      </div>

      {/* SOS Calls List */}
      <div className="p-4 flex-1">
        <div className="rounded-lg border border-slate-700 bg-slate-900">
          {sosPins.length === 0 ? (
            <div className="h-64 flex items-center justify-center">
              <div className="text-center">
                <p className="text-6xl mb-4">🔕</p>
                <p className="text-xl font-semibold text-gray-400">No Active SOS Calls</p>
                <p className="text-gray-500 mt-2">
                  Emergency calls will appear here
                </p>
              </div>
            </div>
          ) : (
            <div className="p-4 space-y-4">
              {sosPins.map((sos, index) => (
                <div
                  key={sos.id}
                  onClick={() =>
                    setSelectedSOS(selectedSOS === sos.id ? null : sos.id)
                  }
                  className={`bg-slate-800 rounded-lg border-2 p-4 cursor-pointer transition-all ${
                    selectedSOS === sos.id
                      ? "border-red-500 shadow-lg shadow-red-500/20"
                      : "border-slate-700 hover:border-red-500/50"
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start gap-3">
                      <div className="text-2xl">🆘</div>
                      <div>
                        <p className="font-bold text-red-500">SOS Call #{index + 1}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(sos.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(
                        responseStatus[sos.id] || "urgent"
                      )}`}
                    >
                      {getStatusLabel(responseStatus[sos.id] || "urgent")}
                    </span>
                  </div>

                  {selectedSOS === sos.id && (
                    <div className="mt-4 pt-4 border-t border-slate-700 space-y-3">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs text-gray-400 mb-1">Latitude</p>
                          <p className="font-semibold text-gray-200">
                            {sos.latitude.toFixed(4)}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-400 mb-1">Longitude</p>
                          <p className="font-semibold text-gray-200">
                            {sos.longitude.toFixed(4)}
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() =>
                            handleViewOnMap(sos.latitude, sos.longitude)
                          }
                          className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold text-sm"
                        >
                          View on Map
                        </button>
                        <button
                          onClick={() => handleToggleResponse(sos.id)}
                          className={`flex-1 px-3 py-2 rounded-lg transition-colors font-semibold text-sm ${
                            responseStatus[sos.id] === "responding"
                              ? "bg-green-600 text-white hover:bg-green-700"
                              : "bg-orange-600 text-white hover:bg-orange-700"
                          }`}
                        >
                          {responseStatus[sos.id] === "responding"
                            ? "Mark Resolved"
                            : "Dispatch Response"}
                        </button>
                      </div>

                      <div className="text-xs text-gray-400 bg-slate-700/50 rounded p-2">
                        <p>📍 Location: Latitude {sos.latitude.toFixed(2)}°, Longitude {sos.longitude.toFixed(2)}°</p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Emergency Button in Page */}
      <div className="p-4 bg-slate-900/30 border-t border-slate-800 shrink-0">
        <div className="bg-slate-800 rounded-lg border border-slate-700 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-gray-200">Need to Send Emergency?</p>
              <p className="text-xs text-gray-500 mt-1">
                Click the SOS button or use the button below
              </p>
            </div>
            <SOSButton />
          </div>
        </div>
      </div>

      {/* Response Log */}
      <div className="p-4 bg-slate-900/30 border-t border-slate-800 shrink-0">
        <div className="bg-slate-800 rounded-lg border border-slate-700 p-4">
          <p className="font-semibold text-gray-200 mb-2">📋 Response Log</p>
          <div className="text-xs text-gray-400 space-y-1 max-h-20 overflow-y-auto">
            <p>✓ SOS Call #{Math.floor(Math.random() * 100)} responded</p>
            <p>✓ Dispatch unit EMS-5 deployed</p>
            <p>✓ Communication established with caller</p>
            <p>✓ Evacuation route calculated</p>
            <p>⏳ Awaiting confirmation...</p>
          </div>
        </div>
      </div>
    </div>
  );
}
