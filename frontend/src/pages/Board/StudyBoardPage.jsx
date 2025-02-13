import BoardList from '@/components/Board/List/BoardList'
import BoardPagination from '@/components/Board/List/BoardPagination'
import BoardTab from '@/components/Board/List/BoardTab'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { posts as mockPosts } from '@/mocks/boardData'
import PayModal from '@/components/Board/Modal/PayModal'
import { useQuery } from '@tanstack/react-query'
import { fetchBoardList } from '@/services/boardService'

const studyTabs = [
  { id: 'legend', label: '명예의 전당' },
  { id: 'qna', label: '질의응답' },
]

const StudyBoardPage = () => {
  const navigate = useNavigate()

  // 상태관리
  const [activeTab, setActiveTab] = useState('legend') // 현재 활성화된 탭

  // 기존 로딩 및 post 관련 state는 제거
  // const [posts, setPosts] = useState([]) // 게시글 목록
  // const [loading, setLoading] = useState(true) // 로딩 상태
  const [totalPages, setTotalPages] = useState(1)

  // 페이지네이션 관련 상태 추가
  const [currentPage, setCurrentPage] = useState(1)

  // 피클 차감 모달
  // 피클 결제 모달 표시 여부
  const [showPayModal, setShowPayModal] = useState(false)
  // 선택된 게시글 id
  const [selectPostId, setSelectPostId] = useState(null)
  // 사용자의 현재 피클 수 (실제로는 API에서 받아와야 함)
  const [userPickle, setUserPickle] = useState(256)

  // 게시글 목록 불러오기
  // activeTab이 변경될 때마다 해당하는 게시글 목록을 새로 불러옴
  // useEffect(() => {
  //   const fetchPosts = async () => {
  //     try {
  //       setLoading(true)
  //       // 실제 API 대신 mockData 사용
  //       const filteredPosts = mockPosts.filter(
  //         (post) => post.type === activeTab
  //       )

  //       // 페이지네이션을 위한 데이터 처리
  //       const ITEMS_PER_PAGE = 10
  //       const start = (currentPage - 1) * ITEMS_PER_PAGE
  //       const end = start + ITEMS_PER_PAGE
  //       const paginatedPosts = filteredPosts.slice(start, end)

  //       setPosts(paginatedPosts)
  //       setTotalPages(Math.ceil(filteredPosts.length / ITEMS_PER_PAGE))
  //       setLoading(false)
  //     } catch (error) {
  //       console.error('게시글 목록을 불러오는데 실패했습니다:', error)
  //       setLoading(false)
  //     }
  //   }
  //   fetchPosts()
  // }, [activeTab, currentPage]) // activeTab이 변경될 때마다 실행

  // TanStack Query
  // 기본 코드
  // 전체 게시글 목록 가져오기
  // const { data, isLoading, isError, error } = useQuery({
  //   queryKey: ['boards'],
  //   queryFn: fetchBoardList,
  // })

  // 디버깅 코드 1
  // TanStack Query
  // const { data, isLoading, isError, error } = useQuery({
  //   queryKey: ['boards'],
  //   queryFn: fetchBoardList,
  //   onSuccess: (data) => {
  //     console.log('Query 성공, 받아온 데이터:', data)
  //   },
  //   onError: (error) => {
  //     console.log('Query 에러:', error)
  //   },
  // })

  // 디버깅 코드 2
  // TanStack Query
  // 전체 게시글 조회
  // const { data, isLoading, isError, error } = useQuery({
  //   queryKey: ['boards'],
  //   queryFn: fetchBoardList,
  //   // 에러 처리
  //   onError: (error) => {
  //     console.log('에러 발생:', error.response?.status)
  //     if (error.response && error.response.status === 403) {
  //       handleLoginCheck()
  //     }
  //   },
  //   // 403 에러가 발생하면 즉시 에러 처리
  //   retry: false,
  // })

  // TanStack Query
  // 로그인 알럿 코드
  // 전체 게시글 조회
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['boards'],
    queryFn: fetchBoardList,
    retry: false, // 에러 발생 시 재시도하지 않음
  })

  // 403 에러 발생 시 한 번만 처리
  useEffect(() => {
    if (error?.response?.status === 403) {
      if (
        window.confirm(
          '로그인이 필요한 서비스입니다. 로그인 페이지로 이동하시겠습니까?'
        )
      ) {
        navigate('/account/login')
      }
    }
  }, [error, navigate])

  // 프론트에서 필터링
  // const filteredPosts = data?.filter((post) => post.type === activeTab) || []

  // 필터링 과정
  // 디버깅용
  const filteredPosts =
    data?.filter((post) => {
      // console.log('현재 게시글 type:', post.type)
      // console.log('현재 activeTab:', activeTab)
      return post.type === activeTab
    }) || []

  // console.log('필터링된 게시글:', filteredPosts)

  // 게시글 클릭 핸들러
  const handlePostClick = (postId) => {
    if (activeTab === 'legend') {
      setSelectPostId(postId)
      setShowPayModal(true)
    } else {
      navigate(`/board/edu/${postId}`)
    }
  }

  // 피클 결제 확인
  const handlePayConfirm = async () => {
    try {
      const requiredPickles = 5
      if (userPickle >= requiredPickles) {
        setUserPickle((prev) => prev - requiredPickles)
        setShowPayModal(false)
        navigate(`/board/edu/${selectPostId}`)
      }
    } catch (error) {
      console.error('피클 차감 중 오류가 발생했습니다:', error)
      alert('처리 중 오류가 발생했습니다. 다시 시도해주세요.')
    }
  }
  // 모달 취소
  const handlePayCancel = () => {
    setShowPayModal(false)
    setSelectPostId(null)
  }

  // 글 작성 페이지로 이동
  // 현재 탭 정보 유지 및 state로 전달하여 글 유형 지정
  const handleWrite = () => {
    navigate('/board/edu/write', {
      state: {
        boardType: 'study', // 게시판 종류 (학습 or 자유)
        type: activeTab, // 게시글 유형 (명예의 전당 or 질의응답)
      },
    })
  }

  // 탭 변경 시 페이지 초기화
  const handleTabChange = (tabId) => {
    setActiveTab(tabId)
    setCurrentPage(1) // 탭 변경 시 1페이지로 리셋
  }

  // TanStack Query 에러 분기
  // 로딩 중일 때 표시할 내용
  if (isLoading) {
    return <div>로딩 중...</div>
  }

  // 에러 발생 시 표시할 내용
  if (isError) {
    return <div>에러가 발생했습니다: {error.message}</div>
  }

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
      <div className="flex flex-row justify-between">
        {/* 글 작성 버튼 */}
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
      <section>
        {/* <BoardList
          posts={filteredPosts}
          type={activeTab}
          boardType="edu"
          onPostClick={handlePostClick}
        /> */}
        <BoardList
          posts={filteredPosts.map((post, index) => ({
            ...post,
            id: post.id || index, // id가 없는 경우 index를 사용
          }))}
          type={activeTab}
          boardType="edu"
          onPostClick={handlePostClick}
        />
      </section>
      <section>
        {/* 페이지네이션 추가 */}
        <BoardPagination
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          totalPages={totalPages}
        />
      </section>
      <PayModal
        isOpen={showPayModal}
        onClose={handlePayCancel}
        onConfirm={handlePayConfirm}
        requiredPickle={5}
        currentPickle={userPickle}
      />
    </main>
  )
}

export default StudyBoardPage
