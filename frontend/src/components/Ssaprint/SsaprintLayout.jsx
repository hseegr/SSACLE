import { useState, useEffect } from 'react'
import FilterBar from '@/components/SprintCommon/FilterBar'
import ItemList from '@/components/SprintCommon/ItemList'
import Pagination from '@/components/common/Pagination'
import { fetchSsaprintListWithFilter } from '@/services/ssaprintService'

const SsaprintLayout = () => {
  const [sprints, setSprints] = useState([])
  const [filters, setFilters] = useState({
    status: 0, // 0: 시작 전, 1: 진행 중, 2: 완료
    categoryId: null,
  })
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    pageSize: 8,
  })

  // 필터 변경 핸들러
  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  const handlePageChange = (newPage) => {
    setPagination((prev) => ({ ...prev, currentPage: newPage }))
  }

  // API 호출하여 싸프린트 목록 가져오기
  useEffect(() => {
    const fetchData = async () => {
      const response = await fetchSsaprintListWithFilter(
        filters.status,
        filters.categoryId,
        pagination.currentPage - 1, // API는 0-based index
        pagination.pageSize
      )

      if (response) {
        setSprints(response.content || [])
        setPagination((prev) => {
          return {
            ...prev,
            totalPages: response.totalPages,
            totalElements: response.totalElements,
          }
        })
      }
    }

    fetchData()
  }, [filters, pagination.currentPage, pagination.pageSize])

  return (
    <div className="mt-16">
      {/* 싸프린트 소개 배너 */}
      <section className="bg-[#F0F7F3] text-gray-700 text-center py-3 rounded-lg mb-3">
        <h1 className="text-sm font-semibold">싸프린트</h1>
        <p className="text-xs">
          함께 배우고 성장하는, 짧고 집중적인 스프린트 학습 공간입니다.
        </p>
      </section>

      {/* 필터 UI */}
      <FilterBar onFilterChange={handleFilterChange} />

      {/* 스프린트 목록 */}
      <section className="mt-1">
        <ItemList items={sprints} domain="ssaprint" />
      </section>

      {/* 페이지네이션 추가 */}
      <Pagination
        currentPage={pagination.currentPage}
        totalPages={pagination.totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  )
}

export default SsaprintLayout
