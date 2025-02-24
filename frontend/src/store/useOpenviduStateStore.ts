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
  cameraPublisher: Publisher | null
  screenPublisher: Publisher | null
  mainStreamManager: StreamManager | null
  subscribers: StreamManager[]
  myConnectionId: string | null
  setOV: (OV: OpenVidu | null) => void
  setSession: (session: Session | null) => void
  setCameraPublisher: (cameraPublisher: Publisher | null) => void
  setScreenPublisher: (screenPublisher: Publisher | null) => void
  setSubscribers: (subscribers: StreamManager) => void
  setMainStreamManager: (mainStreamManager: StreamManager | null) => void
  setMyConnectionId: (myConnectionId: string | null) => void
}

export const useOpenviduStateStore = create<OpenviduStateStore>((set, get) => ({
  OV: null, // OpenVidu 인스턴스
  session: null, // 세션
  cameraPublisher: null, // 카메라 발행자
  screenPublisher: null, // 화면 공유 발행자
  mainStreamManager: null, // 현재 사용자의 스트림 매니저
  subscribers: [], // 구독자
  myConnectionId: null, // 내 연결 ID
  setOV: (OV: OpenVidu | null) => set({ OV }),
  setSession: (session: Session | null) => set({ session }),
  setCameraPublisher: (cameraPublisher: Publisher | null) =>
    set({ cameraPublisher }),
  setScreenPublisher: (screenPublisher: Publisher | null) =>
    set({ screenPublisher }),
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
  setMyConnectionId: (myConnectionId: string | null) => set({ myConnectionId }),
}))
