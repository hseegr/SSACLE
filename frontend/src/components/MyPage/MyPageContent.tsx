import type { FC } from 'react'
import MyPageProfileSection from '@/components/MyPage/MyPageProfileSection'
import MyPagePasswordSection from '@/components/MyPage/MyPagePasswordSection'
import MyPageSkillSection from '@/components/MyPage/MyPageSkillSection'

interface MyPageContentProps {}

const MyPageContent: FC<MyPageContentProps> = ({}) => {
  return (
    <main className="flex-1 space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight">계정 관리</h1>
      {/* Profile Section */}
      <MyPageProfileSection />

      {/* Password Section */}
      <MyPagePasswordSection />

      {/* Skills Section */}
      <MyPageSkillSection />
    </main>
  )
}
export default MyPageContent
