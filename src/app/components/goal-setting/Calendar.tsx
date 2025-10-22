'use client'
import React, { FC, useState } from 'react';

interface CalendarProps {
  onDateSelect: (date: Date) => void;
}

export default function Calendar({ onDateSelect }: CalendarProps) {
    const today = new Date();
    const [currentMonth, setCurrentMonth] = useState(new Date(today.getFullYear(), today.getMonth(), 1));

    const renderDays = () => {
        const month = currentMonth.getMonth();
        const year = currentMonth.getFullYear();
        const firstDayOfMonth = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        const blanks = Array(firstDayOfMonth).fill(null);
        const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

        return [...blanks, ...days].map((day, index) => (
            <div key={index} className="w-1/7 text-center p-2">
                {day && (
                    <button
                        onClick={() => onDateSelect(new Date(year, month, day))}
                        className="w-8 h-8 rounded-full hover:bg-gray-200"
                    >
                        {day}
                    </button>
                )}
            </div>
        ));
    };

    const prevMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
    }

    const nextMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
    }

    return (
      <div className="p-4 border rounded-md mt-2">
        <div className="flex justify-between items-center mb-2">
          <button onClick={prevMonth}>&lt;</button>
          <div className="font-bold">{currentMonth.getFullYear()}년 {currentMonth.getMonth() + 1}월</div>
          <button onClick={nextMonth}>&gt;</button>
        </div>
        <div className="grid grid-cols-7 text-xs text-center text-gray-500">
          <div>일</div><div>월</div><div>화</div><div>수</div><div>목</div><div>금</div><div>토</div>
        </div>
        <div className="grid grid-cols-7">
          {renderDays()}
        </div>
      </div>
    );
}
