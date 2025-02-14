import ItemCard from '@/components/SprintCommon/ItemCard'

const ItemList = ({ items, domain }) => {
  return (
    <div>
      {/* 아이템 리스트 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
        {items.length > 0 ? (
          items.map((item) => (
            <ItemCard key={item.id} item={item} domain={domain} />
          ))
        ) : (
          <p className="text-gray-500 text-center col-span-4">
            조건에 맞는 데이터가 없습니다.
          </p>
        )}
      </div>
    </div>
  )
}

export default ItemList
