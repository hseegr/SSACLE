import { User, UserCategory } from '@/interfaces/user.interface'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import type { FC } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import MypageCategoryChange from '@/components/MyPage/MypageCategoryChange'
import httpCommon from '@/services/http-common'

interface MyPageSkillSectionProps {}

const MyPageSkillSection: FC<MyPageSkillSectionProps> = ({}) => {
  const queryClient = useQueryClient()

  const userInfo: User | undefined = queryClient.getQueryData(['userInfo'])

  const { categoryNames } = userInfo ?? {}

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
    staleTime: 0, // 데이터가 즉시 stale 상태가 되도록 설정
    gcTime: 0, // 데이터가 즉시 stale 상태가 되도록 설정
  })

  return (
    <Card className="delay-700 animate-fade-in-down">
      <CardHeader>
        <CardTitle>주요 기술 및 희망 직무</CardTitle>
      </CardHeader>
      <CardContent className="space-y-8">
        <div className="space-y-4">
          <div>
            <h3 className="mb-3 text-sm font-medium text-muted-foreground">
              나의 주요 기술 선택
            </h3>
            <div className="flex flex-wrap gap-2 mb-4">
              {categoryNames?.map((skill, index) => (
                <Badge key={index} variant="secondary" className="px-3 py-1">
                  {skill}
                </Badge>
              ))}
            </div>
            <MypageCategoryChange>
              <Button variant="outline" size="sm">
                주요 기술 변경
              </Button>
            </MypageCategoryChange>
          </div>
        </div>

        <Separator className="my-6" />

        {/* <div className="space-y-4">
          <div>
            <h3 className="mb-3 text-sm font-medium text-muted-foreground">
              희망 직무 - 최대 3개 선택 가능
            </h3>
            <div className="flex flex-wrap gap-2 mb-4">
              {userInfo.interests.map((interest, index) => (
                <Badge key={index} variant="secondary" className="px-3 py-1">
                  {interest}
                </Badge>
              ))}
            </div>
            <Button variant="outline" size="sm">
              희망 직무 선택
            </Button>
          </div>
        </div> */}
      </CardContent>
    </Card>
  )
}
export default MyPageSkillSection
