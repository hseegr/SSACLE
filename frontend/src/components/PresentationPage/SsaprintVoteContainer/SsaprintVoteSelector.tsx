import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { FC } from 'react'

interface SsaprintVoteSelectorProps {
  rank: string
  setRank: (rank: string) => void
  userList: {
    username: string
    userId: string
    connectionId: string
  }[]
}

const SsaprintVoteSelector: FC<SsaprintVoteSelectorProps> = ({
  rank,
  setRank,
  userList,
}) => {
  return (
    <Select value={rank} onValueChange={setRank}>
      <SelectTrigger className="w-1/2 text-center">
        <SelectValue placeholder="선택" />
      </SelectTrigger>
      <SelectContent>
        {userList.map(({ username, connectionId, userId }) => (
          <SelectItem key={userId} value={userId}>
            {username}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
export default SsaprintVoteSelector
