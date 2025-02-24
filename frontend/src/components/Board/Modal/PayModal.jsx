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
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const PayModal = ({
  isOpen,
  onClose,
  onConfirm,
  requiredPickles = 7,
  currentPickle,
}) => {
  const hasEnoughPickles = currentPickle >= requiredPickles

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="max-w-[440px]">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-ssacle-blue" />
            <span>피클 결제</span>
          </AlertDialogTitle>
          <AlertDialogDescription className="space-y-4">
            <p>
              명예의 전당 게시글을 읽기 위해서는 {requiredPickles}개의 피클이
              필요합니다.
            </p>

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
            결제하기
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default PayModal
