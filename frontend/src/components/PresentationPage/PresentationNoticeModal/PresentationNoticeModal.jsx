// @ts-nocheck
import { Button } from '@/components/ui/button'
import { MODAL_STEP_CONFIG } from '@/constants/modalStep'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { usePresentationModalStore } from '@/store/usePresentaionModalStore'

const PresentationNoticeModal = () => {
  const { isModalOpen, modalStep } = usePresentationModalStore()
  const { title, description, buttons } = MODAL_STEP_CONFIG[modalStep]

  return (
    <Dialog open={isModalOpen} modal className="px-10">
      <DialogContent
        className="gap-8"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader className="gap-4">
          <DialogTitle className="text-lg text-center text-ssacle-blue">
            {title.before}
          </DialogTitle>
          <DialogDescription className="text-sm text-center whitespace-pre-wrap">
            {description.before}
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center justify-center w-full">
          {buttons.map(({ text, onClick, style }, index) => (
            <Button
              key={text + index}
              className={`w-1/3 hover:bg-ssacle-blue/80 bg-ssacle-blue text-white rounded-full font-KR ${style}`}
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
