import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface StreamStore {
  isMicOn: boolean
  isCameraOn: boolean
  isScreenSharing: boolean
  isFullScreen: boolean
  setIsMicOn: (isMicOn: boolean) => void
  setIsCameraOn: (isCameraOn: boolean) => void
  setIsScreenSharing: (isScreenSharing: boolean) => void
  setIsFullScreen: (isFullScreen: boolean) => void
}

export const useStreamStore = create<StreamStore>((set, get) => ({
  isMicOn: false, // 마이크 켜짐 여부
  isCameraOn: true, // 카메라 켜짐 여부
  isScreenSharing: false, // 화면 공유 여부
  isFullScreen: false, // 전체화면 여부
  setIsMicOn: (isMicOn: boolean) => set({ isMicOn }),
  setIsCameraOn: (isCameraOn: boolean) => set({ isCameraOn }),
  setIsScreenSharing: (isScreenSharing: boolean) => set({ isScreenSharing }),
  setIsFullScreen: (isFullScreen: boolean) => set({ isFullScreen }),
}))
