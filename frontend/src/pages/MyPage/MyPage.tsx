import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'

interface UserInfo {
  email: string
  emailVerified: boolean
  skills: string[]
  interests: string[]
  passwordLastUpdated?: string
}

const MyPage: React.FC = () => {
  // 실제 구현시에는 API나 전역 상태에서 사용자 정보를 가져와야 합니다
  const userInfo: UserInfo = {
    email: 'ckdwhdev@gmail.com',
    emailVerified: true,
    skills: ['Java', 'JavaScript', 'React.JS'],
    interests: ['서버/백엔드', '프론트엔드', '풀 스택'],
    passwordLastUpdated: '2024-09-14',
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container px-4 py-8 mx-auto">
        <div className="flex flex-col gap-8 md:flex-row">
          {/* Sidebar */}
          <aside className="w-full md:w-64 shrink-0">
            <nav className="flex flex-col gap-1">
              <button className="w-full px-4 py-2.5 text-left text-sm font-medium rounded-lg bg-primary/10 text-primary">
                내 정보
              </button>
              <button className="w-full px-4 py-2.5 text-left text-sm font-medium rounded-lg text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors">
                계정 관리
              </button>
              <button className="w-full px-4 py-2.5 text-left text-sm font-medium rounded-lg text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors">
                나의 활동
              </button>
            </nav>
          </aside>

          {/* Main Content */}
          <main className="flex-1 space-y-6">
            <h1 className="text-2xl font-semibold tracking-tight">계정 관리</h1>

            {/* Profile Section */}
            <Card className="overflow-hidden">
              <CardHeader>
                <CardTitle>기본정보</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-6">
                  <div className="relative w-24 h-24">
                    <div className="w-full h-full bg-orange-100 rounded-full" />
                    <div className="absolute bottom-0 right-0 p-1 bg-white rounded-full shadow-sm">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="w-6 h-6 rounded-full"
                      >
                        <span className="sr-only">프로필 이미지 변경</span>
                        📷
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-medium">{userInfo.email}</h3>
                      <Badge
                        variant={
                          userInfo.emailVerified ? 'success' : 'destructive'
                        }
                        className="h-5 px-2 text-xs"
                      >
                        {userInfo.emailVerified ? '인증 완료' : '미인증'}
                      </Badge>
                    </div>
                    <Button variant="outline" size="sm">
                      프로필 수정
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Password Section */}
            <Card>
              <CardHeader>
                <CardTitle>비밀번호</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  최근 업데이트: {userInfo.passwordLastUpdated}
                </p>
                <Button variant="outline" size="sm">
                  비밀번호 변경
                </Button>
              </CardContent>
            </Card>

            {/* Skills Section */}
            <Card>
              <CardHeader>
                <CardTitle>주요 기술 및 희망 직무</CardTitle>
              </CardHeader>
              <CardContent className="space-y-8">
                <div className="space-y-4">
                  <div>
                    <h3 className="mb-3 text-sm font-medium text-muted-foreground">
                      주요 기술 - 최대 3개 선택 가능
                    </h3>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {userInfo.skills.map((skill, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="px-3 py-1"
                        >
                          {skill}
                        </Badge>
                      ))}
                    </div>
                    <Button variant="outline" size="sm">
                      주요 기술 변경
                    </Button>
                  </div>
                </div>

                <Separator className="my-6" />

                <div className="space-y-4">
                  <div>
                    <h3 className="mb-3 text-sm font-medium text-muted-foreground">
                      희망 직무 - 최대 3개 선택 가능
                    </h3>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {userInfo.interests.map((interest, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="px-3 py-1"
                        >
                          {interest}
                        </Badge>
                      ))}
                    </div>
                    <Button variant="outline" size="sm">
                      희망 직무 선택
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </main>
        </div>
      </div>
    </div>
  )
}

export default MyPage
