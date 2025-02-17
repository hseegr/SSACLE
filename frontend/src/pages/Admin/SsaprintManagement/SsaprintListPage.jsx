import CommonTable from '@/components/AdminPage/CommonTable'
import DeleteButton from '@/components/AdminPage/DeleteButton'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchSearchSsaprint } from '@/services/adminService'
import useSsaprintList from '@/hooks/useSsaprintList'
import {
  cleanDescription,
  formatDate,
  getStatus,
} from '@/components/AdminPage/SsaprintManagement/SearchSsaprint'

const AdminPage = () => {
  const navigate = useNavigate()

  const [selectedRows, setSelectedRows] = useState([])
  const [page, setPage] = useState(0) // 현재 페이지 상태
  const size = 10 // 한 페이지당 보여줄 개수

  // 싸프린트 데이터 가져오기
  const { data, isLoading, error } = useSsaprintList({
    categoryId: null,
    status: 0,
    page,
    size,
  })

  const columns = [
    { key: 'id', label: '싸프린트 ID', sortable: true },
    { key: 'name', label: '이름' },
    {
      key: 'basicDescription',
      label: '설명',
      render: (row) => cleanDescription(row.basicDescription),
    },
    {
      key: 'startAt',
      label: '시작일',
      render: (row) => formatDate(row.startAt),
    },
    {
      key: 'endAt',
      label: '종료일',
      render: (row) => formatDate(row.endAt),
    },
    { key: 'maxMembers', label: '최대 인원' },
    { key: 'currentMembers', label: '현재 인원' },
    {
      key: 'status',
      label: '상태',
      render: (row) => (
        <span
          className={`px-2 py-1 rounded-full text-white ${getStatusColor(row)}`}
        >
          {getStatus(row.startAt, row.endAt)}
        </span>
      ),
    },
  ]

  const getStatusColor = (row) => {
    const status = getStatus(row.startAt, row.endAt)
    return {
      '모집 중': 'bg-blue-400',
      '진행 중': 'bg-green-500',
      '진행 완료': 'bg-gray-400'
    }[status] || 'bg-gray-200'
  }

  const handleDelete = (row) => {
    const handleDelete = (rowsToDelete) => {
      console.log('삭제할 데이터:', rowsToDelete)
      setSelectedRows([]) // 삭제 후 선택 초기화
    }
    
  }

  const handleCreate = () => {
    navigate('/admin/ssaprint/create')
  }

  return (
    <div className="flex flex-col justify-center p-6 gap-4">
      <h1 className="text-2xl font-bold mb-4 text-center">싸프린트 관리</h1>
      {/* 삭제 버튼 & 생성하기 버튼 영역 */}
      <div className="flex justify-between items-center mb-2">
        {/* 삭제 버튼 */}
        <DeleteButton selectedRows={selectedRows} onDelete={handleDelete} />

        {/* 생성하기 버튼 */}
        <button
          onClick={handleCreate}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
        >
          생성하기
        </button>
      </div>
      <CommonTable
        columns={columns}
        data={data?.content || []} // API 응답이 없으면 빈 배열 전달
        selectable
        perPage={size}
        onSelect={setSelectedRows}
      />
    </div>
  )
}

export default AdminPage
