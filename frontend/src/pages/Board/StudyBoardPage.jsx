import BoardList from '@/components/Board/List/BoardList'
import BoardPagination from '@/components/Board/List/BoardPagination'
import BoardTab from '@/components/Board/List/BoardTab'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PayModal from '@/components/Board/Modal/PayModal'
import { useMutation, useQuery } from '@tanstack/react-query'
import { fetchBoardDetail, fetchBoardList } from '@/services/boardService'
import { fetchUserInfo } from '@/services/mainService'

const studyTabs = [
  { id: 'legend', label: '명예의 전당' },
  { id: 'qna', label: '질의응답' },
]

const StudyBoardPage = () => {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('legend') // 현재 활성화된 탭
  const [currentPage, setCurrentPage] = useState(1)
  const [showPayModal, setShowPayModal] = useState(false)
  const [selectPostId, setSelectPostId] = useState(null)

  // 유저 정보 조회
  const { data: userData } = useQuery({
    queryKey: ['userInfo'],
    queryFn: fetchUserInfo,
    retry: false,
  })

  // 게시글 목록 조회
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['boards'],
    queryFn: fetchBoardList,
    retry: false,
  })

  // 게시글 상세 조회
  const boardDetailMutation = useMutation({
    mutationFn: fetchBoardDetail,
    onSuccess: (data) => {
      navigate(`/board/edu/${data.id}`, { state: { boardData: data } })
    },
    onError: () => {
      alert('게시글을 불러오는데 실패했습니다.')
    },
  })

  // 학습 게시판(edu) + 현재 탭(legend/qna) 필터링
  const filteredPosts =
    data?.filter(
      (post) => post.majorCategory === 'edu' && post.subCategory === activeTab
    ) || []

  // 게시글 클릭 시 실행
  const handlePostClick = (postId) => {
    // 클릭된 게시글 찾기
    const clickedPost = filteredPosts.find((post) => post.id === postId)

    if (!clickedPost) return

    if (clickedPost.subCategory === 'legend') {
      setSelectPostId(postId)
      setShowPayModal(true)
    } else {
      boardDetailMutation.mutate(postId)
    }
  }

  // 피클 결제 확인 후 게시글 상세 조회
  const handlePayConfirm = () => {
    if (userData?.pickles >= 5) {
      boardDetailMutation.mutate(selectPostId)
      setShowPayModal(false)
    } else {
      alert('피클이 부족합니다.')
    }
  }

  // 글 작성 페이지 이동
  const handleWrite = () => {
    navigate('/board/edu/write', {
      state: { boardType: 'study', type: activeTab },
    })
  }

  if (isLoading) return <div>로딩 중...</div>
  if (isError) return <div>에러가 발생했습니다: {error.message}</div>

  return (
    <main className="min-w-max my-20">
      {/* 탭 메뉴 */}
      <section className="my-10">
        <BoardTab
          tabs={studyTabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
      </section>

      {/* 배너 */}
      <section>
        <div className="bg-ssacle-sky w-full h-32 rounded-lg mb-4 flex justify-center items-center">
          {activeTab === 'legend' ? (
            <div className="flex flex-col items-center gap-1">
              <p className="text-ssacle-black font-semibold mb-2">
                🏆 명예의 전당이란 ?
              </p>
              <p className="text-ssacle-black font-normal text-sm">
                명예의 전당은 싸피 교육생들의 다양한 기업 합격 후기, 자기소개서
                작성 꿀팁, 면접 후기 등을 볼 수 있는 곳입니다.
              </p>
              <p className="text-ssacle-blue font-semibold text-sm">
                * 명예의 전당 글을 열람하기 위해선 피클이 필요해요 🥒 !
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-1">
              <p className="text-ssacle-black font-semibold mb-2">
                Q 질의응답이란 ?
              </p>
              <p className="text-ssacle-black font-normal text-sm">
                질의응답은 싸피 교육생들이 자기주도적 학습을 하며 궁금했던 내용,
                구글링을 해도 나오지 않던 내용을 질의하고 답변하는 곳입니다.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* 글 작성 버튼 */}
      <div className="flex flex-row justify-between">
        <section>
          <button
            onClick={handleWrite}
            className="px-4 py-1 text-white rounded bg-ssacle-blue text-sm"
          >
            글 작성하기
          </button>
        </section>
        <section>분류 및 검색창</section>
      </div>

      <div className="border-b my-3"></div>

      {/* 게시글 목록 */}
      <section>
        <BoardList
          posts={filteredPosts}
          type={activeTab}
          boardType="edu"
          onPostClick={handlePostClick}
        />
      </section>

      {/* 페이지네이션 */}
      <section>
        <BoardPagination
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          totalPages={1}
        />
      </section>

      {/* 피클 결제 모달 */}
      <PayModal
        isOpen={showPayModal}
        onClose={() => setShowPayModal(false)}
        onConfirm={handlePayConfirm}
        requiredPickle={5}
        currentPickle={userData?.pickles || 0}
      />
    </main>
  )
}

export default StudyBoardPage
