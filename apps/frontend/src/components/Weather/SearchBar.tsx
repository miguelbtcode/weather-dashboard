import React, { useState } from "react";
import { Search, MapPin, Clock, Navigation2 } from "lucide-react";
import { LoadingSpinner } from "../UI/LoadingStates";
import { useWeather } from "../../context/WeatherContext";
import { useGeolocation } from "../../hooks/useGeolocation";

export const SearchBar: React.FC = () => {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const { searchCity, searchByCoords, loading } = useWeather();

  const {
    getCurrentLocation,
    loading: geoLoading,
    error: geoError,
    isSupported,
  } = useGeolocation();

  // Ciudades populares para sugerencias
  const popularCities = [
    { name: "London", country: "UK", icon: "🇬🇧" },
    { name: "New York", country: "US", icon: "🇺🇸" },
    { name: "Tokyo", country: "JP", icon: "🇯🇵" },
    { name: "Paris", country: "FR", icon: "🇫🇷" },
    { name: "Sydney", country: "AU", icon: "🇦🇺" },
    { name: "Berlin", country: "DE", icon: "🇩🇪" },
  ];

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim() && !loading) {
      await searchCity(query.trim());
      setQuery("");
      setIsFocused(false);
    }
  };

  const handleSuggestionClick = async (cityName: string) => {
    setQuery("");
    setIsFocused(false);
    await searchCity(cityName);
  };

  const handleLocationClick = async () => {
    try {
      const location = await getCurrentLocation();
      if (location) {
        await searchByCoords(location.lat, location.lon);
      }
    } catch (error) {
      console.error("Error getting location:", error);
      // El error ya se maneja en el hook
    }
  };

  const filteredSuggestions = popularCities.filter(
    (city) =>
      city.name.toLowerCase().includes(query.toLowerCase()) ||
      city.country.toLowerCase().includes(query.toLowerCase())
  );

  const isAnyLoading = loading || geoLoading;

  return (
    <div className="relative w-full max-w-md mx-auto lg:mx-0">
      <div className="flex gap-3">
        {/* Campo de búsqueda */}
        <form onSubmit={handleSearch} className="relative flex-1">
          <div className="relative">
            <Search
              className={`absolute left-3 top-1/2 transform -translate-y-1/2 transition-colors ${
                isFocused ? "text-primary-400" : "text-secondary-400"
              }`}
              size={20}
            />
            <input
              type="text"
              placeholder="Buscar ciudad..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setTimeout(() => setIsFocused(false), 200)}
              className={`w-full pl-10 pr-4 py-3 bg-secondary-800 border rounded-full text-white placeholder-secondary-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                isFocused
                  ? "border-primary-500 shadow-lg"
                  : "border-secondary-700"
              }`}
              disabled={isAnyLoading}
            />
            {loading && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <LoadingSpinner size="sm" />
              </div>
            )}
          </div>
        </form>

        {/* Botón de ubicación */}
        {isSupported && (
          <button
            onClick={handleLocationClick}
            disabled={isAnyLoading}
            className={`flex items-center justify-center w-12 h-12 rounded-full border transition-all duration-200 ${
              geoLoading
                ? "bg-primary-600 border-primary-500"
                : "bg-secondary-800 border-secondary-700 hover:border-primary-500 hover:bg-secondary-700"
            } disabled:opacity-50`}
            title="Usar mi ubicación"
          >
            {geoLoading ? (
              <LoadingSpinner size="sm" />
            ) : (
              <Navigation2
                className={`transition-colors ${
                  geoError
                    ? "text-red-400"
                    : "text-secondary-400 hover:text-primary-400"
                }`}
                size={20}
              />
            )}
          </button>
        )}
      </div>

      {/* Error de geolocalización */}
      {geoError && (
        <div className="mt-2 text-xs text-red-400 bg-red-400/10 rounded-lg px-3 py-2">
          {geoError}
        </div>
      )}

      {/* Sugerencias */}
      {isFocused && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-secondary-800 border border-secondary-700 rounded-xl shadow-xl z-50 overflow-hidden">
          {query.length === 0 ? (
            <div className="p-3">
              <div className="flex items-center text-secondary-400 text-sm mb-2">
                <Clock size={14} className="mr-2" />
                Ciudades populares
              </div>
              {popularCities.map((city, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(city.name)}
                  className="w-full flex items-center px-3 py-2 text-left hover:bg-secondary-700 rounded-lg transition-colors"
                >
                  <span className="mr-3">{city.icon}</span>
                  <div>
                    <div className="text-white text-sm">{city.name}</div>
                    <div className="text-secondary-400 text-xs">
                      {city.country}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          ) : filteredSuggestions.length > 0 ? (
            <div className="p-3">
              <div className="flex items-center text-secondary-400 text-sm mb-2">
                <MapPin size={14} className="mr-2" />
                Sugerencias
              </div>
              {filteredSuggestions.map((city, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(city.name)}
                  className="w-full flex items-center px-3 py-2 text-left hover:bg-secondary-700 rounded-lg transition-colors"
                >
                  <span className="mr-3">{city.icon}</span>
                  <div>
                    <div className="text-white text-sm">{city.name}</div>
                    <div className="text-secondary-400 text-xs">
                      {city.country}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          ) : query.length > 0 ? (
            <div className="p-3 text-center text-secondary-400 text-sm">
              Presiona Enter para buscar "{query}"
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};
