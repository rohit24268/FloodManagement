import { create } from "zustand";
import type { DisasterData, Alert, SOSPin, WeatherData, EvacuationCenter } from "../types/disaster";

interface DisasterState {
  // Data
  riskData: DisasterData[];
  alerts: Alert[];
  sosPins: SOSPin[];
  weatherData: WeatherData | null;
  evacuationCenters: EvacuationCenter[];

  // UI State
  isHighAlert: boolean;
  mapCenter: [number, number];
  mapZoom: number;
  selectedAlert: Alert | null;
  isSidebarOpen: boolean;
  currentTimeStep: number;
  isPlayingForecast: boolean;
  demoMode: boolean; // Toggle between real and demo data

  // Actions
  setRiskData: (data: DisasterData[]) => void;
  addAlert: (alert: Alert) => void;
  removeAlert: (alertId: string) => void;
  setAlerts: (alerts: Alert[]) => void;
  addSOSPin: (pin: SOSPin) => void;
  setSOSPins: (pins: SOSPin[]) => void;
  setWeatherData: (data: WeatherData) => void;
  setEvacuationCenters: (centers: EvacuationCenter[]) => void;

  // UI Actions
  setHighAlert: (isHigh: boolean) => void;
  setMapCenter: (center: [number, number]) => void;
  setMapZoom: (zoom: number) => void;
  setSelectedAlert: (alert: Alert | null) => void;
  toggleSidebar: () => void;
  setSidebarOpen: (isOpen: boolean) => void;
  setCurrentTimeStep: (step: number) => void;
  setPlayingForecast: (isPlaying: boolean) => void;
  toggleDemoMode: () => void;
  setDemoMode: (isDemo: boolean) => void;

  // Computed values
  activeAlertCount: number;
  averageRainfall: number;
  higheriskAreas: DisasterData[];
}

export const useDisasterStore = create<DisasterState>((set, get) => ({
  // Initial state
  riskData: [],
  alerts: [],
  sosPins: [],
  weatherData: null,
  evacuationCenters: [],

  isHighAlert: false,
  mapCenter: [17.6601, 75.9064], // Center of Solapur, Maharashtra for demo
  mapZoom: 11,
  selectedAlert: null,
  isSidebarOpen: true,
  currentTimeStep: 0,
  isPlayingForecast: false,
  demoMode: true, // Default to demo mode

  // Data setters
  setRiskData: (data) => set({ riskData: data }),
  addAlert: (alert) =>
    set((state) => ({
      alerts: [alert, ...state.alerts].slice(0, 50), // Keep last 50 alerts
      isHighAlert: alert.severity === "critical",
    })),
  removeAlert: (alertId) =>
    set((state) => ({
      alerts: state.alerts.filter((a) => a.id !== alertId),
    })),
  setAlerts: (alerts) =>
    set({
      alerts,
      isHighAlert: alerts.some((a) => a.severity === "critical"),
    }),
  addSOSPin: (pin) =>
    set((state) => ({
      sosPins: [pin, ...state.sosPins].slice(0, 100), // Keep last 100 pins
    })),
  setSOSPins: (pins) => set({ sosPins: pins }),
  setWeatherData: (data) => set({ weatherData: data }),
  setEvacuationCenters: (centers) => set({ evacuationCenters: centers }),

  // UI setters
  setHighAlert: (isHigh) => set({ isHighAlert: isHigh }),
  setMapCenter: (center) => set({ mapCenter: center }),
  setMapZoom: (zoom) => set({ mapZoom: zoom }),
  setSelectedAlert: (alert) => set({ selectedAlert: alert }),
  toggleSidebar: () =>
    set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  setSidebarOpen: (isOpen) => set({ isSidebarOpen: isOpen }),
  setCurrentTimeStep: (step) => set({ currentTimeStep: step }),
  setPlayingForecast: (isPlaying) => set({ isPlayingForecast: isPlaying }),
  toggleDemoMode: () => set((state) => ({ demoMode: !state.demoMode })),
  setDemoMode: (isDemo) => set({ demoMode: isDemo }),

  // Computed values (updated on every state change)
  get activeAlertCount() {
    return get().alerts.filter((a) => a.active).length;
  },
  get averageRainfall() {
    const state = get();
    if (state.riskData.length === 0) return 0;
    const sum = state.riskData.reduce((acc, data) => acc + data.rainfall, 0);
    return sum / state.riskData.length;
  },
  get higheriskAreas() {
    return get().riskData.filter((d) => d.riskLevel === "high" || d.riskLevel === "critical");
  },
}));
