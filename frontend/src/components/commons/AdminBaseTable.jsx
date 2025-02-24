import React, { useState } from 'react';

const BaseTable = ({ columns, data }) => {
  const [selectedRow, setSelectedRow] = useState(null);
  const [checkedRows, setCheckedRows] = useState({}); // 체크된 행을 저장하는 상태
  const [isAllChecked, setIsAllChecked] = useState(false); // 전체 체크 상태 관리

  // 10줄을 유지하기 위해 빈 데이터를 추가
  const rows = [...data, ...Array(Math.max(10 - data.length, 0)).fill({})];

  // 행 클릭 시 체크박스 토글
  const handleRowClick = (index) => {
    setSelectedRow(index);
    
    setCheckedRows((prev) => {
      const newCheckedRows = { ...prev, [index]: !prev[index] };

      // 전체 선택 상태 업데이트
      const allChecked = Object.values(newCheckedRows).filter(Boolean).length === rows.length;
      setIsAllChecked(allChecked);

      return newCheckedRows;
    });
  };

  // 전체 선택/해제
  const handleAllCheck = () => {
    const newIsAllChecked = !isAllChecked;
    setIsAllChecked(newIsAllChecked);

    // 모든 행을 선택 또는 해제
    const newCheckedRows = {};
    if (newIsAllChecked) {
      rows.forEach((_, index) => {
        newCheckedRows[index] = true;
      });
    }
    setCheckedRows(newCheckedRows);
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-blue-500 text-white border-t border-b border-gray-300">
            <th className="px-4 py-2 text-left">
              <input 
                type="checkbox" 
                checked={isAllChecked} 
                onChange={handleAllCheck} 
              />
            </th>
            {columns.map((col) => (
              <th key={col.key} className="px-4 py-2 text-left">
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr
              key={index}
              className={`border-t border-b border-gray-300 ${
                selectedRow === index ? 'bg-blue-100' : 'bg-white'
              }`}
              onClick={() => handleRowClick(index)}
            >
              <td className="px-4 py-2">
                <input
                  type="checkbox"
                  checked={checkedRows[index] || false} // 체크 상태 반영
                  onChange={(e) => e.stopPropagation()} // 클릭 이벤트 버블링 방지
                />
              </td>
              {columns.map((col) => (
                <td key={col.key} className="px-4 py-2">
                  {row[col.key] || ''}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BaseTable;
