import { create } from 'zustand'
import { persist, PersistOptions } from 'zustand/middleware'

interface SignalStateStore {
  signalState: string
  setSignalState: (signalState: string) => void
}

type SignalStatePersist = PersistOptions<SignalStateStore>

export const useSignalStateStore = create<SignalStateStore>()(
  persist(
    (set) => ({
      signalState: '',
      setSignalState: (signalState) => set({ signalState }),
    }),
    {
      name: 'signal-state-store',
    } as SignalStatePersist
  )
)
