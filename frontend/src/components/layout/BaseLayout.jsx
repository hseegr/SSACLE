import Footer from '@/components/Footer/Footer'
import Header from '@/components/Header/Header'
import { Outlet } from 'react-router-dom'

const BaseLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 w-full px-4 md:px-8 lg:px-48">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
export default BaseLayout
