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
    status: 'available',
    position: [],
    stack: [],
    search: '',
  })
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    pageSize: 10,
  })

  // 필터 변경 핸들러
  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  const handlePageChange = (newPage) => {
    setPagination((prev) => ({ ...prev, currentPage: newPage }))
  }

  // ✅ Mock Data를 불러오는 API 사용 (실제 API 대체)
  useEffect(() => {
    const fetchData = async () => {
      let data
      if (filters.status === 'completed') {
        data = await fetchCompletedSsaprintList(
          pagination.currentPage,
          pagination.pageSize
        )
      } else {
        data = await fetchSsaprintListWithFilter(
          filters.position.join(','),
          filters.stack.join(','),
          pagination.currentPage - 1,
          pagination.pageSize
        )
      }

      if (data) {
        setSprints(data.content || [])
        setPagination((prev) => ({
          ...prev,
          totalPages: data.totalPages,
          totalElements: data.totalElements,
        }))
      }
    }

    fetchData()
  }, [filters, pagination.currentPage, pagination.pageSize])

  // // API 호출하여 싸프린트 목록 가져오기
  // useEffect(() => {
  //   const fetchData = async () => {
  //     let data;
  //     if (filters.status === 'completed') {
  //       data = await fetchCompletedSsaprintList(pagination.currentPage, pagination.pageSize);
  //     } else {
  //       data = await fetchSsaprintListWithFilter(
  //         filters.position.join(','),
  //         filters.stack.join(','),
  //         pagination.currentPage,
  //         pagination.pageSize
  //       );
  //     }

  //     if (data) {
  //       setSprints(data.content || []); // ✅ `.data`에서 직접 `content` 가져오기
  //       setPagination((prev) => ({
  //         ...prev,
  //         totalPages: data.totalPages, // ✅ `.data`에서 직접 가져오기
  //         totalElements: data.totalElements,
  //       }));
  //     }
  //   };

  //   fetchData();
  // }, [filters, pagination.currentPage]);

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
      <FilterBar domain="ssaprint" onFilterChange={handleFilterChange} />

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
