import mockData from '@/mocks/mainPageData.json'
import MySsaprintList from '@/components/MainPage/Profile/MySsaprintList'
import Profile from '@/components/MainPage/Profile/Profile'
import CurruntSsaprint from '@/components/MainPage/Ssaprint/CurrentSsaprint'
import CurruntSsadcup from '@/components/MainPage/Ssadcup/CurrentSsadcup'
import SsabapVote from '@/components/MainPage/SsabapVote/SsabapVote'
import News from '@/components/MainPage/News/News'
import { useQuery } from '@tanstack/react-query'
import {
  fetchAiNews,
  fetchNowMySsaprint,
  fetchSsaprintList,
  fetchUserInfo,
} from '@/services/mainService'

const MainPage = () => {
  // 임시 관심사 데이터
  // const mockInterests = [
  //   { majorCategory: 'Back-end', subCategory: 'Spring' },
  //   { majorCategory: 'Database', subCategory: 'MySQL' },
  // ]
  // 목업 데이터 관련
  const { user, currentSprints, recommendedSprints } = mockData

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

  // 유저 관심사에 맞는 싸프린트 필터링
  const { data: sprintListData, isLoading: isSprintLoading } = useQuery({
    queryKey: ['sprintList'],
    queryFn: fetchSsaprintList,
    retry: false,
  })

  // AI 뉴스 조회
  const { data: aiNewsData, isLoading: isNewsLoading } = useQuery({
    queryKey: ['aiNews'],
    queryFn: fetchAiNews,
    retry: false,
  })

  if (isUserLoading || isNewsLoading || isSprintsLoading) {
    return <div>로딩 중...</div>
  }

  // API 응답 데이터를 컴포넌트가 기대하는 형태로 변환
  const filteredSprints =
    sprintListData
      ?.filter(
        (sprint) =>
          // 유저의 categoryNames에 majorCategoryName이나 subCategoryName이 포함되어 있는지 확인
          userData.categoryNames.includes(sprint.majorCategoryName) ||
          (sprint.subCategoryName &&
            userData.categoryNames.includes(sprint.subCategoryName))
      )
      .map((sprint) => ({
        sprintId: sprint.id,
        title: sprint.title,
        category: sprint.subCategoryName || sprint.majorCategoryName,
        status:
          sprint.currentMembers < sprint.maxMembers ? '모집중' : '모집완료',
        requiredSkills: [sprint.subCategoryName || sprint.majorCategoryName],
        currentMembers: sprint.currentMembers,
        maxMembers: sprint.maxMembers,
        startDate: sprint.start_at,
        endDate: sprint.end_at,
      })) || []

  return (
    <main className="min-w-max">
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
        <CurruntSsaprint
          userData={userData}
          recommendedSprints={filteredSprints}
        />
      </section>
      {/* 모집중인 싸드컵 */}
      {/* <section className="mb-20">
        <CurruntSsadcup
          userData={user}
          recommendedSprints={recommendedSprints}
        />
      </section> */}
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
