// @ts-nocheck
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { usePresentationModalStateStore } from '@/store/usePresentationModalStateStore'
import useModalStepConfig from '@/hooks/useModalStepConfig'

const PresentationNoticeModal = () => {
  const isModalOpen = usePresentationModalStateStore(
    (state) => state.isModalOpen
  )
  const modalStep = usePresentationModalStateStore((state) => state.modalStep)
  const { MODAL_STEP_CONFIG } = useModalStepConfig()
  const { title, description, buttons } = MODAL_STEP_CONFIG[modalStep]

  return (
    <Dialog open={isModalOpen} modal className="px-10">
      <DialogContent
        className="gap-8"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader className="gap-4">
          <DialogTitle className="text-lg text-center text-ssacle-blue">
            {title.map((t) => t)}
          </DialogTitle>
          <DialogDescription className="flex flex-col gap-2 text-sm text-center whitespace-pre-wrap">
            {description.map((d) => (
              <span className="text-sm font-KR" key={d}>
                {d}
              </span>
            ))}
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center justify-center w-full gap-4">
          {buttons.map(({ text, onClick, style, variant }, index) => (
            <Button
              key={text + index}
              variant={variant}
              className={`w-1/3 text-white rounded-full font-KR ${style} hover:bg-${style}/50 focus:ring-0`}
              onClick={onClick}
            >
              {text}
            </Button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default PresentationNoticeModal
