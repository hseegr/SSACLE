import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface RoomConnectionData {
  username: string
  userId: string
  connectionId: string
}

interface RoomStateStore {
  // 현재 접속한 방 아이디
  roomId: string
  setRoomId: (roomId: string) => void
  connectionId: string

  roomConnectionData: Record<string, Array<RoomConnectionData>>

  // 특정 roomId에 참여자 데이터를 추가하는 메서드
  addRoomConnectionData: (roomId: string, newData: RoomConnectionData) => void

  // 특정 roomId의 참여자 데이터를 삭제하는 메서드
  removeRoomConnectionData: (
    roomId: string,
    deleteData: RoomConnectionData
  ) => void

  // 방의 진행 상태
  roomProgress: string
  setRoomProgress: (roomProgress: string) => void
}

const useRoomStateStore = create<RoomStateStore>()(
  persist(
    (set, get) => ({
      roomId: '', // 현재 방 아이디
      connectionId: '', // 현재 접속한 참여자 아이디
      roomProgress: '', // 현재 진행 단계
      roomConnectionData: {}, // 각 roomId별 참여자 데이터 초기값

      setRoomId: (roomId: string) => set({ roomId }),

      setRoomProgress: (roomProgress: string) => set({ roomProgress }),

      // 특정 roomId에 참여자를 추가합니다.
      addRoomConnectionData: (roomId: string, newData: RoomConnectionData) =>
        set((state) => {
          // 초기 데이터가 없을 경우 빈 배열 반환

          // 이미 존재하는 userId가 있는지 확인
          const existingUser = state.roomConnectionData[roomId]?.find(
            (data) => data.userId === newData.userId
          )

          // 이미 존재하는 userId가 있으면 추가하지 않고, 기존 데이터 반환
          if (existingUser) {
            return {
              roomConnectionData: {
                ...state.roomConnectionData,
                [roomId]: state.roomConnectionData[roomId],
              },
            }
          }

          const currentConnections = state.roomConnectionData[roomId] ?? [] // 초기 데이터가 없을 경우 빈 배열 반환
          const newConnections = Array.isArray(currentConnections)
            ? [...currentConnections, newData]
            : [newData]
          return {
            roomConnectionData: {
              ...state.roomConnectionData,
              [roomId]: newConnections,
            },
          }
        }),

      // 특정 roomId의 참여자 데이터를 삭제합니다.
      removeRoomConnectionData: (roomId: string, deleteData) =>
        set((state) => ({
          roomConnectionData: {
            ...state.roomConnectionData,
            [roomId]: state.roomConnectionData[roomId].filter(
              (data) => data.userId !== deleteData.userId
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
