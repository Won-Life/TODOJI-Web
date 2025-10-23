'use client'
import React from 'react';
import DeadlineSection from './DeadlineSection';
import { FinalGoalData, DeadlineData } from '../../types/goal-setting';

interface FinalGoalStepProps {
  data: FinalGoalData;
  onChange: (data: Partial<FinalGoalData>) => void;
}

export default function FinalGoalStep({ data, onChange }: FinalGoalStepProps) {
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ title: e.target.value });
  };

  const handleDeadlineChange = (deadline: DeadlineData) => {
    onChange({ deadline });
  };

  return (
    <>
      <h2 className="text-2xl font-bold mb-6">나의 최종목표는?</h2>
      <div className="flex-col bg-white shadow-even-md rounded-md mb-6">
        <div className="w-full h-40 rounded-md  flex items-center justify-center" >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <input
          type="text"
          value={data.title}
          onChange={handleTitleChange}
          placeholder="최종 목표를 입력하세요. (ex. 외국계 기업 취업)"
          className="w-full bg-gray-100 rounded-md p-3 text-sm placeholder-gray-400 focus:outline-none"
        />
      </div>
      <DeadlineSection
        deadline={data.deadline}
        onChange={handleDeadlineChange}
      />
    </>
  );
}
