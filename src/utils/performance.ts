// Performance monitoring utilities

// Define interfaces for better type safety
interface PerformanceEventTiming extends PerformanceEntry {
  processingStart: number;
}

interface LayoutShift extends PerformanceEntry {
  value: number;
  hadRecentInput: boolean;
}

export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: Map<string, number> = new Map();

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  // Mark the start of a performance measurement
  mark(name: string): void {
    if (typeof performance !== "undefined" && performance.mark) {
      performance.mark(`${name}-start`);
    }
    this.metrics.set(`${name}-start`, Date.now());
  }

  // Measure and log the time since mark was called
  measure(name: string): number {
    const startTime = this.metrics.get(`${name}-start`);
    const endTime = Date.now();

    if (startTime) {
      const duration = endTime - startTime;
      this.metrics.set(name, duration);

      if (typeof performance !== "undefined" && performance.measure) {
        try {
          performance.mark(`${name}-end`);
          performance.measure(name, `${name}-start`, `${name}-end`);
        } catch (error) {
          console.warn("Performance measurement failed:", error);
        }
      }

      // Log slow operations in development
      if (import.meta.env.DEV && duration > 100) {
        console.warn(`Slow operation detected: ${name} took ${duration}ms`);
      }

      return duration;
    }

    return 0;
  }

  // Get all recorded metrics
  getMetrics(): Record<string, number> {
    return Object.fromEntries(this.metrics);
  }

  // Log Core Web Vitals
  logWebVitals(): void {
    if (typeof performance === "undefined") return;

    // Largest Contentful Paint (LCP)
    try {
      new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        const lastEntry = entries[entries.length - 1];
        console.log("LCP:", lastEntry.startTime);
      }).observe({ entryTypes: ["largest-contentful-paint"] });
    } catch (err) {
      console.warn("LCP measurement not supported");
    }

    // First Input Delay (FID)
    try {
      new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          const fidEntry = entry as PerformanceEventTiming;
          if (fidEntry.processingStart) {
            console.log("FID:", fidEntry.processingStart - fidEntry.startTime);
          }
        }
      }).observe({ entryTypes: ["first-input"] });
    } catch (err) {
      console.warn("FID measurement not supported");
    }

    // Cumulative Layout Shift (CLS)
    try {
      let clsValue = 0;
      new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          const clsEntry = entry as LayoutShift;
          if (!clsEntry.hadRecentInput) {
            clsValue += clsEntry.value;
          }
        }
        console.log("CLS:", clsValue);
      }).observe({ entryTypes: ["layout-shift"] });
    } catch (err) {
      console.warn("CLS measurement not supported");
    }
  }

  // Report performance to analytics (placeholder)
  reportToAnalytics(metric: string, value: number): void {
    if (import.meta.env.PROD) {
      // In production, you would send this to your analytics service
      // Example: gtag('event', 'timing_complete', { name: metric, value });
      console.log(`Analytics: ${metric} = ${value}ms`);
    }
  }
}

// Export singleton instance
export const performanceMonitor = PerformanceMonitor.getInstance();

// Hook for measuring component render times
export function usePerformanceMonitor(componentName: string) {
  const monitor = PerformanceMonitor.getInstance();

  return {
    markStart: () => monitor.mark(componentName),
    measureEnd: () => {
      const duration = monitor.measure(componentName);
      monitor.reportToAnalytics(componentName, duration);
      return duration;
    },
  };
}
