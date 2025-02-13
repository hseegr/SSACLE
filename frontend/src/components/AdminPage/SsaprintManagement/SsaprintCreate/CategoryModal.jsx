import { useState } from "react";
import { fetchLoadCategory } from "@/services/adminService";
import { useQuery } from "@tanstack/react-query";
import { X, ImagePlus, FolderCheck } from "lucide-react";

const CategoryModal = ({ onClose }) => {
  const [selectedMain, setSelectedMain] = useState("");
  const [selectedMid, setSelectedMid] = useState("");
  const [selectedSub, setSelectedSub] = useState("");
  const [customInput, setCustomInput] = useState({ main: false, mid: false, sub: false });
  const [uploadedImage, setUploadedImage] = useState(null);

  // 카테고리 데이터 불러오기
  const { data: categories = [], isLoading, isError } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchLoadCategory,
    staleTime: 1000 * 60 * 5,
  });

  // 대주제 목록
  const mainCategories = categories.map((cat) => ({
    value: cat.id,
    label: cat.categoryName,
  }));

  // 선택된 대주제 기반 중주제 필터링
  const selectedMainCategory = categories.find((cat) => cat.id === parseInt(selectedMain, 10));
  const midCategories = selectedMainCategory
    ? selectedMainCategory.subCategories.map((sub) => ({
        value: sub.id,
        label: sub.categoryName,
      }))
    : [];

  // 선택된 중주제 기반 소주제 필터링
  const selectedMidCategory = selectedMainCategory?.subCategories.find(
    (sub) => sub.id === parseInt(selectedMid, 10)
  );
  const subCategories = selectedMidCategory
    ? selectedMidCategory.subCategories.map((sub) => ({
        value: sub.id,
        label: sub.categoryName,
      }))
    : [];

  // 대주제 변경 핸들러
  const handleMainChange = (e) => {
    const value = e.target.value;
    if (value === "custom") {
      setCustomInput({ main: true, mid: false, sub: false });
      setSelectedMain("");
    } else {
      setCustomInput({ main: false, mid: false, sub: false });
      setSelectedMain(value);
    }
    setSelectedMid("");
    setSelectedSub("");
    setUploadedImage(null); // 이미지 초기화
  };

  // 중주제 변경 핸들러
  const handleMidChange = (e) => {
    const value = e.target.value;
    if (value === "custom") {
      setCustomInput((prev) => ({ ...prev, mid: true, sub: false }));
      setSelectedMid("");
      setSelectedSub("");
      setUploadedImage(null); // 이미지 초기화
    } else {
      setCustomInput((prev) => ({ ...prev, mid: false }));
      setSelectedMid(value);
      setSelectedSub("");
      setUploadedImage(null); // 이미지 초기화
    }
  };

  // 이미지 업로드 핸들러
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadedImage(file);
    }
  };

  // 소주제 변경 핸들러
  const handleSubChange = (e) => {
    const value = e.target.value;
    if (value === "custom") {
      setCustomInput((prev) => ({ ...prev, sub: true }));
      setSelectedSub("");
    } else {
      setCustomInput((prev) => ({ ...prev, sub: false }));
      setSelectedSub(value);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg p-8 w-[30rem] relative">
        {/* X 버튼 (닫기) */}
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 transition-colors"
          onClick={onClose}
        >
          <X size={24} />
        </button>

        <h2 className="text-lg font-semibold text-blue-600 text-center">카테고리 생성</h2>
        <p className="text-gray-600 text-sm text-center mt-2">
          현재 존재하지 않는 새로운 카테고리를 만들어보세요!
        </p>
        <p className="text-gray-600 text-xs text-center mt-2">
          직접 입력은 영어로 작성해주세요😊
        </p>

        {/* 대주제 선택 (직접 입력 가능) */}
        {!customInput.main ? (
          <select className="w-full mt-4 p-3 border rounded-md" value={selectedMain} onChange={handleMainChange}>
            <option value="">대주제 선택</option>
            {mainCategories.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
            <option value="custom">직접 입력</option>
          </select>
        ) : (
          <input
            type="text"
            className="w-full mt-4 p-3 border rounded-md"
            placeholder="대주제 입력"
            value={selectedMain}
            onChange={(e) => setSelectedMain(e.target.value)}
          />
        )}

        {/* 중주제 선택 (직접 입력 가능) */}
        <div className="relative flex items-center mt-4">
          {!customInput.mid ? (
            <select className="w-full p-3 border rounded-md" value={selectedMid} onChange={handleMidChange} disabled={!selectedMain}>
              <option value="">중주제 선택</option>
              {midCategories.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
              <option value="custom">직접 입력</option>
            </select>
          ) : (
            <input
              type="text"
              className="w-full p-3 border rounded-md"
              placeholder="중주제 입력"
              value={selectedMid}
              onChange={(e) => setSelectedMid(e.target.value)}
            />
          )}
          {customInput.mid && (
            <label className="ml-3 cursor-pointer">
              <input type="file" className="hidden" onChange={handleImageUpload} />
              {uploadedImage ? <FolderCheck size={24} className="text-blue-600" /> : <ImagePlus size={24} className="text-gray-500" />}
            </label>
          )}
        </div>

        {/* 소주제 선택 (직접 입력 가능) */}
        {!customInput.sub ? (
          <select className="w-full mt-4 p-3 border rounded-md" value={selectedSub} onChange={handleSubChange} 
            disabled={(!selectedMain || !selectedMid) || (customInput.mid && !uploadedImage)}> 
            {/* 대주제 & 중주제 없으면 비활성화, 중주제 직접 입력 + 이미지 없으면 비활성화 */}
            <option value="">소주제 선택</option>
            {subCategories.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
            <option value="custom">직접 입력</option>
          </select>
        ) : (
          <input type="text" className="w-full mt-4 p-3 border rounded-md" placeholder="소주제 입력" value={selectedSub} onChange={(e) => setSelectedSub(e.target.value)} />
        )}

        {/* 생성 버튼 */}
        <button className="w-full mt-6 bg-blue-600 text-white py-2 rounded-md" disabled={!selectedMain || !selectedMid}>
          생성하기
        </button>
      </div>
    </div>
  );
};

export default CategoryModal;
