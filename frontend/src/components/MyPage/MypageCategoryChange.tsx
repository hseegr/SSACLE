import { useEffect, useState, type FC } from 'react'
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
import { useQuery, useQueryClient } from '@tanstack/react-query'
import httpCommon from '@/services/http-common'
import { cn } from '@/lib/utils'
import { Button } from '../ui/button'
import { Category, UserCategory } from '@/interfaces/user.interface'

interface MypageCategoryChangeProps {
  children: React.ReactNode
}

const MypageCategoryChange: FC<MypageCategoryChangeProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<Set<string>>(
    new Set()
  )
  // 카테고리 전체
  const { data: category, isSuccess: isSuccessCategory } = useQuery<Category[]>(
    {
      queryKey: ['category'],
      queryFn: async () => {
        return await httpCommon.get('/category/all').then((res) => res.data)
      },
    }
  )

  // const queryClient = useQueryClient()
  // const userCategoryNames = queryClient.getQueryData<UserCategory[]>([
  //   'userCategory',
  // ])

  // 유저 관심 카테고리
  const { data: userCategory, isSuccess: isSuccessUser } = useQuery<
    UserCategory[]
  >({
    queryKey: ['userCategory'],
    queryFn: async () => {
      return await httpCommon
        .get('/user/interested-category')
        .then((res) => res.data)
    },
  })

  useEffect(() => {
    if (isSuccessCategory && isSuccessUser) {
      // console.log('category', category)
      // console.log('userCategory', userCategory)
      const userCategoryNames = userCategory?.map(
        (userCategory) => userCategory.categoryName
      )
      console.log('userCategoryNamesdfsdfddsfds', userCategoryNames)
      setSelectedCategory(new Set(userCategoryNames))
    }
  }, [isSuccessCategory, isSuccessUser])

  // 카테고리 클릭 시 선택된 카테고리 추가
  const handleCategoryClick = (categoryName: string) => {
    if (selectedCategory.has(categoryName)) {
      setSelectedCategory((prev) => {
        const newSet = new Set(prev)
        newSet.delete(categoryName)
        return newSet
      })
    } else {
      setSelectedCategory((prev) => {
        const newSet = new Set(prev)
        newSet.add(categoryName)
        return newSet
      })
    }
  }

  // 카테고리 변경 버튼 클릭 시 카테고리 변경
  const handleChangeCategory = async () => {
    try {
      await httpCommon.patch('/user/interested-category/update', {
        interestCategoryNames: Array.from(selectedCategory),
      })
      alert('카테고리 변경이 완료되었습니다.')
      setIsOpen(false)
    } catch (error) {
      console.error(error)
      alert('카테고리 변경에 실패했습니다.')
    }
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
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
                  <h1 className="text-xl font-bold">✅ {firsrtCategoryName}</h1>
                  <div className="flex flex-wrap gap-6">
                    {subCategories.length > 0 &&
                      subCategories.map(
                        ({ id, categoryName, subCategories }) => (
                          <div
                            key={id}
                            className="flex flex-wrap gap-x-6 gap-y-4"
                          >
                            <Badge
                              onClick={() => handleCategoryClick(categoryName)}
                              variant="secondary"
                              className={cn(
                                'px-4 py-2 text-base transition-all cursor-pointer bg-ssacle-sky hover:bg-ssacle-blue/50 hover:scale-102',
                                selectedCategory.has(categoryName) &&
                                  'bg-ssacle-blue text-white hover:bg-ssacle-blue/80'
                              )}
                            >
                              {categoryName}
                            </Badge>
                            {subCategories.length > 0 &&
                              subCategories.map(({ id, categoryName }) => (
                                <Badge
                                  onClick={() =>
                                    handleCategoryClick(categoryName)
                                  }
                                  key={id}
                                  variant="secondary"
                                  className={cn(
                                    'px-4 py-2 text-base transition-all cursor-pointer bg-ssacle-sky hover:bg-ssacle-blue/50 hover:scale-102',
                                    selectedCategory.has(categoryName) &&
                                      'bg-ssacle-blue text-white hover:bg-ssacle-blue/80'
                                  )}
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
        <div className="flex justify-end gap-4">
          <Button
            onClick={handleChangeCategory}
            className="bg-ssacle-blue hover:bg-ssacle-blue/80"
          >
            변경하기
          </Button>
          <Button onClick={() => setIsOpen(false)} variant="destructive">
            취소
          </Button>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  )
}
export default MypageCategoryChange
