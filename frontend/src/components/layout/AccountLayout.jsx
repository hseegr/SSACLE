import { Outlet } from 'react-router-dom'

const AccountLayout = () => {
  return (
    <div className="h-[calc(100vh-20rem)]">
      <Outlet />
    </div>
  )
}
export default AccountLayout
