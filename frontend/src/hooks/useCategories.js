import { useQuery } from '@tanstack/react-query'
import { fetchLoadCategory } from '@/services/adminService'

const useCategories = () => {
  const {
    data: categories = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchLoadCategory,
    staleTime: 1000 * 60 * 5,
  })

  return { categories, isLoading, isError }
}

export default useCategories
