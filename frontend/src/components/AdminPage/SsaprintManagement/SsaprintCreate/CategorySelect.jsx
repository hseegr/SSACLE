import SelectDropdown from '@/components/AdminPage/SsaprintManagement/SsaprintCreate/SelectDropdown'
import { useSsaprint } from '@/contexts/SsaprintContext'
import useCategories from '@/hooks/useCategories'

const CategorySelect = ({ disabled }) => {
  const { selectedMain, selectedMid } = useSsaprint()
  const { categories, isLoading, isError } = useCategories()

  if (isLoading) return <p>⏳ 카테고리 불러오는 중...</p>
  if (isError) return <p>❌ 카테고리를 불러오지 못했습니다.</p>

  // 대주제 리스트
  const mainCategories = categories.map((cat) => ({
    value: cat.id,
    label: cat.categoryName,
  }))

  // 선택된 대주제의 중주제 리스트
  const selectedMainCategory = categories.find(
    (cat) => cat.id === parseInt(selectedMain, 10)
  )
  const midCategories = selectedMainCategory
    ? selectedMainCategory.subCategories.map((sub) => ({
        value: sub.id,
        label: sub.categoryName,
      }))
    : []

  // 선택된 중주제의 소주제 리스트
  const selectedMidCategory = selectedMainCategory?.subCategories.find(
    (sub) => sub.id === parseInt(selectedMid, 10)
  )
  const subCategories = selectedMidCategory
    ? selectedMidCategory.subCategories.map((sub) => ({
        value: sub.id,
        label: sub.categoryName,
      }))
    : []

  return (
    <div className="flex flex-wrap justify-between">
      <SelectDropdown
        label="대주제"
        type="main"
        options={mainCategories}
        disabled={disabled}
      />
      <SelectDropdown
        label="중주제"
        type="mid"
        options={midCategories}
        disabled={disabled}
      />
      <SelectDropdown
        label="소주제"
        type="sub"
        options={subCategories}
        disabled={disabled}
      />
    </div>
  )
}

export default CategorySelect
