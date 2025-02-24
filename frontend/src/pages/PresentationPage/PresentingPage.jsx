import ParticipantSection from '@/components/PresentationPage/ParticipantSection/ParticipantSection'
import SharedSection from '@/components/PresentationPage/SharedSection/SharedSection'

const PresentingPage = () => {
  return (
    <div className="flex w-full h-full">
      {/* 공유 영역 */}
      <SharedSection />
      {/* 참여자 영역 */}
      <ParticipantSection sharingStatus={true} />
    </div>
  )
}
export default PresentingPage
