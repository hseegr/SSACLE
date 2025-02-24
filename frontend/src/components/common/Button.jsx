// @ts-nocheck
const buttonVariants = {
  default: 'bg-blue-600 hover:bg-blue-700 text-white',
  secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-800',
  outline: 'border border-gray-300 text-gray-800 hover:bg-gray-100',
  danger: 'bg-red-600 hover:bg-red-700 text-white',
  notion: 'bg-[#694FFF] hover:bg-[#5A3EDC] text-white',
  disabled: 'bg-gray-300 text-gray-400 cursor-not-allowed',
}

const Button = ({
  className = '',
  variant = 'default',
  disabled = false,
  children,
  ...props
}) => {
  return (
    <button
      className={`px-4 py-2 rounded-md text-md font-medium transition-all ${
        disabled ? buttonVariants['disabled'] : buttonVariants[variant]
      } ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  )
}

export default Button
