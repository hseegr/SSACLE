import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { fetchSaveInterest } from '@/services/userService'

const InterestPage = () => {
  const navigate = useNavigate()
  const [selected, setSelected] = useState(new Set())
  const userNickname = localStorage.getItem('userNickname')
  const userId = localStorage.getItem('userId')

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
      navigate('/account/signup/success')
    },
    onError: (error) => {
      console.error('❌ 관심사 저장 실패:', error)
      alert('관심사 저장 중 오류가 발생했습니다. 다시 시도해주세요.')
    },
  })

  // ✅ 주요 카테고리
  const mainCategories = ['Back-end', 'Front-end', 'Infra', 'DataBase']

  // ✅ 서브 카테고리
  const subCategories = [
    'Spring',
    'Django',
    'Node.js',
    'NestJS',
    'ASP.NET',
    'React',
    'Vue.js',
    'Angular',
    'Svelte',
    'Next.js',
    'Docker',
    'Kubernetes',
    'AWS',
    'Azure',
    'Google Cloud',
    'MySQL',
    'PostgreSQL',
    'MongoDB',
    'Redis',
    'Oracle',
    'MariaDB',
  ]

  return (
    <div className="w-full h-auto bg-white flex flex-col items-center py-10 mt-24">
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
        마이페이지에서 언제든 수정할 수 있어요!
      </p>

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
      <div className="w-6 border-b-4 border-ssacle-gray-sm mb-10"></div>

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

      {/* 저장 버튼 */}
      <button
        className={`mt-10 mb-24 px-10 py-3 text-white text-xl font-bold font-noto-sans-kr rounded-full transition-all ${
          userId ? 'bg-ssacle-black' : 'bg-ssacle-gray cursor-not-allowed'
        }`}
        onClick={() => userId && saveInterestsMutation.mutate()}
        disabled={!userId}
      >
        {saveInterestsMutation.isLoading ? '저장 중...' : '저장하기'}
      </button>
    </div>
  )
}

export default InterestPage
