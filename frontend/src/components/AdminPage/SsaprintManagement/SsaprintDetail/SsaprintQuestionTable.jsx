import CommonTable from "../../CommonTable";
import { useState } from "react";

const SsaprintQuestionTable = () => {
  const [selectedRows, setSelectedRows] = useState([]);

  // 질문카드 데이터 (예제)
  const questionData = [
    {
      id: "ABC1234",
      description: "useState는 무엇을 위한 React Hook인가요?",
      createdAt: "2025-01-27",
      userId: "user123",
      userNickname: "나는미셸",
    },
    // 추가 데이터 삽입 가능
  ];

  // 테이블 컬럼 정의
  const columns = [
    { key: "id", label: "질문카드 ID", width: "15%" },
    { key: "description", label: "질문 내용", width: "40%" },
    { key: "createdAt", label: "작성일", width: "20%" },
    { key: "userId", label: "user ID", width: "15%" },
    { key: "userNickname", label: "닉네임", width: "10%" },
  ];

  return (
    <div>
      <h2 className="text-center text-lg font-semibold text-ssacle-blue mb-4">
        스프린트 질문카드
      </h2>
      <CommonTable
        columns={columns}
        data={questionData}
        selectable={true}
        onSelect={setSelectedRows}
        perPage={5}
      />
    </div>
  );
};

export default SsaprintQuestionTable;
