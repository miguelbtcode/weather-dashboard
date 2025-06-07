// Performance utilities for the weather dashboard

export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: ReturnType<typeof setTimeout>;

  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;

  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

// Lazy loading utility for images
export const lazyLoadImage = (src: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(src);
    img.onerror = reject;
    img.src = src;
  });
};

// Intersection Observer for animations
export const createAnimationObserver = (
  callback: (entries: IntersectionObserverEntry[]) => void,
  options?: IntersectionObserverInit
) => {
  const defaultOptions: IntersectionObserverInit = {
    threshold: 0.1,
    rootMargin: "50px",
    ...options,
  };

  return new IntersectionObserver(callback, defaultOptions);
};

// Cache utility for API responses
export class SimpleCache<T> {
  private cache = new Map<string, { data: T; expiry: number }>();

  set(key: string, data: T, ttlMs: number = 15 * 60 * 1000): void {
    const expiry = Date.now() + ttlMs;
    this.cache.set(key, { data, expiry });
  }

  get(key: string): T | null {
    const item = this.cache.get(key);

    if (!item) return null;

    if (Date.now() > item.expiry) {
      this.cache.delete(key);
      return null;
    }

    return item.data;
  }

  has(key: string): boolean {
    return this.get(key) !== null;
  }

  clear(): void {
    this.cache.clear();
  }

  size(): number {
    return this.cache.size;
  }
}

// Global cache instance
export const apiCache = new SimpleCache();

// Performance measurement
export const measurePerformance = <T>(fn: () => T, label: string): T => {
  const start = performance.now();
  const result = fn();
  const end = performance.now();

  if (import.meta.env.DEV) {
    console.log(`${label}: ${(end - start).toFixed(2)}ms`);
  }

  return result;
};

// Async performance measurement
export const measureAsyncPerformance = async <T>(
  fn: () => Promise<T>,
  label: string
): Promise<T> => {
  const start = performance.now();
  const result = await fn();
  const end = performance.now();

  if (import.meta.env.DEV) {
    console.log(`${label}: ${(end - start).toFixed(2)}ms`);
  }

  return result;
};

// Local storage with expiry
export const localStorageWithExpiry = {
  set(key: string, value: any, ttlMs: number): void {
    const item = {
      value,
      expiry: Date.now() + ttlMs,
    };
    localStorage.setItem(key, JSON.stringify(item));
  },

  get<T>(key: string): T | null {
    try {
      const itemStr = localStorage.getItem(key);
      if (!itemStr) return null;

      const item = JSON.parse(itemStr);

      if (Date.now() > item.expiry) {
        localStorage.removeItem(key);
        return null;
      }

      return item.value;
    } catch {
      return null;
    }
  },

  remove(key: string): void {
    localStorage.removeItem(key);
  },
};

// Preload critical resources
export const preloadResources = () => {
  // Preload critical CSS if using external fonts
  const preloadLink = document.createElement("link");
  preloadLink.rel = "preload";
  preloadLink.as = "style";
  preloadLink.href =
    "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap";
  document.head.appendChild(preloadLink);

  // Prefetch weather icons if using external service
  const iconBaseUrl = "https://openweathermap.org/img/wn/";
  const commonIcons = ["01d", "01n", "02d", "02n", "10d", "10n"];

  commonIcons.forEach((icon) => {
    const link = document.createElement("link");
    link.rel = "prefetch";
    link.href = `${iconBaseUrl}${icon}@2x.png`;
    document.head.appendChild(link);
  });
};

// Battery and network-aware features
export const isLowPowerMode = (): boolean => {
  // @ts-ignore - Battery API is experimental
  return (
    navigator
      .getBattery?.()
      .then(
        (battery: any) => battery.charging === false && battery.level < 0.2
      ) || false
  );
};

export const getConnectionQuality = (): "fast" | "slow" | "offline" => {
  if (!navigator.onLine) return "offline";

  // @ts-ignore - Connection API is experimental
  const connection =
    navigator.connection ||
    navigator.mozConnection ||
    navigator.webkitConnection;

  if (!connection) return "fast";

  const effectiveType = connection.effectiveType;

  if (effectiveType === "4g") return "fast";
  if (effectiveType === "3g") return "slow";

  return "slow";
};

// Animation frame utilities
export const nextFrame = (): Promise<number> => {
  return new Promise((resolve) => {
    requestAnimationFrame(resolve);
  });
};

export const waitFrames = (count: number): Promise<void> => {
  return new Promise((resolve) => {
    let remaining = count;
    const tick = () => {
      remaining--;
      if (remaining <= 0) {
        resolve();
      } else {
        requestAnimationFrame(tick);
      }
    };
    requestAnimationFrame(tick);
  });
};
