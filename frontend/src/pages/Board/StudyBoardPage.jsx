import BoardList from '@/components/Board/List/BoardList'
import BoardPagination from '@/components/Board/List/BoardPagination'
import BoardTab from '@/components/Board/List/BoardTab'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PayModal from '@/components/Board/Modal/PayModal'
import { QueryClient, useMutation, useQuery } from '@tanstack/react-query'
import {
  fetchBoardDetail,
  fetchBoardList,
  fetchPurchaseBoard,
} from '@/services/boardService'
import { fetchUserInfo } from '@/services/mainService'
import axios from 'axios'
import httpCommon from '@/services/http-common'

const studyTabs = [
  { id: 'legend', label: '명예의 전당' },
  { id: 'qna', label: '질의응답' },
]

const StudyBoardPage = () => {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('legend') // 현재 활성화된 탭
  const [showPayModal, setShowPayModal] = useState(false)
  const [selectPostId, setSelectPostId] = useState(null)
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // 유저 정보 조회
  const { data: userData } = useQuery({
    queryKey: ['userInfo'],
    queryFn: fetchUserInfo,
    retry: false,
  })

  // 페이지네이션 상태 관리
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    pageSize: 10,
  })

  // 게시글 목록 조회
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const response = await httpCommon.get('/board/boardtype/paged', {
          params: {
            name: activeTab, // 현재 선택된 탭 (legend 또는 qna) 전달
            page: pagination.currentPage - 1, // 0부터 시작하는 인덱스
            size: pagination.pageSize, // 한 페이지당 게시글 수
            sort: 'time,desc',
          },
        })

        if (response.data) {
          setPosts(response.data.content) // 서버에서 필터링된 데이터를 그대로 사용

          setPagination((prev) => ({
            ...prev,
            totalPages: Math.max(response.data.totalPages, 1), // 최소 1 보장
            currentPage: response.data.pageable.pageNumber + 1,
          }))
        }
      } catch (err) {
        console.error('Error fetching board data:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [pagination.currentPage, activeTab])

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

  // 게시글 구매 뮤테이션
  const purchaseBoardMutation = useMutation({
    mutationFn: (boardId) => fetchPurchaseBoard(boardId),
    onSuccess: () => {
      boardDetailMutation.mutate(selectPostId)
      setShowPayModal(false)
    },
    onError: (error) => {
      // 여기서 "게시물 구매 실패" 알럿을 제거
      if (error?.response?.data?.code !== 'BOARD_015') {
        console.error('게시글 구매 실패:', error)
      }
    },
  })

  // filteredPosts는 이제 posts를 바로 사용
  const filteredPosts = posts

  const handlePostClick = (postId) => {
    const clickedPost = posts.find((post) => post.id === postId)
    if (!clickedPost) return

    // 이미 구매한 게시글인지 확인 후, 바로 이동 (모달 안 띄움)
    if (clickedPost.subCategory === 'legend' && clickedPost.isPurchased) {
      alert('이미 구매한 게시글입니다.')
      navigate(`/board/edu/${postId}`)
      return
    }

    // 구매가 필요한 경우에만 모달 띄우기
    if (
      clickedPost.subCategory === 'legend' &&
      clickedPost.writerInfo !== userData?.nickname
    ) {
      setSelectPostId(postId)
      setShowPayModal(true)
    } else {
      boardDetailMutation.mutate(postId)
    }
  }

  const handlePayConfirm = async () => {
    const requiredPickles = 7

    try {
      // 최신 데이터를 조회해서 이미 구매했는지 다시 확인
      const postDetail = await fetchBoardDetail(selectPostId)

      if (postDetail.isPurchased) {
        alert('이미 구매한 게시글입니다.')
        setShowPayModal(false)
        navigate(`/board/edu/${selectPostId}`)
        return // 결제 요청 없이 종료
      }

      // 피클이 충분하면 결제 요청 실행
      if (userData?.pickles >= requiredPickles) {
        await purchaseBoardMutation.mutateAsync(selectPostId)
        boardDetailMutation.mutate(selectPostId)
        setShowPayModal(false)
      } else {
        alert('피클이 부족합니다.')
        setShowPayModal(false)
      }
    } catch (error) {
      // "게시글 구매 실패" 알럿을 제거하고, "이미 구매한 게시글입니다."만 유지
      if (error?.response?.data?.code === 'BOARD_015') {
        alert('이미 구매한 게시글입니다.')
        setShowPayModal(false)
        navigate(`/board/edu/${selectPostId}`)
      }
    }
  }

  // 페이지 변경 핸들러
  const handlePageChange = (newPage) => {
    setPagination((prev) => ({ ...prev, currentPage: newPage }))
  }

  // 게시글 클릭 시 실행
  // const handlePostClick = (postId) => {
  //   // 클릭된 게시글 찾기
  //   const clickedPost = filteredPosts.find((post) => post.id === postId)

  //   if (!clickedPost) return

  //   // 명예의 전당 게시글이고 작성자가 아닌 경우에만 피클 결제 모달 표시
  //   if (
  //     clickedPost.subCategory === 'legend' &&
  //     clickedPost.writerInfo !== userData?.nickname
  //   ) {
  //     setSelectPostId(postId)
  //     setShowPayModal(true)
  //   } else {
  //     // 작성자이거나 일반 게시글인 경우 바로 상세 페이지로 이동
  //     boardDetailMutation.mutate(postId)
  //   }
  // }

  // 피클 결제 확인 후 게시글 상세 조회
  // const handlePayConfirm = async () => {
  //   const requiredPickles = 7
  //   if (userData?.pickles >= requiredPickles) {
  //     try {
  //       await purchaseBoardMutation.mutateAsync(selectPostId)
  //       // 구매 성공 시에만 게시글로 이동
  //       boardDetailMutation.mutate(selectPostId)
  //     } catch (error) {
  //       console.error('결제 처리 중 오류 발생:', error)
  //       alert('게시글 구매에 실패했습니다.')
  //       setShowPayModal(false)
  //     }
  //   } else {
  //     alert('피클이 부족합니다.')
  //     setShowPayModal(false)
  //   }
  // }

  // const handlePayConfirm = async () => {
  //   const requiredPickles = 7

  //   if (userData?.pickles >= requiredPickles) {
  //     try {
  //       await purchaseBoardMutation.mutateAsync(selectPostId)
  //       boardDetailMutation.mutate(selectPostId)
  //       setShowPayModal(false)
  //     } catch (error) {
  //       if (error?.response?.data?.code === 'BOARD_015') {
  //         alert('이미 구매한 게시글입니다.')
  //         setShowPayModal(false)
  //         navigate(`/board/edu/${selectPostId}`)
  //       } else {
  //         console.error('게시글 구매 실패:', error)
  //         alert('게시글 구매에 실패했습니다.')
  //       }
  //     }
  //   } else {
  //     alert('피클이 부족합니다.')
  //     setShowPayModal(false)
  //   }
  // }

  // 탭 변경 시 페이지 초기화
  const handleTabChange = (tabId) => {
    setActiveTab(tabId)
    setPagination((prev) => ({ ...prev, currentPage: 1 }))
  }

  // 글 작성 페이지 이동
  const handleWrite = () => {
    navigate('/board/edu/write', {
      state: { boardType: 'study', type: activeTab },
    })
  }

  if (loading) return <div>로딩 중...</div>
  if (error) return <div>에러가 발생했습니다: {error.message}</div>

  return (
    <main className="min-w-max">
      {/* 탭 메뉴 */}
      <section className="mb-5">
        <BoardTab
          tabs={studyTabs}
          activeTab={activeTab}
          onTabChange={handleTabChange}
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
                * 명예의 전당 글을 열람하기 위해선 피클이 필요해요. 싸프린트를
                수료하고 피클을 받아 사용해요 🥒 !
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
          {activeTab !== 'legend' && (
            <button
              onClick={handleWrite}
              className="px-4 py-1 text-white rounded bg-ssacle-blue text-sm"
            >
              글 작성하기
            </button>
          )}
        </section>
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
          currentPage={pagination.currentPage}
          setCurrentPage={handlePageChange}
          totalPages={pagination.totalPages}
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
