import { cn } from '@/lib/utils'
import type { FC, ReactNode } from 'react'

interface SsadcupVideoLayoutProps {
  children: ReactNode[]
}

const SsadcupVideoLayout: FC<SsadcupVideoLayoutProps> = ({ children }) => {
  // 팀 구분하기
  const team_1: ReactNode[] = []
  const team_2: ReactNode[] = []

  children.forEach((child, index) => {
    if (index % 2 === 0) {
      team_1.push(child)
    } else {
      team_2.push(child)
    }
  })

  return (
    <section className="flex w-full h-[98%] gap-1">
      <div className="flex w-full h-full gap-2">
        {/* 팀 1 */}
        <div
          className={cn(
            'grid grid-cols-1 w-full h-full basis-1/5',
            team_1.length > 4 ? 'grid-rows-5' : 'grid-rows-4'
          )}
        >
          {team_1}
        </div>
        {/* 공유 내용 */}
        <div className="flex flex-col flex-1 w-full h-full">
          <section className="flex-1 w-full h-full border rounded-lg border-gray-200/20"></section>
        </div>
        {/* 팀 2 */}
        <div
          className={cn(
            'grid w-full h-full grid-cols-1 grid-rows-4 basis-1/5',
            team_2.length > 4 ? 'grid-rows-5' : 'grid-rows-4 '
          )}
        >
          {team_2}
        </div>
      </div>
    </section>
  )
}
export default SsadcupVideoLayout
