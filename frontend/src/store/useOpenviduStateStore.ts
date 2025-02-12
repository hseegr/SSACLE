import {
  OpenVidu,
  Publisher,
  Session,
  StreamManager,
  Subscriber,
} from 'openvidu-browser'
import { create } from 'zustand'

interface OpenviduStateStore {
  OV: OpenVidu | null
  session: Session | null
  publisher: Publisher | null
  subscribers: StreamManager[]
  mainStreamManager: StreamManager | null
  setOV: (OV: OpenVidu | null) => void
  setSession: (session: Session | null) => void
  setPublisher: (publisher: Publisher | null) => void
  setSubscribers: (subscribers: StreamManager[]) => void
  setMainStreamManager: (mainStreamManager: StreamManager | null) => void
}

export const useOpenviduStateStore = create<OpenviduStateStore>((set, get) => ({
  OV: null, // OpenVidu 인스턴스
  session: null, // 세션
  publisher: null, // 발행자
  subscribers: [], // 구독자
  mainStreamManager: null, // 메인 스트림 매니저
  setOV: (OV: OpenVidu | null) => set({ OV }),
  setSession: (session: Session | null) => set({ session }),
  setPublisher: (publisher: Publisher | null) => set({ publisher }),
  setSubscribers: (
    subscribers: StreamManager[] | ((prev: StreamManager[]) => StreamManager[])
  ) =>
    set((state) => ({
      subscribers:
        typeof subscribers === 'function'
          ? subscribers(state.subscribers)
          : subscribers,
    })),
  setMainStreamManager: (mainStreamManager: StreamManager | null) =>
    set({ mainStreamManager }),
}))
