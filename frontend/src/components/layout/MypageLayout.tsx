import type { FC } from 'react'
import MyPageSidebar from '@/components/MyPage/MyPageSidebar'

interface MypageLayoutProps {
  children: React.ReactNode
}

const MypageLayout: FC<MypageLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container px-4 py-8 mx-auto">
        <div className="flex flex-col gap-8 md:flex-row">
          {/* Sidebar */}
          <MyPageSidebar />
          {children}
        </div>
      </div>
    </div>
  )
}
export default MypageLayout
