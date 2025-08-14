import type { IPInfo } from '../stores/ipTracker';
import { validateCoordinates, formatCoordinates, isDefaultPosition } from '../utils/mapUtils';

interface DebugPanelProps {
  ipInfo?: IPInfo | null;
  isLoading?: boolean;
}

export function DebugPanel({ ipInfo, isLoading }: DebugPanelProps) {
  if (!import.meta.env.DEV) return null;

  const coords = ipInfo?.location ? [ipInfo.location.lat, ipInfo.location.lng] : [0, 0];
  const isValidCoords = validateCoordinates(coords[0], coords[1]);
  const isDefault = isDefaultPosition(coords[0], coords[1]);

  return (
    <div 
      className="fixed bottom-4 right-4 bg-black bg-opacity-90 text-white p-4 rounded-lg text-xs max-w-md z-50 border border-gray-600"
      style={{ fontFamily: 'monospace' }}
    >
      <h3 className="font-bold mb-2 text-yellow-400">🐛 Debug Info</h3>
      <div className="space-y-1 text-green-300">
        <div>
          <strong className="text-white">Loading:</strong> {isLoading ? '🔄 Yes' : '✅ No'}
        </div>
        <div>
          <strong className="text-white">IP Info:</strong> {ipInfo ? '✅ Available' : '❌ None'}
        </div>
        {ipInfo && (
          <>
            <div>
              <strong className="text-white">IP:</strong> {ipInfo.ip}
            </div>
            <div>
              <strong className="text-white">Location:</strong> {ipInfo.location.city}, {ipInfo.location.region}
            </div>
            <div>
              <strong className="text-white">Raw Coordinates:</strong> {coords[0]}, {coords[1]}
            </div>
            <div>
              <strong className="text-white">Formatted:</strong> {formatCoordinates(coords[0], coords[1])}
            </div>
            <div>
              <strong className="text-white">Valid Coords:</strong> {isValidCoords ? '✅ Yes' : '❌ No'}
            </div>
            <div>
              <strong className="text-white">Default Position:</strong> {isDefault ? '🏠 Yes (London)' : '🌍 No'}
            </div>
            <div>
              <strong className="text-white">Should Show Marker:</strong> {(isValidCoords || isDefault) ? '📍 Yes' : '❌ No'}
            </div>
            <div>
              <strong className="text-white">ISP:</strong> {ipInfo.isp}
            </div>
          </>
        )}
        <div>
          <strong className="text-white">API Key:</strong> {
            import.meta.env.VITE_IPIFY_API_KEY 
              ? (import.meta.env.VITE_IPIFY_API_KEY === 'at_test_key' ? '🔑 Test Key' : '✅ Valid') 
              : '❌ None'
          }
        </div>
      </div>
    </div>
  );
}
