import axios from "axios";

/**
 * Fetch real-time weather data for coordinates using Open-Meteo (Free, no-key API)
 */
export async function fetchWeatherData(lat: number, lon: number) {
  try {
    const response = await axios.get("https://api.open-meteo.com/v1/forecast", {
      params: {
        latitude: lat,
        longitude: lon,
        current_weather: true,
        hourly: "relativehumidity_2m,temperature_2m,precipitation"
      }
    });

    const current = response.data.current_weather;
    
    // Calculate simple Evapotranspiration Index (ET)
    // High temp + low humidity = high ET (needs more water)
    const temp = current.temperature;
    const humidity = response.data.hourly.relativehumidity_2m[0] || 50;
    const windSpeed = current.windspeed;
    
    const stressFactor = (temp * 0.5) + (windSpeed * 0.2) - (humidity * 0.1);

    return {
      temp,
      humidity,
      windSpeed,
      condition: current.weathercode,
      stressFactor: Math.max(0, Math.min(100, stressFactor * 2)) // Normalized 0-100
    };
  } catch (error) {
    console.error("❌ Weather API Error:", error);
    return {
      temp: 28,
      humidity: 45,
      windSpeed: 12,
      condition: 0,
      stressFactor: 50
    };
  }
}
