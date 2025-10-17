'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Trash2, Plus, MoreVertical } from 'lucide-react';
import CustomModal from './CustomModal';
import BuildingDetailModalContent from './BuildingDetailModalContent';

interface Building {
  id: string;
  name: string;
  date: string;
}

export const CityBuildingInfo = () => {
  const buildings: Building[] = [
    { id: '1', name: '건물명', date: '2025/00/01' },
    { id: '2', name: '건물명', date: '2025/00/01' },
    { id: '3', name: '건물명', date: '2025/00/01' },
    { id: '4', name: '건물명', date: '2025/00/01' },
    { id: '5', name: '건물명', date: '2025/00/01' },
    { id: '6', name: '건물명', date: '2025/00/01' },
  ];

  const [isBuildingModalOpen, setIsBuildingModalOpen] = useState(false);
  const [selectedBuildingId, setSelectedBuildingId] = useState<string | null>(null);

   const handleBuildingClick = (buildingId: string) => {
    setSelectedBuildingId(buildingId);
    setIsBuildingModalOpen(true);
  };

  const handleCloseBuildingModal = () => {
    setIsBuildingModalOpen(false);
    setSelectedBuildingId(null);
  };


  return (
    <div className="min-h-screen">
      <div className="mb-4 px-3">
        <h2 className="text-lg font-bold">도시 건설 정보</h2>
        <p className="text-sm text-gray-600 mt-1">진행 중 {buildings.length}개</p>
      </div>

      <div className="space-y-2">
        {buildings.map((building) => (
          <div
            key={building.id}
            onClick={() => handleBuildingClick(building.id)}
            className="flex items-center gap-3 px-3 py-2 bg-gray-300 rounded-md cursor-pointer hover:bg-gray-100 transition-colors"
          >
            <div className="w-10 h-10 bg-black rounded-sm flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-sm">{building.name}</h3>
              <p className="text-xs text-gray-500 mt-1">완공일: {building.date}</p>
            </div>
            <div className="flex-col gap-1">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedBuildingId(building.id);
                }}
                className="px-3 py-1.5 bg-black text-white text-xs font-medium rounded hover:bg-gray-800 transition-colors flex-shrink-0"
              >
                건물로 이동
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleBuildingClick(building.id);
                }}
                className="p-1 hover:bg-gray-200 rounded transition-colors flex-shrink-0"
              >
                <MoreVertical size={18} className="text-gray-600" />
              </button>
            </div>
          </div>
        ))}
      </div>
      <CustomModal isOpen={isBuildingModalOpen} onClose={handleCloseBuildingModal}>
        <BuildingDetailModalContent
          onClose={handleCloseBuildingModal}
          status={'BUILT'}
        />
      </CustomModal>
    </div>
  );
};