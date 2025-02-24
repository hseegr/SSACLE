import PresentationControlItem from '@/components/PresentationPage/PresentationControlItem/PresentationControlItem'
import { usePresentationControls } from '@/hooks/usePresentationControls'

const PresentationControlBar = () => {
  const { leftControl, centerControls, rightControl } =
    usePresentationControls()

  return (
    <nav className="flex items-center justify-between px-12 py-1 shadow-md">
      <ul className="flex justify-start gap-10 px-6 basis-1/4">
        {leftControl.map((control) => (
          <PresentationControlItem key={control.id} control={control} />
        ))}
      </ul>
      <ul className="flex justify-around flex-1 px-6">
        {centerControls.map((control) => (
          <PresentationControlItem key={control.id} control={control} />
        ))}
      </ul>
      <div className="flex justify-end basis-1/4">
        <PresentationControlItem control={rightControl} />
      </div>
    </nav>
  )
}

export default PresentationControlBar
