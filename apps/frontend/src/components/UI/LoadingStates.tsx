// src/components/ui/LoadingStates.tsx
import React from "react";
import { Cloud, Sun, CloudRain } from "lucide-react";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = "md",
  className = "",
}) => {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  };

  return (
    <div
      className={`animate-spin rounded-full border-2 border-primary-400 border-t-transparent ${sizeClasses[size]} ${className}`}
    />
  );
};

interface WeatherLoadingProps {
  message?: string;
}

export const WeatherLoading: React.FC<WeatherLoadingProps> = ({
  message = "Cargando clima...",
}) => {
  return (
    <div className="flex flex-col items-center justify-center h-[60vh] space-y-6">
      {/* Animación de íconos del clima */}
      <div className="relative">
        <div className="flex space-x-2">
          <Sun
            className="text-sunny animate-bounce"
            size={32}
            style={{ animationDelay: "0ms" }}
          />
          <Cloud
            className="text-cloudy animate-bounce"
            size={32}
            style={{ animationDelay: "150ms" }}
          />
          <CloudRain
            className="text-rainy animate-bounce"
            size={32}
            style={{ animationDelay: "300ms" }}
          />
        </div>
      </div>

      {/* Texto de carga */}
      <div className="text-center">
        <h3 className="text-lg font-medium text-white mb-2">{message}</h3>
        <div className="flex space-x-1 justify-center">
          <div
            className="w-2 h-2 bg-primary-400 rounded-full animate-pulse"
            style={{ animationDelay: "0ms" }}
          ></div>
          <div
            className="w-2 h-2 bg-primary-400 rounded-full animate-pulse"
            style={{ animationDelay: "150ms" }}
          ></div>
          <div
            className="w-2 h-2 bg-primary-400 rounded-full animate-pulse"
            style={{ animationDelay: "300ms" }}
          ></div>
        </div>
      </div>
    </div>
  );
};

interface SkeletonProps {
  className?: string;
  rows?: number;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className = "",
  rows = 1,
}) => {
  return (
    <div className="animate-pulse space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className={`bg-secondary-700/50 rounded ${className}`} />
      ))}
    </div>
  );
};

// Skeleton específico para cards del clima
export const WeatherCardSkeleton: React.FC = () => {
  return (
    <div className="bg-secondary-800 rounded-2xl p-6 animate-pulse">
      <div className="flex justify-between items-start mb-6">
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-4 w-28" />
        </div>
        <Skeleton className="h-16 w-16 rounded-full" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Skeleton className="h-20 w-full rounded-lg" />
        <Skeleton className="h-20 w-full rounded-lg" />
      </div>
    </div>
  );
};

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
}) => {
  return (
    <div className="flex flex-col items-center justify-center h-[60vh] text-center px-4">
      {icon && <div className="mb-4 text-primary-400">{icon}</div>}
      <h2 className="text-xl font-medium mb-2 text-white">{title}</h2>
      <p className="text-secondary-400 mb-6 max-w-md">{description}</p>
      {action}
    </div>
  );
};

interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({ message, onRetry }) => {
  return (
    <div className="flex flex-col items-center justify-center h-[60vh] text-center px-4">
      <div className="text-red-400 text-4xl mb-4">⚠️</div>
      <h2 className="text-xl font-medium mb-2 text-white">
        Oops! Algo salió mal
      </h2>
      <p className="text-secondary-300 mb-6 max-w-md">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
        >
          Intentar de nuevo
        </button>
      )}
      <p className="text-secondary-500 text-sm mt-4">
        Verifica tu conexión a internet o intenta con otra ciudad
      </p>
    </div>
  );
};
