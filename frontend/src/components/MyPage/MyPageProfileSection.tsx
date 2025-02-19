import { ReactNode, useRef, type FC } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useQueryClient } from '@tanstack/react-query'
import { User } from '@/interfaces/user.interface'

interface MyPageProfileSectionProps {}

const MyPageProfileSection: FC<MyPageProfileSectionProps> = ({}) => {
  const queryClient = useQueryClient()

  const userInfo: User | undefined = queryClient.getQueryData(['userInfo'])

  const { nickname, pickles, level, profile } = userInfo ?? {}

  const profileImageInputRef = useRef<ReactNode>(null)

  return (
    <Card className="overflow-hidden animate-fade-in-down">
      <CardHeader>
        <CardTitle>기본정보</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-6">
          <div className="relative w-24 h-24">
            <div className="w-full h-full rounded-full bg-ssacle-sky" />
            <input
              type="file"
              name=""
              id=""
              ref={profileImageInputRef as React.RefObject<HTMLInputElement>}
              className="hidden"
            />
            <div className="absolute bottom-0 right-0 p-1 bg-white rounded-full shadow-sm">
              <Button
                variant="ghost"
                size="icon"
                className="w-6 h-6 rounded-full"
                onClick={() => {
                  profileImageInputRef.current?.click()
                }}
              >
                <span className="sr-only">프로필 이미지 변경</span>
                📷
              </Button>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <h3 className="text-lg font-medium">{nickname}</h3>
              <Badge variant="outline" className="px-4 text-sm bg-ssacle-sky">
                Lv. {level}
              </Badge>
              <span>
                <Badge variant="outline" className="px-4 text-sm bg-green-200">
                  {pickles}🥒
                </Badge>
              </span>
            </div>
            <Button variant="outline" size="sm">
              프로필 수정
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
export default MyPageProfileSection
