import React from 'react';

interface ArchIndicatorProps {
  isActive: boolean;
  color?: string;
  width?: number;
  height?: number;
}

const ArchIndicator: React.FC<ArchIndicatorProps> = ({
  isActive,
  color = 'var(--main-color)',
  width = 25,
  height = 25,
}) => {
  return (
    <div
      className="relative mb-1"
      style={{ width: `${width}px`, height: `${height}px` }}
    >
      {/* 아치형 - 바깥 검정 테두리 */}
      <div className="absolute w-full h-full overflow-hidden">
        <div
          className="w-full h-full rounded-t-full border-2 border-black"
        />
      </div>

      {/* 내부 흰색 선 */}
      {isActive && (
        <div
          className="absolute w-full h-full overflow-hidden"
          style={{
            width: 'calc(100% - 4px)',
            height: 'calc(100% - 4px)',
            top: '2px',
            left: '2px',
          }}>
          <div
            className="w-full h-full rounded-t-full border-2 border-white"
            style={{
              boxShadow: 'inset 2px 2px 4px rgba(0, 0, 0, 0.2)',
              backgroundColor: isActive ? color : 'transparent',
            }}
          />
        </div>
      )}
    </div>
  );
};

export default ArchIndicator;
