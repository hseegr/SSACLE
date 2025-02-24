import type { FC } from 'react'
import { useNavigate } from 'react-router-dom'

interface MyPageSidebarProps {}

const MyPageSidebar: FC<MyPageSidebarProps> = ({}) => {
  const navigate = useNavigate()
  return (
    <aside className="w-full md:w-64 shrink-0">
      <nav className="flex flex-col gap-1">
        <button
          onClick={() => {
            navigate('/user/profile')
          }}
          className="w-full px-4 py-2.5 text-left text-sm font-medium rounded-lg text-primary hover:bg-primary/10 transition-colors"
        >
          내 정보
        </button>
        {/* <button
          onClick={() => {
            navigate('/user/profile/account')
          }}
          className="w-full px-4 py-2.5 text-left text-sm font-medium rounded-lg text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
        >
          계정 관리
        </button> */}
        <button
          onClick={() => {
            navigate('/user/profile/activities')
          }}
          className="w-full px-4 py-2.5 text-left text-sm font-medium rounded-lg text-muted-foreground hover:bg-primary/10 transition-colors"
        >
          나의 활동
        </button>
      </nav>
    </aside>
  )
}
export default MyPageSidebar
