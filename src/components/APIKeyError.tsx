import { useState, useCallback } from 'react';
import { clsx } from 'clsx';

interface APIKeyErrorProps {
  onDismiss?: () => void;
  className?: string;
}

export function APIKeyError({ onDismiss, className }: APIKeyErrorProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpanded = useCallback(() => {
    setIsExpanded(!isExpanded);
  }, [isExpanded]);

  return (
    <div
      className={clsx(
        'bg-amber-50 border border-amber-200 rounded-lg p-4 max-w-2xl mx-auto',
        className
      )}
      role="alert"
    >
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <svg
            className="h-5 w-5 text-amber-400"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <div className="ml-3 flex-1">
          <h3 className="text-sm font-medium text-amber-800">
            Demo Mode Active - API Key Required for Full Functionality
          </h3>
          <div className="mt-2 text-sm text-amber-700">
            <p>
              The app is currently using demo data. To track real IP addresses, you'll need a free API key from IPify.
            </p>
            {isExpanded && (
              <div className="mt-3 space-y-2">
                <p className="font-medium">Quick Setup (2 minutes):</p>
                <ol className="list-decimal list-inside space-y-1 ml-2">
                  <li>
                    Visit{' '}
                    <a
                      href="https://geo.ipify.org/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline font-medium hover:text-amber-900"
                    >
                      geo.ipify.org
                    </a>
                  </li>
                  <li>Sign up for a free account (no credit card required)</li>
                  <li>Copy your API key (starts with "at_")</li>
                  <li>Create a <code className="bg-amber-100 px-1 rounded">.env</code> file in the project root</li>
                  <li>Add: <code className="bg-amber-100 px-1 rounded">VITE_IPIFY_API_KEY=your_key_here</code></li>
                  <li>Restart the development server</li>
                </ol>
                <p className="text-xs mt-2">
                  <strong>Note:</strong> The free tier includes 1,000 requests per month, which is perfect for development and testing.
                </p>
              </div>
            )}
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={toggleExpanded}
              className="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded hover:bg-amber-200 transition-colors"
            >
              {isExpanded ? 'Hide Setup' : 'Show Setup Instructions'}
            </button>
            <a
              href="https://geo.ipify.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs bg-amber-800 text-white px-2 py-1 rounded hover:bg-amber-900 transition-colors"
            >
              Get Free API Key
            </a>
            {onDismiss && (
              <button
                type="button"
                onClick={onDismiss}
                className="text-xs text-amber-600 hover:text-amber-800 underline"
              >
                Dismiss
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
