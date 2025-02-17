import { useEffect, useState } from 'react'
import { useParams, useLocation } from 'react-router-dom'
import { getActiveSsaprint } from '@/services/ssaprintService'
import SsaprintJourneyLayout from '@/components/Ssaprint/SsaprintJourneyLayout'

const SsaprintJourneyPage = () => {
  const { sprintId } = useParams() // URL에서 sprintId 가져오기
  const location = useLocation() // navigate로 전달된 teamId 가져오기
  const teamId = location.state?.teamId
  // console.log('📌 teamId:', teamId)
  const [sprintData, setSprintData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSprintData = async () => {
      if (!sprintId || !teamId) return

      try {
        const data = await getActiveSsaprint(sprintId, teamId) // API 호출
        setSprintData(data)
      } catch (error) {
        alert('스프린트 데이터를 불러오는 데 실패했습니다.')
      } finally {
        setLoading(false)
      }
    }

    fetchSprintData()
  }, [sprintId, teamId])

  if (loading) return <p>로딩 중...</p>
  if (!sprintData) return <p>데이터를 불러올 수 없습니다.</p>

  return <SsaprintJourneyLayout sprintData={sprintData} />
}

export default SsaprintJourneyPage
