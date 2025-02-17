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

const SsaprintListPage = () => {
  const navigate = useNavigate()

  const [selectedRows, setSelectedRows] = useState([])
  const [page, setPage] = useState(0) // 현재 페이지 상태
  const size = 10 // 한 페이지당 보여줄 개수
  const data_size = 1000 // 총 가져올 데이터 수수

  // 싸프린트 데이터 가져오기
  const { data, isLoading, error } = useSsaprintList({
    categoryId: null,
    status: 0,
    page,
    size:data_size,
  })

  const columns = [
    { key: 'id', label: '싸프린트 ID', sortable: true, width: '12%' },
    { key: 'name', label: '이름', width: '25%'},
    {
      key: 'basicDescription',
      label: '설명',
      render: (row) => cleanDescription(row.basicDescription),
      width: '23%',
    },
    {
      key: 'startAt',
      label: '시작일',
      render: (row) => formatDate(row.startAt),
      width: '10%',
    },
    {
      key: 'endAt',
      label: '종료일',
      render: (row) => formatDate(row.endAt),
      width: '10%',
    },
    { key: 'maxMembers', label: '최대 인원', width: '5%'},
    { key: 'currentMembers', label: '현재 인원', width: '5%'},
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
      width: '9%',
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

  const handleRowClick = (id) => {
    navigate(`/admin/ssaprint/${id}`)
  }

  return (
    <div className="flex flex-col justify-center p-6 gap-1 max-w-full min-w-max ">
      <h1 className="text-2xl font-bold text-center">싸프린트 관리</h1>
      {/* 삭제 버튼 & 생성하기 버튼 영역 */}
      <div className="flex justify-between items-center m-2">
        {/* 삭제 버튼 */}
        {/* <DeleteButton selectedRows={selectedRows} onDelete={handleDelete} /> */}
        <p className="text-ssacle-blue text-xs text-center mt-2">
          ✨ 원하는 싸프린트를 선택하면 상세 페이지로 이동해요!
        </p>

        {/* 생성하기 버튼 */}
        <button
          onClick={handleCreate}
          className="px-4 py-1.5 bg-ssacle-blue text-white rounded hover:bg-blue-600 transition"
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
        onRowClick={(row) => handleRowClick(row.id)} 
      />
    </div>
  )
}

export default SsaprintListPage
