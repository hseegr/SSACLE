import Progress from '@/components/Progress/Progress'
import { usePresentationStore } from '@/store/usePresentationStore'
import { PRESENTATION_STATUS } from '@/constants/presentationStatus'
import { Link } from 'react-router-dom'

const PresentationHeader = () => {
  const { presentationStatus, setPresentationStatus } = usePresentationStore()

  const { BEFORE_PRESENTATION, PRESENTING, QUESTION_CARD, END_PRESENTATION } =
    PRESENTATION_STATUS

  const steps = [
    { step: '준비', status: BEFORE_PRESENTATION },
    { step: '발표', status: PRESENTING },
    { step: '질문', status: QUESTION_CARD },
    { step: '평가', status: END_PRESENTATION },
    { step: '완료', status: END_PRESENTATION },
  ]
  return (
    <header className="">
      <div className="flex items-center justify-between px-24 py-4">
        {/* logo */}
        <Link to="/">
          <h1 className="text-2xl font-bold text-sky-400">SSACLE</h1>
        </Link>
        {/* 테스트를 위한 버튼 */}
        <div className="flex gap-2">
          <button
            className="px-4 rounded-md bg-ssacle-gray-md text-ssacle-gray-sm hover:bg-gray-600"
            onClick={() => setPresentationStatus(BEFORE_PRESENTATION)}
          >
            준비
          </button>
          <button
            className="px-4 rounded-md bg-ssacle-gray-md text-ssacle-gray-sm hover:bg-gray-600"
            onClick={() => setPresentationStatus(PRESENTING)}
          >
            발표
          </button>
          <button
            className="px-4 rounded-md bg-ssacle-gray-md text-ssacle-gray-sm hover:bg-gray-600"
            onClick={() => setPresentationStatus(QUESTION_CARD)}
          >
            질문
          </button>
          <button
            className="px-4 rounded-md bg-ssacle-gray-md text-ssacle-gray-sm hover:bg-gray-600"
            onClick={() => setPresentationStatus(END_PRESENTATION)}
          >
            완료
          </button>
        </div>
        {/* progress UI */}
        <Progress //
          steps={steps}
          activeStep={presentationStatus} // 현재 진행 단계
          className=""
        />
      </div>
    </header>
  )
}
export default PresentationHeader
