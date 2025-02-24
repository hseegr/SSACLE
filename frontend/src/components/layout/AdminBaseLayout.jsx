import AdminHeader from '@/components/Header/AdminHeader'

import { Outlet } from 'react-router-dom'

const AdminBaseLayout = () => {
  return (
    <div className="flex flex-col w-full h-screen">
      <AdminHeader />
      <main className="flex-1 px-48 pt-16">
        <Outlet />
      </main>
    </div>
  )
}
export default AdminBaseLayout
