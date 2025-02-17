import { useNavigate } from "react-router-dom";

const BackButton = ({ label = "돌아가기", className = "", onClick }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) {
      onClick(); // 사용자 지정 핸들러가 있으면 실행
    } else {
      navigate(-1); // 이전 페이지로 이동
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`flex justify-center items-center w-40 px-6 py-3 bg-ssacle-sky text-ssacle-black text-sm rounded-full hover:bg-blue-200 transition-all ${className}`}
    >
      {label}
    </button>
  );
};

export default BackButton;
