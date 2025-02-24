import React from 'react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  return (
    <div className="flex justify-center items-center gap-2 mt-4 mb-8">
      {/* 처음으로 이동 */}
      <button
        className="w-10 h-10 flex justify-center items-center rounded-lg bg-white border shadow-sm disabled:opacity-50"
        disabled={currentPage === 1}
        onClick={() => onPageChange(1)}
      >
        «
      </button>

      {/* 이전 페이지 */}
      <button
        className="w-10 h-10 flex justify-center items-center rounded-lg bg-white border shadow-sm disabled:opacity-50"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        ‹
      </button>

      {/* 페이지 번호 */}
      {[...Array(totalPages)].map((_, index) => (
        <button
          key={index}
          className={`w-10 h-10 flex justify-center items-center rounded-lg shadow-sm ${
            currentPage === index + 1
              ? 'bg-blue-500 text-white'
              : 'bg-white border'
          }`}
          onClick={() => onPageChange(index + 1)}
        >
          {index + 1}
        </button>
      ))}

      {/* 다음 페이지 */}
      <button
        className="w-10 h-10 flex justify-center items-center rounded-lg bg-white border shadow-sm disabled:opacity-50"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        ›
      </button>

      {/* 마지막 페이지로 이동 */}
      <button
        className="w-10 h-10 flex justify-center items-center rounded-lg bg-white border shadow-sm disabled:opacity-50"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(totalPages)}
      >
        »
      </button>
    </div>
  );
};

export default Pagination;
