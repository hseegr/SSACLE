import { useState, useEffect, useMemo } from 'react'
import { FaPlus, FaTimes } from 'react-icons/fa'
import {
  createTodo,
  deleteTodo,
  updateTodoStatus,
} from '@/services/ssaprintService'

const SprintToDoList = ({ todos, teamId, refreshTodos }) => {
  const [tasks, setTasks] = useState([])
  const [newTask, setNewTask] = useState('')

  // 오늘 날짜 포맷 (YYYY-MM-DD)
  const today = useMemo(() => {
    const now = new Date()
    now.setHours(now.getHours() + 9) // UTC 기준을 한국 시간으로 변환
    return now.toISOString().split('T')[0] // YYYY-MM-DD 형식 반환
  }, [])

  // todos 데이터에서 오늘 날짜의 To-Do 찾기
  useEffect(() => {
    const todayTasks = todos.find((day) => day.date === today)
    if (todayTasks) {
      setTasks(
        todayTasks.contents?.map((content) => ({
          id: content.id,
          text: content.task,
          completed: content.done, // API에서 받은 done 값을 반영
        })) || []
      )
    } else {
      setTasks([])
    }
  }, [todos, today])

  // 체크박스 클릭 시 완료 상태 변경
  const handleToggle = async (todoId) => {
    try {
      await updateTodoStatus(todoId)
      refreshTodos() // 최신 데이터 다시 불러오기
    } catch (error) {
      alert('❌ To-Do 상태 변경에 실패했습니다. 다시 시도해주세요.')
    }
  }

  // ToDo 추가
  const handleAddTask = async () => {
    if (!newTask.trim()) return

    try {
      await createTodo(teamId, { content: newTask, date: today })
      setNewTask('')
      alert('To-Do가 성공적으로 추가되었습니다!')

      // ✅ 최신 To-Do 데이터 다시 불러오기
      refreshTodos()
    } catch (error) {
      alert('❌ To-Do 추가에 실패했습니다. 다시 시도해주세요.')
    }
  }

  // ToDo 삭제제
  const handleDeleteTask = async (todoId) => {
    try {
      await deleteTodo(todoId)
      alert('To-Do가 삭제되었습니다.')
      refreshTodos() // 최신 데이터 다시 불러오기
    } catch (error) {
      alert('❌ To-Do 삭제에 실패했습니다. 다시 시도해주세요.')
    }
  }

  // 엔터키 이벤트 처리
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleAddTask()
    }
  }

  return (
    <div className="p-4 bg-white shadow-md rounded-lg w-full min-h-[42rem] flex flex-col justify-between">
      {/* 상단 - 제목 & 날짜 */}
      <div>
        <h2 className="text-lg font-bold mb-4">To-Do List ✅</h2>
        <h3 className="text-md font-semibold">{today}</h3>

        {/* 할 일 목록 */}
        <ul className="mt-2 space-y-2">
          {tasks.length > 0 ? (
            tasks.map((task, taskIndex) => (
              <li
                key={task.id || taskIndex}
                className="flex items-center justify-between gap-2"
              >
                <div className="flex items-center gap-2 w-full">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => handleToggle(task.id)}
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
                  onClick={() => handleDeleteTask(task.id)}
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
            onKeyDown={handleKeyDown}
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
