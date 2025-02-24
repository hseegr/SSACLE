import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { User } from '@/interfaces/user.interface'
import type { FC } from 'react'

interface SsaprintVoteSelectorProps {
  rank: string
  setRank: (rank: string) => void
  userList: User[]
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
        {userList.map(({ nickname, id: userId }) => (
          <SelectItem key={userId} value={userId}>
            {nickname}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
export default SsaprintVoteSelector
