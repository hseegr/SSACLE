import { usePresentation } from '@/store/usePresentation'
import PresentationContent from '@/pages/PresentationPage/PresentationContent'

const PresentationPageWrapper = ({ children }) => {
  const { isChatOpen, presentationStatus } = usePresentation() // 발표 상태 (상태에 따라 컴포넌트 변경)

  return (
    <div className="flex h-full gap-2 py-4">
      <PresentationContent />
      {children}
    </div>
  )
}
export default PresentationPageWrapper
