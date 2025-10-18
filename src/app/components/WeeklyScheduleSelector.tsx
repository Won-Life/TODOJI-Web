import React, { useState, useEffect } from 'react';

type DayOfWeek = '월' | '화' | '수' | '목' | '금' | '토' | '일';

interface WeeklyScheduleSelectorProps {
  selectedDays?: string[];
  onDaysChange?: (days: string[]) => void;
}

const WeeklyScheduleSelector: React.FC<WeeklyScheduleSelectorProps> = ({
  selectedDays: externalSelectedDays = [],
  onDaysChange
}) => {
  const [selectedDays, setSelectedDays] = useState<Set<DayOfWeek>>(new Set(externalSelectedDays as DayOfWeek[]));

  const days: DayOfWeek[] = ['월', '화', '수', '목', '금', '토', '일'];

  useEffect(() => {
    setSelectedDays(new Set(externalSelectedDays as DayOfWeek[]));
  }, [externalSelectedDays]);

  const toggleDay = (day: DayOfWeek) => {
    const newSelectedDays = new Set(selectedDays);
    if (newSelectedDays.has(day)) {
      newSelectedDays.delete(day);
    } else {
      newSelectedDays.add(day);
    }
    setSelectedDays(newSelectedDays);

    // 부모 컴포넌트에 변경사항 전달
    if (onDaysChange) {
      onDaysChange(Array.from(newSelectedDays));
    }
  };

  const isSelected = (day: DayOfWeek): boolean => {
    return selectedDays.has(day);
  };

  return (
    <div className="w-full p-4 bg-white shadow-even rounded-md">
      <h3 className="text-sm font-medium mb-1">고정 요일 설정</h3>
      <div className="flex justify-between gap-2">
        {days.map((day) => (
          <button
            key={day}
            onClick={() => toggleDay(day)}
            className="flex flex-col items-center transition-colors"
          >
            {/* 둥근 사각형 아이콘 */}
            <div className="w-4 h-8 flex items-center justify-center">
              {/* 둥근 사각형 모양 (아치형) */}
              <svg
                width="20"
                height="17"
                viewBox="0 0 20 17"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="transition-colors"
              >
                <defs>
                  {/* Inner shadow filter */}
                  <filter id="innerShadow">
                    <feGaussianBlur in="SourceAlpha" stdDeviation="1" />
                    <feOffset dx="0" dy="1" result="offsetblur" />
                    <feFlood floodColor="rgba(0,0,0,0.2)" />
                    <feComposite in2="offsetblur" operator="in" />
                    <feMerge>
                      <feMergeNode />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>
                
                {/* 외곽 테두리 (검정) */}
                <path
                  d="M6 8C6 4.68629 8.68629 2 12 2C15.3137 2 18 4.68629 18 8V21C18 21.5523 17.5523 22 17 22H7C6.44772 22 6 21.5523 6 21V8Z"
                  stroke="black"
                  strokeWidth="2"
                  fill="white"
                />
                
                {/* 내부 색상 (padding 효과를 위해 작은 path) */}
                <path
                  d="M8 8.5C8 5.73858 10.2386 3.5 13 3.5C15.7614 3.5 18 5.73858 18 8.5V20C18 20.5523 17.5523 21 17 21H9C8.44772 21 8 20.5523 8 20V8.5Z"
                  fill={isSelected(day) ? '#10b981' : 'white'}
                  filter={isSelected(day) ? 'url(#innerShadow)' : 'none'}
                />
              </svg>
            </div>
            
            {/* 요일 텍스트 */}
            <span className="text-xs text-gray-700">{day}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default WeeklyScheduleSelector;