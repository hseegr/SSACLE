import type { FC } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useQueryClient } from '@tanstack/react-query'
import { User } from '@/interfaces/user.interface'
import { Button } from '@/components/ui/button'
import PasswordChangeForm from '@/components/MyPage/PasswordChangeForm'

interface MyPagePasswordSectionProps {}

const MyPagePasswordSection: FC<MyPagePasswordSectionProps> = ({}) => {
  const queryClient = useQueryClient()

  const userInfo: User | undefined = queryClient.getQueryData(['userInfo'])

  const { categoryNames } = userInfo ?? {}
  return (
    <Card className="delay-300 animate-fade-in-down">
      <CardHeader>
        <CardTitle>비밀번호</CardTitle>
      </CardHeader>
      <CardContent className="flex items-center justify-between">
        {/* <p className="text-sm text-muted-foreground">
          최근 업데이트: {userInfo.passwordLastUpdated}
        </p> */}
        <PasswordChangeForm>
          <Button variant="outline" size="sm">
            비밀번호 변경
          </Button>
        </PasswordChangeForm>
      </CardContent>
    </Card>
  )
}
export default MyPagePasswordSection
