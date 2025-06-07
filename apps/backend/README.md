# Weather Dashboard Backend

Backend API para aplicación de dashboard climático usando Azure Functions y .NET 8.0.

## Características

- ⚡ Azure Functions con .NET 8.0
- 🌤️ Integración con OpenWeatherMap API
- 🔄 Cache con Azure Redis
- 📊 Alertas climáticas instantáneas
- 🏗️ Arquitectura serverless

## Configuración Local

1. Configurar `local.settings.json` con tu API key de OpenWeatherMap
2. Ejecutar: `cd src/WeatherDashboard.Functions && func start`

## API Endpoints

- `GET /api/weather/current/{city}` - Clima actual
- `GET /api/weather/forecast/{city}` - Pronóstico 5 días
- `GET /api/alerts/{city}` - Alertas climáticas
- `GET /api/health` - Health check
