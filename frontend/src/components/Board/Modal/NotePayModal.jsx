import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { CreditCard } from 'lucide-react'

const NotePayModal = ({
  isOpen,
  onClose,
  onConfirm,
  note,
  requiredPickles = 5,
  currentPickle,
  purchaseSuccess,
  notionUrl,
}) => {
  const hasEnoughPickles = currentPickle >= requiredPickles

  // 하드코딩된 일기 목록
  const diaryList = [
    '1주차 - prop 공부하기',
    '2주차 - 컴포넌트 설계하기',
    '3주차 - 상태관리 학습하기',
    '4주차 - API 연동하기',
    '5주차 - 일기장 만들기',
  ]

  if (purchaseSuccess) {
    return (
      <AlertDialog open={isOpen} onOpenChange={onClose}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>구매가 완료되었어요! 🎉</AlertDialogTitle>
            <AlertDialogDescription>
              <p className="mb-4">노트 구매가 완료되었습니다.</p>
              <a
                href={notionUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                노션 페이지로 이동하기
              </a>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={onClose}>확인</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    )
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="max-w-[440px]">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-ssacle-blue" />
            <span>노트 구매하기</span>
          </AlertDialogTitle>
          <AlertDialogDescription className="space-y-4">
            <p className="font-medium text-lg">{note?.sprintName}</p>

            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm font-medium mb-2">학습 일기 목록</p>
              <ul className="space-y-1">
                {diaryList.map((diary, index) => (
                  <li key={index} className="text-sm text-gray-600">
                    {diary}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">현재 보유 피클</p>
              <p className="text-lg font-bold text-ssacle-blue flex items-center gap-1">
                {currentPickle} 🥒
              </p>
            </div>

            {!hasEnoughPickles && (
              <div className="text-sm text-red-500">
                피클이 부족합니다. 더 많은 활동을 통해 피클을 모아보세요!
              </div>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel className="border-gray-200 hover:bg-gray-100 hover:text-gray-900">
            취소
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={!hasEnoughPickles}
            className={`${
              hasEnoughPickles
                ? 'bg-ssacle-blue hover:bg-blue-600'
                : 'bg-gray-300 cursor-not-allowed'
            }`}
          >
            {requiredPickles}피클로 구매하기
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default NotePayModal
