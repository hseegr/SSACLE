import profileImage from '@/mocks/pImg.png'

const Profile = ({ userData }) => {
  if (!userData) {
    return <div>사용자 정보를 불러올 수 없습니다.</div>
  }
  const { nickname, level, pickles, profile } = userData

  const MAX_LEVEL = 30

  // 레벨 기준 진행률 계산
  const progressPercent = (level / MAX_LEVEL) * 100

  return (
    <div className="min-w-max bg-ssacle-sky rounded-xl p-10 w-full h-60 content-center">
      <div className="flex items-center gap-6">
        {/* 프로필 이미지 */}
        <div className="w-28 h-28 bg-white rounded-full">
          <img
            src={profile || profileImage}
            alt="프로필 캐릭터"
            className="w-full h-full rounded-full object-cover"
          />
        </div>

        {/* 정보 */}
        <div className="flex-1">
          {/* 이름, 레벨 */}
          <div className="flex items-center gap-2 mb-2">
            <span className="font-semibold text-lg text-ssacle-black">
              {nickname}
            </span>
            <span className="text-green-500 font-semibold ">
              {pickles} 피클 🥒
            </span>
          </div>
          <div className="font-bold text-base text-ssacle-blue">
            Lv. {level}
          </div>

          {/* 레벨 바 */}
          <div className="mt-2">
            <div className="w-full bg-white h-4 rounded-full">
              <div
                className="bg-ssacle-blue h-full rounded-full transition-all duration-300 min-w-[1rem]"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            {/* 경험치 텍스트 */}
            <div className="flex justify-between mt-1">
              <span className="text-sm text-white font-semibold">
                Level {level}
              </span>
              <span className="text-sm text-white font-semibold">
                Level {MAX_LEVEL}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile
