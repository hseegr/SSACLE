const buttonVariants = {
  default: 'bg-blue-600 hover:bg-blue-700 text-white',
  secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-800',
  outline: 'border border-gray-300 text-gray-800 hover:bg-gray-100',
  danger: 'bg-red-600 hover:bg-red-700 text-white',
}

// `variant`를 props로 받아 적용할 수 있도록 설정
const Button = ({
  className = '',
  variant = 'default',
  children,
  ...props
}) => {
  return (
    <button
      className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${buttonVariants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

export default Button
