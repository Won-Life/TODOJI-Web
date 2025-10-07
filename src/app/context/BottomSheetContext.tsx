import React, { createContext, useContext, ReactNode } from 'react';

interface BottomSheetContextType {
  currentSnapRatio: number;
  mapZoomRatio: number; // 줌/스크롤 계산을 위한 도시 영역의 높이 비율 (0 ~ 1.0)
}

const BottomSheetContext = createContext<BottomSheetContextType | undefined>(undefined);

export const useBottomSheetContext = () => {
  const context = useContext(BottomSheetContext);
  if (context === undefined) {
    throw new Error('useBottomSheetContext must be used within a BottomSheetProvider');
  }
  return context;
};

interface BottomSheetProviderProps {
  currentSnapRatio: number;
  children: ReactNode;
}

export const BottomSheetProvider = ({ currentSnapRatio, children }: BottomSheetProviderProps) => {
  // TODO: 도시 영역 높이 계산 (Snap Ratio가 낮아지면 Map Zoom Ratio는 높아져야 함)
  // 예: Snap 1.0 (최대) -> Zoom 0.0 (최소)
  //     Snap 0.04 (최소) -> Zoom ~0.96 (최대)
  const mapZoomRatio = 1 - currentSnapRatio;

  return (
    <BottomSheetContext.Provider value={{ currentSnapRatio, mapZoomRatio }}>
      {children}
    </BottomSheetContext.Provider>
  );
};