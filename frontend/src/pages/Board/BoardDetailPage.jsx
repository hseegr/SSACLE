import React, { useState } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { useMutation, useQuery } from '@tanstack/react-query'
import {
  fetchBoardDetail,
  fetchBoardList,
  fetchDeleteBoard,
} from '@/services/boardService'
import CommentForm from '@/components/Board/Comment/CommentForm'
import CommentList from '@/components/Board/Comment/CommentList'
import BoardNav from '@/components/Board/Detail/BoardNav'
import PayModal from '@/components/Board/Modal/PayModal'
import { fetchUserInfo } from '@/services/mainService'

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

  // 게시글 목록 조회 (이전/다음글을 위해)
  const { data: boardList } = useQuery({
    queryKey: ['boardList'],
    queryFn: fetchBoardList,
    enabled: !!post, // post 데이터가 있을 때만 실행
  })
  // 현재 로그인한 사용자 정보 조회
  const { data: userData } = useQuery({
    queryKey: ['userInfo'],
    queryFn: fetchUserInfo,
    retry: false,
  })

  // 게시글 삭제 mutation
  const deletePostMutation = useMutation({
    mutationFn: fetchDeleteBoard,
    onSuccess: () => {
      alert('게시글이 삭제되었습니다.')
      navigate(`/board/${boardType}?tab=${post.subCategory}`)
    },
    onError: (error) => {
      console.error('게시글 삭제 실패:', error)
      alert('게시글 삭제에 실패했습니다.')
    },
  })

  // 게시글 삭제 핸들러
  const handleDeletePost = () => {
    if (window.confirm('정말 이 게시글을 삭제하시겠습니까?')) {
      deletePostMutation.mutate(boardId)
    }
  }

  // 게시글 수정 페이지로 이동
  const handleEditPost = () => {
    navigate(`/board/${boardType}/${boardId}/edit`, {
      state: {
        boardType: boardType,
        type: post.subCategory,
      },
    })
  }

  // 작성자 여부 확인 (닉네임으로 비교)
  const isAuthor = userData?.nickname === post?.writerInfo

  // 이전글, 다음글 계산
  const getPrevNextPosts = () => {
    if (!boardList || !post) return { prev: null, next: null }

    // 같은 카테고리(subCategory)의 게시글만 필터링하고 시간순 정렬
    const sameTypeList = boardList
      .filter((item) => item.subCategory === post.subCategory)
      .sort((a, b) => new Date(b.time) - new Date(a.time)) // 시간 오름차순 정렬로 변경

    const currentIndex = sameTypeList.findIndex((item) => item.id === post.id)

    return {
      // 이전글은 현재 인덱스보다 하나 뒤의 글 (더 오래된 글)
      prev:
        currentIndex < sameTypeList.length - 1
          ? sameTypeList[currentIndex + 1]
          : null,
      // 다음글은 현재 인덱스보다 하나 앞의 글 (더 최신 글)
      next: currentIndex > 0 ? sameTypeList[currentIndex - 1] : null,
    }
  }

  const { prev, next } = getPrevNextPosts()

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

    // 이전글/다음글 정보 찾기
    const targetPost = postId === prev?.id ? prev : next

    // 명예의 전당 게시글이고 작성자가 아닌 경우에만 피클 결제 모달 표시
    if (
      post?.subCategory === 'legend' &&
      targetPost?.writerInfo !== userData?.nickname
    ) {
      setSelectedPostId(postId)
      setShowPayModal(true)
    } else {
      // 작성자이거나 일반 게시글인 경우 바로 이동
      navigate(`/board/${boardType}/${postId}`)
    }
  }
  // 피클 결제 확인 후 게시글 열기
  const handlePayConfirm = async () => {
    try {
      const requiredPickles = 5
      if (userData?.pickles >= requiredPickles) {
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
        {BOARD_TITLES[post.subCategory] || BOARD_TITLES[boardType] || '게시판'}
      </h2>

      <div className="border-b pb-4 mb-4 flex flex-col gap-2">
        <h1 className="text-2xl font-bold">{post?.title || '제목 없음'}</h1>
        <div className="text-gray-500 text-sm">
          {post?.writerInfo || '알 수 없음'} |{' '}
          {post?.time?.split('T')[0] || '날짜 없음'} | 조회수{' '}
          {post?.viewCount || 0}
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
        prevPost={
          prev
            ? {
                id: prev.id,
                title: prev.title,
                date: prev.time, // 서버 응답의 time 필드 사용
              }
            : null
        }
        nextPost={
          next
            ? {
                id: next.id,
                title: next.title,
                date: next.time, // 서버 응답의 time 필드 사용
              }
            : null
        }
        onNavigate={handlePostNavigate}
      />

      <PayModal
        isOpen={showPayModal}
        onClose={() => setShowPayModal(false)}
        onConfirm={handlePayConfirm}
        requiredPickle={5}
        currentPickle={userData?.pickles}
      />

      {/* 버튼 그룹 */}
      <div className="mt-6 flex justify-end gap-2">
        {isAuthor && (
          <>
            <button
              onClick={handleEditPost}
              className="px-4 py-2 bg-blue-300 text-white rounded hover:bg-blue-600"
            >
              수정
            </button>
            <button
              onClick={handleDeletePost}
              className="px-4 py-2 bg-blue-300 text-white rounded hover:bg-blue-600"
            >
              삭제
            </button>
          </>
        )}
        <button
          onClick={() =>
            navigate(`/board/${boardType}?tab=${post.subCategory}`)
          }
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
