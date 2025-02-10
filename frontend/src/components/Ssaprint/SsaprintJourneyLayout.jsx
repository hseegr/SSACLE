import SprintProgressStatus from '@/components/SprintCommon/SprintProgressStatus'

const SsaprintJourneyLayout = ({ sprint }) => {
  if (!sprint) return null

  return (
    <div className="mt-16 flex flex-col gap-6">
      <SprintProgressStatus sprint={sprint} />
    </div>
  )
}

export default SsaprintJourneyLayout
