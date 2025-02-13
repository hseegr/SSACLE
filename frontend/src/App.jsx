import AppRoutes from '@/routes/AppRoutes.jsx'
import './App.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { SsaprintProvider } from './contexts/SsaprintContext' // 싸프린트 생성 관련 context

const queryClient = new QueryClient()

function App() {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <SsaprintProvider>
          <AppRoutes />
        </SsaprintProvider>
      </QueryClientProvider>
    </>
  )
}

export default App
