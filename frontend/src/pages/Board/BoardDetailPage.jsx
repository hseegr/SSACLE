import React, { useState } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { useMutation, useQuery } from '@tanstack/react-query'
import {
  fetchBoardDetail,
  fetchBoardList,
  fetchDeleteBoard,
  fetchPurchaseBoard,
} from '@/services/boardService'
import CommentForm from '@/components/Board/Comment/CommentForm'
import CommentList from '@/components/Board/Comment/CommentList'
import BoardNav from '@/components/Board/Detail/BoardNav'
import PayModal from '@/components/Board/Modal/PayModal'
import { fetchUserInfo } from '@/services/mainService'
import {
  fetchBoardComments,
  fetchCreateComment,
  fetchCreateSubComment,
  fetchDeleteComment,
  fetchUpdateComment,
} from '@/services/commentService'

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

  // 게시글 상세 조회 쿼리
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

  // 게시글 목록 조회 쿼리 (이전/다음글 탐색용)
  const { data: boardList } = useQuery({
    queryKey: ['boardList'],
    queryFn: fetchBoardList,
    enabled: !!post,
  })

  // 사용자 정보 조회 쿼리
  const { data: userData } = useQuery({
    queryKey: ['userInfo'],
    queryFn: fetchUserInfo,
    retry: false,
  })

  // 게시글 삭제 뮤테이션
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

  // 게시글 관련 핸들러들
  const handleDeletePost = () => {
    if (window.confirm('정말 이 게시글을 삭제하시겠습니까?')) {
      deletePostMutation.mutate(boardId)
    }
  }

  const handleEditPost = () => {
    navigate(`/board/${boardType}/${boardId}/edit`, {
      state: {
        boardType: boardType,
        type: post.subCategory,
      },
    })
  }

  // 댓글 목록 조회 쿼리
  const {
    data: commentsData = [],
    refetch: refetchComments,
    isLoading: isCommentsLoading,
  } = useQuery({
    queryKey: ['comments', boardId],
    queryFn: () => fetchBoardComments(boardId),
    enabled: !!boardId,
  })

  // 댓글 작성 뮤테이션
  const createCommentMutation = useMutation({
    mutationFn: (content) => fetchCreateComment(boardId, content),
    onSuccess: () => refetchComments(),
    onError: (error) => {
      console.error('댓글 작성 실패:', error)
      alert('댓글 작성에 실패했습니다.')
    },
  })

  // 댓글 수정 뮤테이션
  const updateCommentMutation = useMutation({
    mutationFn: ({ commentId, content }) =>
      fetchUpdateComment(commentId, content),
    onSuccess: () => refetchComments(),
    onError: (error) => {
      console.error('댓글 수정 실패:', error)
      alert('댓글 수정에 실패했습니다.')
    },
  })

  // 댓글 삭제 뮤테이션
  const deleteCommentMutation = useMutation({
    mutationFn: fetchDeleteComment,
    onSuccess: () => refetchComments(),
    onError: (error) => {
      console.error('댓글 삭제 실패:', error)
      alert('댓글 삭제에 실패했습니다.')
    },
  })

  // 대댓글 작성 뮤테이션
  const createSubCommentMutation = useMutation({
    mutationFn: ({ parentId, content }) =>
      fetchCreateSubComment(parentId, content),
    onSuccess: () => refetchComments(),
    onError: (error) => {
      console.error('대댓글 작성 실패:', error)
      alert('대댓글 작성에 실패했습니다.')
    },
  })

  // 댓글 관련 핸들러들
  const handleCommentSubmit = async (content) => {
    try {
      await createCommentMutation.mutateAsync(content)
    } catch (error) {
      console.error('댓글 작성 실패:', error)
    }
  }

  const handleCommentEdit = async (commentId, content) => {
    if (!commentId) return // commentId가 없는 경우 처리 중단
    try {
      await updateCommentMutation.mutateAsync({ commentId, content })
      await refetchComments() // 성공 시 댓글 목록을 새로고침
    } catch (error) {
      console.error('댓글 수정 실패:', error)
    }
  }

  const handleCommentDelete = async (commentId) => {
    if (!commentId) return // commentId가 없는 경우 처리 중단
    try {
      await deleteCommentMutation.mutateAsync(commentId)
      await refetchComments() // 삭제 후 댓글 목록 새로고침
    } catch (error) {
      console.error('댓글 삭제 실패:', error)
    }
  }

  const handleReplySubmit = async (parentId, content) => {
    if (!parentId) return // parentId가 없는 경우 처리 중단
    try {
      await createSubCommentMutation.mutateAsync({
        parentId,
        content,
      })
      await refetchComments() // 대댓글 작성 후 댓글 목록 새로고침
    } catch (error) {
      console.error('대댓글 작성 실패:', error)
    }
  }

  // 피클 결제 관련 상태 및 핸들러
  const [showPayModal, setShowPayModal] = useState(false)
  const [selectedPostId, setSelectedPostId] = useState(null)

  const handlePostNavigate = async (postId) => {
    if (!postId) return

    try {
      // 이동하려는 게시글의 정보 조회
      const targetPost = await fetchBoardDetail(postId)

      // 명예의 전당 게시글이고 작성자가 아닌 경우
      if (
        targetPost.subCategory === 'legend' &&
        targetPost.writerInfo !== userData?.nickname
      ) {
        // 이미 구매한 게시글인 경우
        if (targetPost.isPurchased) {
          alert('이미 구매한 게시글입니다.')
          navigate(`/board/${boardType}/${postId}`)
          return
        }

        // 구매가 필요한 경우
        setSelectedPostId(postId)
        setShowPayModal(true)
      } else {
        // 일반 게시글이거나 본인이 작성한 글인 경우 바로 이동
        navigate(`/board/${boardType}/${postId}`)
      }
    } catch (error) {
      console.error('게시글 정보 조회 실패:', error)
      alert('게시글 정보를 불러오는데 실패했습니다.')
    }
  }

  // 게시글 구매 뮤테이션 추가
  const purchaseBoardMutation = useMutation({
    mutationFn: (boardId) => fetchPurchaseBoard(boardId),
    onSuccess: () => {
      // 게시글 데이터 갱신을 위한 쿼리 무효화
      queryClient.invalidateQueries(['boardDetail', selectedPostId])
    },
    onError: (error) => {
      if (error?.response?.data?.code !== 'BOARD_015') {
        console.error('게시글 구매 실패:', error)
      }
    },
  })

  const REQUIRED_PICKLES = 7 // 필요한 피클 수를 상수로 정의

  const handlePayConfirm = async () => {
    try {
      // 최신 데이터를 조회해서 이미 구매했는지 다시 확인
      const postDetail = await fetchBoardDetail(selectedPostId)

      if (postDetail.isPurchased) {
        alert('이미 구매한 게시글입니다.')
        setShowPayModal(false)
        navigate(`/board/${boardType}/${selectedPostId}`)
        return
      }

      // 피클이 충분하면 결제 요청 실행
      if (userData?.pickles >= REQUIRED_PICKLES) {
        try {
          await purchaseBoardMutation.mutateAsync(selectedPostId)
          setShowPayModal(false)
          navigate(`/board/${boardType}/${selectedPostId}`)
        } catch (error) {
          if (error?.response?.data?.code === 'BOARD_015') {
            alert('이미 구매한 게시글입니다.')
            setShowPayModal(false)
            navigate(`/board/${boardType}/${selectedPostId}`)
          } else {
            console.error('게시글 구매 실패:', error)
            alert('게시글 구매에 실패했습니다.')
          }
        }
      } else {
        alert('피클이 부족합니다.')
        setShowPayModal(false)
      }
    } catch (error) {
      console.error('게시글 정보 조회 실패:', error)
      alert('게시글 정보를 불러오는데 실패했습니다.')
      setShowPayModal(false)
    }
  }

  // 이전글, 다음글 계산
  const getPrevNextPosts = () => {
    if (!boardList || !post) return { prev: null, next: null }

    const sameTypeList = boardList
      .filter((item) => item.subCategory === post.subCategory)
      .sort((a, b) => new Date(b.time) - new Date(a.time))

    const currentIndex = sameTypeList.findIndex((item) => item.id === post.id)

    return {
      prev:
        currentIndex < sameTypeList.length - 1
          ? sameTypeList[currentIndex + 1]
          : null,
      next: currentIndex > 0 ? sameTypeList[currentIndex - 1] : null,
    }
  }

  const { prev, next } = getPrevNextPosts()
  const isAuthor = userData?.nickname === post?.writerInfo

  // if (isLoading) return <div>로딩 중...</div>
  if (isError || !post)
    return <div>게시글을 불러오는 중 오류가 발생했습니다.</div>

  return (
    <div className="w-full max-w-4xl px-4 py-8 mx-auto overflow-hidden">
      <h2 className="flex justify-center mb-6 text-xl font-semibold text-ssacle-blue">
        {BOARD_TITLES[post.subCategory] || BOARD_TITLES[boardType] || '게시판'}
      </h2>

      <div className="flex flex-col gap-2 pb-4 mb-4 border-b">
        <h1 className="text-2xl font-bold">{post?.title || '제목 없음'}</h1>
        <div className="text-sm text-gray-500">
          {post?.writerInfo || '알 수 없음'} |{' '}
          {post?.time?.split('T')[0] || '날짜 없음'}
        </div>
        <div className="flex gap-2 mt-2">
          {post?.tags?.map((tag, index) => (
            <span key={index} className="px-2 py-1 text-sm bg-gray-100 rounded">
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
      <div className="flex justify-end gap-2 mt-6">
        {isAuthor && (
          <>
            <button
              onClick={handleEditPost}
              className="px-4 py-2 text-white bg-blue-300 rounded hover:bg-blue-600"
            >
              수정
            </button>
            <button
              onClick={handleDeletePost}
              className="px-4 py-2 text-white bg-blue-300 rounded hover:bg-blue-600"
            >
              삭제
            </button>
          </>
        )}
        <button
          onClick={() =>
            navigate(`/board/${boardType}?tab=${post.subCategory}`)
          }
          className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
        >
          목록
        </button>
      </div>

      <div className="mt-16">
        <CommentList
          comments={commentsData}
          currentUserId={userData?.nickname}
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
