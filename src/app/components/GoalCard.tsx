import Image from 'next/image';

export default function GoalCard() {
  return (
    <div>
      <h2 className="text-xl font-bold text-gray-800 pl-2 mb-2">최종목표</h2>
      <div className="relative">
        <Image
          src="/assets/goal.png"
          alt="Goal image"
          width={450}
          height={250}
          priority
          className="object-cover rounded-lg w-full h-48"
          />
        <div className="absolute inset-0 bg-black/40 rounded-lg"></div>
        <div className="absolute top-4 right-4 text-white text-lg font-bold px-4 py-2 rounded-lg">
          D - 103
        </div>
        <div className="absolute bottom-4 left-4 text-white">
          <h3 className="text-xl font-bold">외국계 기업 취업</h3>
          <p className="text-xs mt-1">시작일: 2025년 09월 01일</p>
          <p className="text-xs">마감일: 2026년 03월 01일</p>
        </div>
      </div>
    </div>
  );
}
