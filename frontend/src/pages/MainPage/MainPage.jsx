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
  fetchUserInfo,
} from '@/services/mainService'

const MainPage = () => {
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

  // AI 뉴스 조회
  const { data: aiNewsData, isLoading: isNewsLoading } = useQuery({
    queryKey: ['aiNews'],
    queryFn: fetchAiNews,
    retry: false,
  })

  if (isUserLoading || isNewsLoading || isSprintsLoading) {
    return <div>로딩 중...</div>
  }

  return (
    <main className="min-w-max my-20">
      {/* 프로필, 나의 싸프린트 + 싸드컵 현황 보드 */}
      <div className="flex flex-row gap-x-5 mb-20">
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
          userData={user}
          recommendedSprints={recommendedSprints}
        />
      </section>
      {/* 모집중인 싸드컵 */}
      <section className="mb-20">
        <CurruntSsadcup
          userData={user}
          recommendedSprints={recommendedSprints}
        />
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
