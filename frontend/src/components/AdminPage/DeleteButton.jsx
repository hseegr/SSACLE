const DeleteButton = ({ selectedRows, onDelete }) => {
    return (
      <button
        className="px-4 py-2 bg-red-500 text-white rounded disabled:opacity-50"
        onClick={() => onDelete(selectedRows)}
        disabled={selectedRows.length === 0}
      >
        삭제
      </button>
    );
  };
  
  export default DeleteButton;
  