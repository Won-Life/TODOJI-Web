'use client'
import React, { useState } from 'react';
import Calendar from './Calendar';
import { DeadlineData } from '../../types/goal-setting';

const formatDate = (date: Date): string => {
  const year = date.getFullYear().toString().slice(2);
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const dayOfWeek = ['일', '월', '화', '수', '목', '금', '토'][date.getDay()];
  return `${year}/${month}/${day}(${dayOfWeek})`;
}

interface DeadlineSectionProps {
  deadline: DeadlineData;
  onChange: (deadline: DeadlineData) => void;
  hasCheckbox?: boolean;
}

export default function DeadlineSection({ deadline, onChange, hasCheckbox = false }: DeadlineSectionProps) {
  const { type: deadlineType, startDate, endDate, period, hasDeadline } = deadline;

  // UI-only state for calendar expansion (not synced to parent)
  const [isCalendarOpen, setIsCalendarOpen] = useState<'start' | 'end' | null>(null);
  const [dateError, setDateError] = useState<string>('');

  const handleStartDateClick = () => {
    setIsCalendarOpen(isCalendarOpen === 'start' ? null : 'start');
    setDateError('');
  };

  const handleEndDateClick = () => {
    setIsCalendarOpen(isCalendarOpen === 'end' ? null : 'end');
    setDateError('');
  };

  const handleDateSelect = (date: Date) => {
    if (isCalendarOpen === 'start') {
      // Check if new start date is after end date
      if (endDate && date > endDate) {
        setDateError('시작일은 종료일보다 이전이어야 합니다.');
        return;
      }
      setDateError('');
      onChange({ ...deadline, startDate: date });
      setIsCalendarOpen(null);
    } else if (isCalendarOpen === 'end') {
      // Check if new end date is before start date
      if (startDate && date < startDate) {
        setDateError('종료일은 시작일보다 이후여야 합니다.');
        return;
      }
      setDateError('');
      onChange({ ...deadline, endDate: date });
      setIsCalendarOpen(null);
    }
  }

  const showDateSection = hasCheckbox ? hasDeadline : true;

  return (
    <div className="w-full shadow-even rounded-md p-3">
      <div className="flex items-center justify-between">
        <p className="font-bold text-left">마감 기한</p>
        {hasCheckbox && (
          <input
            type="checkbox"
            checked={hasDeadline || false}
            onChange={(e) => onChange({ ...deadline, hasDeadline: e.target.checked })}
            className="form-checkbox h-5 w-5 text-black rounded focus:ring-black"
          />
        )}
      </div>

      {showDateSection && (
        <div className="flex-col bg-white shadow-even rounded-md mt-2">
          <div className="flex bg-gray-100 rounded-md text-sm p-1">
            <button
              onClick={() => {
                onChange({ ...deadline, type: 'date' });
                setIsCalendarOpen(null);
              }}
              className={`flex-1 p-2 rounded-md font-semibold transition-all ${deadlineType === 'date' ? 'bg-white shadow' : 'bg-transparent text-gray-500'}`}>
              날짜
            </button>
            <button
              onClick={() => {
                onChange({ ...deadline, type: 'period' });
                setIsCalendarOpen(null);
              }}
              className={`flex-1 p-2 rounded-md font-semibold transition-all ${deadlineType === 'period' ? 'bg-white shadow' : 'bg-transparent text-gray-500'}`}>
              기간
            </button>
          </div>

          {deadlineType === 'date' ? (
            <div>
              <div className="flex items-center justify-between p-3">
                <span
                  onClick={handleStartDateClick}
                  className={`cursor-pointer ${isCalendarOpen === 'start' ? 'text-red-500' : ''}`}>
                  {startDate ? formatDate(startDate) : '시작일'}
                </span>
                <span>→</span>
                <span
                  onClick={handleEndDateClick}
                  className={`cursor-pointer ${isCalendarOpen === 'end' ? 'text-red-500' : ''}`}>
                  {endDate ? formatDate(endDate) : '종료일'}
                </span>
              </div>
              {dateError && (
                <div className="px-3 pb-2 text-xs text-red-500">
                  {dateError}
                </div>
              )}
              {isCalendarOpen && <Calendar onDateSelect={handleDateSelect} />}
            </div>
          ) : (
            <div className="relative w-full">
              <input
                type="number"
                value={period || ''}
                onChange={(e) => onChange({ ...deadline, period: e.target.value })}
                placeholder="ex. 100"
                className="w-full p-3 text-sm placeholder-gray-400 text-right pr-12"
                />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">일</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
