import { useMemo, useRef, useState, type FC } from 'react'
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import httpCommon from '@/services/http-common'

interface PasswordChangeFormProps {
  children: React.ReactNode
}

const PasswordChangeForm: FC<PasswordChangeFormProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [currentPassword, setCurrentPassword] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [confirmPassword, setConfirmPassword] = useState<string>('')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (
      currentPassword.length === 0 ||
      password.length === 0 ||
      confirmPassword.length === 0
    ) {
      alert('모든 필드를 입력해주세요.')
      return
    }

    if (password !== confirmPassword) {
      alert('비밀번호가 일치하지 않습니다.')
      return
    }

    try {
      const { status } = await httpCommon.patch('/user/update-password', {
        currentPassword,
        newPassword: password,
        confirmPassword,
      })

      if (status === 200) {
        alert('비밀번호가 변경되었습니다.')
      }
    } catch (error) {
      if (error instanceof Error && error?.status === 401) {
        alert('인증되지 않은 사용자입니다.')
      } else if (error instanceof Error && error?.status === 400) {
        alert('입력값이 유효하지 않거나 비밀번호가 일치하지 않습니다.')
      } else if (error instanceof Error && error?.status === 500) {
        alert('서버 에러 발생')
      } else {
        alert('알 수 없는 에러 발생')
      }
    }
  }

  const isPasswordMatch = useMemo(() => {
    return password === confirmPassword
  }, [password, confirmPassword])

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>비밀번호 변경</AlertDialogTitle>
        </AlertDialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-4">
              <Input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="현재 비밀번호"
              />
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="새로운 비밀번호"
              />
              <Input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="새로운 비밀번호 확인"
              />
            </div>
            <div className="flex items-center justify-between w-full gap-2">
              {confirmPassword.length === 0 ? (
                <p className="text-sm text-muted-foreground"></p>
              ) : isPasswordMatch ? (
                <p className="text-sm text-green-500">비밀번호가 일치합니다!</p>
              ) : (
                <p className="text-sm text-red-500">
                  비밀번호가 일치하지 않습니다.
                </p>
              )}
              <div className="flex gap-2">
                <Button
                  type="submit"
                  className="bg-ssacle-blue hover:bg-ssacle-blue/90"
                >
                  변경
                </Button>
                <Button
                  onClick={() => setIsOpen(false)}
                  type="reset"
                  variant="outline"
                  className=""
                >
                  취소
                </Button>
              </div>
            </div>
          </div>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  )
}
export default PasswordChangeForm
