export interface DisasterData {
  latitude: number;
  longitude: number;
  riskScore: number;
  riskLevel: "low" | "medium" | "high" | "critical";
  rainfall: number;
  slope: number;
  soilSaturation: number;
  timestamp: number;
}

export interface Alert {
  id: string;
  type: "flood" | "landslide" | "sos";
  title: string;
  message: string;
  severity: "low" | "medium" | "high" | "critical";
  latitude: number;
  longitude: number;
  timestamp: number;
  active: boolean;
}

export interface SOSPin {
  id: string;
  latitude: number;
  longitude: number;
  timestamp: number;
  userId?: string;
  status: "pending" | "responded" | "resolved";
}

export interface WeatherData {
  rainfall: number;
  temperature: number;
  humidity: number;
  windSpeed: number;
  timestamp: number;
}

export interface RiskHeatmapData {
  latitude: number;
  longitude: number;
  riskScore: number;
  type: "flood" | "landslide";
}

export interface EvacuationCenter {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  capacity: number;
  currentOccupancy: number;
  address: string;
}
