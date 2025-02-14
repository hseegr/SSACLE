import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface RoomStateStore {
  // 현재 접속한 방 아이디
  roomId: string
  setRoomId: (roomId: string) => void

  // 각 roomId별 참여자 데이터
  roomConnectionData: Record<
    string, // roomId key
    Record<
      string, // 참여자에 대한 key (예: userId)
      {
        username: string
        userId: string
      }
    >
  >

  // 특정 roomId에 참여자 데이터를 추가하는 메서드
  addRoomConnectionData: (
    roomId: string,
    newData: Record<
      string,
      {
        username: string
        userId: string
      }
    >
  ) => void

  // 특정 roomId의 참여자 데이터를 삭제하는 메서드
  removeRoomConnectionData: (
    roomId: string,
    deleteData: Record<
      string,
      {
        username: string
        userId: string
      }
    >
  ) => void

  // 방의 진행 상태
  roomProgress: string
  setRoomProgress: (roomProgress: string) => void
}

const useRoomStateStore = create<RoomStateStore>()(
  persist(
    (set, get) => ({
      roomId: '', // 현재 방 아이디
      roomProgress: '', // 현재 진행 단계
      roomConnectionData: {}, // 각 roomId별 참여자 데이터 초기값

      setRoomId: (roomId: string) => set({ roomId }),

      setRoomProgress: (roomProgress: string) => set({ roomProgress }),

      // 특정 roomId에 참여자를 추가합니다.
      addRoomConnectionData: (roomId: string, newData) =>
        set((state) => ({
          roomConnectionData: {
            ...state.roomConnectionData,
            [roomId]: {
              // 이미 해당 roomId의 데이터가 있다면 기존 데이터를 유지하면서 새 데이터를 병합합니다.
              ...(state.roomConnectionData[roomId] || {}),
              ...newData,
            },
          },
        })),

      // 특정 roomId의 참여자 데이터를 삭제합니다.
      removeRoomConnectionData: (roomId: string, deleteData) =>
        set((state) => ({
          roomConnectionData: {
            ...state.roomConnectionData,
            [roomId]: Object.fromEntries(
              // 해당 roomId의 참가자 목록이 없을 수도 있으므로 기본값 {}를 사용
              Object.entries(state.roomConnectionData[roomId] || {}).filter(
                ([key]) => !deleteData[key]
              )
            ),
          },
        })),
    }),
    {
      name: 'room-state-store',
    }
  )
)

export default useRoomStateStore
