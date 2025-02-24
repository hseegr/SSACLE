// @ts-nocheck
import { useQuery } from '@tanstack/react-query'
import { fetchSprintTeamNotes } from '@/services/ssaprintService'

const SprintNotesGallery = ({ sprintId, myNotionUrl }) => {
  // 스프린트에 속한 팀 노트 목록 조회
  const {
    data: notes = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['sprintTeamNotes', sprintId],
    queryFn: () => fetchSprintTeamNotes(sprintId),
    enabled: !!sprintId, // sprintId가 존재할 때만 실행
  })

  // 내 노트 제외한 노트 목록 필터링
  const filteredNotes = notes.filter((note) => note.notionURL !== myNotionUrl)

  // 노트 클릭 시 Notion 링크 열기
  const handleOpenNote = (url) => {
    window.open(url, '_blank')
  }

  if (isLoading) {
    return (
      <div className="text-gray-500 text-center p-4">
        📄 학습 노트를 불러오는 중...
      </div>
    )
  }

  if (isError || filteredNotes.length === 0) {
    return (
      <div className="text-gray-500 text-center p-4">
        📌 다른 팀의 공유된 학습 노트가 없습니다.
      </div>
    )
  }

  return (
    <div className="bg-white shadow-md rounded-lg p-5 w-[20rem] max-w-md h-[52rem]">
      <h2 className="text-lg font-semibold flex items-center gap-1">
        싸프린트 학습 공유 노트 📖
      </h2>
      <p className="text-gray-600 text-sm mt-1">
        같은 스프린트에 참여한 다른 팀원들의 학습 노트를 확인하고, 배움을
        공유해보세요!
      </p>

      <div className="mt-4 flex flex-col gap-3 max-h-[40rem] overflow-y-auto">
        {filteredNotes.map((note, index) => {
          const noteName = note.name.replace(/^팀\s*/, '') // "팀" 제거

          return (
            <button
              key={index}
              onClick={() => handleOpenNote(note.notionURL)}
              className="bg-gray-100 hover:bg-gray-200 transition p-3 rounded-lg text-left shadow-sm"
            >
              {noteName}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default SprintNotesGallery
