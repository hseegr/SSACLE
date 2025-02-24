import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import MySsaprintList from '@/components/MainPage/Profile/MySsaprintList'
import Profile from '@/components/MainPage/Profile/Profile'
import CurruntSsaprint from '@/components/MainPage/Ssaprint/CurrentSsaprint'
import CurruntSsadcup from '@/components/MainPage/Ssadcup/CurrentSsadcup'
import SsabapVote from '@/components/MainPage/SsabapVote/SsabapVote'
import News from '@/components/MainPage/News/News'
import {
  fetchAiNews,
  fetchNowMySsaprint,
  fetchSsaprintList,
  fetchUserInfo,
} from '@/services/mainService'

const MainPage = () => {
  const navigate = useNavigate()

  // 유저 프로필 조회
  const { data: userData, isLoading: isUserLoading } = useQuery({
    queryKey: ['userInfo'],
    queryFn: fetchUserInfo,
    retry: false,
  })

  // 현재 참여중인 싸프린트 / 싸드컵 현황
  const { data: currentSprintsData, isLoading: isSprintsLoading } = useQuery({
    queryKey: ['currentSprints'],
    queryFn: fetchNowMySsaprint,
  })

  // 추천 싸프린트 조회
  const { data: sprintListData = [], isLoading: isSprintLoading } = useQuery({
    queryKey: ['sprintList'],
    queryFn: fetchSsaprintList,
    enabled: !!userData?.categoryNames && userData.categoryNames.length > 0,
    retry: false,
  })

  // AI 뉴스 조회
  const { data: aiNewsData, isLoading: isNewsLoading } = useQuery({
    queryKey: ['aiNews'],
    queryFn: fetchAiNews,
    retry: false,
  })

  // 로딩 상태 처리
  if (isUserLoading || isNewsLoading || isSprintsLoading || isSprintLoading) {
    return <div>로딩 중...</div>
  }

  // 추천 싸프린트 필터링
  const filteredSprints = sprintListData
    .filter(
      (sprint) =>
        userData.categoryNames.includes(sprint.majorCategoryName) ||
        (sprint.subCategoryName &&
          userData.categoryNames.includes(sprint.subCategoryName))
    )
    .map((sprint) => ({
      sprintId: sprint.id,
      title: sprint.title,
      category: sprint.subCategoryName || sprint.majorCategoryName,
      status: sprint.currentMembers < sprint.maxMembers ? '모집중' : '모집완료',
      requiredSkills: [sprint.subCategoryName || sprint.majorCategoryName],
      currentMembers: sprint.currentMembers,
      maxMembers: sprint.maxMembers,
      startDate: sprint.start_at,
      endDate: sprint.end_at,
    }))

  // 추천 싸프린트가 없을 경우 렌더링할 컴포넌트
  const NoInterestMessage = () => (
    <>
      <p className="tracking-tighter text-xl font-semibold text-ssacle-black mb-9">
        <span className="font-bold">{userData.nickname}</span>님에게 딱 맞는{' '}
        <span className="font-bold text-ssacle-blue">싸프린트</span> 여기
        있어요! 💡
      </p>
      <div className="bg-gray-50 rounded-xl p-6 text-center">
        <p className="text-ssacle-black font-semibold mb-2">
          아직 관심분야가 없으신가요? 🌟
        </p>
        <p className="text-ssacle-black text-sm mb-4">
          내게 딱 맞는 싸프린트 추천을 받으려면 관심분야를 선택해보세요!
        </p>
        <button
          onClick={() => navigate('/user/profile')}
          className="bg-ssacle-blue text-white px-4 py-2 text-sm rounded-lg hover:bg-blue-600 transition-colors"
        >
          관심분야 선택하기
        </button>
      </div>
    </>
  )

  return (
    <main className="min-w-[1000px]">
      {/* 프로필, 나의 싸프린트 + 싸드컵 현황 보드 */}
      <div className="flex flex-row mb-20 gap-x-5">
        <section className="basis-2/5">
          <Profile userData={userData} />
        </section>
        <section className="basis-3/5">
          <MySsaprintList currentSprintsData={currentSprintsData} />
        </section>
      </div>

      {/* 모집중인 싸프린트 */}
      <section className="mb-20">
        {userData?.categoryNames && userData.categoryNames.length > 0 ? (
          filteredSprints.length > 0 ? (
            <CurruntSsaprint
              userData={userData}
              recommendedSprints={filteredSprints}
            />
          ) : (
            <div className="bg-ssacle-sky rounded-xl p-6 text-center">
              <p className="text-ssacle-black font-semibold">
                현재 추천 가능한 싸프린트가 없습니다. 😊
              </p>
            </div>
          )
        ) : (
          <NoInterestMessage />
        )}
      </section>

      {/* 싸밥 투표, AI 기사 */}
      <div className="flex flex-row gap-x-5">
        <section className="basis-1/2">
          <SsabapVote />
        </section>
        <section className="basis-1/2">
          <News news={aiNewsData} />
        </section>
      </div>
    </main>
  )
}

export default MainPage
