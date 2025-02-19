import { useState } from 'react'

const CommonTable = ({
  columns,
  data,
  selectable = false,
  perPage = 5,
  renderActions,
  onSelect, // 📍 부모 컴포넌트에서 선택된 행을 관리하도록 `onSelect` 추가
  onRowClick,
}) => {
  const [selectedRows, setSelectedRows] = useState([])
  const [sortKey, setSortKey] = useState(null)
  const [sortOrder, setSortOrder] = useState('asc')
  const [page, setPage] = useState(1)

  const handleRowSelect = (id) => {
    let updatedSelection = selectedRows.includes(id)
      ? selectedRows.filter((rowId) => rowId !== id)
      : [...selectedRows, id]

    setSelectedRows(updatedSelection)
    onSelect(updatedSelection) // 📍 선택된 행을 부모 컴포넌트로 전달
  }

  const handleSort = (key) => {
    if (sortKey === key) {
      // 📍 이미 선택된 컬럼이면 오름/내림 차순 변경
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      // 📍 새로운 컬럼 선택 시 기본 정렬은 오름차순
      setSortKey(key)
      setSortOrder('asc')
    }
  }

  // 📍 정렬 로직 (문자열과 숫자 구분하여 정렬)
  const sortedData = [...data].sort((a, b) => {
    if (!sortKey) return 0
    const valueA = a[sortKey]
    const valueB = b[sortKey]

    if (typeof valueA === 'string') {
      return sortOrder === 'asc'
        ? valueA.localeCompare(valueB)
        : valueB.localeCompare(valueA)
    } else {
      return sortOrder === 'asc' ? valueA - valueB : valueB - valueA
    }
  })

  // 📍 페이지네이션 로직
  const startIndex = (page - 1) * perPage
  const paginatedData = sortedData.slice(startIndex, startIndex + perPage)
  const totalPages = Math.ceil(data.length / perPage)

  // 📍 전체 체크박스 핸들러 (모든 행을 선택 또는 해제)
  const toggleAll = () => {
    if (selectedRows.length === paginatedData.length) {
      setSelectedRows([])
      onSelect([]) // 📍 부모 컴포넌트에도 빈 배열 전달
    } else {
      const allIds = paginatedData.map((row) => row.id)
      setSelectedRows(allIds)
      onSelect(allIds) // 📍 부모 컴포넌트에 모든 선택된 행 전달
    }
  }

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full border-collapse border border-gray-300 text-sm">
        <thead className="bg-blue-100">
          <tr>
            {selectable && (
              <th className="p-2 border text-center text-sm">
                <div className="flex items-center justify-center">
                  <input
                    type="checkbox"
                    onChange={toggleAll}
                    checked={
                      selectedRows.length === paginatedData.length &&
                      selectedRows.length > 0
                    }
                  />
                </div>
              </th>
            )}
            {columns.map((col) => (
              <th
                key={col.key}
                className="p-2 border text-left cursor-pointer"
                onClick={() => handleSort(col.key)}
                style={{ width: col.width || 'auto' }}
              >
                <div className="flex items-center">
                  {col.label}
                  {col.sortable && (
                    <span className="ml-1 inline-block w-4 text-center">
                      {sortKey === col.key
                        ? sortOrder === 'asc'
                          ? '▲'
                          : '▼'
                        : '▲'}
                    </span>
                  )}
                </div>
              </th>
            ))}
            {renderActions && <th className="p-2 border">삭제</th>}
          </tr>
        </thead>
        <tbody>
          {paginatedData.map((row) => (
            <tr
              key={row.id}
              className="border-b"
              onClick={() => onRowClick && onRowClick(row)}
            >
              {selectable && (
                <td className="p-2 border text-center">
                  <div className="flex items-center justify-center">
                    <input
                      type="checkbox"
                      checked={selectedRows.includes(row.id)}
                      onChange={() => handleRowSelect(row.id)}
                    />
                  </div>
                </td>
              )}
              {columns.map((col) => (
                <td
                  key={col.key}
                  className={`p-2 border ${col.align === 'center' ? 'text-center' : 'text-left'} overflow-hidden text-ellipsis whitespace-nowrap max-w-[200px]`}
                  style={{ width: col.width || 'auto' }}
                >
                  {col.render ? col.render(row) : row[col.key]}
                </td>
              ))}
              {renderActions && (
                <td className="p-2 border">{renderActions(row)}</td>
              )}
            </tr>
          ))}
        </tbody>
      </table>

      {/* 📍 페이지네이션 버튼 */}
      <div className="flex justify-end items-center p-3 gap-3">
        <button
          onClick={() => setPage(page - 1)}
          disabled={page === 1}
          className="px-2 py-1 border rounded disabled:opacity-50"
        >
          이전
        </button>
        <span>
          {page} / {totalPages}
        </span>
        <button
          onClick={() => setPage(page + 1)}
          disabled={page >= totalPages}
          className="px-2 py-1 border rounded disabled:opacity-50"
        >
          다음
        </button>
      </div>
    </div>
  )
}

export default CommonTable
