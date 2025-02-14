import type { FC, ReactNode } from 'react'
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

interface ControlBarDropdownProps {
  children: ReactNode
  isDropdown: boolean
  dropDownItems: {
    title: string
    items: [
      {
        username: string
        icon: ReactNode
      },
    ]
  }[]
}

const ControlBarDropdown: FC<ControlBarDropdownProps> = ({
  children,
  isDropdown,
  dropDownItems,
}) => {
  if (!isDropdown) return <>{children}</>

  const { title, items } = dropDownItems

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>{title}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {items.map(
            ({
              username,
              icon: Icon,
            }: {
              username: string
              icon: ReactNode
            }) => (
              <DropdownMenuItem key={username}>
                <span>{username}</span>
                <DropdownMenuShortcut className="transition-all duration-100 cursor-pointer hover:text-ssacle-blue">
                  <Icon />
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
