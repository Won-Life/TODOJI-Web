'use client';

import React, { useRef, useEffect, useState } from 'react';
import { useBottomSheetContext } from '../context/BottomSheetContext';
import { FaChevronDown } from 'react-icons/fa';
import { BuildingStatus } from './BuildingDetailModalContent';
import { sendMessageToRN } from '../utils/webview';
import { useRouter } from 'next/navigation';

interface CityAreaProps {
  // 바텀 시트 Context에서 받아오는 값들 (Pixi.js 줌 인/아웃에 사용될 변수)
  mapZoomRatio: number; // 0.0 (시트 최대) ~ 0.96 (시트 최소)
  onVillageClick: (village: string) => void;
  onBuildingClick: (buildingStatus: BuildingStatus) => void;
  showOnboarding?: boolean; // 온보딩 표시 여부
  currentSnapRatio: number; // 바텀시트 현재 높이 비율
}

// 온보딩 메시지 데이터
const ONBOARDING_MESSAGES = [
  '반가워요! 여기는 당신의 목표를 달성하며 만들어갈 도시예요.',
  '할 일을 완료할 때마다 건물이 지어지고, 도시가 성장해요.',
  '바텀시트를 올려 할 일 목록을 확인하고, 목표를 향해 나아가보세요!',
  '목표 설정을 하러 가볼까요?',
];

const CityAreaContents: React.FC<CityAreaProps> = ({
  mapZoomRatio,
  onVillageClick,
  onBuildingClick,
  showOnboarding = false,
  currentSnapRatio,
}: CityAreaProps) => {
  // Pixi.js 줌 레벨을 mapZoomRatio에 따라 조정하는 로직을 여기에 구현할 것
  // 예: const zoomLevel = 1 + mapZoomRatio * 0.5; // 1배에서 1.5배까지 줌 인
  const villageName = '외국계 기업 취업';

  // 온보딩 상태 관리
  const [onboardingStep, setOnboardingStep] = useState(0);
  const isLastStep = onboardingStep === ONBOARDING_MESSAGES.length - 1;
  const route = useRouter();

  // 다음 버튼 클릭 핸들러
  const handleNextStep = () => {
    if (isLastStep) {
      route.push('/goal-setting')
      // 마지막 단계에서 확인 버튼 클릭 시 RN으로 메시지 전송
      // sendMessageToRN({
      //   type: 'ONBOARDING_COMPLETE',
      //   data: { completedAt: new Date().toISOString() },
      // });
    } else {
      setOnboardingStep((prev) => prev + 1);
    }
  };

  // 바텀시트와 겹치지 않는 영역 계산 (바텀시트 높이를 vh로 계산)
  const bottomSheetHeightVh = currentSnapRatio * 100;
  const availableBottomSpace = 100 - bottomSheetHeightVh; // 남은 공간 (vh)

  return (
    <div className="relative w-full h-full bg-gray-300 flex flex-col items-center justify-center">
      {/* 1. 좌측 상단: 마을 정보 컴포넌트 */}
      <div className="absolute top-4 left-4 py-2 px-2 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg flex items-center space-x-2" 
        onClick={() => onVillageClick(villageName)}
      >
        <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
        <div className="flex flex-col">
          <span className="font-semibold text-gray-800">뭐시기 마을</span>
          <div className="flex items-center text-sm text-gray-600">
            <span>{villageName}</span>
            <FaChevronDown className="ml-1 w-3 h-3" />
          </div>
        </div>
      </div>

      {/* 2. 우측 상단: 포인트 정보 컴포넌트 */}
      <div className="absolute top-8 right-4 py-1 px-2 bg-white/90 backdrop-blur-sm rounded-md shadow-lg flex items-center space-x-1">
        <span className="text-gray-800 font-bold">1,330 P</span>
        <div className="w-2 h-2 rounded-full bg-green-500"></div>
      </div>

      {/* 3. 도시 영역 중앙 텍스트 및 줌 상태 */}
      <h2 className="text-xl font-bold text-gray-700 mb-6">도시 영역</h2>
      <div className="text-sm text-gray-600 space-y-2 text-center">
        <p>Map Zoom Ratio (Pixi.js 입력 변수): **{mapZoomRatio.toFixed(3)}**</p>
        <p>시트가 내려갈수록 (Ratio가 커질수록) 줌 인 됩니다.</p>

        {/* 건물 예시 */}
        <div className="flex justify-around w-full mt-4">
            <div className="flex flex-col items-center" onClick={()=>onBuildingClick('NOT_BUILDABLE')}>
                <span className="text-4xl">🏠</span>
                <span className="text-xs text-red-500">아직 못짓는 건물</span>
            </div>
            <div className="flex flex-col items-center" onClick={()=>onBuildingClick('BUILDABLE')}>
                <span className="text-4xl">🏡</span>
                <span className="text-xs text-blue-500">지을 수 있는 건물</span>
            </div>
            <div className="flex flex-col items-center" onClick={()=>onBuildingClick('BUILT')}>
                <span className="text-4xl">🏢</span>
                <span className="text-xs text-green-500">지어진 건물</span>
            </div>
        </div>
      </div>

      {/* 온보딩 설명 박스 */}
      {showOnboarding && (
        <div
          className="absolute left-4 right-4 bg-white rounded-2xl shadow-2xl p-4 flex flex-col"
          style={{
            bottom: `calc(${bottomSheetHeightVh}vh + 16px)`, // 바텀시트 위 16px
            maxWidth: '400px',
            margin: '0 auto',
          }}
        >
          {/* 메시지 영역 */}
          <div className="flex-1 mb-4">
            <p className="text-gray-800 text-base leading-relaxed">
              {ONBOARDING_MESSAGES[onboardingStep]}
            </p>
          </div>

          {/* 진행 표시 점 + 버튼 */}
          <div className="flex items-center justify-between">
            {/* 진행 표시 점들 */}
            <div className="flex space-x-2">
              {ONBOARDING_MESSAGES.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === onboardingStep ? 'bg-blue-500' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>

            {/* 다음/확인 버튼 */}
            <button
              onClick={handleNextStep}
              className="px-6 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors"
            >
              {isLastStep ? '확인' : '다음'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Context에서 값을 받아오는 래퍼 컴포넌트
export default function CityArea({
  onVillageClick,
  onBuildingClick,
  showOnboarding,
}: {
  onVillageClick: (village: string) => void;
  onBuildingClick: (buildingStatus: BuildingStatus) => void;
  showOnboarding?: boolean;
}) {
  const { mapZoomRatio, currentSnapRatio } = useBottomSheetContext();
  return (
    <CityAreaContents
      mapZoomRatio={mapZoomRatio}
      onVillageClick={onVillageClick}
      onBuildingClick={onBuildingClick}
      showOnboarding={showOnboarding}
      currentSnapRatio={currentSnapRatio}
    />
  );
}