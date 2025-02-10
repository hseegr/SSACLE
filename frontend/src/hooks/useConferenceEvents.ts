import { useState, useCallback } from 'react'
import { Subscriber, Connection, SessionEventMap } from 'openvidu-browser'

export function useConferenceEvents() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([])
  const [connections, setConnections] = useState<Connection[]>([])

  // ✅ 스트림 삭제 핸들러
  const handleStreamDestroyed = useCallback(
    async (event: SessionEventMap['streamDestroyed']) => {
      setSubscribers((prev) =>
        prev.filter((sub) => sub.stream.streamId !== event.stream.streamId)
      )
    },
    []
  )

  // ✅ 동적으로 연결 이벤트 처리 (connectionCreated)
  const handleConnectionCreated = useCallback(
    (event: SessionEventMap['connectionCreated']) => {
      const newConnection: Connection = event.connection
      setConnections((prev) => [...prev, newConnection])
      console.log('새 연결이 생성되었습니다:', newConnection)
    },
    []
  )

  // ✅ 연결 해제 이벤트 처리 (connectionDestroyed)
  const handleConnectionDestroyed = useCallback(
    (event: SessionEventMap['connectionDestroyed']) => {
      const removedConnection: Connection = event.connection
      setConnections((prev) =>
        prev.filter(
          (connection) =>
            connection.connectionId !== removedConnection.connectionId
        )
      )
      console.log('연결이 해제되었습니다:', removedConnection)
    },
    []
  )

  return {
    subscribers,
    connections,
    setSubscribers,
    setConnections,
    handleStreamDestroyed,
    handleConnectionCreated,
    handleConnectionDestroyed,
  }
}
