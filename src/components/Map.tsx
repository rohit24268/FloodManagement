import { useEffect, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useDisasterStore } from "../store/disasterStore";
import type { SOSPin, DisasterData } from "../types/disaster";
import iconRetinaUrl from "leaflet/dist/images/marker-icon-2x.png";
import iconUrl from "leaflet/dist/images/marker-icon.png";
import shadowUrl from "leaflet/dist/images/marker-shadow.png";

// Fix leaflet icon issue
L.Icon.Default.mergeOptions({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
});

interface MapProps {
  riskData: DisasterData[];
  sosPins: SOSPin[];
  currentTimeStep?: number;
}

/**
 * Heatmap overlay component that renders risk polygons
 */
function HeatmapOverlay({ riskData, timeStep }: { riskData: DisasterData[]; timeStep: number }) {
  const map = useMap();

  useEffect(() => {
    const layers: L.Layer[] = [];

    riskData.forEach((data) => {
      // Create a small circle for each data point
      const radius = 5000; // 5km radius
      const intensity = data.riskScore * (1 + timeStep * 0.1); // Increase over time
      const color =
        intensity < 0.25
          ? "#22c55e" // Green
          : intensity < 0.5
            ? "#eab308" // Yellow
            : intensity < 0.75
              ? "#f97316" // Orange
              : "#dc2626"; // Red

      const circle = L.circle([data.latitude, data.longitude], {
        radius,
        color,
        fillColor: color,
        fillOpacity: 0.4 + intensity * 0.3,
        weight: 2,
      });

      circle.bindPopup(
        `<div class="text-sm">
          <strong>Risk Score: ${(intensity * 100).toFixed(1)}%</strong><br/>
          Rainfall: ${(data.rainfall * 100).toFixed(0)}%<br/>
          Slope: ${(data.slope * 100).toFixed(0)}%<br/>
          Saturation: ${(data.soilSaturation * 100).toFixed(0)}%
        </div>`
      );

      layers.push(circle);
      map.addLayer(circle);
    });

    return () => {
      layers.forEach((layer) => map.removeLayer(layer));
    };
  }, [riskData, timeStep, map]);

  return null;
}

/**
 * SOS Pin markers
 */
function SOSMarkers({ pins }: { pins: SOSPin[] }) {
  const redIcon = L.icon({
    iconUrl:
      "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSMzMiIgdmlld0JveD0iMCAwIDMyIDMyIj48cmVjdCB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIGZpbGw9IiNkYzI2MjYiIHJ4PSI0Ii8+PHRleHQgeD0iMTYiIHk9IjIyIiBmb250LXNpemU9IjIwIiBmb250LXdlaWdodD0iYm9sZCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0id2hpdGUiPlM8L3RleHQ+PC9zdmc+",
    iconSize: [32, 32],
  });

  return (
    <>
      {pins.map((pin) => (
        <Marker key={pin.id} position={[pin.latitude, pin.longitude]} icon={redIcon}>
          <Popup>
            <div className="text-sm font-semibold text-red-600">
              <strong>SOS Request</strong>
              <br />
              Status: {pin.status}
              <br />
              Time: {new Date(pin.timestamp).toLocaleTimeString()}
            </div>
          </Popup>
        </Marker>
      ))}
    </>
  );
}

/**
 * Main Map Component
 */
export default function Map({ riskData, sosPins, currentTimeStep = 0 }: MapProps) {
  const { mapCenter, mapZoom } = useDisasterStore();

  const mapPosition = useMemo(() => mapCenter as [number, number], [mapCenter]);

  return (
    <div className="w-full h-full rounded-lg overflow-hidden shadow-lg border border-slate-700">
      <MapContainer
        center={mapPosition}
        zoom={mapZoom}
        className="w-full h-full"
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          maxZoom={19}
        />

        <HeatmapOverlay riskData={riskData} timeStep={currentTimeStep} />
        <SOSMarkers pins={sosPins} />
      </MapContainer>
    </div>
  );
}
