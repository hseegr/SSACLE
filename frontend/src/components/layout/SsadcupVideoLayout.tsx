import type { FC, ReactNode } from 'react'

interface SsadcupVideoLayoutProps {
  children: ReactNode[]
}

const SsadcupVideoLayout: FC<SsadcupVideoLayoutProps> = ({ children }) => {
  return <div>{children}</div>
}
export default SsadcupVideoLayout
