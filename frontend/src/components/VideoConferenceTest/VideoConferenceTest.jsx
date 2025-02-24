import React, { useState, useEffect, useRef } from 'react'
import { OpenVidu } from 'openvidu-browser'
import axios from 'axios'

const OPENVIDU_SERVER_URL = 'http://localhost:4443' // OpenVidu 서버 주소
const BACKEND_SERVER_URL = 'http://localhost:5000' // Spring Boot 서버 주소

const VideoConferenceTest = () => {
  const [session, setSession] = useState(null) // 화상회의 세션
  const [publisher, setPublisher] = useState(null) // 로컬 스트림(자신의 비디오)
  const [subscribers, setSubscribers] = useState([]) // 원격 스트림들(다른 참가자들의 비디오)

  // Ref 생성
  const publisherRef = useRef(null)
  const subscriberRefs = useRef({}) // 동적 구독자 refs 관리

  useEffect(() => {
    // 컴포넌트 언마운트 시 세션 정리
    return () => {
      leaveSession()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // 🟢 1️⃣ OpenVidu 서버에 연결
  const joinSession = async () => {
    const openvidu = new OpenVidu()
    const newSession = openvidu.initSession()
    setSession(newSession)

    // 스트림 생성 이벤트 핸들러
    newSession.on('streamCreated', (event) => {
      const subscriber = newSession.subscribe(event.stream, undefined)
      setSubscribers((prev) => [...prev, subscriber])
    })

    // 스트림 파괴 이벤트 핸들러
    newSession.on('streamDestroyed', (event) => {
      setSubscribers((prev) =>
        prev.filter((sub) => sub.stream.streamId !== event.stream.streamId)
      )
    })

    // 백엔드 서버에서 세션 토큰 받아오기
    const token = await getToken()

    if (!token) {
      console.error('토큰을 가져오지 못했습니다.')
      return
    }

    try {
      // 세션에 연결
      await newSession.connect(token)

      // 퍼블리셔 초기화
      const localPublisher = openvidu.initPublisher(publisherRef.current, {
        insertMode: 'APPEND', // 비디오 요소 추가 방식
        resolution: '640x480',
        frameRate: 30,
        mirror: false,
      })

      // 세션에 퍼블리셔 게시
      await newSession.publish(localPublisher)
      setPublisher(localPublisher)
    } catch (error) {
      console.error('OpenVidu 연결 실패:', error)
    }
  }

  // 세션 종료 함수
  const leaveSession = () => {
    if (session) {
      session.disconnect()
    }
    setSession(null)
    setPublisher(null)
    setSubscribers([])
  }

  // 백엔드 서버에서 토큰을 받아오는 함수
  const getToken = async () => {
    // 🔹 새로운 세션 생성 요청
    const res = await axios.post(`${BACKEND_SERVER_URL}/api/sessions`)

    const sid = res.data

    console.log(sid)

    try {
      // 🔹 특정 세션에 대한 토큰 요청
      const response = await axios.post(
        `${BACKEND_SERVER_URL}/api/sessions/${sid}/connections`
      )

      const token = response.data
      return token
    } catch (error) {
      console.error('토큰 요청 실패:', error)
      return null
    }
  }

  // 퍼블리셔가 설정될 때 비디오 엘리먼트 생성
  useEffect(() => {
    if (publisher && publisher.createVideoElement) {
      publisher.createVideoElement(publisherRef.current, 'APPEND')
    }
  }, [publisher])

  // 서브스크라이버가 추가될 때 비디오 엘리먼트 생성
  useEffect(() => {
    subscribers.forEach((sub) => {
      if (
        sub &&
        sub.createVideoElement &&
        !subscriberRefs.current[sub.stream.streamId]
      ) {
        // 서브스크라이버의 비디오 컨테이너에 참조를 생성
        subscriberRefs.current[sub.stream.streamId] = React.createRef()

        // 비디오 엘리먼트 생성 및 삽입
        sub.createVideoElement(
          subscriberRefs.current[sub.stream.streamId].current,
          'APPEND'
        )
      }
    })
  }, [subscribers])

  navigator.mediaDevices.enumerateDevices().then(console.log)

  return (
    <div>
      <h1>OpenVidu Video Conference</h1>
      {!session ? (
        <button onClick={joinSession}>참여하기</button>
      ) : (
        <button onClick={leaveSession}>나가기</button>
      )}
      <div id="video-container" style={styles.videoContainer}>
        {/* 로컬 퍼블리셔 비디오 */}
        <div
          id="publisher-video"
          ref={publisherRef}
          style={styles.publisher}
        ></div>

        {/* 원격 서브스크라이버 비디오 */}
        {subscribers.map((sub) => (
          <div
            key={sub.stream.streamId}
            id={`subscriber-video-${sub.stream.streamId}`}
            ref={subscriberRefs.current[sub.stream.streamId]}
            style={styles.subscriber}
          ></div>
        ))}
      </div>
    </div>
  )
}

// 간단한 스타일링 (필요에 따라 CSS 파일로 분리 가능)
const styles = {
  videoContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '1rem',
    padding: '1rem',
  },
  publisher: {
    width: '100%',
    height: '300px',
    backgroundColor: '#000',
  },
  subscriber: {
    width: '100%',
    height: '300px',
    backgroundColor: '#000',
  },
}

export default VideoConferenceTest
