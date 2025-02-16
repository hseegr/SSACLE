import { useState, useEffect } from 'react'
import FilterBar from '@/components/SprintCommon/FilterBar'
import ItemList from '@/components/SprintCommon/ItemList'
import Pagination from '@/components/common/Pagination'
import {
  fetchSsaprintListWithFilter,
  fetchCompletedSsaprintList,
} from '@/services/ssaprintService'

const SsaprintLayout = () => {
  const [sprints, setSprints] = useState([])
  const [filters, setFilters] = useState({
    status: 0, // 0: 참여 가능, 1: 진행 중, 2: 완료
    categoryId: null,
  })
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    pageSize: 8,
  })

  // 필터 변경 핸들러 (상태 변경 시 기존 목록 초기화)
  const handleFilterChange = (key, value) => {
    setFilters((prev) => {
      if (key === 'status' && value === 2) {
        setSprints([])
      }
      return { ...prev, [key]: value }
    })
  }

  // 페이지 변경 핸들러
  const handlePageChange = (newPage) => {
    setPagination((prev) => ({ ...prev, currentPage: newPage }))
  }

  // API 호출하여 싸프린트 목록 가져오기
  useEffect(() => {
    const fetchData = async () => {
      setSprints([]) // 기존 데이터 초기화

      if (filters.status === 2) {
        // 참여 완료 스프린트 조회
        const response = await fetchCompletedSsaprintList(
          pagination.currentPage - 1,
          pagination.pageSize
        )

        if (response) {
          setSprints(response.content || [])
          setPagination((prev) => ({
            ...prev,
            totalPages: response.totalPages,
            totalElements: response.totalElements,
          }))
        }
      } else {
        // 참여 가능 스프린트 조회
        const response = await fetchSsaprintListWithFilter(
          filters.status,
          filters.categoryId,
          pagination.currentPage - 1,
          pagination.pageSize
        )
        if (response) {
          setSprints(response.content || [])
          setPagination((prev) => ({
            ...prev,
            totalPages: response.totalPages,
            totalElements: response.totalElements,
          }))
        }
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
        <ItemList
          items={
            filters.status === 2 ? sprints.map((item) => item.sprint) : sprints
          }
          domain="ssaprint"
        />
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
