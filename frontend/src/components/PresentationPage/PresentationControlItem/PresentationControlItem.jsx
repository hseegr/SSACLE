const PresentationControlItem = ({ control }) => {
  const { icon: Icon, title, style, activeFunction } = control

  return (
    <li className="list-none">
      <button
        className={`flex flex-col justify-center items-center gap-2 px-4 rounded-md ${style} hover:bg-gray-800 py-1`}
        onClick={activeFunction}
      >
        <span className="size-5">
          <Icon className="w-full" />
        </span>
        <span className="text-xs text-ssacle-gray-sm">{title}</span>
      </button>
    </li>
  )
}
export default PresentationControlItem
