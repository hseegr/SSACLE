import { useCallback } from 'react'
import useEmblaCarousel from 'embla-carousel-react'

export function EmblaCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel()

  // 이전 버튼 기능
  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev()
  }, [emblaApi])

  // 다음 버튼 기능
  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext()
  }, [emblaApi])

  return (
    <div className="relative w-[25rem] bg-white p-10 rounded-lg shadow-md text-center">
      <h2 className="text-lg font-bold text-ssacle-blue mb-4">
        SSAFY인 인증하는 방법
      </h2>

      {/* 캐러셀 영역 */}
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {/* 첫 번째 슬라이드 */}
          <div className="min-w-full p-6 text-left">
            <p className="text-xs text-ssacle-black font-bold mb-2">🩵 1단계</p>
            <ol className="text-xs text-ssacle-black list-disc list-inside">
              <li>싸피 MatterMost에서 원하는 서버를 클릭</li>
              <li>인증 코드를 받을 Private 채널을 만든다</li>
              <ol className="list-disc list-inside pl-4">
                <li>채널 하단 Add channels 클릭</li>
                <li>새로운 채널 생성</li>
                <li>이름 자유롭게 작성 후 Private Channel 클릭</li>
                <li>채널 만들기</li>
              </ol>
            </ol>
          </div>

          {/* 두 번째 슬라이드 */}
          <div className="min-w-full p-6 text-left">
            <p className="text-xs text-ssacle-black font-bold mb-2">💙 2단계</p>
            <ol className="text-xs text-ssacle-black list-disc list-inside">
              <li>
                채널을 만든 서버를 켠 상태에서 좌측 상단 MatterMost 로고 클릭
              </li>
              <li>‘통합’ 클릭</li>
              <li>'전체 Incoming Webhook' 메뉴 클릭</li>
              <li>'Incoming Webhook 추가하기' 버튼 클릭</li>
              <li>
                ‘제목’ 자유롭게 입력 후 ‘채널’을 클릭하여 방금 만든 채널을 선택
                후 저장
              </li>
              <li>화면에 뜨는 URL 복사하여 우측 Webhook URL에 붙여넣기</li>
              <li>
                MM 가입한 이메일을 입력 후 인증 코드 받기 버튼을 누르면
                만들어놓은 채널에 인증 코드가 전송됩니다!
              </li>
            </ol>
          </div>
        </div>
      </div>

      {/* 이전/다음 버튼 */}
      <button
        className="absolute top-1/2 left-0 -translate-y-1/2 ml-2 py-1 px-3 rounded-full"
        onClick={scrollPrev}
      >
        ◀️
      </button>
      <button
        className="absolute top-1/2 right-0 -translate-y-1/2 mr-2 py-1 px-3 rounded-full"
        onClick={scrollNext}
      >
        ▶️
      </button>
    </div>
  )
}
