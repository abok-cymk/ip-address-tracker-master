
import { useEffect, Suspense, lazy, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { clsx } from 'clsx';
import { SearchForm } from './components/SearchForm';
import { IPInfoDisplay } from './components/IPInfoDisplay';
import { ErrorBoundary } from './components/ErrorBoundary';
// import { DebugPanel } from './components/DebugPanel';
import { APIKeyError } from './components/APIKeyError';
import { useCurrentIP } from './hooks/useIPTracker';
import { useIPTrackerStore } from './stores/ipTracker';
import { performanceMonitor } from './utils/performance';

// Lazy load the map component for better performance
const IPMap = lazy(() => 
  import('./components/IPMap').then(module => ({ default: module.IPMap }))
);

// Create a stable query client instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
      refetchOnWindowFocus: false,
      retry: 2,
    },
    mutations: {
      retry: 1,
    },
  },
});

function AppContent() {
  const { currentIP, isLoading, error } = useIPTrackerStore();
  const { data: initialIP, isLoading: isLoadingInitial } = useCurrentIP();
  const [apiKeyErrorDismissed, setApiKeyErrorDismissed] = useState(false);

  // Check if we have a valid API key
  const hasValidAPIKey = Boolean(
    import.meta.env.VITE_IPIFY_API_KEY && 
    import.meta.env.VITE_IPIFY_API_KEY !== "at_test_key" && 
    import.meta.env.VITE_IPIFY_API_KEY.startsWith("at_")
  );

  useEffect(() => {
    // Initialize performance monitoring
    performanceMonitor.logWebVitals();
    
    // Preload critical resources
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = '/pattern-bg-desktop.png';
    link.as = 'image';
    document.head.appendChild(link);

    return () => {
      document.head.removeChild(link);
    };
  }, []);

  const displayIP = currentIP || initialIP;
  const isLoadingAny = isLoading || isLoadingInitial;

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header Section */}
      <header 
        className={clsx(
          'relative bg-cover bg-center bg-no-repeat',
          'px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16',
          'flex flex-col items-center justify-center',
          'min-h-[280px] sm:min-h-[320px]'
        )}
        style={{
          backgroundImage: window.innerWidth >= 768 
            ? `url('/pattern-bg-desktop.png')` 
            : `url('/pattern-bg-mobile.png')`,
        }}
      >
        <div className="w-full max-w-2xl mx-auto text-center space-y-6 sm:space-y-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-medium text-white">
            IP Address Tracker
          </h1>
          
          <SearchForm className="mx-auto" />
          
          {error && (
            <div 
              className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg max-w-md mx-auto"
              role="alert"
            >
              {error}
            </div>
          )}
        </div>
      </header>

      {/* API Key Warning */}
      {!hasValidAPIKey && !apiKeyErrorDismissed && (
        <section className="px-4 sm:px-6 lg:px-8 py-4">
          <APIKeyError onDismiss={() => setApiKeyErrorDismissed(true)} />
        </section>
      )}

      {/* IP Info Section */}
      <section className="relative -mt-16 sm:-mt-20 px-4 sm:px-6 lg:px-8 z-20"
        style={{ marginTop: !hasValidAPIKey && !apiKeyErrorDismissed ? '-4rem' : undefined }}
      >
        <IPInfoDisplay 
          ipInfo={displayIP} 
          isLoading={isLoadingAny}
        />
      </section>

      {/* Map Section */}
      <main className="flex-1 relative">
        <ErrorBoundary
          fallback={
            <div className="h-full bg-gray-200 flex items-center justify-center">
              <p className="text-gray-600">Map could not be loaded</p>
            </div>
          }
        >
          <Suspense 
            fallback={
              <div className="h-full bg-gray-100 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-8 h-8 border-4 border-gray-300 border-t-gray-600 rounded-full animate-spin mx-auto mb-2" />
                  <p className="text-gray-600">Loading map...</p>
                </div>
              </div>
            }
          >
            <IPMap ipInfo={displayIP} className="h-full min-h-[400px]" />
          </Suspense>
        </ErrorBoundary>
      </main>

      {/* Debug Panel for development */}
      {/* <DebugPanel ipInfo={displayIP} isLoading={isLoadingAny} /> */}
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AppContent />
        {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
