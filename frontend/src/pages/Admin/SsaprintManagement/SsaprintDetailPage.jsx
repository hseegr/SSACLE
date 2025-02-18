import UserProfile from '@/components/AdminPage/UserProfile'
import SsaprintInfo from '@/components/AdminPage/SsaprintManagement/SsaprintDetail/SsaprintInfo'
import SsaprintContent from '@/components/AdminPage/SsaprintManagement/SsaprintDetail/SsaprintContent'
import SasprintQuestionTable from '@/components/AdminPage/SsaprintManagement/SsaprintDetail/SsaprintQuestionTable'
import BackButton from '@/components/AdminPage/BackButton'
import { useParams } from 'react-router-dom'
import { fetchSsaprintDetail } from '@/services/ssaprintService'
import { useEffect, useState } from 'react'
import { formatDate } from '@/components/AdminPage/SsaprintManagement/SearchSsaprint'
import { fetchAdminSsaprintUser } from '@/services/adminService'

const SsaprintDetail = () => {
  const { id: sprintId } = useParams()
  const [sprintData, setSprintData] = useState(null)
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const getSprintDetail = async () => {
      try {
        setLoading(true)
        if (!sprintId) {
          setError('스프린트 ID가 없습니다.')
          return
        }
        const data = await fetchSsaprintDetail(sprintId)
        const sprintUsers = await fetchAdminSsaprintUser(sprintId)
        setSprintData(data)
      } catch (err) {
        setError('데이터를 불러오는 중 오류가 발생했습니다.')
      } finally {
        setLoading(false)
      }
    }
    getSprintDetail()
  }, [sprintId])

  if (loading) return <p className="text-center">데이터 로딩 중...</p>
  if (error) return <p className="text-center text-red-500">{error}</p>

  // const mockMembers = [
  //   { id: 1, nickname: '미셸', imageUrl: '' },
  //   { id: 2, nickname: '쥬니', imageUrl: '' },
  //   { id: 3, nickname: '펠릭', imageUrl: '' },
  //   { id: 4, nickname: '시베리아', imageUrl: '' },
  // ]

  return (
    <div className="max-w-full min-w-max flex flex-col justify-center items-center p-6 gap-6">
      <h1 className="text-2xl font-bold text-center">싸프린트 상세 조회</h1>
      {/* <p>ID: {sprintId}</p> */}
      {/* 스프린트 기본 정보 */}
      <SsaprintInfo
        title={sprintData.sprint.name}
        topic={
          sprintData.categories?.map((cat) => cat.categoryName).join('  |  ') ||
          'N/A'
        }
        period={`${formatDate(sprintData?.sprint?.startAt)} ~ ${formatDate(sprintData?.sprint?.endAt)}`}
        description={sprintData.sprint.basicDescription}
      />

      {/* 스프린트 멤버 */}
      <div className="mt-6">
        <h2 className="text-ssacle-blue text-lg font-semibold text-center">
          스프린트 멤버
        </h2>
        <div className="flex justify-center gap-4 text-sm m-4">
          {members.length > 0
            ? members.map((member) => (
                <UserProfile
                  key={member.id}
                  imageUrl={member.imageUrl}
                  nickname={member.nickname}
                />
              ))
            : '참여 멤버가 없습니다.'}
        </div>
      </div>

      {/* 스프린트 상세 내용 */}
      <div>
        <h2 className="text-ssacle-blue text-lg font-semibold text-center my-4">
          스프린트 상세 내용
        </h2>
        <SsaprintContent
          learningSchedule={
            sprintData?.sprint?.detailDescription || '상세 설명이 없습니다.'
          }
          goal={sprintData?.sprint?.recommendedFor || '추천 대상 없음'}
        />
      </div>

      {/* 질문 카드 테이블 */}
      <div className="max-w-3xl w-full mx-auto m-6">
        <SasprintQuestionTable />
      </div>

      <BackButton className="mb-12" />
    </div>
  )
}

export default SsaprintDetail
