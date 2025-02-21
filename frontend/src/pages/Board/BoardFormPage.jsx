import React, { useState, useEffect } from 'react'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import { posts as mockPosts } from '@/mocks/boardData'
import { useMutation, useQuery } from '@tanstack/react-query'
import {
  fetchBoardDetail,
  fetchCreateBoard,
  fetchUpdateBoard,
} from '@/services/boardService'

const BoardFormPage = () => {
  // 글자 수 제한 상수 추가
  const TITLE_MAX_LENGTH = 50
  const CONTENT_MAX_LENGTH = 300

  const navigate = useNavigate()
  const { boardId } = useParams()
  const location = useLocation()
  const { state } = location
  const [loading, setLoading] = useState(!!boardId)

  // URL에서 majorCategory 가져오기
  const majorCategory = location.pathname.includes('/board/edu')
    ? 'edu'
    : 'free'

  // searchParams에서 subCategory 가져오기
  const searchParams = new URLSearchParams(location.search)
  // state의 type을 우선적으로 사용하고, 없을 경우 URL의 tab 값 사용
  const subCategory =
    location.state?.type || searchParams.get('tab') || 'legend'

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    majorCategory,
    subCategory,
    tags: [],
    tagInput: '', // 사용자 태그 입력 값 저장
  })

  // 수정 모드일 때 기존 게시글 데이터 불러오기
  const { data: existingPost } = useQuery({
    queryKey: ['post', boardId],
    queryFn: () => fetchBoardDetail(boardId),
    enabled: !!boardId,
    onError: (error) => {
      console.error('게시글을 불러오는데 실패했습니다:', error)
      alert('게시글을 불러오는데 실패했습니다.')
      navigate(-1)
    },
  })

  useEffect(() => {
    if (existingPost) {
      console.log('Setting form data with:', existingPost)
      setFormData((prev) => ({
        ...prev, // 기존 값 유지
        title: existingPost.title || '',
        content: existingPost.content || '',
        majorCategory: existingPost.majorCategory || prev.majorCategory,
        subCategory: existingPost.subCategory || prev.subCategory,
        tags: existingPost.tags || [],
      }))
      setLoading(false) // 데이터 반영 후 로딩 해제
    }
  }, [existingPost])

  // 게시글 생성 mutation
  const createPostMutation = useMutation({
    mutationFn: fetchCreateBoard,
    onSuccess: () => {
      alert('게시글이 작성되었습니다.')
      // 작성 완료 후 해당 게시판 목록으로 이동
      navigate(`/board/${majorCategory}?tab=${subCategory}`)
    },
    onError: (error) => {
      console.error('게시글 작성 실패:', error)
      const errorMessage =
        error.response?.data?.message || '게시글 작성에 실패했습니다.'
      alert(errorMessage)
    },
  })

  // 게시글 수정 mutation
  const updatePostMutation = useMutation({
    mutationFn: ({ id, data }) => fetchUpdateBoard(id, data),
    onSuccess: () => {
      alert('게시글이 수정되었습니다.')
      navigate(`/board/${majorCategory}?tab=${subCategory}`)
    },
    onError: (error) => {
      const errorMessage =
        error.response?.data?.message || '게시글 수정에 실패했습니다.'
      alert(errorMessage)
    },
  })

  const isValid = formData.title.trim() && formData.content?.trim()

  // 게시글 작성 및 수정
  const handleSubmit = async (e) => {
    e.preventDefault()

    const now = new Date()
    now.setHours(now.getHours() + 9) // UTC -> KST 변환

    if (!isValid) return

    const postData = {
      majorCategory: formData.majorCategory,
      subCategory: formData.subCategory,
      title: formData.title.trim(),
      content: formData.content.trim(),
      tags: formData.tags,
    }

    if (boardId) {
      updatePostMutation.mutate({ id: boardId, data: postData })
    } else {
      createPostMutation.mutate(postData)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target

    // 제목 글자 수 제한
    if (name === 'title' && value.length > TITLE_MAX_LENGTH) {
      return
    }

    // 내용 글자 수 제한
    if (name === 'content' && value.length > CONTENT_MAX_LENGTH) {
      return
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // 사용자가 태그 입력 후 Enter 또는 쉼표(,) 입력 시 추가
  const handleTagInputKeyDown = (e) => {
    if ((e.key === 'Enter' || e.key === ',') && formData.tagInput.trim()) {
      e.preventDefault() // 기본 입력 이벤트 방지
      const newTag = formData.tagInput.trim()
      if (!formData.tags.includes(newTag)) {
        setFormData((prev) => ({
          ...prev,
          tags: [...prev.tags, newTag],
          tagInput: '', // 입력 후 초기화
        }))
      }
    }
  }

  // 태그 입력값 업데이트
  const handleTagInputChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      tagInput: e.target.value,
    }))
  }

  // 태그 삭제
  const handleTagRemove = (tag) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tag),
    }))
  }

  const handleCancel = () => {
    if (
      window.confirm(
        boardId ? '수정을 취소하시겠습니까?' : '작성을 취소하시겠습니까?'
      )
    ) {
      navigate(-1)
    }
  }

  if (loading) {
    return <div></div>
  }

  return (
    <div className="container max-w-4xl px-4 py-8 mx-auto my-20 min-w-max">
      <h1 className="mb-6 text-2xl font-bold">
        {boardId ? '게시글 수정' : '새 게시글 작성'}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 제목 입력 */}
        <div>
          <label className="block mb-2">제목</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
            placeholder={`제목을 입력해주세요 (최대 ${TITLE_MAX_LENGTH}자)`}
            maxLength={TITLE_MAX_LENGTH}
            required
          />
        </div>

        {/* 태그 입력 (사용자 직접 입력 가능) */}
        <div>
          <label className="block mb-2">태그 입력</label>
          <div
            className={`flex flex-wrap gap-2 p-2 rounded ${formData.tags.length === 0 ? 'border' : ''}`}
          >
            {formData.tags.map((tag) => (
              <span
                key={tag}
                className="flex items-center px-3 py-1 text-sm text-white rounded-full bg-ssacle-blue"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => handleTagRemove(tag)}
                  className="ml-2 text-white hover:text-white"
                >
                  ×
                </button>
              </span>
            ))}
            <input
              type="text"
              value={formData.tagInput}
              onChange={handleTagInputChange}
              onKeyDown={handleTagInputKeyDown}
              placeholder="태그를 입력 후 Enter 또는 , 입력"
              className="flex-1 outline-none"
            />
          </div>
        </div>

        {/* 내용 입력 */}
        <div>
          <label className="block mb-2">내용</label>
          <span className="text-sm text-gray-500">
            {formData.content.length}/{CONTENT_MAX_LENGTH}
          </span>
          <textarea
            name="content"
            value={formData.content}
            onChange={handleChange}
            rows="10"
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
            placeholder={`내용을 입력해주세요 (최대 ${CONTENT_MAX_LENGTH}자)`}
            maxLength={CONTENT_MAX_LENGTH}
            required
          />
        </div>

        {/* 버튼 그룹 */}
        <div className="flex justify-center gap-4">
          <button
            type="submit"
            disabled={
              !isValid ||
              createPostMutation.isPending ||
              updatePostMutation.isPending
            }
            className={`px-6 py-2 rounded transition-colors ${
              isValid &&
              !createPostMutation.isPending &&
              !updatePostMutation.isPending
                ? 'bg-blue-500 text-white hover:bg-blue-600'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {createPostMutation.isPending || updatePostMutation.isPending
              ? '처리 중...'
              : boardId
                ? '수정하기'
                : '작성하기'}
          </button>
          <button
            type="button"
            onClick={handleCancel}
            className="px-6 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            취소
          </button>
        </div>
      </form>
    </div>
  )
}

export default BoardFormPage
