import React, { useCallback, useRef } from 'react';
import { useDragToSnap } from '../hooks/useDragToSnap'; // 커스텀 훅 임포트

interface CustomBottomSheetProps {
  isOpen: boolean; // 시트 열림/닫힘 상태
  onClose: () => void; // 시트 닫기 콜백 함수
  children?: React.ReactNode; // 시트 내부에 들어갈 내용
  snapPoints?: number[]; // [선택 사항] 스냅 포인트 (높이 비율)
  initialSnap?: number; // [선택 사항] 초기 스냅 포인트 인덱스
}

export default function BottomSheet({
  isOpen,
  onClose,
  children,
  snapPoints = [0.04, 0.35, 1],
  initialSnap = 0,
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
  });

    const handleCloseButtonClick = useCallback(() => {
    if (!sheetRef.current) {
        onClose(); // ref가 없으면 즉시 닫기
        return;
    }

    // 1. 최소 스냅 포인트의 인덱스를 찾습니다.
    const minSnapValue = Math.min(...snapPoints);
    const minSnapIndex = snapPoints.findIndex(p => p === minSnapValue);

    // 2. 시트를 최소 스냅 포인트로 이동시킵니다.
    setSnapIndex(minSnapIndex); 
    
    // 3. CSS 애니메이션이 완료될 시간(300ms)을 기다린 후, 
    //    부모 컴포넌트의 onClose(isOpen=false)를 호출하여 시트를 완전히 닫습니다 (translate-y-full).
    setTimeout(() => {
        onClose();
    }, 300); // useDragToSnap의 transition duration과 맞춤
  }, [snapPoints, setSnapIndex, onClose]);
  
  // 최종 시트 높이 (스냅 포인트에 따라)
  const finalHeight = `${snapPoints[currentSnapIndex] * 100}vh`;

  // 시트 본체의 CSS 클래스
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
      {/* 배경 오버레이 (isOpen 상태에 따라 렌더링) */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 transition-opacity duration-300"
          onClick={onClose}
        ></div>
      )}

      {/* 바텀 시트 본체 */}
      <div
        ref={sheetRef}
        className={sheetClasses}
        style={{ height: finalHeight }}
      >
        {/* 헤더 (드래그 시작점) */}
        <div
          className="flex justify-center p-3 border-b border-border cursor-grab touch-none"
          onPointerDown={handlePointerDown} // ✨ 훅에서 받은 핸들러 연결
        >
          <div className="w-10 h-1 bg-muted rounded-full" />
          <button
            onClick={handleCloseButtonClick}
            className="absolute right-4 top-2 text-muted-foreground hover:text-foreground"
          >
            &times;
          </button>
        </div>

        {/* 컨텐츠 영역 및 스냅 조작 버튼 (기존과 동일) */}
        <div className="flex-grow overflow-y-auto p-4">
          {children}
        </div>

        {snapPoints.length > 1 && (
          <div className="flex justify-around p-2 border-t border-border">
            {snapPoints.map((_, index) => (
              <button
                key={index}
                onClick={() => setSnapIndex(index)} // ✨ 훅에서 받은 setSnapIndex 사용
                className={`px-3 py-1 rounded-md text-sm ${
                  currentSnapIndex === index
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-secondary-foreground hover:bg-muted'
                }`}
              >
                {index === snapPoints.length - 1 ? 'Full' : `${snapPoints[index] * 100}%`}
              </button>
            ))}
          </div>
        )}
      </div>
    </>
  );
}