var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { ParameterType, ToolsService, tool } from '@optimizely-opal/opal-tools-sdk';
import express from 'express';
const app = express();
// This is required for the tool to properly read and understand the incoming JSON POST requests from Opal.
app.use(express.json());
// Error handling middleware
app.use((error, req, res, next) => {
    console.error('Server error:', error);
    res.status(500).json({
        success: false,
        error: 'Internal server error',
        details: error.message
    });
});
process.on('uncaughtException', (err) => {
    console.error('uncaughtException:', err);
});
process.on('unhandledRejection', (reason) => {
    console.error('unhandledRejection:', reason);
});
// Register the configured app with the Opal ToolsService
// This allows the service to properly setup API endpoints as well as communicate properly with your functions
const toolsService = new ToolsService(app);
// If you want to use the @tool decorator, your functions must be within a class declaration.
class WeatherTools {
    // Register the tool. Provide a meaningful descriptions to help Opal understand how to use this tool.
    async getWeather(parameters) {
        try {
            const { city, state, country, units = '' } = parameters;
            const apiUrl = 'https://api.openweathermap.org/data/2.5/weather';
            // Validate required parameters
            if ((!city || city.trim() === '') ||
                (!country || country.trim() === '')) {
                throw new Error('City and Country are required and cannot be empty');
            }
            // Start with mock data in case an API key is not configured.
            let weatherData = {
                temperature: units === 'fahrenheit' ? 72 : 22,
                condition: 'sunny',
                location: `${city}, ${state}, ${country}`,
            };
            // Check for API key and use this to retrieve live weather.
            // if(process.env.OPENWEATHERMAP_API_KEY && process.env.OPENWEATHERMAP_API_KEY.trim() !== ''){
            //   // Build query parameters for OpenWeatherMap API GET request.
            //   let q = new URLSearchParams();
            //   if(state) 
            //     q.append("q", `${city},${state},${country}`);
            //   else 
            //     q.append("q", `${city},${country}`);
            //   q.append('units', units);
            //   q.append("appid",process.env.OPENWEATHERMAP_API_KEY);
            //
            //   // Request live weather data.
            //   const response = await fetch(`${apiUrl}?${q}`);
            //   if(!response.ok){
            //     throw new Error(`Response Error: ${response.status}`);
            //   }
            //
            //   // Build response for Opal based on data from the API.
            //   const result = await response.json();
            //   weatherData = {
            //     temperature: result.main.temp,
            //     condition: result.weather[0].main + (result.weather[0].description ? ` (${result.weather[0].description})` : ''),
            //     location: `${result.name}, ${result.sys.country}`
            //   }
            // }
            // Return response to Opal
            return weatherData;
        }
        catch (error) {
            console.error('Error fetching weather:', error);
            throw new Error(`Failed to get weather for ${parameters.city}: ${error.message}`);
        }
    }
}
__decorate([
    tool({
        name: 'get_weather',
        description: 'Gets current weather for a location based on City name, State or Region code, and Country code. Set preferred Units.',
        parameters: [
            {
                name: "city",
                description: "The name of the city.",
                type: ParameterType.String,
                required: true
            },
            {
                name: "country",
                description: "The country code. E.g. 'US' for United States or 'FR' for France.",
                type: ParameterType.String,
                required: true
            },
            {
                name: "units",
                description: "Options are Imperial for Fahrenheit, Metric for Celcius. If left blank, this will return temperature in Kelvin.",
                type: ParameterType.String,
                required: true
            }
        ]
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], WeatherTools.prototype, "getWeather", null);
// Discovery endpoint is automatically created at /discovery by ToolsService
// Tool execution endpoints are automatically created by ToolsService
// Start the server
const PORT = process.env.PORT || 3000;
console.log("About to listen. PORT=", process.env.PORT);
app.listen(PORT, () => {
    console.log(`Opal Tools service running on port ${PORT}`);
    console.log(`Discovery endpoint automatically available at http://localhost:${PORT}/discovery`);
});
export default app;
