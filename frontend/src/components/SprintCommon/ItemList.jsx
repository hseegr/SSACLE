// @ts-nocheck
import ItemCard from '@/components/SprintCommon/ItemCard'

const ItemList = ({ items, domain }) => {
  return (
    <div className="min-w-[500px] grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-6 min-h-[412px]">
      {items.length > 0 ? (
        items.map((item) => {
          // status === 2일 때 item이 { sprint, teamId } 형태
          // status !== 2일 때 item이 sprint 자체
          const sprint = item.sprint || item
          const teamId = item.teamId || null // teamId가 있으면 전달, 없으면 null

          return (
            <div key={sprint.id} className="flex justify-center">
              <ItemCard item={sprint} teamId={teamId} domain={domain} />
            </div>
          )
        })
      ) : (
        <p className="text-gray-500 text-center w-full">
          조건에 맞는 데이터가 없습니다.
        </p>
      )}
    </div>
  )
}

export default ItemList
