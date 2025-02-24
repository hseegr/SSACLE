import { UserRound } from 'lucide-react'

const UserProfile = ({ imageUrl, nickname }) => {
  return (
    <div className="flex flex-col items-center gap-1 py-6">
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={nickname}
          className="w-20 h-20 rounded-full shadow-lg"
        />
      ) : (
        <UserRound className="w-20 h-20 text-ssacle-gray rounded-full shadow-lg" />
      )}
      <span className="mt-2 text-xs">{nickname}</span>
    </div>
  )
}

export default UserProfile
