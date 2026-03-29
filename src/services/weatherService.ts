import axios from "axios";
import type { WeatherData } from "../types/disaster";

const OPEN_METEO_BASE_URL = "https://api.open-meteo.com/v1/forecast";

/**
 * Fetch weather data from Open Meteo API (no API key required)
 */
export async function fetchWeatherData(
  latitude: number,
  longitude: number
): Promise<WeatherData | null> {
  try {
    const response = await axios.get(OPEN_METEO_BASE_URL, {
      params: {
        latitude,
        longitude,
        current:
          "temperature_2m,relative_humidity_2m,precipitation,weather_code,wind_speed_10m",
        timezone: "auto",
      },
    });

    const current = response.data.current;
    return {
      rainfall: (current.precipitation || 0) / 100, // Normalize to 0-1 (assuming mm scale)
      temperature: current.temperature_2m || 20,
      humidity: (current.relative_humidity_2m || 50) / 100, // Already 0-100, normalize to 0-1
      windSpeed: current.wind_speed_10m || 0,
      timestamp: Date.now(),
    };
  } catch (error) {
    console.error("Error fetching weather data from Open Meteo:", error);
    return null;
  }
}

/**
 * Mock weather data for demo purposes
 */
export function getMockWeatherData(
  latitude: number,
  longitude: number
): WeatherData {
  // Generate semi-random data based on coordinates
  const rainfallSeed = Math.abs(Math.sin(latitude * longitude) * 10000) % 100;
  const humiditySeed = Math.abs(Math.cos(latitude - longitude) * 10000) % 100;

  return {
    rainfall: (rainfallSeed / 100) * 0.8, // Scale down to max 0.8
    temperature: 20 + rainfallSeed * 0.3,
    humidity: (humiditySeed / 100) * 0.8 + 0.2,
    windSpeed: rainfallSeed * 0.2,
    timestamp: Date.now(),
  };
}

/**
 * Mock elevation data (placeholder for Google Elevation API)
 */
export async function fetchElevationData(
  latitude: number,
  longitude: number
): Promise<number | null> {
  try {
    // This would normally call Google Elevation API
    // For now, generate mock elevation based on coordinates
    const elevation = 100 + Math.abs(Math.sin(latitude) * Math.cos(longitude)) * 3000;
    return elevation;
  } catch (error) {
    console.error("Error fetching elevation data:", error);
    return null;
  }
}

/**
 * Calculate slope from elevation data (mock implementation)
 */
export function calculateSlope(elevation: number): number {
  // In a real implementation, this would compare elevations of neighboring cells
  // For demo, use elevation as a proxy for slope
  const maxElevation = 3000;
  const slope = Math.min(1, elevation / maxElevation);
  return slope;
}
