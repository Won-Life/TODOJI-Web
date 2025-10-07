'use client';

import React, { useRef, useEffect } from 'react';
import { useBottomSheetContext } from '../context/BottomSheetContext';
import { FaChevronDown } from 'react-icons/fa';

interface CityAreaProps {
  // 바텀 시트 Context에서 받아오는 값들 (Pixi.js 줌 인/아웃에 사용될 변수)
  mapZoomRatio: number; // 0.0 (시트 최대) ~ 0.96 (시트 최소)
  onVillageClick: (village: string) => void;
}

const CityAreaContents: React.FC<CityAreaProps> = ({ mapZoomRatio, onVillageClick }: CityAreaProps) => {
  // Pixi.js 줌 레벨을 mapZoomRatio에 따라 조정하는 로직을 여기에 구현할 것
  // 예: const zoomLevel = 1 + mapZoomRatio * 0.5; // 1배에서 1.5배까지 줌 인
  const villageName = '외국계 기업 취업';

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
            <div className="flex flex-col items-center">
                <span className="text-4xl">🏠</span>
                <span className="text-xs text-red-500">아직 못짓는 건물</span>
            </div>
            <div className="flex flex-col items-center">
                <span className="text-4xl">🏡</span>
                <span className="text-xs text-blue-500">지을 수 있는 건물</span>
            </div>
            <div className="flex flex-col items-center">
                <span className="text-4xl">🏢</span>
                <span className="text-xs text-green-500">지어진 건물</span>
            </div>
        </div>
      </div>
    </div>
  );
}

// Context에서 값을 받아오는 래퍼 컴포넌트
export default function CityArea({ onVillageClick }: {onVillageClick: (village: string) => void}) {
  const { mapZoomRatio } = useBottomSheetContext();
  return <CityAreaContents mapZoomRatio={mapZoomRatio}  onVillageClick={onVillageClick} />;
}