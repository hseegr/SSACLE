import ParticipantSection from '@/components/PresentationPage/ParticipantSection/ParticipantSection'
import QuestionCardSection from '@/components/PresentationPage/QuestionCardSection/QuestionCardSection'
import SharedSection from '@/components/PresentationPage/SharedSection/SharedSection'

const QuestionCardPage = () => {
  return (
    <div className="flex w-full gap-2">
      <div className="flex flex-col w-full gap-2">
        <QuestionCardSection />
        {/* <SharedSection /> */}
      </div>
      <ParticipantSection sharingStatus={false} />
    </div>
  )
}
export default QuestionCardPage
