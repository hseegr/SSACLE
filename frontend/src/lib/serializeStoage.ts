// 로컬스토리지에서 데이터를 가져오는 함수
const getItem = async (name: string): Promise<any> => {
  const value = localStorage.getItem(name)
  if (!value) return null

  const parsed = JSON.parse(value)
  const data = parsed.state.signalStates
  if (data) {
    Object.keys(data).forEach((key) => {
      data[key] = new Set(data[key])
    })
  }
  return data
}

// 로컬스토리지에 데이터를 저장하는 함수
const setItem = async (name: string, value: string): Promise<void> => {
  const parsed = JSON.parse(value)
  const data = parsed.state.signalStates
  if (data) {
    const serializedSignalStates: Record<string, string[]> = {}

    Object.keys(data).forEach((key) => {
      serializedSignalStates[key] = Array.from(data[key])
    })

    parsed.state.signalStates = serializedSignalStates
  }
  localStorage.setItem(name, JSON.stringify(parsed))
}

// 로컬스토리지에서 데이터를 삭제하는 함수
const removeItem = async (name: string): Promise<void> => {
  localStorage.removeItem(name)
}

export const serializeStorage = { getItem, setItem, removeItem }
