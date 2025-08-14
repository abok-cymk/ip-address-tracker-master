import type { IPInfo } from "../stores/ipTracker";

const API_KEY = import.meta.env.VITE_IPIFY_API_KEY;
const BASE_URL = "https://geo.ipify.org/api/v2/country,city";
const FALLBACK_API_URL = "https://ipapi.co/json/"; // Free fallback API

// Rate limiting implementation
class RateLimiter {
  private requests: number[] = [];
  private readonly maxRequests = 10;
  private readonly timeWindow = 60000; // 1 minute

  canMakeRequest(): boolean {
    const now = Date.now();
    this.requests = this.requests.filter(
      (time) => now - time < this.timeWindow
    );

    if (this.requests.length >= this.maxRequests) {
      return false;
    }

    this.requests.push(now);
    return true;
  }

  getWaitTime(): number {
    if (this.requests.length === 0) return 0;
    const oldestRequest = Math.min(...this.requests);
    return Math.max(0, this.timeWindow - (Date.now() - oldestRequest));
  }
}

const rateLimiter = new RateLimiter();

// Cache implementation
class Cache<T> {
  private cache = new Map<string, { data: T; timestamp: number }>();
  private readonly ttl = 5 * 60 * 1000; // 5 minutes

  get(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    if (Date.now() - entry.timestamp > this.ttl) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  set(key: string, data: T): void {
    this.cache.set(key, { data, timestamp: Date.now() });
  }

  clear(): void {
    this.cache.clear();
  }
}

const ipCache = new Cache<IPInfo>();

// Mock data for development when no API key is available
const mockIPData: IPInfo = {
  ip: "192.168.1.1",
  location: {
    city: "Brooklyn",
    region: "NY",
    country: "US",
    postalCode: "11201",
    timezone: "-05:00",
    lat: 40.6892,
    lng: -73.9442,
  },
  isp: "SpaceX Starlink",
};

export class IPTrackerError extends Error {
  public code:
    | "RATE_LIMIT"
    | "NETWORK"
    | "INVALID_INPUT"
    | "API_ERROR"
    | "NO_API_KEY";

  constructor(
    message: string,
    code:
      | "RATE_LIMIT"
      | "NETWORK"
      | "INVALID_INPUT"
      | "API_ERROR"
      | "NO_API_KEY" = "API_ERROR"
  ) {
    super(message);
    this.name = "IPTrackerError";
    this.code = code;
  }
}

function validateIPAddress(ip: string): boolean {
  const ipv4Regex =
    /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  const ipv6Regex = /^(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/;
  return ipv4Regex.test(ip) || ipv6Regex.test(ip);
}

function validateDomain(domain: string): boolean {
  const domainRegex =
    /^(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)*[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?$/;
  return domainRegex.test(domain) && domain.length <= 253;
}

// Fallback API for when IPify is not available
async function fetchFromFallbackAPI(): Promise<IPInfo> {
  try {
    const response = await fetch(FALLBACK_API_URL);
    if (!response.ok) {
      throw new Error(`Fallback API failed: ${response.status}`);
    }

    const data = await response.json();

    return {
      ip: data.ip || "Unknown",
      location: {
        city: data.city || "Unknown",
        region: data.region || "Unknown",
        country: data.country_name || data.country || "Unknown",
        postalCode: data.postal || "Unknown",
        timezone: data.timezone || "Unknown",
        lat: data.latitude || 0,
        lng: data.longitude || 0,
      },
      isp: data.org || "Unknown",
    };
  } catch (error) {
    console.warn("Fallback API also failed, using mock data:", error);
    return mockIPData;
  }
}

// Check if we have a valid API key
function hasValidAPIKey(): boolean {
  return Boolean(
    API_KEY && API_KEY !== "at_test_key" && API_KEY.startsWith("at_")
  );
}

export async function fetchIPInfo(query?: string): Promise<IPInfo> {
  // Check if we have a valid API key, if not use fallback
  if (!hasValidAPIKey()) {
    console.warn("No valid IPify API key found, using fallback API");
    if (!query) {
      return fetchFromFallbackAPI();
    } else {
      // For specific queries without API key, return mock data with user input
      return {
        ...mockIPData,
        ip: validateIPAddress(query) ? query : mockIPData.ip,
      };
    }
  }

  // Check rate limit
  if (!rateLimiter.canMakeRequest()) {
    const waitTime = rateLimiter.getWaitTime();
    throw new IPTrackerError(
      `Rate limit exceeded. Please wait ${Math.ceil(waitTime / 1000)} seconds.`,
      "RATE_LIMIT"
    );
  }

  const cacheKey = query || "current";

  // Check cache first
  const cached = ipCache.get(cacheKey);
  if (cached) {
    return cached;
  }

  // Validate input if provided
  if (query) {
    const isValidIP = validateIPAddress(query);
    const isValidDomain = validateDomain(query);

    if (!isValidIP && !isValidDomain) {
      throw new IPTrackerError(
        "Please enter a valid IP address or domain name.",
        "INVALID_INPUT"
      );
    }
  }

  try {
    const url = new URL(BASE_URL);
    url.searchParams.set("apiKey", API_KEY!);
    if (query) {
      if (validateIPAddress(query)) {
        url.searchParams.set("ipAddress", query);
      } else {
        url.searchParams.set("domain", query);
      }
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

    const response = await fetch(url.toString(), {
      signal: controller.signal,
      headers: {
        Accept: "application/json",
      },
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      if (response.status === 429) {
        throw new IPTrackerError(
          "Rate limit exceeded. Please try again later.",
          "RATE_LIMIT"
        );
      }
      if (response.status === 403) {
        console.warn(
          "API key invalid or expired, falling back to alternative API"
        );
        return fetchFromFallbackAPI();
      }
      if (response.status === 422) {
        throw new IPTrackerError(
          "Invalid IP address or domain provided.",
          "INVALID_INPUT"
        );
      }
      throw new IPTrackerError(
        `API request failed: ${response.status}`,
        "API_ERROR"
      );
    }

    const data = await response.json();

    const ipInfo: IPInfo = {
      ip: data.ip,
      location: {
        city: data.location.city || "Unknown",
        region: data.location.region || "Unknown",
        country: data.location.country || "Unknown",
        postalCode: data.location.postalCode || "Unknown",
        timezone: data.location.timezone || "Unknown",
        lat: data.location.lat || 0,
        lng: data.location.lng || 0,
      },
      isp: data.isp || "Unknown",
    };

    // Cache the result
    ipCache.set(cacheKey, ipInfo);

    return ipInfo;
  } catch (error) {
    if (error instanceof IPTrackerError) {
      throw error;
    }

    if (error instanceof DOMException && error.name === "AbortError") {
      throw new IPTrackerError("Request timeout. Please try again.", "NETWORK");
    }

    throw new IPTrackerError(
      "Network error occurred. Please check your connection and try again.",
      "NETWORK"
    );
  }
}

export async function getCurrentUserIP(): Promise<IPInfo> {
  return fetchIPInfo();
}

export function clearCache(): void {
  ipCache.clear();
}
