import { useEffect, useMemo, useRef } from 'react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { IPInfo } from '../stores/ipTracker';
import { createMapIcon, validateCoordinates, isDefaultPosition, formatCoordinates } from '../utils/mapUtils';

interface MapUpdaterProps {
  position: [number, number];
  ipInfo?: IPInfo | null;
}

function MapUpdater({ position, ipInfo }: MapUpdaterProps) {
  const map = useMap();

  useEffect(() => {
    console.log('🗺️ MapUpdater: New position received', position, ipInfo);
    
    if (position[0] !== 0 || position[1] !== 0) {
      map.setView(position, 13, {
        animate: true,
        duration: 1,
      });
    }
  }, [map, position, ipInfo]);

  return null;
}

interface IPMapProps {
  ipInfo?: IPInfo | null;
  className?: string;
}

export function IPMap({ ipInfo, className }: IPMapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const markerIcon = useMemo(() => createMapIcon(), []);

  const position = useMemo((): [number, number] => {
    console.log('🗺️ IPMap: Computing position from ipInfo', ipInfo);
    if (!ipInfo?.location) {
      console.log('🗺️ IPMap: No ipInfo or location, using default position (London)');
      return [51.505, -0.09]; // Default to London
    }
    const coords: [number, number] = [ipInfo.location.lat, ipInfo.location.lng];
    console.log('🗺️ IPMap: Using coordinates', coords, formatCoordinates(coords[0], coords[1]));
    return coords;
  }, [ipInfo]);

  const shouldShowMarker = useMemo(() => {
    const isValid = validateCoordinates(position[0], position[1]);
    const isDefault = isDefaultPosition(position[0], position[1]);
    
    console.log('🗺️ IPMap: Marker visibility check:', {
      position,
      isValid,
      isDefault,
      shouldShow: isValid || isDefault,
      coordinates: formatCoordinates(position[0], position[1])
    });
    
    // Show marker if coordinates are valid OR if it's the default position
    return isValid || isDefault;
  }, [position]);

  console.log('🗺️ IPMap: Rendering with', { 
    position, 
    shouldShowMarker, 
    ipInfo: ipInfo ? 'Available' : 'None',
    coordinates: formatCoordinates(position[0], position[1])
  });

  return (
    <div className={className} style={{ height: '100%', minHeight: '400px' }}>
      <MapContainer
        center={position}
        zoom={13}
        style={{ height: '100%', width: '100%' }}
        zoomControl={true}
        attributionControl={true}
        scrollWheelZoom={true}
        ref={mapRef}
        className="z-0"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        
        {shouldShowMarker && (
          <Marker 
            position={position} 
            icon={markerIcon}
          >
          </Marker>
        )}
        
        <MapUpdater position={position} ipInfo={ipInfo} />
      </MapContainer>
    </div>
  );
}
