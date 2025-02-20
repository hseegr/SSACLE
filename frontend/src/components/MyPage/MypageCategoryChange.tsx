import type { FC } from 'react'
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { useQuery } from '@tanstack/react-query'
import httpCommon from '@/services/http-common'
import { cn } from '@/lib/utils'

interface MypageCategoryChangeProps {
  children: React.ReactNode
}

const MypageCategoryChange: FC<MypageCategoryChangeProps> = ({ children }) => {
  const { data: category } = useQuery({
    queryKey: ['category'],
    queryFn: () => {
      return httpCommon.get('/category/all').then((res) => res.data)
    },
  })

  const { data: userCategory } = useQuery({
    queryKey: ['userCategory'],
    queryFn: () => {
      return httpCommon.get('/user/interested-category').then((res) => res.data)
    },
  })

  console.log(userCategory)

  return (
    <AlertDialog>
      <AlertDialogTrigger>{children}</AlertDialogTrigger>
      <AlertDialogContent className="max-w-[800px]">
        <AlertDialogHeader>
          <AlertDialogTitle>👍🏻 나의 주요 기술 변경 👍🏻</AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogDescription></AlertDialogDescription>
        <Separator className="" />
        <div className="flex flex-col gap-y-6 max-h-[500px] overflow-y-auto :">
          <div className="flex flex-col gap-6">
            {category?.map(
              ({
                id: firstId,
                categoryName: firsrtCategoryName,
                subCategories,
              }) => (
                <div key={firstId} className="flex flex-col gap-4">
                  <h1 className="text-xl font-bold">{firsrtCategoryName}</h1>
                  <div className="flex flex-wrap gap-6">
                    {subCategories.length > 0 &&
                      subCategories.map(
                        ({ id, categoryName, subCategories }) => (
                          <div
                            key={id}
                            className="flex flex-wrap gap-x-6 gap-y-4"
                          >
                            <Badge
                              variant="secondary"
                              className={cn(
                                'px-4 py-2 text-base transition-all cursor-pointer bg-ssacle-sky hover:bg-ssacle-blue/50 hover:scale-102'
                              )}
                            >
                              {categoryName}
                            </Badge>
                            {subCategories.length > 0 &&
                              subCategories.map(({ id, categoryName }) => (
                                <Badge
                                  variant="secondary"
                                  className="px-4 py-2 text-base transition-all cursor-pointer bg-ssacle-sky hover:bg-ssacle-blue/50 hover:scale-102"
                                >
                                  {categoryName}
                                </Badge>
                              ))}
                          </div>
                        )
                      )}
                  </div>
                  <Separator className="" />
                </div>
              )
            )}
          </div>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  )
}
export default MypageCategoryChange
