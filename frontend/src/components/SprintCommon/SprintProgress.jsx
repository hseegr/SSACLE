const ProgressItem = ({ icon, text, highlight }) => (
  <li className="text-sm text-gray-700 flex items-start gap-2">
    {icon}{' '}
    <span>
      {highlight && <span className="font-semibold">{highlight}</span>} {text}
    </span>
  </li>
)

const SprintProgress = () => {
  const progressSteps = [
    {
      icon: '📚',
      highlight: '싸프린트 기간 동안 제공되는 ToDo를 바탕으로 단계별 학습',
      text: '을 진행합니다.',
    },
    {
      icon: '📝',
      highlight: '참여자들은 학습 중 각각 2개의 질문',
      text: '을 등록합니다.',
    },
    {
      icon: '🎤',
      highlight: '마지막 날',
      text: ', 배운 내용을 발표하고 질문에 답변하는 시간을 가집니다.',
    },
    {
      icon: '👨‍🏫',
      highlight: '발표자는 한 명',
      text: '이며, 발표 세션 시작 시 랜덤으로 선정됩니다.',
    },
    {
      icon: '🎯',
      highlight: '발표 후',
      text: ', 참여자들은 사전에 등록한 질문 카드 중 하나를 랜덤으로 뽑아 답변합니다.',
    },
    {
      icon: '🏆',
      highlight: '모든 과정이 끝나면',
      text: ', 우수 발표자를 투표로 선정하고, 최종 우수 활동자에게는 포인트를 지급합니다.',
    },
  ]

  return (
    <div className="p-4 bg-gray-50 rounded-lg">
      <h2 className="text-lg font-semibold text-gray-800 mb-3">
        싸프린트 진행 방식
      </h2>
      <p className="text-sm text-gray-700">
        싸프린트는{' '}
        <span className="font-semibold">학습 → 발표 & 질문/답변 → 투표</span>의
        순서로 진행됩니다.
      </p>
      <ul className="list-none space-y-1 mt-3">
        {progressSteps.map((step, index) => (
          <ProgressItem
            key={index}
            icon={step.icon}
            highlight={step.highlight}
            text={step.text}
          />
        ))}
      </ul>
      <p className="text-sm text-gray-500 mt-3">
        🌟 최종 평가는 학습 노트, ToDo, 발표 & 답변 등을 기반으로 진행됩니다. 🌟
      </p>
    </div>
  )
}

export default SprintProgress
