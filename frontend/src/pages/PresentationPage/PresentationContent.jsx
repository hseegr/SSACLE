import BeforePresentationPage from '@/pages/PresentationPage/BeforePresentationPage'
import PresentingPage from '@/pages/PresentationPage/PresentingPage'
import QuestionCardPage from '@/pages/PresentationPage/QuestionCardPage'

import { PRESENTATION_STATUS } from '@/constants/presentationStatus'
import { usePresentation } from '@/store/usePresentation'

const PRESENTATION_COMPONENTS = {
  [PRESENTATION_STATUS.BEFORE_PRESENTATION]: BeforePresentationPage,
  [PRESENTATION_STATUS.PRESENTING]: PresentingPage,
  [PRESENTATION_STATUS.QUESTION_CARD]: QuestionCardPage,
}

const PresentationContent = () => {
  const { presentationStatus } = usePresentation()
  const CurrentComponent = PRESENTATION_COMPONENTS[presentationStatus]

  return CurrentComponent ? <CurrentComponent /> : <h1>Loading...</h1>
}
export default PresentationContent
