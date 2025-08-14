import { useForm } from 'react-hook-form';
import { useCallback, useRef, useEffect } from 'react';
import { clsx } from 'clsx';
import { useSearchIP, usePrefetchIP } from '../hooks/useIPTracker';

interface SearchFormData {
  query: string;
}

interface SearchFormProps {
  className?: string;
  onSearch?: (query: string) => void;
}

export function SearchForm({ className, onSearch }: SearchFormProps) {
  const { searchIP, isLoading } = useSearchIP();
  const prefetchIP = usePrefetchIP();
  const debounceTimeoutRef = useRef<number>(0);
  const searchTimeoutRef = useRef<number>(0);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
  } = useForm<SearchFormData>({
    mode: 'onChange',
    defaultValues: {
      query: '',
    },
  });

  const queryValue = watch('query');

  // Debounced search function
  const debouncedSearch = useCallback(
    (query: string) => {
      // Clear existing timeout
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }

      const trimmedQuery = query.trim();
      
      // Only search if query is valid
      if (trimmedQuery.length >= 2) {
        searchTimeoutRef.current = window.setTimeout(() => {
          searchIP(trimmedQuery);
          onSearch?.(trimmedQuery);
        }, 800); // 800ms delay for auto-search
      }
    },
    [searchIP, onSearch]
  );

  // Debounced prefetch function
  const debouncedPrefetch = useCallback(
    (query: string) => {
      // Clear existing timeout
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }

      const trimmedQuery = query.trim();
      
      // Prefetch if query is long enough
      if (trimmedQuery.length >= 4) {
        debounceTimeoutRef.current = window.setTimeout(() => {
          prefetchIP(trimmedQuery);
        }, 300); // 300ms delay for prefetch
      }
    },
    [prefetchIP]
  );

  // Handle input change with debouncing
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      
      // Prefetch data for performance
      debouncedPrefetch(value);
      
      // Auto-search after typing stops
      debouncedSearch(value);
    },
    [debouncedPrefetch, debouncedSearch]
  );

  // Manual submit handler
  const onSubmit = useCallback(
    (data: SearchFormData) => {
      // Clear any pending debounced searches
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }

      const trimmedQuery = data.query.trim();
      if (trimmedQuery) {
        searchIP(trimmedQuery);
        onSearch?.(trimmedQuery);
      }
    },
    [searchIP, onSearch]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && !isLoading && isValid) {
        e.preventDefault();
        handleSubmit(onSubmit)();
      }
    },
    [handleSubmit, onSubmit, isLoading, isValid]
  );

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={clsx(
        'relative flex items-center bg-white rounded-2xl shadow-lg overflow-hidden',
        'max-w-md sm:max-w-lg w-full',
        className
      )}
      role="search"
      aria-label="IP address search"
    >
      <div className="flex-1 relative">
        <input
          {...register('query', {
            required: 'Please enter an IP address or domain',
            minLength: {
              value: 2,
              message: 'Please enter at least 2 characters',
            },
            maxLength: {
              value: 253,
              message: 'Search term is too long',
            },
            pattern: {
              value: /^[a-zA-Z0-9.-_]+$/,
              message: 'Please enter a valid IP address or domain',
            },
            onChange: handleInputChange,
          })}
          type="text"
          placeholder="Search for any IP address or domain"
          className={clsx(
            'w-full px-6 py-4 text-lg text-gray-950 placeholder-gray-400',
            'border-none outline-none bg-transparent',
            'focus:ring-0 focus:outline-none',
            'transition-colors duration-200',
            errors.query && 'text-red-500',
            isLoading && 'bg-gray-50'
          )}
          onKeyDown={handleKeyDown}
          autoComplete="off"
          autoCapitalize="off"
          autoCorrect="off"
          spellCheck="false"
          aria-invalid={errors.query ? 'true' : 'false'}
          aria-describedby={errors.query ? 'search-error' : undefined}
          disabled={isLoading}
        />
        
        {/* Loading indicator inside input */}
        {isLoading && (
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
            <div
              className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"
              aria-hidden="true"
            />
          </div>
        )}
        
        {errors.query && (
          <div
            id="search-error"
            className="absolute top-full left-6 mt-1 text-sm text-red-500 bg-white px-2 py-1 rounded shadow-sm z-10"
            role="alert"
          >
            {errors.query.message}
          </div>
        )}
      </div>

      <button
        type="submit"
        disabled={isLoading || !isValid || !queryValue?.trim()}
        className={clsx(
          'flex items-center justify-center px-6 py-4 bg-gray-950 text-white',
          'transition-all duration-200 ease-in-out',
          'hover:bg-gray-800 focus:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-950 focus:ring-offset-2',
          'disabled:bg-gray-400 disabled:cursor-not-allowed',
          'min-w-[60px] relative'
        )}
        aria-label="Search"
      >
        {isLoading ? (
          <div
            className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"
            aria-hidden="true"
          />
        ) : (
          <svg
            width="11"
            height="14"
            viewBox="0 0 11 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            className="w-3 h-4"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M2 0L9 7L2 14"
              stroke="currentColor"
              strokeWidth="3"
            />
          </svg>
        )}
      </button>
    </form>
  );
}
