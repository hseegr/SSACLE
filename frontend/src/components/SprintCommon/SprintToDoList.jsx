import { useState, useEffect, useMemo } from 'react'
import { FaPlus, FaTimes } from 'react-icons/fa'

const SprintToDoList = ({ todos }) => {
  const [tasks, setTasks] = useState([])
  const [newTask, setNewTask] = useState('')

  // 오늘 날짜 포맷 (YYYY-MM-DD) 
  const [today] = useMemo(() => new Date().toISOString().split('T'), [])

  // todos 데이터에서 오늘 날짜의 To-Do 찾기
  useEffect(() => {
    const todayTasks = todos.find((day) => day.date === today)
    if (todayTasks) {
      setTasks(
        todayTasks.tasks.map((task) => ({ text: task, completed: false }))
      )
    } else {
      setTasks([])
    }
  }, [todos, today])

  // 체크박스 변경 이벤트
  const handleToggle = (taskIndex) => {
    setTasks((prevTasks) =>
      prevTasks.map((task, index) =>
        index === taskIndex ? { ...task, completed: !task.completed } : task
      )
    )
  }

  // 할 일 삭제
  const handleDeleteTask = (taskIndex) => {
    setTasks((prevTasks) => prevTasks.filter((_, index) => index !== taskIndex))
  }

  // 새 할 일 추가
  const handleAddTask = () => {
    if (!newTask.trim()) return
    setTasks((prevTasks) => [...prevTasks, { text: newTask, completed: false }])
    setNewTask('') // 입력 필드 초기화
  }

  return (
    <div className="p-4 bg-white shadow-md rounded-lg w-full min-h-[24rem] flex flex-col justify-between">
      {/* 상단 - 제목 & 날짜 */}
      <div>
        <h2 className="text-lg font-bold mb-4">To-Do List ✅</h2>
        <h3 className="text-md font-semibold">{today}</h3>

        {/* 할 일 목록 */}
        <ul className="mt-2 space-y-2">
          {tasks.length > 0 ? (
            tasks.map((task, taskIndex) => (
              <li
                key={taskIndex}
                className="flex items-center justify-between gap-2"
              >
                <div className="flex items-center gap-2 w-full">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => handleToggle(taskIndex)}
                    className="cursor-pointer"
                  />
                  <span
                    className={`text-xs flex-1 ${task.completed ? 'line-through text-gray-500' : ''}`}
                  >
                    {task.text}
                  </span>
                </div>
                {/* X 버튼 (삭제) */}
                <button
                  onClick={() => handleDeleteTask(taskIndex)}
                  className="w-3 h-3 flex items-center justify-center bg-gray-500 rounded-sm hover:bg-gray-700 transition"
                >
                  <FaTimes className="text-white text-[6px]" />
                </button>
              </li>
            ))
          ) : (
            <p className="text-gray-400 text-xs">오늘의 To-Do가 없습니다.</p>
          )}
        </ul>
      </div>

      {/* 하단 - 입력창 & 추가 버튼 */}
      <div className="mt-4">
        <p className="text-blue-500 text-xs font-semibold mb-2">
          ToDo를 추가할 수 있어요!
        </p>
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="새로운 To-Do 입력"
            className="flex-1 p-1.5 border rounded-md focus:outline-none text-xs"
          />
          <button
            onClick={handleAddTask}
            className="p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            <FaPlus />
          </button>
        </div>
      </div>
    </div>
  )
}

export default SprintToDoList
