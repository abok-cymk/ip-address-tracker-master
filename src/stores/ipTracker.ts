import { create } from "zustand";
import { devtools } from "zustand/middleware";

export interface IPInfo {
  ip: string;
  location: {
    city: string;
    region: string;
    country: string;
    postalCode: string;
    timezone: string;
    lat: number;
    lng: number;
  };
  isp: string;
}

interface IPTrackerState {
  currentIP: IPInfo | null;
  isLoading: boolean;
  error: string | null;
  searchHistory: string[];
  setCurrentIP: (ip: IPInfo) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  addToHistory: (query: string) => void;
  clearError: () => void;
}

export const useIPTrackerStore = create<IPTrackerState>()(
  devtools(
    (set) => ({
      currentIP: null,
      isLoading: false,
      error: null,
      searchHistory: [],

      setCurrentIP: (ip) =>
        set({ currentIP: ip, error: null }, false, "setCurrentIP"),

      setLoading: (loading) => set({ isLoading: loading }, false, "setLoading"),

      setError: (error) => set({ error, isLoading: false }, false, "setError"),

      addToHistory: (query) =>
        set(
          (state) => ({
            searchHistory: [
              query,
              ...state.searchHistory.filter((h) => h !== query),
            ].slice(0, 10),
          }),
          false,
          "addToHistory"
        ),

      clearError: () => set({ error: null }, false, "clearError"),
    }),
    { name: "ip-tracker-store" }
  )
);
