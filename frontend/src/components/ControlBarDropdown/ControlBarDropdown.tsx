import { useMemo, type FC, type ReactNode } from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useShallow } from 'zustand/shallow'
import useRoomStateStore from '@/store/useRoomStateStore'
import { useParams } from 'react-router-dom'
import { SendIcon } from 'lucide-react'

interface ControlBarDropdownProps {
  children: ReactNode
  isDropdown: boolean
}

const ControlBarDropdown: FC<ControlBarDropdownProps> = ({
  children,
  isDropdown,
}) => {
  if (!isDropdown) return <>{children}</>

  const { roomId } = useParams()

  const { roomConnectionData } = useRoomStateStore(
    useShallow((state) => ({
      roomConnectionData: state.roomConnectionData,
    }))
  )

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>{'참여자'}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {roomConnectionData[roomId as string]?.map(
            ({ username }: { username: string }) => (
              <DropdownMenuItem key={username}>
                <span>{username}</span>
                <DropdownMenuShortcut className="transition-all duration-100 cursor-pointer hover:text-ssacle-blue">
                  <SendIcon />
                </DropdownMenuShortcut>
              </DropdownMenuItem>
            )
          )}
        </DropdownMenuGroup>
        <DropdownMenuGroup></DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
export default ControlBarDropdown
