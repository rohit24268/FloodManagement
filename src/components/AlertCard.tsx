import { X, AlertTriangle, AlertCircle, Zap } from "lucide-react";
import type { Alert } from "../types/disaster";

interface AlertCardProps {
  alert: Alert;
  onClose: (alertId: string) => void;
  isSelected?: boolean;
  onClick?: () => void;
}

export default function AlertCard({
  alert,
  onClose,
  isSelected = false,
  onClick,
}: AlertCardProps) {
  const getSeverityColor = () => {
    switch (alert.severity) {
      case "critical":
        return "bg-red-900 border-red-600 text-red-100";
      case "high":
        return "bg-red-800 border-orange-600 text-orange-100";
      case "medium":
        return "bg-yellow-900 border-yellow-600 text-yellow-100";
      default:
        return "bg-green-900 border-green-600 text-green-100";
    }
  };

  const getSeverityIcon = () => {
    switch (alert.severity) {
      case "critical":
        return <Zap className="w-4 h-4" />;
      case "high":
        return <AlertTriangle className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  return (
    <div
      className={`
        p-3 rounded-lg border transition-all duration-200 cursor-pointer
        ${getSeverityColor()}
        ${isSelected ? "ring-2 ring-white shadow-lg" : "hover:shadow-md"}
      `}
      onClick={onClick}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-start gap-2 flex-1">
          {getSeverityIcon()}
          <div className="flex-1">
            <h4 className="font-semibold text-sm">{alert.title}</h4>
            <p className="text-xs opacity-90 mt-1">{alert.message}</p>
            <p className="text-xs opacity-75 mt-2">
              {new Date(alert.timestamp).toLocaleTimeString()}
            </p>
          </div>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClose(alert.id);
          }}
          className="text-current opacity-60 hover:opacity-100 transition-opacity"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
