import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { posts as mockPosts } from '@/mocks/boardData'
import CommentForm from '@/components/Board/Comment/CommentForm'
import CommentList from '@/components/Board/Comment/CommentList'
import BoardNav from '@/components/Board/Detail/BoardNav'
import PayModal from '@/components/Board/Modal/PayModal'

const BOARD_TITLES = {
  edu: '학습 게시판',
  free: '자유 게시판',
  legend: '🏆 명예의 전당',
  qna: 'Q 질의응답',
  ssaguman: '싸구만',
}

const BoardDetailPage = () => {
  const { boardId } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const boardType = location.pathname.includes('/board/edu') ? 'edu' : 'free'

  // 상태 관리
  const [post, setPost] = useState(null) // 게시글 데이터 저장
  const [loading, setLoading] = useState(true) // 로딩 상태
  const [comments, setComments] = useState([]) // 댓글 목록
  const [prevNextPosts, setPrevNextPosts] = useState({ prev: null, next: null }) // 이전, 다음 게시글

  // 피클 결제 관련 상태
  const [showPayModal, setShowPayModal] = useState(false)
  const [selectedPostId, setSelectedPostId] = useState(null)
  const [userPickle, setUserPickle] = useState(256) // 실제로는 API에서 받아와야 함
  const [navigationTarget, setNavigationTarget] = useState(null)

  // 임시로 현재 사용자 ID 하드코딩 (실제로는 인증 시스템에서 가져와야 함)
  const currentUserId = 'user123'

  // 게시물 데이터 불러오기
  useEffect(() => {
    const fetchPostData = async () => {
      setLoading(true)
      try {
        // 게시글 데이터 가져오기 (실제로는 API 호출)
        const foundPost = mockPosts.find((p) => p.id === Number(boardId))
        if (!foundPost) {
          throw new Error('게시글을 찾을 수 없습니다.')
        }
        setPost(foundPost)

        // 같은 타입의 게시글만 필터링
        const sameTypePosts = mockPosts
          .filter((p) => p.type === foundPost.type)
          .sort((a, b) => new Date(b.date) - new Date(a.date)) // 날짜순 정렬

        // 현재 게시글의 인덱스 찾기
        const currentIndex = sameTypePosts.findIndex(
          (p) => p.id === Number(boardId)
        )

        // 이전/다음 게시글 설정
        setPrevNextPosts({
          prev: currentIndex > 0 ? sameTypePosts[currentIndex - 1] : null,
          next:
            currentIndex < sameTypePosts.length - 1
              ? sameTypePosts[currentIndex + 1]
              : null,
        })

        // 댓글 데이터 설정 (임시 데이터 - 대댓글 포함)
        setComments([
          {
            id: 1,
            userId: 'user123',
            author: '작성자1',
            content: '좋은 글이네요!',
            createdAt: '2025-01-23T10:00:00',
            replies: [
              {
                id: 3,
                userId: 'user789',
                author: '작성자3',
                parentId: 1,
                parentAuthor: '작성자1',
                content: '저도 동의합니다!',
                createdAt: '2025-01-23T10:30:00',
              },
            ],
          },
          {
            id: 2,
            userId: 'user456',
            author: '작성자2',
            content: '참고가 많이 됐습니다.',
            createdAt: '2025-01-23T11:00:00',
            replies: [],
          },
        ])
      } catch (error) {
        console.error('데이터 로딩 실패:', error)
        alert('게시글을 불러오는데 실패했습니다.')
        navigate(`/board/${boardType}`)
      } finally {
        setLoading(false)
      }
    }

    fetchPostData()
  }, [boardId, boardType, navigate])

  // 게시글 이동 핸들러
  const handlePostNavigate = (postId) => {
    if (post.type === 'legend') {
      setSelectedPostId(postId)
      setNavigationTarget(postId)
      setShowPayModal(true)
    } else {
      navigate(`/board/${boardType}/${postId}`, {
        state: { postType: post.type },
      })
    }
  }

  // 피클 결제 확인 핸들러
  const handlePayConfirm = async () => {
    try {
      const requiredPickles = 5
      if (userPickle >= requiredPickles) {
        setUserPickle((prev) => prev - requiredPickles)
        setShowPayModal(false)

        if (navigationTarget) {
          navigate(`/board/${boardType}/${navigationTarget}`, {
            state: { postType: post.type },
          })
        }
      }
    } catch (error) {
      console.error('피클 차감 중 오류가 발생했습니다:', error)
      alert('처리 중 오류가 발생했습니다. 다시 시도해주세요.')
    } finally {
      setNavigationTarget(null)
      setSelectedPostId(null)
    }
  }

  // 피클 결제 취소 핸들러
  const handlePayCancel = () => {
    setShowPayModal(false)
    setSelectedPostId(null)
    setNavigationTarget(null)
  }

  // 댓글 작성 핸들러
  const handleCommentSubmit = async (content) => {
    try {
      // 실제로는 API 호출
      const newComment = {
        id: Math.max(...comments.map((c) => c.id)) + 1,
        userId: currentUserId,
        author: '현재 사용자',
        content,
        createdAt: new Date().toISOString(),
        replies: [],
      }
      setComments([...comments, newComment])
    } catch (error) {
      console.error('댓글 작성 실패:', error)
      alert('댓글 작성에 실패했습니다.')
    }
  }

  // 댓글 수정 핸들러
  const handleCommentEdit = async (commentId, newContent) => {
    try {
      // 실제로는 API 호출
      setComments((prevComments) =>
        prevComments.map((comment) => {
          if (comment.id === commentId) {
            return { ...comment, content: newContent }
          }
          if (comment.replies) {
            return {
              ...comment,
              replies: comment.replies.map((reply) =>
                reply.id === commentId
                  ? { ...reply, content: newContent }
                  : reply
              ),
            }
          }
          return comment
        })
      )
    } catch (error) {
      console.error('댓글 수정 실패:', error)
      alert('댓글 수정에 실패했습니다.')
    }
  }

  // 댓글 삭제 핸들러
  const handleCommentDelete = async (commentId) => {
    try {
      // 실제로는 API 호출
      setComments((prevComments) =>
        prevComments.filter((comment) => {
          if (comment.id === commentId) return false
          if (comment.replies) {
            comment.replies = comment.replies.filter(
              (reply) => reply.id !== commentId
            )
          }
          return true
        })
      )
    } catch (error) {
      console.error('댓글 삭제 실패:', error)
      alert('댓글 삭제에 실패했습니다.')
    }
  }

  // 대댓글 작성 핸들러
  const handleReplySubmit = async (parentId, content) => {
    try {
      const parentComment = comments.find((c) => c.id === parentId)
      if (!parentComment) throw new Error('원 댓글을 찾을 수 없습니다.')

      const newReply = {
        id:
          Math.max(
            ...comments.map((c) => c.id),
            ...comments.flatMap((c) => c.replies?.map((r) => r.id) || [])
          ) + 1,
        userId: currentUserId,
        author: '현재 사용자',
        parentId,
        parentAuthor: parentComment.author,
        content,
        createdAt: new Date().toISOString(),
      }

      setComments((prevComments) =>
        prevComments.map((comment) =>
          comment.id === parentId
            ? { ...comment, replies: [...(comment.replies || []), newReply] }
            : comment
        )
      )
    } catch (error) {
      console.error('답글 작성 실패:', error)
      alert('답글 작성에 실패했습니다.')
    }
  }

  if (loading) {
    return (
      <div className="min-w-max my-20 container mx-auto px-4 py-8 max-w-4xl">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-w-max my-20 container mx-auto px-4 py-8 max-w-4xl">
      {/* 게시판 이름 */}
      <h2 className="text-xl font-semibold text-ssacle-blue flex justify-center mb-6">
        {BOARD_TITLES[post.type] || BOARD_TITLES[boardType] || '게시판'}
      </h2>

      {/* 게시글 정보 */}
      <div className="border-b pb-4 mb-4 flex flex-col gap-2">
        <h1 className="text-2xl font-bold">{post.title}</h1>
        <div className="text-gray-500 text-sm">
          {post.author} | {post.date} | 조회수 {post.views}
        </div>

        {/* 태그 */}
        <div className="mt-2 flex gap-2">
          {post.tags?.map((tag, index) => (
            <span key={index} className="bg-gray-100 px-2 py-1 rounded text-sm">
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* 게시글 본문 */}
      <div className="py-8 min-h-52">{post.content}</div>

      {/* 게시글 네비게이션 */}
      <BoardNav
        prevPost={prevNextPosts.prev}
        nextPost={prevNextPosts.next}
        onNavigate={handlePostNavigate}
      />

      {/* 피클 결제 모달 */}
      <PayModal
        isOpen={showPayModal}
        onClose={handlePayCancel}
        onConfirm={handlePayConfirm}
        requiredPickle={5}
        currentPickle={userPickle}
      />

      {/* 목록으로 돌아가기 버튼 */}
      <div className="mt-6 flex justify-end gap-2">
        {currentUserId === post.userId && (
          <>
            <button
              onClick={() => navigate(`/board/${boardType}/${boardId}/edit`)}
              className="px-4 py-2 text-blue-500 border border-blue-500 rounded hover:bg-blue-50"
            >
              수정
            </button>
            <button
              onClick={() => {
                if (window.confirm('정말 삭제하시겠습니까?')) {
                  // 삭제 로직 구현
                  navigate(`/board/${boardType}`)
                }
              }}
              className="px-4 py-2 text-red-500 border border-red-500 rounded hover:bg-red-50"
            >
              삭제
            </button>
          </>
        )}
        <button
          onClick={() => navigate(`/board/${boardType}`)}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          목록
        </button>
      </div>

      {/* 댓글 영역 */}
      <div className="mt-16">
        <CommentList
          comments={comments}
          currentUserId={currentUserId}
          onDelete={handleCommentDelete}
          onEdit={handleCommentEdit}
          onReply={handleReplySubmit}
        />
        <div className="mt-4">
          <CommentForm onSubmit={handleCommentSubmit} />
        </div>
      </div>
    </div>
  )
}

export default BoardDetailPage
