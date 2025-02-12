import PresentationControlItem from '@/components/PresentationPage/PresentationControlItem/PresentationControlItem'
import { usePresentationControls } from '@/hooks/usePresentationControls'

const PresentationControlBar = () => {
  const { leftControl, centerControls, rightControl } =
    usePresentationControls()

  return (
    <nav className="flex items-center justify-between px-24 py-1 shadow-md">
      <PresentationControlItem control={leftControl} />
      <ul className="flex justify-between gap-10 px-6">
        {centerControls.map((control) => (
          <PresentationControlItem key={control.id} control={control} />
        ))}
      </ul>
      <PresentationControlItem control={rightControl} />
    </nav>
  )
}

export default PresentationControlBar
