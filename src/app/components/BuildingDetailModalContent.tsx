import React, { ReactNode } from 'react';

interface Building {
  name: string;
  imageUrl: string;
  level: number;
  requiredActions: number;
  completionDate: string;
  remainingActions: number;
}

export type BuildingStatus = 'BUILT' | 'BUILDABLE' | 'NOT_BUILDABLE';

interface BuildingStatusLayoutProps {
  onClose: () => void;
  status: BuildingStatus;
}

export default function BuildingDetailModalContent ({ onClose, status }: BuildingStatusLayoutProps) {
  interface StatusConfig {
    title: string;
    subtitle: string;
    content: ReactNode;
    buttonText: string;
    isButtonEnabled: boolean;
  }

  // Mock Data
  const building: Building = {
    name: '건물명',
    imageUrl: '',
    level: 1,
    requiredActions: 50,
    completionDate: '2025/09/01',
    remainingActions: 4,
  };

  const statusConfig: Record<BuildingStatus, StatusConfig> = {
    BUILT: {
      title: building.name,
      subtitle: `행동 ${building.requiredActions}개 완료로 건설\n완공일: ${building.completionDate}`,
      content: (
        <div className="w-full">
          <label htmlFor="memo" className="block text-sm font-bold text-gray-700 mb-2 text-left">메모</label>
          <textarea
            id="memo"
            rows={3}
            className="w-full bg-gray-200 border border-gray-300 rounded-lg p-3 text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400"
            placeholder="메모를 입력하세요."
          ></textarea>
        </div>
      ),
      buttonText: '확인',
      isButtonEnabled: true,
    },
    BUILDABLE: {
      title: building.name,
      subtitle: `Lv. ${building.level}\n필요 행동 달성 갯수: ${building.requiredActions}개`,
      content: <p className="text-lg font-bold text-gray-800">행동 목표를 {building.requiredActions}개 완료해<br />건물을 지을 수 있어요!</p>,
      buttonText: '건물 짓기',
      isButtonEnabled: true,
    },
    NOT_BUILDABLE: {
      title: building.name,
      subtitle: `행동 ${building.requiredActions}개 완료로 건설 가능`,
      content: <p className="text-lg font-bold text-gray-800">행동 목표를 {building.remainingActions}개 더 완료하면<br />건물을 지을 수 있어요!</p>,
      buttonText: '건물 짓기',
      isButtonEnabled: false,
    },
  };

  const currentStatus = statusConfig[status];

  return (
    <div className="bg-white rounded-2xl w-full max-w-sm mx-auto text-center flex flex-col items-center relative">
      <button onClick={onClose} className="absolute top-2 right-2 text-gray-500 hover:text-gray-800">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l 12 12" />
        </svg>
      </button>

      <div className="flex items-start w-full mb-6">
        <div className="relative w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500 mr-4 flex-shrink-0">
          건물 png<br/>이미지
        </div>
        <div className="text-left">
          <h2 className="text-xl font-bold pt-2 text-gray-900 flex items-center">
            {currentStatus.title}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L15.232 5.232z" />
            </svg>
          </h2>
          <p className="text-sm text-gray-500 whitespace-pre-line mt-1">{currentStatus.subtitle}</p>
        </div>
      </div>

      <div className="mb-8 h-24 flex items-center justify-center w-full">
         {currentStatus.content}
      </div>

      <button
        className={`w-full py-3 rounded-lg font-bold text-lg transition-colors ${
          currentStatus.isButtonEnabled
            ? 'bg-black text-white hover:bg-gray-800'
            : 'bg-gray-200 text-gray-500 cursor-not-allowed'
        }`}
        disabled={!currentStatus.isButtonEnabled}
      >
        {currentStatus.buttonText}
      </button>

      {/* <style>{`
        @keyframes fade-in-up {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.3s ease-out forwards;
        }
      `}</style> */}
    </div>
  );
};
