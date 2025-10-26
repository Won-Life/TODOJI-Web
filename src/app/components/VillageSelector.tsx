'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { IoChevronDown, IoAdd } from 'react-icons/io5';

// Village 데이터 타입 정의
type Village = {
  id: number;
  name: string;
  goal: string;
  createdDate: string;
  imageUrl?: string;
};

// VillageSelector 컴포넌트 Props 정의
type VillageSelectorProps = {
  villages: Village[];
  selectedVillageId: number;
  onSelectVillage: (id: number) => void;
  maxVillages: number;
};

// 마을 카드 (모달 내부에서 사용)
type VillageCardProps = {
  village: Village;
  isSelected: boolean;
  onClick: () => void;
};

function VillageCard({ village, isSelected, onClick }: VillageCardProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center p-2 rounded-lg border ${
        isSelected
          ? 'border-green-500 bg-green-50' // 선택된 항목 스타일
          : 'border-gray-200 bg-white'
      } transition-colors`}
    >
      <div className="flex-shrink-0 w-13 h-13 bg-gray-200 rounded-md mr-4">
        {/* {village.imageUrl && (
          <img
            src={village.imageUrl}
            alt={village.name}
            className="w-full h-full object-cover rounded-md"
          />
        )} */}
      </div>
      <div className="text-left">
        <h3 className="font-bold text-lg">{village.name}</h3>
        <p className="text-sm text-gray-600">최종목표: {village.goal}</p>
        <p className="text-sm text-gray-600">생성일: {village.createdDate}</p>
      </div>
    </button>
  );
}

// 메인 컴포넌트 (헤더 + 모달)
export default function VillageSelector({
  villages,
  selectedVillageId,
  onSelectVillage,
  maxVillages,
}: VillageSelectorProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  // 현재 선택된 마을 정보 찾기
  const selectedVillage =
    villages.find((v) => v.id === selectedVillageId) || villages[0];

  // 마을 선택 시 처리 핸들러
  const handleSelect = (id: number) => {
    onSelectVillage(id);
    setIsOpen(false); // 모달 닫기
  };

  return (
    <>
      <header className="sticky top-0 z-10 flex items-center justify-center py-4 bg-gray-50 border-b border-gray-200">
        <button
          onClick={() => setIsOpen(true)} // 클릭 시 모달 열기
          className="flex items-center space-x-1.5"
        >
          <span className="text-lg font-bold text-gray-900">
            {selectedVillage.name}
          </span>
          <IoChevronDown className="w-5 h-5 text-gray-700" />
        </button>
      </header>

      {isOpen && (
        <div
          className="fixed inset-0 z-50"
          role="dialog"
          aria-modal="true"
          onClick={() => setIsOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative z-10 bg-white rounded-b-2xl p-2 pt-2 space-y-2 max-h-[40vh] flex flex-col shadow-lg max-w-sm mx-auto mt-16"
          >
            {/* 닫기 버튼 (선택 사항) */}
            {/* <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-gray-500"
            >
              <IoClose className="w-6 h-6" />
            </button> */}

            <div className="overflow-y-auto space-y-2 px-2 pb-1">
              {villages.map((village) => (
                <VillageCard
                  key={village.id}
                  village={village}
                  isSelected={village.id === selectedVillageId}
                  onClick={() => handleSelect(village.id)}
                />
              ))}
            </div>

            <div className="px-2">
              <button className="w-full flex items-center justify-center space-x-2 bg-green-500 text-white font-bold py-2 rounded-lg text-lg transition-transform active:scale-95" onClick={() => router.replace('goal-setting')}>
                <IoAdd className="w-6 h-6" />
                <span>
                  마을 추가 ({villages.length}/{maxVillages})
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
