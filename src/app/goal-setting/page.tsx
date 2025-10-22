'use client'
import React, { useState } from 'react';
import FinalGoalStep from '../components/goal-setting/FinalGoalStep';
import SubGoalStep from '../components/goal-setting/SubGoalStep';
import VillageNameStep from '../components/goal-setting/VillageNameStep';
import { GoalSettingFormData, FinalGoalData, SubGoalData } from '../types/goal-setting';

// 각 단계의 UI 컴포넌트들
const STEPS = [
  { id: 1, title: '최종 목표' },
  { id: 2, title: '세부목표 1' },
  { id: 3, title: '세부목표 2' },
  { id: 4, title: '세부목표 3' },
  { id: 5, title: '마을 이름' },
];

const ProgressBar: React.FC<{ currentStep: number }> = ({ currentStep }) => {
  return (
    <div className="w-full relative">
      {/* 배경 선 (Line) - 전체 길이에 깔림 */}
      <div className="absolute top-1/2 left-0 right-0 h-[2px] transform -translate-y-1/2 bg-gray-300 mx-4">
        {/* 진행된 선 (Black Line) */}
        <div
          className="h-full bg-black transition-all duration-500"
          style={{
            width: `${((currentStep - 1) / (STEPS.length - 1)) * 100}%`,
          }}
        />
      </div>

      {/* 점(Dot)들과 텍스트(Label) 컨테이너 */}
      <div className="flex w-full items-center justify-between relative px-4">
        {STEPS.map((step, _) => (
          <div
            key={step.id}
            className="relative z-10 flex flex-col items-center"
          >
            {/* 1. 점 (Dot) - z-index로 선 위에 오게 함 */}
            <div
              className={`w-2 h-2 rounded-full ${
                currentStep >= step.id
                  ? 'bg-black transition-all delay-300 transition-colors duration-300'
                  : 'bg-gray-300'
              }`}
            />

            {/* 2. 텍스트 레이블 (점의 정중앙 아래에 위치) */}
            <p
              className={`
                absolute top-full mt-2
                text-[10px] whitespace-nowrap
                transform -translate-x-1/2 left-1/2
                ${
                  currentStep >= step.id
                    ? 'text-black font-semibold transition-all delay-300 transition-colors duration-300'
                    : 'text-gray-400'
                }
              `}
            >
              {step.title}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

// 메인 페이지
export default function GoalSettingPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<GoalSettingFormData>({
    finalGoal: {
      title: '',
      deadline: {
        type: 'date',
        startDate: new Date(),
        endDate: new Date(new Date().setDate(new Date().getDate() + 30)),
      }
    },
    subGoal1: {
      title: '',
      deadline: {
        type: 'date',
        startDate: new Date(),
        endDate: new Date(new Date().setDate(new Date().getDate() + 30)),
        hasDeadline: false,
      },
      criteriaType: 'self-check',
      actions: [
        { id: 1, text: '어학공부 하기', selectedDays: [] },
        { id: 2, text: '어학공부 하기', selectedDays: [] },
      ]
    },
    subGoal2: {
      title: '',
      deadline: {
        type: 'date',
        startDate: new Date(),
        endDate: new Date(new Date().setDate(new Date().getDate() + 30)),
        hasDeadline: false,
      },
      criteriaType: 'self-check',
      actions: [
        { id: 1, text: '어학공부 하기', selectedDays: [] },
        { id: 2, text: '어학공부 하기', selectedDays: [] },
      ]
    },
    subGoal3: {
      title: '',
      deadline: {
        type: 'date',
        startDate: new Date(),
        endDate: new Date(new Date().setDate(new Date().getDate() + 30)),
        hasDeadline: false,
      },
      criteriaType: 'self-check',
      actions: [
        { id: 1, text: '어학공부 하기', selectedDays: [] },
        { id: 2, text: '어학공부 하기', selectedDays: [] },
      ]
    },
    villageName: '',
  });

  const handleNext = () => {
    setCurrentStep((prev) => (prev < STEPS.length ? prev + 1 : prev));
  };

  const handleBack = () => {
      setCurrentStep((prev) => (prev > 1 ? prev - 1 : prev));
  }

  const handleComplete = async () => {
    console.log('Submitting goal data:', formData);

    // TODO: 서버에 데이터 전송
    // try {
    //   const response = await fetch('/api/goals', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify(formData),
    //   });
    //   if (response.ok) {
    //     // 성공 처리 (예: 홈으로 이동)
    //     router.push('/home');
    //   }
    // } catch (error) {
    //   console.error('Failed to save goal:', error);
    // }
  };

  const updateFinalGoal = (data: Partial<FinalGoalData>) => {
    setFormData(prev => ({
      ...prev,
      finalGoal: { ...prev.finalGoal, ...data }
    }));
  };

  const updateSubGoal = (goalNumber: 1 | 2 | 3, data: Partial<SubGoalData>) => {
    const goalKey = `subGoal${goalNumber}` as 'subGoal1' | 'subGoal2' | 'subGoal3';
    setFormData(prev => ({
      ...prev,
      [goalKey]: { ...prev[goalKey], ...data }
    }));
  };

  const updateVillageName = (name: string) => {
    setFormData(prev => ({ ...prev, villageName: name }));
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <FinalGoalStep
            data={formData.finalGoal}
            onChange={updateFinalGoal}
          />
        );
      case 2:
        return (
          <SubGoalStep
            key="subgoal-1"
            stepNumber={1}
            subGoal={formData.subGoal1}
            onChange={(data) => updateSubGoal(1, data)}
          />
        );
      case 3:
        return (
          <SubGoalStep
            key="subgoal-2"
            stepNumber={2}
            subGoal={formData.subGoal2}
            onChange={(data) => updateSubGoal(2, data)}
          />
        );
      case 4:
        return (
          <SubGoalStep
            key="subgoal-3"
            stepNumber={3}
            subGoal={formData.subGoal3}
            onChange={(data) => updateSubGoal(3, data)}
          />
        );
      case 5:
        return (
          <VillageNameStep
            value={formData.villageName}
            onChange={updateVillageName}
          />
        );
      default:
        return <div>완료!</div>;
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-black min-h-screen font-sans">
      <div className="bg-black text-white p-4 flex items-center">
        <button onClick={handleBack}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="mx-auto font-semibold">최초 목표 설정</h1>
      </div>

      <div className="bg-white p-6 min-h-screen flex-col pb-24">
        <ProgressBar currentStep={currentStep} />

        <div className="flex-grow mt-8">
          {renderStepContent()}
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 max-w-md p-4 pb-10 mx-auto">
        <button
          onClick={currentStep === STEPS.length ? handleComplete : handleNext}
          className="w-full py-3 bg-black text-white rounded-lg font-bold text-lg"
        >
          {currentStep === STEPS.length ? '완료' : '다음'}
        </button>
      </div>
    </div>
  );
}
