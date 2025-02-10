import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getActiveSsaprint } from '@/services/ssaprintService'
import SsaprintJourneyLayout from '@/components/Ssaprint/SsaprintJourneyLayout'

const SsaprintJourneyPage = () => {
  const { sprintId } = useParams()
  const [sprintData, setSprintData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSprintData = async () => {
      try {
        const data = await getActiveSsaprint(sprintId) // ✅ 목업 데이터 사용
        setSprintData(data)
      } catch (error) {
        alert('스프린트 데이터를 불러오는 데 실패했습니다.')
      } finally {
        setLoading(false)
      }
    }

    fetchSprintData()
  }, [sprintId])

  if (loading) return <p>로딩 중...</p>
  if (!sprintData) return <p>데이터를 불러올 수 없습니다.</p>

  return <SsaprintJourneyLayout sprint={sprintData} />
}

export default SsaprintJourneyPage
