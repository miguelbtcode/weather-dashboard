export type TemperatureUnit = "metric" | "imperial";

export interface TemperatureValue {
  celsius: number;
  fahrenheit: number;
}

export class TemperatureConverter {
  static celsiusToFahrenheit(celsius: number): number {
    return (celsius * 9) / 5 + 32;
  }

  static fahrenheitToCelsius(fahrenheit: number): number {
    return ((fahrenheit - 32) * 5) / 9;
  }

  static formatTemperature(
    temp: number,
    unit: TemperatureUnit,
    decimals: number = 0
  ): string {
    const symbol = unit === "metric" ? "°C" : "°F";
    return `${temp.toFixed(decimals)}${symbol}`;
  }

  static convertTemperature(
    temp: number,
    fromUnit: TemperatureUnit,
    toUnit: TemperatureUnit
  ): number {
    if (fromUnit === toUnit) return temp;

    if (fromUnit === "metric" && toUnit === "imperial") {
      return this.celsiusToFahrenheit(temp);
    }

    if (fromUnit === "imperial" && toUnit === "metric") {
      return this.fahrenheitToCelsius(temp);
    }

    return temp;
  }

  static createTemperatureValue(celsius: number): TemperatureValue {
    return {
      celsius,
      fahrenheit: this.celsiusToFahrenheit(celsius),
    };
  }
}

// Hook para manejar conversiones de temperatura
export const useTemperature = (
  tempInCelsius: number,
  unit: TemperatureUnit
) => {
  const getDisplayTemp = (): number => {
    return unit === "metric"
      ? tempInCelsius
      : TemperatureConverter.celsiusToFahrenheit(tempInCelsius);
  };

  const getFormattedTemp = (decimals: number = 0): string => {
    const displayTemp = getDisplayTemp();
    return TemperatureConverter.formatTemperature(displayTemp, unit, decimals);
  };

  const getUnitSymbol = (): string => {
    return unit === "metric" ? "°C" : "°F";
  };

  const getSpeedUnit = (): string => {
    return unit === "metric" ? "km/h" : "mph";
  };

  const convertSpeed = (speedKmh: number): number => {
    return unit === "metric" ? speedKmh : speedKmh * 0.621371; // km/h to mph
  };

  return {
    displayTemp: getDisplayTemp(),
    formattedTemp: getFormattedTemp(),
    unitSymbol: getUnitSymbol(),
    speedUnit: getSpeedUnit(),
    convertSpeed,
    getFormattedTemp,
  };
};
