import React, { useState } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { fetchBoardDetail } from '@/services/boardService'
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
  bulletin: '자유',
}

const BoardDetailPage = () => {
  const { boardId } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const boardType = location.pathname.includes('/board/edu') ? 'edu' : 'free'

  // 게시글 상세 조회
  const {
    data: post,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['boardDetail', boardId],
    queryFn: () => fetchBoardDetail(boardId),
    enabled: !!boardId,
    retry: false,
  })

  // 현재 활성화된 탭 정보 가져오기
  const searchParams = new URLSearchParams(location.search)
  const activeTab = searchParams.get('tab') || 'legend' // 기본값: 명예의 전당

  // 피클 결제 관련 상태
  const [showPayModal, setShowPayModal] = useState(false)
  const [selectedPostId, setSelectedPostId] = useState(null)
  const [userPickle, setUserPickle] = useState(256) // TODO: 실제 유저 데이터와 연동 필요

  // 게시글 이동 핸들러 (명예의 전당일 경우 피클 결제 필요)
  const handlePostNavigate = (postId) => {
    if (!postId) return
    console.log('📌 이동할 게시글 ID:', postId)

    if (post?.type === 'legend') {
      setSelectedPostId(postId)
      setShowPayModal(true)
    } else {
      navigate(`/board/${boardType}/${postId}`)
    }
  }

  // 피클 결제 확인 후 게시글 열기
  const handlePayConfirm = async () => {
    try {
      const requiredPickles = 5
      if (userPickle >= requiredPickles) {
        setUserPickle((prev) => prev - requiredPickles)
        setShowPayModal(false)
        navigate(`/board/${boardType}/${selectedPostId}`)
      } else {
        alert('피클이 부족합니다!')
      }
    } catch (error) {
      console.error('❌ 피클 결제 오류:', error)
    }
  }

  // 댓글 관리
  const [comments, setComments] = useState([])

  const handleCommentSubmit = async (content) => {
    try {
      // TODO: API 연결 후 서버로 전송
      const newComment = {
        id: comments.length + 1,
        userId: 'user123', // TODO: 실제 유저 데이터 연동 필요
        author: '현재 사용자',
        content,
        createdAt: new Date().toISOString(),
        replies: [],
      }
      setComments([...comments, newComment])
    } catch (error) {
      console.error('❌ 댓글 작성 실패:', error)
    }
  }

  const handleCommentEdit = async (commentId, newContent) => {
    try {
      setComments((prevComments) =>
        prevComments.map((comment) => {
          if (comment.id === commentId)
            return { ...comment, content: newContent }
          return comment
        })
      )
    } catch (error) {
      console.error('❌ 댓글 수정 실패:', error)
    }
  }

  const handleCommentDelete = async (commentId) => {
    try {
      setComments((prevComments) =>
        prevComments.filter((comment) => comment.id !== commentId)
      )
    } catch (error) {
      console.error('❌ 댓글 삭제 실패:', error)
    }
  }

  const handleReplySubmit = async (parentId, content) => {
    try {
      setComments((prevComments) =>
        prevComments.map((comment) => {
          if (comment.id === parentId) {
            return {
              ...comment,
              replies: [
                ...(comment.replies || []),
                {
                  id: comments.length + 1,
                  userId: 'user123',
                  author: '현재 사용자',
                  parentId,
                  content,
                  createdAt: new Date().toISOString(),
                },
              ],
            }
          }
          return comment
        })
      )
    } catch (error) {
      console.error('❌ 답글 작성 실패:', error)
    }
  }

  if (isLoading) return <div>로딩 중...</div>
  if (isError || !post)
    return <div>게시글을 불러오는 중 오류가 발생했습니다. 😢</div>

  return (
    <div className="min-w-max my-20 container mx-auto px-4 py-8 max-w-4xl">
      <h2 className="text-xl font-semibold text-ssacle-blue flex justify-center mb-6">
        {BOARD_TITLES[post?.type] || BOARD_TITLES[boardType] || '게시판'}
      </h2>

      <div className="border-b pb-4 mb-4 flex flex-col gap-2">
        <h1 className="text-2xl font-bold">{post?.title || '제목 없음'}</h1>
        <div className="text-gray-500 text-sm">
          {post?.author || '알 수 없음'} | {post?.date || '날짜 없음'} | 조회수{' '}
          {post?.views || 0}
        </div>
        <div className="mt-2 flex gap-2">
          {post?.tags?.map((tag, index) => (
            <span key={index} className="bg-gray-100 px-2 py-1 rounded text-sm">
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className="py-8 min-h-52">{post?.content || '내용 없음'}</div>

      <BoardNav
        prevPost={null}
        nextPost={null}
        onNavigate={handlePostNavigate}
      />

      <PayModal
        isOpen={showPayModal}
        onClose={() => setShowPayModal(false)}
        onConfirm={handlePayConfirm}
        requiredPickle={5}
        currentPickle={userPickle}
      />

      <div className="mt-6 flex justify-end gap-2">
        <button
          onClick={() => navigate(`/board/${boardType}`)}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          목록
        </button>
      </div>

      <div className="mt-16">
        <CommentList
          comments={comments}
          currentUserId="user123"
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
