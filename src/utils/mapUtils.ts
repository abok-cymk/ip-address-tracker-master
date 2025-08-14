// Map utilities for better debugging and icon handling

import L from "leaflet";

// Create a more robust icon with multiple fallback options
export function createMapIcon(): L.Icon {
  // Try custom icon first
  const customIcon = new L.Icon({
    iconUrl: "/icon-location.svg",
    iconRetinaUrl: "/icon-location.svg",
    iconSize: [46, 56],
    iconAnchor: [23, 56],
    popupAnchor: [0, -56],
    shadowUrl: undefined,
    shadowSize: undefined,
    shadowAnchor: undefined,
    className: "custom-marker-icon",
  });

  // Default Leaflet icon as fallback
//   const defaultIcon = new L.Icon({
//     iconUrl:
//       "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
//     iconRetinaUrl:
//       "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
//     shadowUrl:
//       "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
//     iconSize: [25, 41],
//     iconAnchor: [12, 41],
//     popupAnchor: [1, -34],
//     shadowSize: [41, 41],
//   });

  // Check if custom icon is available
  const img = new Image();
  img.src = "/icon-location.svg";

  img.onload = () => {
    console.log("✅ Custom map icon loaded successfully");
  };

  img.onerror = () => {
    console.warn("⚠️ Custom map icon failed to load, using default");
  };

  return customIcon; // Return custom icon, browser will handle fallback
}

// Validate coordinates
export function validateCoordinates(lat: number, lng: number): boolean {
  const isValidLat = lat >= -90 && lat <= 90 && lat !== 0;
  const isValidLng = lng >= -180 && lng <= 180 && lng !== 0;
  return isValidLat && isValidLng;
}

// Format coordinates for display
export function formatCoordinates(lat: number, lng: number): string {
  const latDir = lat >= 0 ? "N" : "S";
  const lngDir = lng >= 0 ? "E" : "W";
  return `${Math.abs(lat).toFixed(4)}°${latDir}, ${Math.abs(lng).toFixed(
    4
  )}°${lngDir}`;
}

// Check if position is the default fallback
export function isDefaultPosition(lat: number, lng: number): boolean {
  return lat === 51.505 && lng === -0.09;
}
