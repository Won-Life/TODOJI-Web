"use client"

import React from 'react';

// 로딩 상태를 표시하는 스피너 컴포넌트
export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-background">
      {/* 1. 스피너 컨테이너 */}
      <div className="flex items-center justify-center space-x-2">
        {/* 2. 회전하는 원 (Tailwind CSS 애니메이션 사용) */}
        <div className="w-10 h-10 border-4 border-t-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        {/* 3. 로딩 텍스트 */}
        <p className="text-lg font-semibold text-foreground">
          잠시만 기다려주세요...
        </p>
      </div>
      {/* 4. [선택 사항] 로딩 중 스켈레톤 UI를 여기에 추가할 수도 있습니다. */}
    </div>
  );
}