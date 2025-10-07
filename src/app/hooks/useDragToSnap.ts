// hooks/useDragToSnap.ts

import { useState, useCallback, useEffect, useRef } from 'react';

// 시트 상태 및 드래그 핸들러를 관리하는 타입
interface DragSnapControls {
  handlePointerDown: (e: React.PointerEvent<HTMLDivElement>) => void;
  isDragging: boolean;
  currentSnapIndex: number;
  setSnapIndex: (index: number) => void;
}

interface UseDragToSnapProps {
  sheetRef: React.RefObject<HTMLDivElement | null>;
  snapPoints: number[]; // vh 비율 (예: 0.25, 0.5, 1)
  initialSnap: number;
  onClose: () => void;
  isOpen: boolean;
  onSnapChange: (ratio: number) => void;
}

// 뷰포트 높이(vh)를 픽셀(px)로 변환하는 헬퍼 함수
const vhToPx = (vh: number): number => (vh * window.innerHeight) / 100;

export function useDragToSnap({
  sheetRef,
  snapPoints,
  initialSnap,
  onClose,
  isOpen,
  onSnapChange,
}: UseDragToSnapProps): DragSnapControls {
  const [currentSnapIndex, setCurrentSnapIndex] = useState(initialSnap);
  const [isDragging, setIsDragging] = useState(false);

  // 드래그 시작 상태를 추적하는 Ref들
  const dragState = useRef({
    startY: 0,
    startSheetY: 0, // 드래그 시작 시 시트의 현재 translateY 값 (px)
    currentY: 0,
  });

  // isOpen 상태 변경 시 초기화
  useEffect(() => {
    if (isOpen) {
      setCurrentSnapIndex(initialSnap);
    }
  }, [isOpen, initialSnap]);

  // ---------------------------------------------------
  // 1. 드래그 이동 (Pointer Move)
  // ---------------------------------------------------
  const handlePointerMove = useCallback((e: PointerEvent) => {
    if (!isDragging || !sheetRef.current) return;

    const deltaY = e.clientY - dragState.current.startY;
    const newY = Math.max(0, dragState.current.startSheetY + deltaY);
    dragState.current.currentY = newY; // 현재 Y 위치 업데이트

    // 시각적 위치 업데이트
    sheetRef.current.style.transform = `translateY(${newY}px)`;
  }, [isDragging, sheetRef]);


  // 2. 드래그 종료 (Pointer Up)
  const handlePointerUp = useCallback((e: PointerEvent) => {
    if (!isDragging || !sheetRef.current) return;

    setIsDragging(false);
    sheetRef.current.style.userSelect = '';

    const dragDistance = e.clientY - dragState.current.startY;
    let nextIndex = currentSnapIndex;

    // --- 스냅 로직 ---
    if (dragDistance > 50) { // 아래로 50px 이상 드래그 (닫거나 낮은 스냅으로)
        nextIndex = Math.max(0, currentSnapIndex - 1);
    } else if (dragDistance < -50) { // 위로 50px 이상 드래그 (높은 스냅으로)
        nextIndex = Math.min(snapPoints.length - 1, currentSnapIndex + 1);
    }

    setCurrentSnapIndex(nextIndex);
    onSnapChange(snapPoints[nextIndex]);

    // 최종 스냅 위치로 애니메이션 (CSS transition 재활성화)
    sheetRef.current.style.transition = 'transform 0.3s ease-out, height 0.3s ease-out';
    sheetRef.current.style.transform = 'translateY(0)'; // translate 리셋

    setTimeout(() => {
      if(sheetRef.current) sheetRef.current.style.transition = '';
    }, 300);

  }, [isDragging, currentSnapIndex, snapPoints, onClose, sheetRef, onSnapChange]);


  // 3. 드래그 시작 (Pointer Down)
  const handlePointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (!sheetRef.current || !isOpen) return;

    const currentTransform = sheetRef.current.style.transform;
    const currentY = currentTransform ? parseFloat(currentTransform.match(/translateY\(([^)]+)px/)?.[1] || '0') : 0;

    setIsDragging(true);

    // dragState Ref에 초기값 저장
    dragState.current = {
        startY: e.clientY,
        startSheetY: currentY,
        currentY: currentY,
    };

    // 드래그 중 transition 끄기
    sheetRef.current.style.transition = 'none';
    sheetRef.current.style.userSelect = 'none';

  }, [isOpen, sheetRef]);


  // 4. 전역 Listener 등록 및 해제 (마우스/손가락이 시트 밖으로 나가도 추적)
  useEffect(() => {
    if (isOpen) {
        document.addEventListener('pointermove', handlePointerMove);
        document.addEventListener('pointerup', handlePointerUp);
    }

    return () => {
        document.removeEventListener('pointermove', handlePointerMove);
        document.removeEventListener('pointerup', handlePointerUp);
    };
  }, [isOpen, handlePointerMove, handlePointerUp]);

  return {
    handlePointerDown,
    isDragging,
    currentSnapIndex,
    setSnapIndex: setCurrentSnapIndex
  };
}