import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import {
  fetchSaveInterest,
  fetchSignupLoadCategory,
} from '@/services/userService'

const InterestPage = () => {
  const navigate = useNavigate()
  const [selected, setSelected] = useState(new Set())
  const [categories, setCategories] = useState([])
  const userNickname = localStorage.getItem('userNickname')
  const userId = localStorage.getItem('userId')

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await fetchSignupLoadCategory()
        setCategories(data)
      } catch (error) {
        console.error('❌ 카테고리 불러오기 실패:', error)
      }
    }

    loadCategories()
  }, [])

  // 대주제(메인 카테고리)와 중주제(서브 카테고리) 변환
  const mainCategories = categories.map((category) => category.categoryName)
  const subCategories = categories.flatMap((category) =>
    category.subCategories.map((sub) => sub.categoryName)
  )

  const toggleSelection = (interest) => {
    setSelected((prev) => {
      const newSelection = new Set(prev)
      if (newSelection.has(interest)) {
        newSelection.delete(interest)
      } else {
        newSelection.add(interest)
      }
      return newSelection
    })
  }

  // 관심사 저장 Mutation
  const saveInterestsMutation = useMutation({
    mutationFn: async () => {
      if (!userId)
        throw new Error('사용자 정보가 없습니다. 다시 로그인해주세요.')
      return fetchSaveInterest(userId, Array.from(selected))
    },
    onSuccess: () => {
      alert('관심사가 성공적으로 저장되었습니다!')
      localStorage.removeItem('userId')
      localStorage.removeItem('userNickname')
      navigate('/account/signup/success')
    },
    onError: (error) => {
      console.error('❌ 관심사 저장 실패:', error)
      alert('관심사 저장 중 오류가 발생했습니다. 다시 시도해주세요.')
    },
  })

  return (
    <div className="w-auto h-auto overflow-auto flex justify-center items-center bg-white">
      <div className="w-[40rem] max-w-2xl h-auto bg-white flex flex-col justify-center items-center py-10 mt-24 shrink-0">
        <p className="text-ssacle-gray text-xl font-noto-sans-kr font-light mb-2">
          거의 다 됐어요!
        </p>
        <h2 className="text-ssacle-black text-2xl font-noto-sans-kr font-light mb-2">
          <span className="font-bold">{userNickname}</span>님의 관심 주제를
          알려주세요!
        </h2>
        <div className="text-center text-ssacle-black text-2xl font-noto-sans-kr font-light mb-2">
          <p>해당 키워드를 바탕으로,</p>
          <p>훨씬 수월하게 콘텐츠를 고를 수 있어요!</p>
        </div>
        <p className="text-ssacle-gray text-xl font-noto-sans-kr font-light mb-20">
          선택하지 않아도, 마이페이지에서 언제든 수정할 수 있어요!
        </p>

        {/* 로딩 상태 처리 */}
        {categories.length === 0 ? (
          <p>카테고리를 불러오는 중...⌛</p>
        ) : (
          <div className="max-w-2xl">
            {/* 주요 카테고리 */}
            <div className="flex flex-wrap justify-center gap-4 w-full mb-10">
              {mainCategories.map((interest) => (
                <button
                  key={interest}
                  onClick={() => toggleSelection(interest)}
                  className={`px-6 py-2 rounded-full text-xl font-bold font-montserrat transition-colors duration-200 ${
                    selected.has(interest)
                      ? 'bg-ssacle-blue text-white'
                      : 'bg-ssacle-sky text-ssacle-blue'
                  }`}
                >
                  {interest}
                </button>
              ))}
            </div>

            {/* 구분선 */}
            <div className="flex flex-col items-center w-full">
              <div className="w-6 border-b-4 border-ssacle-gray-sm mb-10"></div>
            </div>

            {/* 서브 카테고리 */}
            <div className="flex flex-wrap justify-center gap-4 w-full mb-10">
              {subCategories.map((interest) => (
                <button
                  key={interest}
                  onClick={() => toggleSelection(interest)}
                  className={`px-6 py-2 rounded-full text-xl font-bold font-montserrat transition-colors duration-200 ${
                    selected.has(interest)
                      ? 'bg-ssacle-blue text-white'
                      : 'bg-ssacle-sky text-ssacle-blue'
                  }`}
                >
                  {interest}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 저장 버튼 */}
        <div className="relative group flex flex-col items-center">
          <button
            className={`mt-10 mb-3 px-10 py-3 text-white text-xl font-bold font-noto-sans-kr rounded-full transition-all ${
              userId ? 'bg-ssacle-black' : 'bg-ssacle-gray cursor-not-allowed'
            }`}
            onClick={() => {userId && saveInterestsMutation.mutate()}}
            disabled={!userId}
          >
            {saveInterestsMutation.isLoading ? '저장 중...' : '저장하기'}
          </button>

          {/* userId가 없을 때 로그인 버튼 표시 */}
          {!userId && (
            <button
              className="px-10 py-3 text-white text-xl font-bold font-noto-sans-kr rounded-full bg-ssacle-blue transition-all"
              onClick={() => {
                localStorage.removeItem('userId')
                localStorage.removeItem('userNickname')
                navigate('/account/signup/success')
              }}
            >
              넘어가기
            </button>
          )}

          {/* userId가 없을 때 툴팁 표시 */}
          {!userId && (
            <div className="🔥 absolute left-1/2 transform -translate-x-1/2 -top-10 bg-black text-white text-sm rounded-md px-4 py-2 min-w-[13rem] opacity-0 group-hover:opacity-100 transition-opacity text-center">
              <p>인증 코드가 만료되었어요!</p>
              <p>마이페이지에서 수정해야해요!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default InterestPage
