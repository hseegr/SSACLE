import { PresentationParticipants, User } from '@/interfaces/user.interface'
import { fetchPresentationParticipants } from '@/services/presentationService'
import { useQuery } from '@tanstack/react-query'
import type { FC, ReactNode } from 'react'
import { useParams } from 'react-router-dom'

interface SsaprintVoteDataWrapperProps {
  children: ReactNode
}

const SsaprintVoteDataWrapper: FC<SsaprintVoteDataWrapperProps> = ({
  children,
}) => {
  const { roomId } = useParams()

  useQuery<PresentationParticipants[]>({
    queryKey: ['presentation-participants'],
    queryFn: () => fetchPresentationParticipants(roomId ?? 'test-session-id'),
    staleTime: 1000 * 60 * 5, // 10분 동안 캐시 유지
    refetchInterval: 1000 * 5, // 10초 동안 캐시 유지
    enabled: !!roomId,
  })

  return <div>{children}</div>
}
export default SsaprintVoteDataWrapper
