import { create } from "zustand"
import { devtools, persist } from "zustand/middleware"
import type { Label, PredictionRecord } from "@/lib/api"

interface AppState {
  labels: Label[]
  records: PredictionRecord[]
  currentLabel: Label | null
  isLoading: boolean
  error: string | null

  // Actions
  setLabels: (labels: Label[]) => void
  setRecords: (records: PredictionRecord[]) => void
  setCurrentLabel: (label: Label | null) => void
  addRecord: (record: PredictionRecord) => void
  setLoading: (isLoading: boolean) => void
  setError: (error: string | null) => void
}

// Definir un estado inicial explícito
const initialState: AppState = {
  labels: [],
  records: [],
  currentLabel: null,
  isLoading: false,
  error: null,

  // Estas funciones serán sobrescritas por Zustand, pero TypeScript necesita que estén definidas
  setLabels: () => {},
  setRecords: () => {},
  setCurrentLabel: () => {},
  addRecord: () => {},
  setLoading: () => {},
  setError: () => {},
}

export const useStore = create<AppState>()(
  devtools(
    persist(
      (set) => ({
        // ... store definition (initialState and actions) ...
        ...initialState, // Ensure initialState is spread here

        setLabels: (labels) => set({ labels: Array.isArray(labels) ? labels : [] }),
        setRecords: (records) => set({ records: Array.isArray(records) ? records : [] }),
        setCurrentLabel: (label) => set({ currentLabel: label }),
        addRecord: (record) =>
          set((state) => ({
            records: [record, ...(Array.isArray(state.records) ? state.records : [])],
          })),
        setLoading: (isLoading) => set({ isLoading }),
        setError: (error) => set({ error }),
      }),
      {
        name: "signmed-storage",
        // Custom merge function to handle rehydration from localStorage.
        // This ensures that if 'labels' or 'records' arrays are missing or
        // are not arrays in the persisted state (e.g., due to an old/corrupted
        // localStorage entry or a previous bug), they are initialized as empty arrays
        // in the store, preventing 'undefined.length' errors in components.
        merge: (persistedState, currentState) => {
          const merged = { ...currentState, ...persistedState };
          if (!Array.isArray(merged.labels)) {
            merged.labels = [];
          }
          if (!Array.isArray(merged.records)) {
            merged.records = [];
          }
          // Keep other persisted state as is, or add more specific merges if needed
          return merged;
        },
        // The onRehydrateStorage can be kept for logging/debugging if needed, or removed if merge handles it.
        // For now, let's keep it but comment out its content as merge is more direct.
        onRehydrateStorage: () => (state, error) => {
          if (error) {
            console.warn("Zustand persist: An error occurred during rehydration:", error);
          }
          // console.log("Zustand persist: Rehydration complete. Current state:", state);
          // if (state) {
          //   if (!Array.isArray(state.labels)) console.warn("Rehydrated state.labels is not an array!");
          //   if (!Array.isArray(state.records)) console.warn("Rehydrated state.records is not an array!");
          // }
        },
      },
    ),
  ),
)

// Re-exportar tipos para compatibilidad
export type { Label, PredictionRecord }
