'use client'
import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import DeadlineSection from './DeadlineSection';
import WeeklyScheduleSelector from '../WeeklyScheduleSelector';
import { SubGoalData, DeadlineData, ActionItem } from '../../types/goal-setting';

interface SubGoalStepProps {
  stepNumber: number;
  subGoal: SubGoalData;
  onChange: (data: Partial<SubGoalData>) => void;
}

export default function SubGoalStep({ stepNumber, subGoal, onChange }: SubGoalStepProps) {
  const { title, deadline, criteriaType, countValue, actions } = subGoal;

  // UI-only state for schedule expansion (not synced to parent)
  const [openScheduleIds, setOpenScheduleIds] = useState<Set<number>>(new Set());
  const [focusId, setFocusId] = useState<number | null>(null);
  const inputRefs = useRef<{ [key: number]: HTMLInputElement | null }>({});

  const toggleSchedule = (id: number) => {
    const newOpenIds = new Set(openScheduleIds);
    if (openScheduleIds.has(id)) {
      newOpenIds.delete(id);
    } else {
      newOpenIds.add(id);
    }
    setOpenScheduleIds(newOpenIds);
  };

  const updateSelectedDays = (id: number, days: string[]) => {
    onChange({
      actions: actions.map(a =>
        a.id === id ? { ...a, selectedDays: days } : a
      )
    });
  };

  const addNewAction = () => {
    const newId = actions.length > 0 ? Math.max(...actions.map(a => a.id)) + 1 : 1;
    const newAction: ActionItem = { id: newId, text: '', selectedDays: [] };
    onChange({ actions: [...actions, newAction] });
    setFocusId(newId);
  };

  useEffect(() => {
    if (focusId !== null && inputRefs.current[focusId]) {
      inputRefs.current[focusId]?.focus();
      setFocusId(null);
    }
  }, [focusId, actions]);

  const updateActionText = (id: number, text: string) => {
    onChange({
      actions: actions.map(a =>
        a.id === id ? { ...a, text } : a
      )
    });
  };

  const handleActionBlur = (id: number, text: string) => {
    if (text.trim() === '') {
      onChange({ actions: actions.filter(a => a.id !== id) });
    }
  };

  return (
    <>
    <h2 className="text-2xl font-bold">세부목표와 행동</h2>
    <h3 className="text-lg font-semibold text-gray-600 mb-6">세부목표 {stepNumber}</h3>
    <div className="w-full text-left space-y-4">
      <input
        type="text"
        value={title}
        onChange={(e) => onChange({ title: e.target.value })}
        placeholder={`세부목표를 입력하세요. (15자 이내)`}
        className="w-full shadow-even bg-gray-100 rounded-md p-3 text-sm placeholder-gray-400 focus:outline-none"
      />
      <DeadlineSection
        deadline={deadline}
        onChange={(deadline: DeadlineData) => onChange({ deadline })}
        hasCheckbox={true}
      />
      <div className="shadow-even rounded-md p-3">
        <div className="flex items-center justify-between">
          <label className="text-sm font-bold">목표 달성 기준</label>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div className="mt-2 flex bg-gray-100 rounded-md p-1 text-sm">
          <button
            onClick={() => onChange({ criteriaType: 'self-check' })}
            className={`flex-1 rounded-md p-2 font-semibold transition-all ${
              criteriaType === 'self-check'
                ? 'bg-white shadow'
                : 'bg-transparent text-gray-500'
            }`}
          >
            스스로 체크하기
          </button>
          <button
            onClick={() => onChange({ criteriaType: 'count' })}
            className={`flex-1 rounded-md p-2 transition-all relative ${
              criteriaType === 'count'
                ? 'bg-white shadow font-semibold'
                : 'bg-transparent text-gray-500'
            }`}
          >
            <input
              type="number"
              value={countValue || ''}
              onChange={(e) => onChange({ countValue: e.target.value })}
              onClick={(e) => {
                e.stopPropagation();
                onChange({ criteriaType: 'count' });
              }}
              className={`inline-block w-8 text-center bg-transparent border-b-2 mr-2 ${
                criteriaType === 'count' ? 'border-black' : 'border-gray-400'
              } focus:outline-none`}
            />
            회 이상 수행
          </button>
        </div>
      </div>
      <div className="shadow-even rounded-md p-3">
        <p className="text-sm font-bold mb-2">행동목표</p>
        <div className="space-y-2 text-sm">
          {actions.map((action, index) => (
            <div key={action.id}>
              <div className="flex items-center gap-2">
                <span className="font-bold w-4">{index + 1}.</span>
                <div className="flex items-center justify-between flex-1 border-b border-gray-300 pb-1 px-1">
                  <input
                    ref={(el) => { inputRefs.current[action.id] = el; }}
                    type="text"
                    value={action.text}
                    onChange={(e) => updateActionText(action.id, e.target.value)}
                    onBlur={(e) => handleActionBlur(action.id, e.target.value)}
                    placeholder="행동 목표를 입력하세요"
                    className={`text-xs bg-transparent outline-none flex-1 ${action.text ? '' : 'placeholder-gray-300'}`}
                  />
                  <button onClick={() => toggleSchedule(action.id)}>
                    <Image
                      src={action.selectedDays.length > 0 || openScheduleIds.has(action.id) ? '/assets/repeat-active.png' : '/assets/repeat.png'}
                      alt="repeat"
                      width={13}
                      height={13}
                    />
                  </button>
                </div>
              </div>
              {openScheduleIds.has(action.id) && (
                <div className="mt-2">
                  <WeeklyScheduleSelector
                    selectedDays={action.selectedDays}
                    onDaysChange={(days) => updateSelectedDays(action.id, days)}
                  />
                </div>
              )}
            </div>
          ))}
          <button
            onClick={addNewAction}
            className="shadow-even w-1/2 mx-auto text-center text-sm text-white mt-4 py-2 rounded-md block"
            style={{ backgroundColor: 'var(--main-color)' }}
          >
            + 새 행동목표 생성
          </button>
        </div>
      </div>
    </div>
    </>
  );
}
