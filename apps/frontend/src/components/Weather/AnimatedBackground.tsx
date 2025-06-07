import React, { useEffect, useRef } from "react";
import { useWeatherTheme } from "../../utils/weatherThemes";

interface AnimatedBackgroundProps {
  weatherCode?: string;
  intensity?: "light" | "medium" | "heavy";
}

export const AnimatedBackground: React.FC<AnimatedBackgroundProps> = ({
  weatherCode = "01d",
  intensity = "medium",
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme, isNight } = useWeatherTheme(weatherCode);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Configurar canvas
    const updateCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    updateCanvasSize();
    window.addEventListener("resize", updateCanvasSize);

    // Partículas
    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      opacity: number;
      type: "rain" | "snow" | "cloud" | "star";
    }> = [];

    // Crear partículas según el clima
    const createParticles = () => {
      const particleCount =
        intensity === "light" ? 50 : intensity === "medium" ? 100 : 150;

      for (let i = 0; i < particleCount; i++) {
        let particle;

        if (weatherCode.includes("10") || weatherCode.includes("09")) {
          // Lluvia
          particle = {
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: -2 + Math.random() * 1,
            vy: 8 + Math.random() * 4,
            size: 1 + Math.random() * 2,
            opacity: 0.6 + Math.random() * 0.4,
            type: "rain" as const,
          };
        } else if (weatherCode.includes("13")) {
          // Nieve
          particle = {
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: -1 + Math.random() * 2,
            vy: 1 + Math.random() * 3,
            size: 2 + Math.random() * 4,
            opacity: 0.7 + Math.random() * 0.3,
            type: "snow" as const,
          };
        } else if (
          weatherCode.includes("02") ||
          weatherCode.includes("03") ||
          weatherCode.includes("04")
        ) {
          // Nubes (partículas flotantes)
          particle = {
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: 0.5 + Math.random() * 1,
            vy: 0.2 + Math.random() * 0.4,
            size: 8 + Math.random() * 15,
            opacity: 0.1 + Math.random() * 0.2,
            type: "cloud" as const,
          };
        } else if (isNight) {
          // Estrellas
          particle = {
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: 0,
            vy: 0,
            size: 1 + Math.random() * 2,
            opacity: 0.3 + Math.random() * 0.7,
            type: "star" as const,
          };
        } else {
          // Partículas de luz para clima soleado
          particle = {
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: 0.2 + Math.random() * 0.4,
            vy: 0.1 + Math.random() * 0.2,
            size: 2 + Math.random() * 4,
            opacity: 0.1 + Math.random() * 0.3,
            type: "cloud" as const,
          };
        }

        particles.push(particle);
      }
    };

    createParticles();

    // Animación
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle, index) => {
        // Actualizar posición
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Reiniciar partículas que salen del canvas
        if (particle.y > canvas.height + 10) {
          particle.y = -10;
          particle.x = Math.random() * canvas.width;
        }
        if (particle.x > canvas.width + 10) {
          particle.x = -10;
          particle.y = Math.random() * canvas.height;
        }

        // Dibujar partícula
        ctx.save();
        ctx.globalAlpha = particle.opacity;

        switch (particle.type) {
          case "rain":
            ctx.strokeStyle = theme.iconColor;
            ctx.lineWidth = particle.size;
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(
              particle.x - particle.vx * 3,
              particle.y - particle.vy * 3
            );
            ctx.stroke();
            break;

          case "snow":
            ctx.fillStyle = theme.particleColor;
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            ctx.fill();
            break;

          case "cloud":
            ctx.fillStyle = theme.particleColor;
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            ctx.fill();
            break;

          case "star":
            ctx.fillStyle = "#ffffff";
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            ctx.fill();
            // Efecto de parpadeo
            if (Math.random() > 0.98) {
              particle.opacity = Math.random() * 0.8 + 0.2;
            }
            break;
        }

        ctx.restore();
      });

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", updateCanvasSize);
    };
  }, [weatherCode, theme, isNight, intensity]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{
        background: `linear-gradient(135deg, ${theme.backgroundGradient
          .split(" ")
          .join(", ")})`,
        opacity: 0.3,
      }}
    />
  );
};

// Componente para efectos de resplandor
export const WeatherGlow: React.FC<{ weatherCode?: string }> = ({
  weatherCode = "01d",
}) => {
  const { theme } = useWeatherTheme(weatherCode);

  return (
    <div className="fixed inset-0 pointer-events-none z-10">
      {/* Resplandor principal */}
      <div
        className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-20"
        style={{
          background: `radial-gradient(circle, ${theme.primary}, transparent 70%)`,
          animation: "pulse 4s ease-in-out infinite",
        }}
      />

      {/* Resplandor secundario */}
      <div
        className="absolute top-1/3 right-1/4 w-64 h-64 rounded-full blur-2xl opacity-15"
        style={{
          background: `radial-gradient(circle, ${theme.secondary}, transparent 70%)`,
          animation: "pulse 6s ease-in-out infinite reverse",
        }}
      />

      {/* Efectos específicos por clima */}
      {weatherCode.includes("11") && (
        <div
          className="absolute inset-0"
          style={{
            background: "transparent",
            animation: "lightning 8s infinite",
          }}
        />
      )}
    </div>
  );
};

// Estilos CSS adicionales que necesitas agregar a tu index.css
export const weatherAnimationStyles = `
@keyframes lightning {
  0%, 90%, 100% { opacity: 0; }
  1%, 3% { 
    opacity: 1; 
    background: radial-gradient(circle, rgba(139, 69, 19, 0.3), transparent 70%);
  }
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}

@keyframes glow {
  0%, 100% { box-shadow: 0 0 20px var(--weather-glow); }
  50% { box-shadow: 0 0 40px var(--weather-glow); }
}

.weather-glow {
  animation: glow 3s ease-in-out infinite;
}

.weather-float {
  animation: float 3s ease-in-out infinite;
}
`;
