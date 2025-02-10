import { create } from 'zustand'

export const useOpenViduStore = create((set, get) => ({
  publisher: null, // 퍼블리셔
  isMicOn: true, // 마이크 켜짐 여부
  isCameraOn: true, // 카메라 켜짐 여부
  isScreenOn: false, // 화면 공유 여부

  setPublisher: (publisher) => set({ publisher }),

  toggleMicrophone: () => {
    const { publisher, isMicOn } = get()
    if (publisher) {
      const newMicState = !isMicOn
      publisher.publishAudio(newMicState)
      set({ isMicOn: newMicState })
      console.log('마이크 상태:', newMicState ? '켜짐' : '꺼짐')
    } else {
      console.warn('Publisher가 초기화되지 않았습니다.')
    }
  },

  toggleCamera: () => {
    const { publisher, isCameraOn } = get()
    if (publisher) {
      const newCameraState = !isCameraOn
      publisher.publishVideo(newCameraState)
      set({ isCameraOn: newCameraState })
      console.log('카메라 상태:', newCameraState ? '켜짐' : '꺼짐')
    } else {
      console.warn('Publisher가 초기화되지 않았습니다.')
    }
  },
}))
