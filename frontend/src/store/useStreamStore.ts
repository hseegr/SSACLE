import { create } from 'zustand'

interface StreamStore {
  isMicOn: boolean
  isCameraOn: boolean
  isScreenSharing: boolean
  setIsMicOn: (isMicOn: boolean) => void
  setIsCameraOn: (isCameraOn: boolean) => void
  setIsScreenSharing: (isScreenSharing: boolean) => void
}

export const useStreamStore = create<StreamStore>((set, get) => ({
  isMicOn: false, // 마이크 켜짐 여부
  isCameraOn: false, // 카메라 켜짐 여부
  isScreenSharing: false, // 화면 공유 여부

  setIsMicOn: (isMicOn: boolean) => set({ isMicOn }),
  setIsCameraOn: (isCameraOn: boolean) => set({ isCameraOn }),
  setIsScreenSharing: (isScreenSharing: boolean) => set({ isScreenSharing }),

  // toggleMicrophone: () => {
  //   const { publisher, isMicOn } = get()
  //   if (publisher) {
  //     const newMicState = !isMicOn
  //     publisher.publishAudio(newMicState)
  //     set({ isMicOn: newMicState })
  //     console.log('마이크 상태:', newMicState ? '켜짐' : '꺼짐')
  //   } else {
  //     console.warn('Publisher가 초기화되지 않았습니다.')
  //   }
  // },

  // toggleCamera: () => {
  //   const { publisher, isCameraOn } = get()
  //   if (publisher) {
  //     const newCameraState = !isCameraOn
  //     publisher.publishVideo(newCameraState)
  //     set({ isCameraOn: newCameraState })
  //     console.log('카메라 상태:', newCameraState ? '켜짐' : '꺼짐')
  //   } else {
  //     console.warn('Publisher가 초기화되지 않았습니다.')
  //   }
  // },

  // toggleScreenSharing: () => {
  //   const { publisher, isScreenSharing } = get()
  //   if (publisher) {
  //     const newScreenSharingState = !isScreenSharing
  //     publisher.publishScreen(newScreenSharingState)
  //     set({ isScreenSharing: newScreenSharingState })
  //     console.log('화면공유 상태:', newScreenSharingState ? '켜짐' : '꺼짐')
  //   } else {
  //     console.warn('Publisher가 초기화되지 않았습니다.')
  //   }
  // },
}))
