const SprintOverview = ({ basicDescription, detailDescription }) => {
  return (
    <div className="p-4 rounded-lg">
      <h2 className="text-lg font-bold text-gray-900">{basicDescription}</h2>
      <p className="text-md text-gray-700 mt-4">{detailDescription}</p>
    </div>
  )
}

export default SprintOverview
