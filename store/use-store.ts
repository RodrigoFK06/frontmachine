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
        ...initialState, // Usar el estado inicial explícito

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
        // Asegurarnos de que el estado inicial se use si hay algún problema con el almacenamiento persistente
        onRehydrateStorage: () => (state) => {
          if (!state) return

          // Asegurarnos de que los arrays existan
          if (!Array.isArray(state.labels)) state.labels = []
          if (!Array.isArray(state.records)) state.records = []
        },
      },
    ),
  ),
)

// Re-exportar tipos para compatibilidad
export type { Label, PredictionRecord }
