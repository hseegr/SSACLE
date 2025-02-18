import { fetchAdminQuestionCards } from '@/services/adminService'
import CommonTable from '../../CommonTable'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

const SsaprintQuestionTable = () => {
  const { id: sprintId } = useParams()
  const [questionData, setQuestionData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedRows, setSelectedRows] = useState([])

  useEffect(() => {
    const fetchQuestionCards = async () => {
      try {
        if (!sprintId) {
          throw new Error('스프린트 ID가 없습니다.')
        }

        const data = await fetchAdminQuestionCards(sprintId)
        setQuestionData(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchQuestionCards()
  }, [sprintId])

  // 테이블에 기본 5개의 빈 행 추가
  const displayData =
    questionData.length > 0
      ? questionData
      : Array.from({ length: 5 }, (_, index) => ({
          id: ` `,
          description: ` `,
          createdAt: ` `,
          teamId: ` `,
          opened: ` `,
        }))

  // 테이블 컬럼 정의
  const columns = [
    { key: 'id', label: '질문카드 ID', width: '15%' },
    { key: 'description', label: '질문 내용', width: '40%' },
    { key: 'createdAt', label: '작성일', width: '20%' },
    { key: 'teamId', label: '팀 ID', width: '15%' },
    { key: 'opened', label: '공개 여부', width: '10%' },
  ]

  if (loading) return <p className="text-center">데이터 로딩 중...⏳</p>
  if (error) return <p className="text-center text-red-500">{error}</p>

  return (
    <div>
      <h2 className="text-center text-lg font-semibold text-ssacle-blue mb-4">
        스프린트 질문카드
      </h2>
      <CommonTable
        columns={columns}
        data={displayData}
        selectable={true}
        onSelect={setSelectedRows}
        perPage={5}
      />
    </div>
  )
}

export default SsaprintQuestionTable
