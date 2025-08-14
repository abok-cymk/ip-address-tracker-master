import { useMemo } from 'react';
import { clsx } from 'clsx';
import type { IPInfo } from '../stores/ipTracker';

interface IPInfoDisplayProps {
  ipInfo?: IPInfo | null;
  isLoading?: boolean;
  className?: string;
}

interface InfoCardProps {
  label: string;
  value: string;
  isLoading?: boolean;
  className?: string;
}

function InfoCard({ label, value, isLoading, className }: InfoCardProps) {
  return (
    <div className={clsx('text-center sm:text-left', className)}>
      <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 sm:mb-3">
        {label}
      </h3>
      <div className="min-h-[1.5rem]">
        {isLoading ? (
          <div className="flex justify-center sm:justify-start">
            <div className="w-24 h-6 bg-gray-200 rounded animate-pulse" />
          </div>
        ) : (
          <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-950 break-all">
            {value || 'N/A'}
          </p>
        )}
      </div>
    </div>
  );
}

export function IPInfoDisplay({ ipInfo, isLoading, className }: IPInfoDisplayProps) {
  const formattedData = useMemo(() => {
    if (!ipInfo) return null;

    return {
      ipAddress: ipInfo.ip,
      location: `${ipInfo.location.city}, ${ipInfo.location.region} ${ipInfo.location.postalCode}`,
      timezone: `UTC ${ipInfo.location.timezone}`,
      isp: ipInfo.isp,
    };
  }, [ipInfo]);

  return (
    <div
      className={clsx(
        'bg-white rounded-2xl shadow-lg p-6 sm:p-8',
        'w-full max-w-5xl mx-auto',
        'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8',
        'relative z-10',
        className
      )}
      role="region"
      aria-label="IP Address Information"
    >
      <InfoCard
        label="IP Address"
        value={formattedData?.ipAddress || ''}
        isLoading={isLoading}
        className="sm:border-r sm:border-gray-200 sm:pr-8"
      />
      
      <InfoCard
        label="Location"
        value={formattedData?.location || ''}
        isLoading={isLoading}
        className="lg:border-r lg:border-gray-200 lg:pr-8"
      />
      
      <InfoCard
        label="Timezone"
        value={formattedData?.timezone || ''}
        isLoading={isLoading}
        className="sm:border-r sm:border-gray-200 sm:pr-8 lg:border-r-0 lg:pr-0"
      />
      
      <InfoCard
        label="ISP"
        value={formattedData?.isp || ''}
        isLoading={isLoading}
      />
    </div>
  );
}
