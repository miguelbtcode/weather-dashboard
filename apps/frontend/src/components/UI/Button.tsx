import React from "react";
import { LucideIcon } from "lucide-react";
import { LoadingSpinner } from "./LoadingSpinner";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  icon?: LucideIcon;
  iconPosition?: "left" | "right";
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  size = "md",
  loading = false,
  icon: Icon,
  iconPosition = "left",
  className = "",
  disabled,
  ...props
}) => {
  const baseClasses =
    "weather-button font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

  const variantClasses = {
    primary:
      "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white focus:ring-blue-500",
    secondary:
      "bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 focus:ring-white/50",
    ghost:
      "text-white/80 hover:text-white hover:bg-white/10 focus:ring-white/50",
  };

  const sizeClasses = {
    sm: "px-3 py-2 text-sm rounded-lg",
    md: "px-6 py-3 text-base rounded-xl",
    lg: "px-8 py-4 text-lg rounded-2xl",
  };

  const iconSize = {
    sm: 16,
    md: 18,
    lg: 20,
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      <div className="flex items-center justify-center space-x-2">
        {loading ? (
          <LoadingSpinner size="sm" />
        ) : (
          <>
            {Icon && iconPosition === "left" && <Icon size={iconSize[size]} />}
            {children && <span>{children}</span>}
            {Icon && iconPosition === "right" && <Icon size={iconSize[size]} />}
          </>
        )}
      </div>
    </button>
  );
};
