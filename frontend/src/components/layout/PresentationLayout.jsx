import PresentationControlBar from '@/components/PresentationPage/PresentationControlBar/PresentationControlBar'
import PresentationHeader from '@/components/PresentationPage/PresentationHeader/PresentationHeader'
import { Outlet } from 'react-router-dom'

const PresentationLayout = () => {
  return (
    <div className="flex flex-col w-full h-screen text-white bg-ssacle-black min-w-[1280px]">
      <PresentationHeader />
      <main className="flex-1 px-4 bg-ssacle-black max-h-[calc(100vh-100px)]">
        <Outlet />
      </main>
      <PresentationControlBar />
    </div>
  )
}
export default PresentationLayout
