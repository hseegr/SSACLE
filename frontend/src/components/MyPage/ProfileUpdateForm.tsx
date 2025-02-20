import type { FC } from 'react'
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Input } from '@/components/ui/input'

interface ProfileUpdateFormProps {
  children: React.ReactNode
}

const ProfileUpdateForm: FC<ProfileUpdateFormProps> = ({ children }) => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>프로필 수정</AlertDialogTitle>
        </AlertDialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-4">
            <Input type="text" placeholder="Name" />
            <Input type="text" placeholder="Email" />
            <Input type="text" placeholder="Phone" />
          </div>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  )
}
export default ProfileUpdateForm
