import { useState, useEffect } from 'react'
import { FaChevronUp, FaChevronDown } from 'react-icons/fa'

const SprintCurriculum = ({ todos = [] }) => {
  const [expandedDays, setExpandedDays] = useState({})
  const [allExpanded, setAllExpanded] = useState(false)

  // Day 목록 생성
  const formattedTodos = todos.map((todo, index) => ({
    day: `Day ${index + 1}`,
    date: todo.date,
    tasks: todo.tasks,
    icon: index === 5 ? '📝' : index === 6 ? '🎤' : '📚',
  }))

  if (!todos || !Array.isArray(todos) || todos.length === 0) {
    return <p className="text-gray-500 text-center">데이터를 불러오는 중...</p>
  }

  // 특정 Day 토글
  const toggleDay = (day) => {
    setExpandedDays((prev) => {
      const newExpandedDays = {
        ...prev,
        [day]: !prev[day],
      }

      // 하나라도 열려 있으면 모두 펼치기로 변경
      const isAnyOpen = Object.values(newExpandedDays).some((isOpen) => isOpen)
      setAllExpanded(isAnyOpen)

      return newExpandedDays
    })
  }

  // 전체 토글
  const toggleAll = () => {
    const newState = !allExpanded
    const newExpandedDays = formattedTodos.reduce((acc, todo) => {
      acc[todo.day] = newState
      return acc
    }, {})

    setExpandedDays(newExpandedDays)
    setAllExpanded(newState)
  }

  return (
    <div className="bg-gray-50 rounded-lg p-6">
      <div className="flex justify-between items-center mb-4 mt-1">
        <h2 className="text-lg font-semibold">커리큘럼</h2>
        <button
          className="text-gray-500 hover:text-black text-sm"
          onClick={toggleAll}
        >
          {allExpanded ? '모두 접기' : '모두 펼치기'}
        </button>
      </div>
      <div>
        {formattedTodos.map((todo) => (
          <div
            key={todo.day}
            className={`border border-gray-100 rounded-lg mb-3 overflow-hidden ${expandedDays[todo.day] ? 'shadow-lg' : ''}`}
          >
            <button
              className="w-full flex justify-between items-center p-3 font-semibold hover:bg-gray-100 text-sm bg-gray-100"
              onClick={() => toggleDay(todo.day)}
            >
              <span className="flex items-center gap-2">
                <span>{todo.icon}</span>
                <span>{todo.day}</span>
              </span>
              {expandedDays[todo.day] ? (
                <FaChevronUp className="text-gray-500 text-xs" />
              ) : (
                <FaChevronDown className="text-gray-500 text-xs" />
              )}
            </button>
            {expandedDays[todo.day] && (
              <div className="bg-gray-100">
                <hr className="border-t border-gray-300 mb-2 w-[90%] mx-auto" />
                <ul className="text-sm p-5">
                  {todo.tasks.map((task, idx) => (
                    <li key={idx} className="text-gray-700 mb-1">
                      ▪ {task}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default SprintCurriculum
