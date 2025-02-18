// @ts-nocheck
import ItemCard from '@/components/SprintCommon/ItemCard'

const ItemList = ({ items, domain }) => {
  return (
    <div className="flex flex-wrap justify-start gap-x-6 gap-y-3">
      {items.length > 0 ? (
        items.map((item) => (
          <div key={item.id} className="flex justify-center w-[240px]">
            <ItemCard item={item} domain={domain} />
          </div>
        ))
      ) : (
        <p className="text-gray-500 text-center w-full">
          조건에 맞는 데이터가 없습니다.
        </p>
      )}
    </div>
  )
}

export default ItemList
