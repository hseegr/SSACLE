import BoardList from '@/components/Board/List/BoardList'
import BoardPagination from '@/components/Board/List/BoardPagination'
import NotePayModal from '@/components/Board/Modal/NotePayModal'
import httpCommon from '@/services/http-common'
import { fetchUserInfo } from '@/services/mainService'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { CreditCard, BookmarkCheck, ExternalLink } from 'lucide-react'

const NoteBoardPage = () => {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [selectedPost, setSelectedPost] = useState(null)
  const [showPurchaseModal, setShowPurchaseModal] = useState(false)
  const queryClient = useQueryClient()

  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    pageSize: 10,
  })

  // 유저 정보 조회
  const { data: userData, refetch: refetchUserInfo } = useQuery({
    queryKey: ['userInfo'],
    queryFn: fetchUserInfo,
    retry: false,
  })

  // 서버에서 받은 데이터를 BoardList 형식에 맞게 변환
  // const formatPosts = (posts) => {
  //   console.log('Formatting posts:', posts) // 디버깅용 로그 추가

  //   return posts.map((post) => ({
  //     id: post.teamId,
  //     title: post.sprintName,
  //     writerInfo: post.teamName,
  //     tags: post.categoryNames,
  //     diaries: post.diaries,
  //     time: new Date().toISOString(),
  //     // isPurchased와 notionUrl을 API 응답에서 직접 가져옴
  //     isPurchased: !!post.notionUrl,
  //     notionUrl: post.notionUrl || '',
  //   }))
  // }

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const response = await httpCommon.get('/teams/diaries', {
          params: {
            page: pagination.currentPage - 1,
            size: pagination.pageSize,
            sort: 'startAt,desc',
          },
        })

        if (response.data) {
          const formattedPosts = response.data.content.map((post) => ({
            id: post.teamId,
            teamId: post.teamId, // 원본 teamId도 보존
            title: post.sprintName,
            writerInfo: post.teamName,
            tags: post.categoryNames || [],
            diaries: post.diaries || [],
            time: post.startAt || new Date().toISOString(),
            // 구매/참여 여부 확인을 위한 플래그들
            isPurchased: !!post.notionUrl,
            notionUrl: post.notionUrl || '',
          }))

          setPosts(formattedPosts)

          setPagination((prev) => ({
            ...prev,
            totalPages: Math.max(1, response.data.totalPages),
            currentPage: pagination.currentPage,
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
  }, [pagination.currentPage, pagination.pageSize])

  const handlePostClick = (postId) => {
    const clickedPost = posts.find((post) => post.id === postId)
    if (!clickedPost) return

    // 구매 상태를 명시적으로 전달
    setSelectedPost({
      ...clickedPost,
      isPurchased: !!clickedPost.notionUrl,
    })
    setShowPurchaseModal(true)
  }

  const handleModalClose = () => {
    setShowPurchaseModal(false)
    setSelectedPost(null)
    refetchUserInfo() // 모달이 닫힐 때 유저 정보 갱신
  }

  const handlePageChange = (newPage) => {
    setPagination((prev) => ({
      ...prev,
      currentPage: newPage,
    }))
  }

  const handlePurchaseComplete = async () => {
    await refetchUserInfo() // 구매 완료 시 유저 정보 갱신
  }

  return (
    <main className="min-w-max">
      <section>
        <div className="bg-ssacle-sky w-full h-24 rounded-lg mb-4 flex justify-center items-center">
          <div className="flex flex-col items-center gap-1">
            <p className="text-ssacle-black font-semibold mb-2">
              📖 노트 사기란?
            </p>
            <p className="text-ssacle-black font-normal text-sm">
              싸피 교육생들이 직접 작성한 학습 노트를 사고 팔 수 있는
              공간입니다.
            </p>
          </div>
        </div>
      </section>

      <div className="border-b my-3"></div>

      {loading && (
        <div className="text-center py-4">데이터를 불러오는 중...</div>
      )}

      {error && (
        <div className="text-red-500 text-center py-4">에러 발생: {error}</div>
      )}

      {!loading && !error && posts.length === 0 && (
        <div className="text-center py-4">작성된 노트가 없습니다.</div>
      )}

      {!loading && !error && posts.length > 0 && (
        <section>
          <BoardList
            posts={posts}
            type="note"
            boardType="note"
            onPostClick={handlePostClick}
          />
        </section>
      )}

      <section>
        <BoardPagination
          currentPage={pagination.currentPage}
          setCurrentPage={handlePageChange}
          totalPages={pagination.totalPages}
        />
      </section>

      {selectedPost && (
        <NotePayModal
          isOpen={showPurchaseModal}
          onClose={handleModalClose}
          post={selectedPost}
          currentPickle={userData?.pickles || 0}
          onPurchaseComplete={handlePurchaseComplete}
        />
      )}
    </main>
  )
}

export default NoteBoardPage
