import { fetchWeatherApi } from "openmeteo";

const params = {
  latitude: 60.93,
  longitude: 10.69,
  current: ["temperature_2m", "rain", "snowfall", "wind_speed_10m"],
};
const url = "https://api.open-meteo.com/v1/forecast";
const responses = await fetchWeatherApi(url, params);

// Process first location. Add a for-loop for multiple locations or weather models
const response = responses[0];

// Attributes for timezone and location
const latitude = response.latitude();
const longitude = response.longitude();
const elevation = response.elevation();
const utcOffsetSeconds = response.utcOffsetSeconds();

console.log(
    `\nCoordinates: ${latitude}°N ${longitude}°E`,
    `\nElevation: ${elevation}m asl`,
    `\nTimezone difference to GMT+0: ${utcOffsetSeconds}s`,
);

const current = response.current()!;

// Note: The order of weather variables in the URL query and the indices below need to match!
const weatherData = {
  current: {
    time: new Date((Number(current.time()) + utcOffsetSeconds) * 1000),
    temperature_2m: current.variables(0)!.value(),
    rain: current.variables(1)!.value(),
    snowfall: current.variables(2)!.value(),
    wind_speed_10m: current.variables(3)!.value(),
  },
};

// The 'weatherData' object now contains a simple structure, with arrays of datetimes and weather information
console.log(
    `\nCurrent time: ${weatherData.current.time}\n`,
    `\nCurrent temperature_2m: ${weatherData.current.temperature_2m}`,
    `\nCurrent rain: ${weatherData.current.rain}`,
    `\nCurrent snowfall: ${weatherData.current.snowfall}`,
    `\nCurrent wind_speed_10m: ${weatherData.current.wind_speed_10m}`,
);
