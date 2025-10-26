import React, { useCallback, useRef } from 'react';
import { useDragToSnap } from '../hooks/useDragToSnap';

interface CustomBottomSheetProps {
  isOpen: boolean;
  onClose?: () => void;
  children?: React.ReactNode;
  snapPoints?: number[]; // 바텀시트 높이 조절
  initialSnap?: number; // 초기 스냅 포인트 인덱스
  onSnapChange: (ratio: number) => void; // 스냅 변경 시 컨텍스트 값 업데이트
}

export default function BottomSheet({
  isOpen,
  onClose = () => {},
  children,
  snapPoints = [0.04, 0.35, 1],
  initialSnap = 1,
  onSnapChange,
}: CustomBottomSheetProps) {
  const sheetRef = useRef<HTMLDivElement>(null);

  const {
    handlePointerDown,
    isDragging,
    currentSnapIndex,
    setSnapIndex
  } = useDragToSnap({
    sheetRef,
    snapPoints,
    initialSnap,
    onClose,
    isOpen,
    onSnapChange,
  });

  const finalHeight = `${snapPoints[currentSnapIndex] * 100}vh`;

  const sheetClasses = `
    fixed inset-x-0 bottom-0
    bg-background text-foreground
    rounded-t-2xl shadow-lg
    ${isOpen ? 'translate-y-0' : 'translate-y-full'}
    ${isDragging ? 'transition-none' : 'transition-transform duration-300 ease-out'}
    flex flex-col
    z-50
  `;

  return (
    <>
      <div
        ref={sheetRef}
        className={sheetClasses}
        style={{ height: finalHeight }}
      >
        {/* 헤더 */}
        <div
          className="flex justify-center p-3 border-border cursor-grab touch-none"
          onPointerDown={handlePointerDown}
        >
          <div className="w-20 h-1 bg-[#D9D9D9] rounded-full" />
        </div>

        {/* 컨텐츠 영역 및 스냅 조작 버튼 */}
        <div className="flex-grow overflow-y-auto p-2">
          {children}
        </div>
      </div>
    </>
  );
}