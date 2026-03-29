import type { DisasterData } from "../types/disaster";

/**
 * Calculate the disaster risk score based on multiple environmental factors
 * Formula: (Rainfall × 0.5) + (Slope × 0.3) + (Saturation × 0.2)
 * 
 * @param rainfall - Rainfall level (0-1, normalized)
 * @param slope - Terrain slope (0-1, normalized)
 * @param soilSaturation - Soil saturation level (0-1, normalized)
 * @returns Risk score between 0 and 1
 */
export function calculateDisasterRisk(
  rainfall: number,
  slope: number,
  soilSaturation: number
): number {
  // Normalize inputs to ensure they're between 0 and 1
  const normalizedRainfall = Math.max(0, Math.min(1, rainfall));
  const normalizedSlope = Math.max(0, Math.min(1, slope));
  const normalizedSaturation = Math.max(0, Math.min(1, soilSaturation));

  // Apply weighted formula
  const riskScore =
    normalizedRainfall * 0.5 +
    normalizedSlope * 0.3 +
    normalizedSaturation * 0.2;

  return Math.max(0, Math.min(1, riskScore));
}

/**
 * Determine risk level based on risk score
 */
export function getRiskLevel(
  riskScore: number
): "low" | "medium" | "high" | "critical" {
  if (riskScore < 0.3) return "low";
  if (riskScore < 0.5) return "medium";
  if (riskScore < 0.7) return "high";
  return "critical";
}

/**
 * Get color for risk score visualization (Green to Red)
 */
export function getRiskColor(riskScore: number): string {
  if (riskScore < 0.25) return "#22c55e"; // Green
  if (riskScore < 0.5) return "#eab308"; // Yellow
  if (riskScore < 0.75) return "#f97316"; // Orange
  return "#dc2626"; // Red
}

/**
 * Get RGBA color for risk score visualization (for heatmap overlay)
 */
export function getRiskColorRGBA(riskScore: number, alpha: number = 0.6): string {
  let rgb: [number, number, number];

  if (riskScore < 0.25) {
    rgb = [34, 197, 94]; // Green
  } else if (riskScore < 0.5) {
    rgb = [234, 179, 8]; // Yellow
  } else if (riskScore < 0.75) {
    rgb = [249, 115, 22]; // Orange
  } else {
    rgb = [220, 38, 38]; // Red
  }

  return `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${alpha})`;
}

/**
 * Generate mock disaster data for a given location
 */
export function generateMockDisasterData(
  latitude: number,
  longitude: number
): DisasterData {
  // Add some randomness based on coordinates
  const seed = (Math.abs(Math.sin(latitude) * Math.cos(longitude)) * 10000) % 1;

  const rainfall = Math.random() * 0.8 + seed * 0.2;
  const slope = Math.random() * 0.6 + seed * 0.4;
  const soilSaturation = Math.random() * 0.7 + seed * 0.3;

  const riskScore = calculateDisasterRisk(rainfall, slope, soilSaturation);

  return {
    latitude,
    longitude,
    riskScore,
    riskLevel: getRiskLevel(riskScore),
    rainfall,
    slope,
    soilSaturation,
    timestamp: Date.now(),
  };
}

/**
 * Simulate forecasted spread over time (12 hours in 1-hour intervals)
 */
export function generateForecastedSpread(
  baseRiskScore: number,
  hours: number = 12
): number[] {
  const spread: number[] = [];
  for (let i = 0; i < hours; i++) {
    // Simulate gradual increase then plateau
    const progress = i / (hours * 0.7);
    const spreadFactor = Math.min(1, progress * 0.3);
    spread.push(Math.min(1, baseRiskScore + spreadFactor));
  }
  return spread;
}
