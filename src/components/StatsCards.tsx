import React from "react";
import { Cloud, AlertTriangle, MapPin, TrendingUp } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  unit?: string;
  icon: React.ReactNode;
  status?: "normal" | "warning" | "critical";
  subtitle?: string;
}

function StatsCard({
  title,
  value,
  unit,
  icon,
  status = "normal",
  subtitle,
}: StatsCardProps) {
  const getStatusColor = () => {
    switch (status) {
      case "critical":
        return "bg-red-900 border-red-600";
      case "warning":
        return "bg-amber-900 border-amber-600";
      default:
        return "bg-slate-800 border-slate-600";
    }
  };

  return (
    <div
      className={`
        rounded-lg border p-4 flex items-start gap-3
        transition-all duration-200 hover:shadow-lg
        ${getStatusColor()}
      `}
    >
      <div className="p-2 rounded-lg bg-slate-700">{icon}</div>
      <div className="flex-1">
        <p className="text-xs font-semibold text-slate-300 uppercase tracking-wide">{title}</p>
        <div className="flex items-baseline gap-2 mt-2">
          <span className="text-2xl font-bold text-white">{value}</span>
          {unit && <span className="text-sm text-slate-400">{unit}</span>}
        </div>
        {subtitle && <p className="text-xs text-slate-400 mt-2">{subtitle}</p>}
      </div>
    </div>
  );
}

interface StatsRowProps {
  averageRainfall: number;
  activeSOS: number;
  evacuationCenters: number;
  highRiskAreas: number;
}

export default function StatsCards({
  averageRainfall,
  activeSOS,
  evacuationCenters,
  highRiskAreas,
}: StatsRowProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatsCard
        icon={<Cloud className="w-5 h-5 text-blue-400" />}
        title="Current Avg Rainfall"
        value={(averageRainfall * 100).toFixed(1)}
        unit="%"
        status={averageRainfall > 0.7 ? "critical" : averageRainfall > 0.4 ? "warning" : "normal"}
      />

      <StatsCard
        icon={<AlertTriangle className="w-5 h-5 text-red-400" />}
        title="Active SOS Requests"
        value={activeSOS}
        status={activeSOS > 5 ? "critical" : activeSOS > 2 ? "warning" : "normal"}
        subtitle={activeSOS === 0 ? "No emergency reports" : "Immediate assistance needed"}
      />

      <StatsCard
        icon={<MapPin className="w-5 h-5 text-green-400" />}
        title="Evacuation Centers"
        value={evacuationCenters}
        subtitle="Available for shelter"
      />

      <StatsCard
        icon={<TrendingUp className="w-5 h-5 text-amber-400" />}
        title="High Risk Areas"
        value={highRiskAreas}
        status={highRiskAreas > 10 ? "critical" : highRiskAreas > 5 ? "warning" : "normal"}
        subtitle="Requiring immediate attention"
      />
    </div>
  );
}
