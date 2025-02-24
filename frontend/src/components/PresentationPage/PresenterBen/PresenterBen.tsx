import { useOpenviduStateStore } from '@/store/useOpenviduStateStore'
import { useQueryClient } from '@tanstack/react-query'
import type { FC } from 'react'

interface PresenterBenProps {}

const PresenterBen: FC<PresenterBenProps> = ({}) => {
  const myConnectionId = useOpenviduStateStore((state) => state.myConnectionId)
  const queryClient = useQueryClient()

  const presentationParticipants = queryClient.getQueryData<[]>([
    'presentation-participants',
  ])

  // team 구분
  const team_1 = presentationParticipants?.filter(
    (participant, idx) => idx % 2 === 0
  )
  const team_2 = presentationParticipants?.filter(
    (participant, idx) => idx % 2 === 1
  )

  // 벤을 할 사람 정하기
  const isBenPresenter_1 = team_1?.some(
    (each) => each?.connectionId === myConnectionId
  )
  const isBenPresenter_2 = team_2?.some(
    (each) => each?.connectionId === myConnectionId
  )

  if (isBenPresenter_1) {
    return <div>PresenterBen</div>
  } else {
  }

  return <div>PresenterBen</div>
}
export default PresenterBen
