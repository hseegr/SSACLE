// @ts-nocheck
import { useLocation } from 'react-router-dom'
import Pagination from '@/components/common/Pagination'
import FilterBar from '@/components/SprintCommon/FilterBar'
import ItemList from '@/components/SprintCommon/ItemList'
import SprintBanner from '@/components/SprintCommon/SprintBanner'
import {
  fetchCompletedSsaprintList,
  fetchSsaprintListWithFilter,
} from '@/services/ssaprintService'
import { useEffect, useState } from 'react'

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
  const location = useLocation() // 현재 경로 가져오기

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
    window.scrollTo(0, 0)

    let isMounted = true // 최신 요청만 반영하기 위한 플래그

    const fetchData = async () => {
      if (filters.status === 2) {
        // 참여 완료 스프린트 조회
        const response = await fetchCompletedSsaprintList(
          pagination.currentPage - 1,
          pagination.pageSize
        )

        if (response && isMounted) {
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
        if (response && isMounted) {
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

    return () => {
      isMounted = false // 이전 요청 취소
    }
  }, [filters, pagination.currentPage, pagination.pageSize, location.pathname])

  return (
    <div className="relative min-h-full flex flex-col">
      {/* 싸프린트 소개 배너 */}
      <SprintBanner
        title="싸프린트"
        description="함께 배우고 성장하는, 짧고 집중적인 스프린트 학습 공간입니다."
        domain="ssaprint"
      />

      {/* 필터 UI */}
      <div className="mt-6">
        <FilterBar onFilterChange={handleFilterChange} />
      </div>

      {/* 스프린트 목록 */}
      <section className="mt-5 w-full min-h-[412px]">
        <ItemList
          items={
            filters.status === 2 ? sprints.map((item) => item.sprint) : sprints
          }
          domain="ssaprint"
        />
      </section>

      {/* 페이지네이션 추가 */}
      <div className="mt-5">
        <Pagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  )
}

export default SsaprintLayout
