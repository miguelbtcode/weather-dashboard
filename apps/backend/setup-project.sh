#!/bin/bash

# Weather Dashboard Backend - Script de Configuración
echo "🌤️  Iniciando configuración del Weather Dashboard Backend..."

# 1. Configurar .NET 8 SDK
echo "⚙️  Configurando .NET 8 SDK..."
cat > global.json << 'EOF'
{
  "sdk": {
    "version": "8.0.407",
    "rollForward": "latestPatch"
  }
}
EOF

# 2. Instalar template de Azure Functions
echo "📦 Instalando template de Azure Functions..."
dotnet new install Microsoft.Azure.Functions.Worker.ProjectTemplates::4.0.5086

# 3. Crear solución
echo "📁 Creando solución..."
dotnet new sln -n weather-dashboard

# 4. Crear proyecto Azure Functions
echo "⚡ Creando proyecto Azure Functions..."
mkdir -p src
cd src
func init WeatherDashboard.Functions --worker-runtime dotnet-isolated
cd WeatherDashboard.Functions

# 5. Renombrar archivo .csproj para mantener convención con punto
echo "📝 Renombrando archivo .csproj para usar punto..."
if [ -f "WeatherDashboard_Functions.csproj" ]; then
    mv "WeatherDashboard_Functions.csproj" "WeatherDashboard.Functions.csproj"
    echo "✅ Renombrado: WeatherDashboard_Functions.csproj → WeatherDashboard.Functions.csproj"
elif [ -f "WeatherDashboard.Functions.csproj" ]; then
    echo "✅ El archivo ya tiene el nombre correcto: WeatherDashboard.Functions.csproj"
else
    echo "⚠️  No se encontró archivo .csproj para renombrar"
fi

# 6. Crear función HTTP trigger
echo "🌐 Creando función HTTP trigger..."
func new --template "HTTP trigger" --name WeatherHttpTrigger

# 7. Agregar paquetes NuGet
echo "📦 Agregando paquetes NuGet..."
dotnet add package StackExchange.Redis --version 2.7.20
dotnet add package Newtonsoft.Json --version 13.0.3
cd ../..
echo "🧪 Creando proyecto de tests..."
cd src
dotnet new xunit -n WeatherDashboard.Tests --framework net8.0
cd ..

# 9. Agregar proyectos a la solución
echo "🔗 Configurando solución..."
dotnet sln add src/WeatherDashboard.Functions/WeatherDashboard.Functions.csproj
dotnet sln add src/WeatherDashboard.Tests/WeatherDashboard.Tests.csproj
dotnet add src/WeatherDashboard.Tests/WeatherDashboard.Tests.csproj reference src/WeatherDashboard.Functions/WeatherDashboard.Functions.csproj

# 10. Crear estructura de carpetas
echo "🏗️  Creando estructura de carpetas..."

# Functions
mkdir -p src/WeatherDashboard.Functions/{Functions,Models,Services/Interfaces,Configuration,Utilities}

# Tests
mkdir -p src/WeatherDashboard.Tests/UnitTests/{Services,Functions}

# Infrastructure
mkdir -p infrastructure/{bicep,arm}

# CI/CD y docs
mkdir -p .github/workflows docs

# 11. Crear archivos vacíos
echo "📄 Creando archivos base..."

# Functions
touch src/WeatherDashboard.Functions/Functions/{WeatherFunctions,AlertFunctions,HealthCheckFunction}.cs
touch src/WeatherDashboard.Functions/Models/{WeatherResponse,WeatherAlert,ForecastResponse,ApiResponse}.cs
touch src/WeatherDashboard.Functions/Services/Interfaces/{IWeatherService,ICacheService,IAlertService}.cs
touch src/WeatherDashboard.Functions/Services/{WeatherService,CacheService,AlertService}.cs
touch src/WeatherDashboard.Functions/Configuration/{AppSettings,RedisConfiguration}.cs
touch src/WeatherDashboard.Functions/Utilities/{Constants,Extensions}.cs

# Tests
touch src/WeatherDashboard.Tests/UnitTests/Services/{WeatherServiceTests,CacheServiceTests}.cs
touch src/WeatherDashboard.Tests/UnitTests/Functions/WeatherFunctionsTests.cs

# Infrastructure
touch infrastructure/bicep/{main,storage,functions,redis}.bicep
touch infrastructure/arm/azuredeploy.json

# CI/CD
touch .github/workflows/{ci-cd,tests}.yml

# Docs
touch docs/{api-documentation,deployment-guide,configuration}.md

# 12. Configurar local.settings.json
echo "⚙️  Configurando local.settings.json..."
cat > src/WeatherDashboard.Functions/local.settings.json << 'EOF'
{
  "IsEncrypted": false,
  "Values": {
    "AzureWebJobsStorage": "UseDevelopmentStorage=true",
    "FUNCTIONS_WORKER_RUNTIME": "dotnet-isolated",
    "OpenWeatherMapApiKey": "YOUR_API_KEY_HERE",
    "RedisConnectionString": "YOUR_REDIS_CONNECTION_STRING",
    "CacheDurationMinutes": "15",
    "AlertThresholds__Temperature": "35",
    "AlertThresholds__WindSpeed": "50",
    "AlertThresholds__Humidity": "90"
  }
}
EOF

# 13. Crear README.md
cat > README.md << 'EOF'
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
EOF

# 14. Crear .gitignore
cat > .gitignore << 'EOF'
## Azure Functions
local.settings.json
bin/
obj/
.vs/
.vscode/
*.user
*.suo
*.cache
.DS_Store
Thumbs.db
EOF

echo ""
echo "✅ ¡Estructura del proyecto creada exitosamente!"
echo ""
echo "📋 Resumen:"
echo "├── weather-dashboard.sln"
echo "├── src/"
echo "│   ├── WeatherDashboard.Functions/ (Azure Functions .NET 8.0)"
echo "│   └── WeatherDashboard.Tests/ (Unit Tests)"
echo "├── infrastructure/ (Bicep templates)"
echo "└── .github/workflows/ (CI/CD)"
echo ""
echo "🚀 Próximos pasos:"
echo "1. Configurar OpenWeatherMap API key en local.settings.json"
echo "2. Ejecutar: cd src/WeatherDashboard.Functions && func start"
echo "3. Implementar código en cada archivo"