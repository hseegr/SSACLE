import { useMemo, type FC } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { useQuery } from '@tanstack/react-query'
import httpCommon from '@/services/http-common'
import { Sprint } from '@/interfaces/user.interface'
import { useNavigate } from 'react-router-dom'

interface MyPageActivitiesProps {}

const MyPageActivities: FC<MyPageActivitiesProps> = ({}) => {
  const navigate = useNavigate()
  const { data: mySprint, isLoading } = useQuery<Sprint[]>({
    queryKey: ['my-sprint'],
    queryFn: async () => {
      return await httpCommon.get('/user/sprint').then((res) => res.data)
    },
  })

  const totalSprint = useMemo(() => {
    return mySprint?.length || 0
  }, [mySprint])

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="w-12 h-12 border-t-2 border-b-2 rounded-full animate-spin border-primary"></div>
      </div>
    )
  }

  return (
    <main className="flex-1 max-w-5xl px-4 mx-auto space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">나의 활동</h1>
      <Card className=" duration-400 animate-fade-in-down">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="text-2xl">✨</span>
            <span>싸프린트</span>
            <span className="text-2xl">✨</span>
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            참여한 모든 싸프린트 기록을 확인할 수 있습니다.
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50">
              <span className="text-sm text-muted-foreground">
                총 참여 횟수:
              </span>
              <span className="text-lg font-semibold">{totalSprint}회</span>
            </div>

            <div className="flex flex-col gap-4">
              {mySprint?.map(({ name, endAt, id: sprintId, teamId }) => (
                <div
                  onClick={() => {
                    navigate(`/my-sprints/${sprintId}`, {
                      state: { sprintId, teamId },
                    })
                  }}
                  key={name}
                  className="flex items-center justify-between p-4 transition-colors border rounded-lg cursor-pointer bg-card hover:bg-accent/50"
                >
                  <h3 className="font-medium">👍🏻 {name}</h3>
                  {endAt && (
                    <p className="text-sm text-muted-foreground">
                      {new Date(endAt).toLocaleDateString()}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* <Separator className="my-6" />

      <Card className="delay-300 duration-400 animate-fade-in-down">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="text-2xl">✨</span>
            <span>싸드컵</span>
            <span className="text-2xl">✨</span>
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            참여한 싸드컵 대회 기록을 확인할 수 있습니다.
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50">
              <span className="text-sm text-muted-foreground">
                아직 참여한 싸드컵이 없습니다.
              </span>
            </div>
          </div>
        </CardContent>
      </Card> */}

      <Separator className="my-6" />

      <Card className="delay-200 duration-400 animate-fade-in-down">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="text-2xl">✨</span>
            <span>학습 게시판</span>
            <span className="text-2xl">✨</span>
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            작성한 게시글과 댓글을 확인할 수 있습니다.
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50">
              <span className="text-sm text-muted-foreground">
                아직 작성한 게시글이 없습니다.
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Separator className="my-6" />

      <Card className=" duration-400">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="text-2xl">✨</span>
            <span>구매한 노트</span>
            <span className="text-2xl">✨</span>
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            구매하신 노트 목록을 확인할 수 있습니다.
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50">
              <span className="text-sm text-muted-foreground">
                아직 구매한 노트가 없습니다.
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </main>
  )
}
export default MyPageActivities
