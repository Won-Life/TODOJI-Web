'use client';

import React, { useCallback, useState, useEffect } from 'react';
import BottomSheet from '../components/BottomSheet';
import TodoListContent from '../components/TodoListContent';
import CityAreaContents from '../components/CityAreaContents';
import { BottomSheetProvider } from '../context/BottomSheetContext';
import CustomModal from '../components/CustomModal';
import { TodoDetailModalContent } from '../components/TodoDetailModalContent';
import VillageDetailModalContent from '../components/VillageDetailModalContent';
import NewGoalCreationModalContent from '../components/NewGoalCreationModalContent';
import BuildingDetailModalContent, { BuildingStatus } from '../components/BuildingDetailModalContent';
import { addRNMessageListener } from '../utils/webview';
import { OnboardingProvider, useOnboarding } from '../context/OnBoardingContext';

export default function Home() {
  const [isSheetOpen, setIsSheetOpen] = useState(true);
  const [currentSnapRatio, setCurrentSnapRatio] = useState(0.04);

  // 온보딩 표시 여부 상태 (RN WebView로부터 받아옴)
  const { showOnboarding, setShowOnboarding } = useOnboarding();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTodo, setSelectedTodo] = useState(null);

  const handleTodoClick = useCallback((todo: any) => {
    setSelectedTodo(todo);
    setIsModalOpen(true);
  }, []);

  const [isVillageModalOpen, setIsVillageModalOpen] = useState(false);
  const [selectedVillage, setSelectedVillage] = useState('');
  const [isBuildingModalOpen, setIsBuildingModalOpen] = useState(false);
  const [selectedBuildingStatus, setSelectedBuildingStatus] = useState<BuildingStatus>('NOT_BUILDABLE');

  const onVillageClick = useCallback((village: string) => {
    setSelectedVillage(village);
    setIsVillageModalOpen(true);
  }, []);

  const onBuildingClick = useCallback((buildingStatus: BuildingStatus) => {
    setSelectedBuildingStatus(buildingStatus);
    setIsBuildingModalOpen(true);
  }, []);

  const [isActionCreateModalOpen, setIsActionCreateModalOpen] = useState(false);

  const onActionCreationClick = useCallback(() => {
    setIsActionCreateModalOpen(true);
  }, []);

  const handleCloseSheet = () => setIsSheetOpen(false);
  const handleCloseModal = () => setIsModalOpen(false);
  const handleCloseVillageModal = () => setIsVillageModalOpen(false);
  const handleCloseBuildingModal = () => setIsBuildingModalOpen(false);
  const handleActionCreationClick = () => setIsActionCreateModalOpen(false);

  const snapPoints = [0.04, 0.35, 1];
  const initialSnap = snapPoints.findIndex(p => p === currentSnapRatio);

  // RN WebView로부터 메시지 수신 (온보딩 표시 여부 등)
  useEffect(() => {
    const cleanup = addRNMessageListener((message) => {
      if (message.type === 'SHOW_ONBOARDING') {
        setShowOnboarding(message.data?.show ?? true);
      } else if (message.type === 'HIDE_ONBOARDING') {
        setShowOnboarding(false);
      }
    });

    return cleanup;
  }, []);

  return (
    <OnboardingProvider>
    <div className="relative h-screen w-screen overflow-hidden">
      <BottomSheetProvider currentSnapRatio={currentSnapRatio}>
        {/* INFO:
          시트가 올라와도, CityAreaContents는 항상 전체 화면에 렌더링됨
          바텀 시트가 차지하는 만큼 시트 아래에 겹쳐짐 */}
        <CityAreaContents
          onVillageClick={onVillageClick}
          onBuildingClick={onBuildingClick}
          showOnboarding={showOnboarding}
        />
        <BottomSheet
          isOpen={isSheetOpen}
          onClose={handleCloseSheet}
          snapPoints={snapPoints}
          initialSnap={initialSnap}
          onSnapChange={setCurrentSnapRatio}
        >
          <TodoListContent onTodoClick={handleTodoClick} onCreateClick={onActionCreationClick}/>
        </BottomSheet>
      </BottomSheetProvider>
      <CustomModal isOpen={isModalOpen} onClose={handleCloseModal}>
        <TodoDetailModalContent
          todo={selectedTodo}
          onClose={handleCloseModal}
        />
      </CustomModal>
      <CustomModal isOpen={isVillageModalOpen} onClose={handleCloseVillageModal}>
        <VillageDetailModalContent
          village={selectedVillage}
          onClose={handleCloseVillageModal}
        />
      </CustomModal>
      <CustomModal isOpen={isActionCreateModalOpen} onClose={handleActionCreationClick}>
        <NewGoalCreationModalContent
          onClose={handleActionCreationClick}
        />
      </CustomModal>
      <CustomModal isOpen={isBuildingModalOpen} onClose={handleCloseBuildingModal}>
        <BuildingDetailModalContent
          onClose={handleCloseBuildingModal}
          status={selectedBuildingStatus}
        />
      </CustomModal>
    </div>
    </OnboardingProvider>
  );
}