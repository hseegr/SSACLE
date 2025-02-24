import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import {
  PRESENTATION_STATUS,
  PresentationStatus,
} from '@/constants/presentationStatus'
import { serializeStorage } from '@/lib/serializeStoage'

export type SignalStateKeys = {
  [K in PresentationStatus]: Extract<(typeof PRESENTATION_STATUS)[K], string>
}

// SignalStateKeys에서 유니온 타입 추출 후, 이를 키로 하는 타입 정의
type SignalState = {
  [K in SignalStateKeys[keyof SignalStateKeys]]: Set<string>
}

// 스토어 상태 타입 정의 - state 타입
interface StoreState {
  presentationStatus: PresentationStatus // 현재 발표 상태
  signalStates: SignalState // 시그널 상태 : 각각의 시그널 타입에 대한 연결된 참가자 ID 목록
  timestamp?: number // 스토어 생성 시간
}

// 스토어 상태 타입 정의
interface PresentationSignalStore extends StoreState {
  // 발표 상태 설정
  setPresentationStatus: (status: PresentationStatus) => void

  // 시그널 연결 추가
  addSignalConnection: (
    signalType: SignalStateKeys[keyof SignalStateKeys], // 시그널 타입
    connectionId: string // 연결 ID
  ) => void

  // 시그널 연결 제거
  clearSignalConnections: (
    signalType: SignalStateKeys[keyof SignalStateKeys]
  ) => void

  // 스토어 초기화
  resetStore: () => void
}

// 초기 신호 상태 타입 정의 : 이제 LOWERCASE를 사용하지 않고 값 그대로 사용
const initialSignalStates: SignalState = Object.values(
  PRESENTATION_STATUS
).reduce(
  (acc, status) => ({
    ...acc,
    [status]: new Set<string>(),
  }),
  {} as SignalState
)

// 초기 상태 정의
const initialState: StoreState = {
  presentationStatus: 'INITIAL', // 초기 발표 상태 (Key 값으로 비교)
  signalStates: initialSignalStates, // 초기 시그널 상태 (벨류값)
  timestamp: Date.now(), // 스토어 생성 시간
}

export const usePresentationSignalStore = create<PresentationSignalStore>()(
  persist(
    (set) => ({
      ...initialState, // 초기 상태

      // 발표 상태 설정
      setPresentationStatus: (status) => set({ presentationStatus: status }),

      // 시그널 연결 추가 : 시그널 상태에 해당 connectionId를 추가
      addSignalConnection: (signalType, connectionId) =>
        set((state) => ({
          signalStates: {
            ...state.signalStates,
            [signalType]: new Set([
              ...state.signalStates[signalType],
              connectionId,
            ]),
          },
        })),

      // 시그널 연결 제거 : 시그널 상태에 해당 타입의 모든 연결을 제거
      clearSignalConnections: (signalType) =>
        set((state) => ({
          signalStates: {
            ...state.signalStates,
            [signalType]: new Set<string>(),
          },
        })),
      // 스토어 초기화
      resetStore: () => set(initialState),
    }),
    {
      name: 'presentation-signal-store',
      storage: createJSONStorage(() => serializeStorage),
      partialize: (state) => ({
        ...state,
        timestamp: Date.now(),
      }),
      // 24시간 이후 스토어 초기화
      onRehydrateStorage: () => {
        return (state) => {
          if (
            state &&
            Date.now() - (state.timestamp ?? 0) > 24 * 60 * 60 * 1000
          ) {
            usePresentationSignalStore.getState().resetStore()
          }
        }
      },
    }
  )
)

// 지속된 상태 제거
export const clearPersistedState = (): void => {
  localStorage.removeItem('presentation-signal-store')
  usePresentationSignalStore.getState().resetStore()
}
