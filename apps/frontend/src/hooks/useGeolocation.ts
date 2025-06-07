// src/hooks/useGeolocation.ts
import { useState, useCallback } from "react";

interface GeolocationState {
  loading: boolean;
  error: string | null;
  location: {
    lat: number;
    lon: number;
  } | null;
}

interface GeolocationOptions {
  enableHighAccuracy?: boolean;
  timeout?: number;
  maximumAge?: number;
}

export const useGeolocation = (options: GeolocationOptions = {}) => {
  const [state, setState] = useState<GeolocationState>({
    loading: false,
    error: null,
    location: null,
  });

  const {
    enableHighAccuracy = false,
    timeout = 10000, // 10 segundos
    maximumAge = 300000, // 5 minutos
  } = options;

  const getCurrentLocation = useCallback(async (): Promise<{
    lat: number;
    lon: number;
  } | null> => {
    // Verificar si la geolocalización está disponible
    if (!navigator.geolocation) {
      const error = "Geolocalización no disponible en este navegador";
      setState((prev) => ({ ...prev, error, loading: false }));
      throw new Error(error);
    }

    setState((prev) => ({ ...prev, loading: true, error: null }));

    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: Math.round(position.coords.latitude * 1000000) / 1000000,
            lon: Math.round(position.coords.longitude * 1000000) / 1000000,
          };

          setState({
            loading: false,
            error: null,
            location,
          });

          resolve(location);
        },
        (error) => {
          let errorMessage = "Error obteniendo ubicación";

          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = "Permiso de ubicación denegado";
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = "Ubicación no disponible";
              break;
            case error.TIMEOUT:
              errorMessage = "Tiempo de espera agotado";
              break;
            default:
              errorMessage = "Error desconocido al obtener ubicación";
              break;
          }

          setState((prev) => ({
            ...prev,
            loading: false,
            error: errorMessage,
          }));
          reject(new Error(errorMessage));
        },
        {
          enableHighAccuracy,
          timeout,
          maximumAge,
        }
      );
    });
  }, [enableHighAccuracy, timeout, maximumAge]);

  // Función para limpiar errores
  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }));
  }, []);

  // Verificar si los permisos están disponibles
  const checkPermission = useCallback(async () => {
    if ("permissions" in navigator) {
      try {
        const permission = await navigator.permissions.query({
          name: "geolocation",
        });
        return permission.state; // 'granted', 'denied', 'prompt'
      } catch {
        return "unknown";
      }
    }
    return "unknown";
  }, []);

  return {
    ...state,
    getCurrentLocation,
    clearError,
    checkPermission,
    isSupported: "geolocation" in navigator,
  };
};
