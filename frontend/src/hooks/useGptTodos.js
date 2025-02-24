import { useMutation } from '@tanstack/react-query'
import { useSsaprint } from '@/contexts/SsaprintContext'
import useCategories from '@/hooks/useCategories'
import { fetchGptTodos } from '@/services/adminService'

export const useGptTodos = () => {
  const { startDate, endDate, selectedSub, setDescription, setTodos, } = useSsaprint()
  const { categories } = useCategories()

  const topic =
    categories
      .flatMap((cat) => cat.subCategories.flatMap((mid) => mid.subCategories))
      .find((sub) => sub.id === Number(selectedSub))?.categoryName || ''

  const mutation = useMutation({
    mutationFn: async () => {
      if (!startDate || !endDate || !topic) {
        console.warn('⚠️ 필수 값이 부족하여 API 요청을 중단합니다.')
        return
      }
      // console.log('🔥 [useMutation] GPT API 요청 실행됨')

      const response = await fetchGptTodos({
        startAt: startDate,
        endAt: endDate,
        topic,
      })
      return response
    },
    onSuccess: (data) => {
      // console.log('✅ GPT 응답 데이터:', data)
      if (data) {
        setDescription({
          basicDescription: data.basicDescription || '',
          detailDescription: data.detailDescription || '',
          recommendedFor: data.recommendedFor || '',
          todos: data.todos
            ? data.todos.map((todo) => `${todo.date}: ${todo.tasks.join(', ')}`).join('\n')
            : '',
        })
      }
    },
    onError: (error) => {
      console.error('❌ GPT API 요청 실패:', error)
    },
  })

  return { ...mutation, triggerGptFetch: mutation.mutate }
}
