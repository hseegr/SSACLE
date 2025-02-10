import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { fetchSsaprintDetail } from '@/services/ssaprintService'
import SsaprintDetailLayout from '@/components/Ssaprint/SsaprintDetailLayout'

const SsaprintDetailPage = () => {
  const { sprintId } = useParams()
  const [sprintData, setSprintData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getSprintData = async () => {
      try {
        const data = await fetchSsaprintDetail(sprintId)
        setSprintData(data)
      } finally {
        setLoading(false)
      }
    }

    getSprintData()
  }, [sprintId])

  if (loading) {
    return <p className="text-center text-gray-500">로딩 중...</p>
  }

  return <SsaprintDetailLayout sprintData={sprintData} />
}

export default SsaprintDetailPage
