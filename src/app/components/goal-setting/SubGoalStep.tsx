'use client'
import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { AiOutlineQuestionCircle } from 'react-icons/ai';
import DeadlineSection from './DeadlineSection';
import WeeklyScheduleSelector from '../WeeklyScheduleSelector';
import { SubGoalData, DeadlineData, ActionItem } from '../../types/goal-setting';

interface SubGoalStepProps {
  stepNumber: number;
  subGoal: SubGoalData;
  onChange: (data: Partial<SubGoalData>) => void;
  editMode?: boolean;
}

export default function SubGoalStep({ stepNumber, subGoal, onChange, editMode = false }: SubGoalStepProps) {
  const { title, deadline, criteriaType, countValue, actions } = subGoal;

  const [openScheduleIds, setOpenScheduleIds] = useState<Set<number>>(new Set());
  const [focusId, setFocusId] = useState<number | null>(null);
  const inputRefs = useRef<{ [key: number]: HTMLInputElement | null }>({});
  const [showTooltip, setShowTooltip] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const iconRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        tooltipRef.current &&
        !tooltipRef.current.contains(target) &&
        iconRef.current &&
        !iconRef.current.contains(target)
      ) {
        setShowTooltip(false);
      }
    };

    if (showTooltip) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showTooltip]);

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
    <div className="flex items-center justify-between mt-5 mb-2 px-1">
      <h3 className="text-lg font-bold">세부목표 {stepNumber}</h3>
      {editMode && (
        <button
          className="px-3 py-1 text-xs text-white rounded-sm"
          style={{ backgroundColor: 'var(--main-color)' }}
        >
          달성
        </button>
      )}
    </div>
    <div className="w-full text-left space-y-2">
      <input
        type="text"
        value={title}
        onChange={(e) => onChange({ title: e.target.value })}
        placeholder={`세부목표를 입력하세요. (15자 이내)`}
        className="w-full shadow-even rounded-md p-3 text-sm placeholder-gray-400 focus:outline-none"
      />
      <DeadlineSection
        deadline={deadline}
        onChange={(deadline: DeadlineData) => onChange({ deadline })}
        hasCheckbox={true}
      />
      <div className="shadow-even rounded-md p-3">
        <div className="flex items-center justify-between">
          <label className="text-sm font-bold">목표 달성 기준</label>
          <div className="relative" ref={iconRef}>
            <AiOutlineQuestionCircle
              className={`h-4 w-4 cursor-pointer transition-colors ${
                showTooltip ? 'text-[var(--main-color)]' : 'text-gray-400'
              }`}
              onClick={() => setShowTooltip(!showTooltip)}
            />
            {showTooltip && (
              <div
                ref={tooltipRef}
                className="absolute right-0 top-6 w-[70vw] bg-white shadow-lg rounded-md p-3 text-xs text-gray-700 z-50 border border-gray-200 break-keep"
              >
                <div className="mb-3">
                  <strong>스스로 체크하기</strong>
                  <br />
                  대시보드 화면에서 박스를 체크해,
                  <br />
                  스스로 세부목표 달성 여부를 정할 수 있습니다.
                </div>
                <div>
                  <strong>n회 이상 수행</strong>
                  <br />
                  직접 입력한 횟수만큼 세부목표를 달성하면,
                  <br />
                  자동으로 세부목표가 달성 처리됩니다.
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="mt-2 flex bg-gray-100 rounded-md p-1 text-xs">
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
      <p className="text-lg font-bold mt-3 mb-2 pl-1">행동목표</p>
      <div className="shadow-even rounded-md p-3">
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
