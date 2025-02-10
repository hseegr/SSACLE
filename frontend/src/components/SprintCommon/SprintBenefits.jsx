const SprintBenefits = ({ benefits }) => {
  return (
    <div className="p-4 bg-gray-50 rounded-lg">
      <h2 className="text-sm font-semibold text-gray-800 mb-1">수료 후 혜택</h2>
      <ul className="list-none space-y-1">
        {benefits.map((benefit, index) => (
          <li
            key={index}
            className="text-sm text-gray-700 flex items-center gap-2"
          >
            {benefit}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default SprintBenefits
