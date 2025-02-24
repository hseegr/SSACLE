import { useEffect, useState } from 'react'
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
import httpCommon from '@/services/http-common'
import { useQueryClient } from '@tanstack/react-query'

const NotePayModal = ({ isOpen, onClose, post, currentPickle }) => {
  const [loading, setLoading] = useState(false)
  const [purchaseCompleted, setPurchaseCompleted] = useState(false)
  const [notionUrl, setNotionUrl] = useState('')
  const [error, setError] = useState('')

  const queryClient = useQueryClient()
  const requiredPickles = 7

  useEffect(() => {
    // Sprint_403_6 코드를 확인했다면 이미 구매한 노트
    if (isOpen && error?.response?.data?.code === 'Sprint_403_6') {
      alert(
        '이미 구매한 노트입니다. 싸프린트의 참여 종료 페이지를 확인해주세요!'
      )
      onClose()
    }
  }, [isOpen, error])

  const handlePurchase = async () => {
    if (loading) return

    setLoading(true)
    setError('')

    try {
      // 구매 API 호출
      const response = await httpCommon.post(`/teams/${post.id}/purchase`)

      if (response.status === 200) {
        setNotionUrl(response.data)
        setPurchaseCompleted(true)

        // 전역 유저 정보 즉시 갱신
        await queryClient.invalidateQueries(['userInfo'])
        await queryClient.refetchQueries(['userInfo'])

        // localStorage에서도 피클 정보 업데이트
        // const userInfo = await httpCommon.get('/user/summary')
        // if (userInfo.data) {
        //   localStorage.setItem('userPickles', userInfo.data.pickles.toString())
        // }
      }
    } catch (error) {
      // Sprint_403_6 에러 코드 확인
      if (error.response?.data?.code === 'Sprint_403_6') {
        alert(
          '이미 구매한 노트입니다.\n싸프린트의 참여 종료 페이지를 확인해주세요!'
        )
        onClose()
        return
      }

      setError(
        error.response?.data?.message ||
          '노트 구매에 실패했습니다. 다시 시도해주세요.'
      )
    } finally {
      setLoading(false)
    }
  }

  const handleModalClose = async () => {
    if (!loading) {
      // 모달이 닫힐 때도 한번 더 갱신
      await queryClient.invalidateQueries(['userInfo'])
      await queryClient.refetchQueries(['userInfo'])

      setPurchaseCompleted(false)
      setNotionUrl('')
      setError('')
      onClose()
    }
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={handleModalClose}>
      <AlertDialogContent className="max-w-[440px]">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-ssacle-blue" />
            <span>{purchaseCompleted ? '구매 완료' : '노트 구매'}</span>
          </AlertDialogTitle>
          <AlertDialogDescription className="space-y-4">
            {purchaseCompleted ? (
              <div className="space-y-4">
                <p>노트 구매가 완료되었습니다!</p>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-2">
                    아래 링크에서 노트를 확인하세요.
                  </p>
                  <a
                    href={notionUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-ssacle-blue hover:text-blue-700 underline"
                  >
                    Notion에서 보기
                  </a>
                </div>
              </div>
            ) : (
              <>
                <p>
                  <strong>{post?.writerInfo}</strong>의 노트를 구매하려면{' '}
                  {requiredPickles}피클이 필요합니다.
                </p>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">현재 보유 피클</p>
                  <p className="text-lg font-bold text-ssacle-blue flex items-center gap-1">
                    {currentPickle} 🥒
                  </p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">노트 학습 내용</p>
                  <ul className="text-gray-700 text-sm list-disc list-inside">
                    {post?.diaries && post.diaries.length > 0 ? (
                      post.diaries.map((diary, index) => (
                        <li key={index}>{diary}</li>
                      ))
                    ) : (
                      <li>등록된 학습 내용이 없습니다.</li>
                    )}
                  </ul>
                </div>

                {error && (
                  <div className="text-red-500 text-sm mt-2">{error}</div>
                )}
              </>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          {purchaseCompleted ? (
            <AlertDialogAction
              onClick={handleModalClose}
              className="bg-ssacle-blue hover:bg-blue-600"
            >
              닫기
            </AlertDialogAction>
          ) : (
            <>
              <AlertDialogCancel className="border-gray-200 hover:bg-gray-100 hover:text-gray-900">
                취소
              </AlertDialogCancel>
              <button
                onClick={handlePurchase}
                disabled={loading}
                className={`px-4 py-2 rounded-md ${
                  loading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-ssacle-blue hover:bg-blue-600 text-white'
                }`}
              >
                {loading ? '구매 중...' : '구매하기'}
              </button>
            </>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default NotePayModal
