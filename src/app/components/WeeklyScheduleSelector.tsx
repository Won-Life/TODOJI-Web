import React, { useState, useEffect } from 'react';
import ArchIndicator from './ArchIndicator';

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
      <div className="flex justify-between gap-2 px-4 pt-2">
        {days.map((day) => (
          <button
            key={day}
            onClick={() => toggleDay(day)}
            className="flex flex-col items-center transition-colors"
          >
            <ArchIndicator isActive={isSelected(day)} width={20} height={20} />

            {/* 요일 텍스트 */}
            <span className="text-xs font-semibold text-gray-700">{day}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default WeeklyScheduleSelector;