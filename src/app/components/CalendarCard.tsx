import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface ColorData {
  [key: string]: string;
}

const CalendarCard: React.FC = () => {
  const [isMonthView, setIsMonthView] = useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  // 샘플 데이터 - 실제로는 props나 API로 받아올 데이터
  const colorData: ColorData = {
    '2025-09-02': '#10b981',
    '2025-09-03': '#10b981',
    '2025-09-04': '#10b981',
    '2025-09-06': '#10b981',
    '2025-09-07': '#10b981',
    '2025-09-09': '#10b981',
    '2025-10-01': '#10b981',
    '2025-10-03': '#10b981',
    '2025-10-05': '#10b981',
    '2025-10-08': '#10b981',
    '2025-10-10': '#10b981',
  };

  // 날짜를 YYYY-MM-DD 형식으로 변환
  const formatDateKey = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // 해당 주의 월요일 구하기
  const getMonday = (date: Date): Date => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(d.setDate(diff));
  };

  // 주차 계산 (해당 월의 1일 기준)
  const getWeekOfMonth = (date: Date): number => {
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    const firstMonday = getMonday(firstDay);
    const currentMonday = getMonday(date);

    const diffTime = currentMonday.getTime() - firstMonday.getTime();
    const diffWeeks = Math.floor(diffTime / (7 * 24 * 60 * 60 * 1000));

    return diffWeeks + 1;
  };

  // 주차 뷰 - 7일 (월~일)
  const getWeekDates = (): Date[] => {
    const monday = getMonday(selectedDate);
    const dates: Date[] = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(monday);
      date.setDate(monday.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  // 월간 뷰 - 한 달의 모든 날짜 (이전/다음 달 포함)
  const getMonthDates = (): Date[] => {
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    const firstMonday = getMonday(firstDay);
    const dates: Date[] = [];

    const currentDate = new Date(firstMonday);

    // 6주 표시 (최대)
    for (let week = 0; week < 6; week++) {
      for (let day = 0; day < 7; day++) {
        dates.push(new Date(currentDate));
        currentDate.setDate(currentDate.getDate() + 1);
      }
      // 마지막 날을 넘어갔으면 중단
      if (currentDate > lastDay && currentDate.getDay() === 1) break;
    }

    return dates;
  };

  const dates: Date[] = isMonthView ? getMonthDates() : getWeekDates();
  const weekDays: string[] = ['월', '화', '수', '목', '금', '토', '일'];

  // 헤더 텍스트
  const getHeaderText = (): string => {
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth() + 1;
    const week = getWeekOfMonth(selectedDate);
    return `${year}년 ${month}월 ${week}주차`;
  };

  return (
    <div className="flex-col gap-y-15">
      <div className="flex justify-between items-center mb-2 pl-2">
        <h2 className="text-lg font-bold">{getHeaderText()}</h2>
        <button
          onClick={() => setIsMonthView(!isMonthView)}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          {isMonthView ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>
      </div>

      {/* 요일 헤더 */}
      <div className={`max-w-md mx-auto px-2 grid ${isMonthView ? 'grid-cols-7' : 'grid-cols-7'} gap-2 mb-1`}>
        {weekDays.map((day) => (
          <div key={day} className="text-center text-xs text-gray-800 font-medium">
            {day}
          </div>
        ))}
      </div>

      <div className="max-w-md mx-auto px-2 py-3 bg-white rounded-xl shadow-lg">
        {/* 날짜 그리드 */}
        <div className={`grid ${isMonthView ? 'grid-cols-7' : 'grid-cols-7'} gap-2`}>
          {dates.map((date, index) => {
            const dateKey = formatDateKey(date);
            const color = colorData[dateKey];
            const isCurrentMonth = date.getMonth() === selectedDate.getMonth();

            return (
              <div key={index} className="flex flex-col items-center">
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center mb-1 border-2"
                  style={{
                    backgroundColor: color || 'transparent',
                    borderColor: color || '#e5e7eb',
                  }}
                />
                <div
                  className={`text-xs ${
                    isCurrentMonth ? 'text-gray-900' : 'text-gray-400'
                  }`}
                >
                  {date.getDate()}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CalendarCard;