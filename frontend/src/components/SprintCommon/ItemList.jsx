import { useState } from 'react'
import ItemCard from '@/components/SprintCommon/ItemCard'
import Pagination from '@/components/common/Pagination'

const ItemList = ({ items, domain }) => {
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 8

  // 현재 페이지에서 보여줄 데이터
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = items.slice(indexOfFirstItem, indexOfLastItem)

  // 전체 페이지 수
  const totalPages = Math.ceil(items.length / itemsPerPage)

  return (
    <div>
      {/* 아이템 리스트 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
        {currentItems.length > 0 ? (
          currentItems.map((item) => (
            <ItemCard key={item.id} item={item} domain={domain} />
          ))
        ) : (
          <p className="text-gray-500 text-center col-span-4">
            조건에 맞는 데이터가 없습니다.
          </p>
        )}
      </div>

      {/* 페이지네이션 */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  )
}

export default ItemList
