import { cn } from '@/lib/utils'
import type { FC } from 'react'

interface SsaprintVotePresenterProps {
  presenterRating: number
  setPresenterRating: (presenterRating: number) => void
}

const SsaprintVotePresenter: FC<SsaprintVotePresenterProps> = ({
  presenterRating,
  setPresenterRating,
}) => {
  return (
    <div className="flex flex-col gap-5 animate-fade-in">
      <h2 className="text-xl font-bold">발표자 평가</h2>
      <div className="flex flex-col gap-1">
        <span className="">발표의 만족도를 평가해주세요.</span>
        <span>아래 5개의 항목 중 하나를 선택해주세요.</span>
        <span className="my-2 text-sm italic">
          <span className="font-semibold">1</span>: 매우 불만족,{' '}
          <span className="font-semibold">5</span>: 매우 만족
        </span>
      </div>
      <div className="flex justify-around gap-8">
        {[1, 2, 3, 4, 5].map((number) => (
          <div key={number}>
            <label
              onClick={() => setPresenterRating(number)}
              className={cn(
                'flex items-center justify-center  w-14 h-14  ',
                'hover:bg-ssacle-blue/50 hover:scale-110 bg-ssacle-blue/20',
                'transition-all duration-300 rounded-full cursor-pointer',
                presenterRating === number &&
                  'bg-ssacle-blue text-white scale-110'
              )}
              htmlFor={`presenterRating-${number}`}
              key={number}
            >
              {number}
            </label>
            <input
              className="hidden"
              id={`presenterRating-${number}`}
              type="radio"
              name="presenterRating"
              value={number}
              onChange={() => setPresenterRating(number)}
              checked={presenterRating === number}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
export default SsaprintVotePresenter
