import Progress from '@/components/Progress/Progress'
import { Link } from 'react-router-dom'
import { usePresentationSignalStore } from '@/store/usePresentationSignalStore'
import PresentationStatusBar from '@/components/PresentationPage/PresentationStatusBar/PresentationStatusBar'

const PresentationHeader = () => {
  const presentationStatus = usePresentationSignalStore(
    (state) => state.presentationStatus
  )
  return (
    <header className="">
      <div className="flex items-center justify-between px-24 py-4">
        {/* logo */}
        <Link to="/main">
          <h1 className="text-2xl font-bold text-sky-400">SSACLE</h1>
        </Link>
        <PresentationStatusBar />
        {/* progress UI */}
        <Progress //
          activeStep={presentationStatus} // 현재 진행 단계
          className=""
        />
      </div>
    </header>
  )
}
export default PresentationHeader
