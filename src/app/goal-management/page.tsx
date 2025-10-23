'use client'

import { useState } from 'react';
import FinalGoalStep from '../components/goal-setting/FinalGoalStep';
import SubGoalStep from '../components/goal-setting/SubGoalStep';
import { FinalGoalData, SubGoalData } from '../types/goal-setting';

type Tab = 'final' | 'sub';

// Mock data
const mockFinalGoal: FinalGoalData = {
  title: '외국계 기업 취업',
  deadline: {
    type: 'date',
    startDate: new Date('2025-01-01'),
    endDate: new Date('2025-12-31'),
  }
};

const mockSubGoals: SubGoalData[] = [
  {
    title: '영어 실력 향상',
    deadline: {
      type: 'date',
      startDate: new Date('2025-01-01'),
      endDate: new Date('2025-06-30'),
      hasDeadline: true,
    },
    criteriaType: 'count',
    countValue: '50',
    actions: [
      { id: 1, text: '매일 영어 뉴스 읽기', selectedDays: ['월', '화', '수', '목', '금'] },
      { id: 2, text: '주 3회 영어 회화 연습', selectedDays: ['월', '수', '금'] },
    ]
  },
  {
    title: '포트폴리오 완성',
    deadline: {
      type: 'period',
      period: '3',
      hasDeadline: true,
    },
    criteriaType: 'self-check',
    actions: [
      { id: 1, text: '프로젝트 3개 완성하기', selectedDays: [] },
      { id: 2, text: 'GitHub 정리', selectedDays: ['토'] },
    ]
  },
  {
    title: '면접 준비',
    deadline: {
      type: 'date',
      startDate: new Date('2025-09-01'),
      endDate: new Date('2025-12-31'),
      hasDeadline: true,
    },
    criteriaType: 'count',
    countValue: '20',
    actions: [
      { id: 1, text: '모의 면접 연습', selectedDays: ['목'] },
      { id: 2, text: '자기소개서 작성', selectedDays: [] },
    ]
  }
];

export default function GoalManagementPage() {
  const [activeTab, setActiveTab] = useState<Tab>('final');
  const [finalGoal, setFinalGoal] = useState<FinalGoalData>(mockFinalGoal);
  const [subGoals, setSubGoals] = useState<SubGoalData[]>(mockSubGoals);

  const handleFinalGoalChange = (data: Partial<FinalGoalData>) => {
    setFinalGoal(prev => ({ ...prev, ...data }));
  };

  const handleSubGoalChange = (index: number, data: Partial<SubGoalData>) => {
    setSubGoals(prev => prev.map((goal, i) =>
      i === index ? { ...goal, ...data } : goal
    ));
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <main className="flex-col space-y-5 container mx-auto p-4 max-w-sm">
        <header className="flex items-center space-x-2 mb-4">
          <button
            onClick={() => setActiveTab('final')}
            className={`px-4 py-2 text-sm font-semibold rounded-lg shadow-sm transition-colors ${
              activeTab === 'final'
                ? 'text-white bg-green-500'
                : 'text-gray-700 bg-gray-200'
            }`}
          >
            최종목표
          </button>
          <button
            onClick={() => setActiveTab('sub')}
            className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${
              activeTab === 'sub'
                ? 'text-white bg-green-500'
                : 'text-gray-700 bg-gray-200'
            }`}
          >
            세부목표
          </button>
        </header>

        <section className="mt-8 space-y-8">
          {activeTab === 'final' && (
            <FinalGoalStep
              data={finalGoal}
              onChange={handleFinalGoalChange}
            />
          )}

          {activeTab === 'sub' && (
            <div className="space-y-6">
              {subGoals.map((subGoal, index) => (
                <SubGoalStep
                  key={index}
                  stepNumber={index + 1}
                  subGoal={subGoal}
                  onChange={(data) => handleSubGoalChange(index, data)}
                />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
