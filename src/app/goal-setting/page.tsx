'use client'
import React, { useState, FC, useRef, useEffect } from 'react';
import Image from 'next/image';
import WeeklyScheduleSelector from '../components/WeeklyScheduleSelector';

// 각 단계의 UI 컴포넌트들
const STEPS = [
  { id: 1, title: '최종 목표' },
  { id: 2, title: '세부목표 1' },
  { id: 3, title: '세부목표 2' },
  { id: 4, title: '세부목표 3' },
  { id: 5, title: '마을 이름' },
];

const formatDate = (date: Date): string => {
  const year = date.getFullYear().toString().slice(2);
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const dayOfWeek = ['일', '월', '화', '수', '목', '금', '토'][date.getDay()];
  return `${year}/${month}/${day}(${dayOfWeek})`;
}

const ProgressBar: FC<{ currentStep: number }> = ({ currentStep }) => {
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

const Calendar: FC<{ onDateSelect: (date: Date) => void }> = ({ onDateSelect }) => {
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
};

const DeadlineSection: FC<{ hasCheckbox?: boolean }> = ({ hasCheckbox = false }) => {
  const [deadlineType, setDeadlineType] = useState<'date' | 'period'>('date');
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date(new Date().setDate(new Date().getDate() + 30)));
  const [period, setPeriod] = useState<string>('100');
  const [isChecked, setIsChecked] = useState(false);

  const handleDateSelect = (date: Date) => {
    // Simple range selection logic
    if (!startDate || (startDate && endDate)) {
      setStartDate(date);
      setEndDate(null as any);
    } else {
      if (date < startDate) {
        setEndDate(startDate);
        setStartDate(date);
      } else {
        setEndDate(date);
      }
    }
  }

  const showDateSection = hasCheckbox ? isChecked : true;

  return (
    <div className="w-full shadow-even rounded-md p-3">
      <div className="flex items-center justify-between">
        <p className="font-bold text-left">마감 기한</p>
        {hasCheckbox && (
          <input
            type="checkbox"
            checked={isChecked}
            onChange={(e) => setIsChecked(e.target.checked)}
            className="form-checkbox h-5 w-5 text-black rounded focus:ring-black"
          />
        )}
      </div>

      {showDateSection && (
        <div className="flex-col bg-white shadow-even rounded-md mt-2">
          <div className="flex bg-gray-100 rounded-md text-sm p-1">
            <button
              onClick={() => { setDeadlineType('date'); setIsCalendarOpen(false); }}
              className={`flex-1 p-2 rounded-md font-semibold transition-all ${deadlineType === 'date' ? 'bg-white shadow' : 'bg-transparent text-gray-500'}`}>
              날짜
            </button>
            <button
              onClick={() => { setDeadlineType('period'); setIsCalendarOpen(false); }}
              className={`flex-1 p-2 rounded-md font-semibold transition-all ${deadlineType === 'period' ? 'bg-white shadow' : 'bg-transparent text-gray-500'}`}>
              기간
            </button>
          </div>

          {deadlineType === 'date' ? (
            <div>
              <div
                onClick={() => setIsCalendarOpen(!isCalendarOpen)}
                className="flex items-center justify-between p-3 cursor-pointer">
                <span className={isCalendarOpen ? 'text-red-500' : ''}>{startDate ? formatDate(startDate) : '시작일'}</span>
                <span>→</span>
                <span>{endDate ? formatDate(endDate) : '종료일'}</span>
              </div>
              {isCalendarOpen && <Calendar onDateSelect={handleDateSelect} />}
            </div>
          ) : (
            <div className="relative w-full">
              <input
                type="number"
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
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
};

// 최종 목표 설정 페이지
const FinalGoalStep = () => {
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
        placeholder="최종 목표를 입력하세요. (ex. 외국계 기업 취업)"
        className="w-full bg-gray-100 rounded-md p-3 text-sm placeholder-gray-400"
      />
    </div>
    <DeadlineSection />
  </>
);}

// 마을 이름 설정 페이지
const VillageNameStep = () => (
  <>
    <h2 className="flex-1 text-2xl font-bold mb-6">마을 이름</h2>
    <div className="relative w-full">
      <input
        type="text"
        placeholder="마을 이름을 입력해주세요."
        className="w-full bg-gray-100 rounded-md p-3 text-sm placeholder-gray-400"
      />
      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">마을</span>
    </div>
  </>
);

// 세부 목표 설정 페이지
const SubGoalStep: FC<{ stepNumber: number }> = ({ stepNumber }) => {
  const [criteriaType, setCriteriaType] = useState<'self-check' | 'count'>('self-check');
  const [countValue, setCountValue] = useState<string>('');
  const [actions, setActions] = useState([
    { id: 1, text: '어학공부 하기', hasSchedule: false, isScheduleOpen: false, selectedDays: [] as string[] },
    { id: 2, text: '어학공부 하기', hasSchedule: false, isScheduleOpen: false, selectedDays: [] as string[] },
  ]);
  const [focusId, setFocusId] = useState<number | null>(null);
  const inputRefs = useRef<{ [key: number]: HTMLInputElement | null }>({});

  const toggleSchedule = (id: number) => {
    setActions(actions.map(action => {
      if (action.id === id) {
        const willClose = action.isScheduleOpen;
        // 닫을 때 선택된 요일이 있는지 확인
        const hasSelectedDays = action.selectedDays.length > 0;
        return {
          ...action,
          isScheduleOpen: !action.isScheduleOpen,
          hasSchedule: willClose ? hasSelectedDays : action.hasSchedule
        };
      }
      return action;
    }));
  };

  const updateSelectedDays = (id: number, days: string[]) => {
    setActions(actions.map(action =>
      action.id === id ? { ...action, selectedDays: days } : action
    ));
  };

  const addNewAction = () => {
    const newId = actions.length > 0 ? Math.max(...actions.map(a => a.id)) + 1 : 1;
    setActions([...actions, { id: newId, text: '', hasSchedule: false, isScheduleOpen: false, selectedDays: [] as string[] }]);
    setFocusId(newId);
  };

  useEffect(() => {
    if (focusId !== null && inputRefs.current[focusId]) {
      inputRefs.current[focusId]?.focus();
      setFocusId(null);
    }
  }, [focusId, actions]);

  const updateActionText = (id: number, text: string) => {
    setActions(actions.map(action =>
      action.id === id ? { ...action, text } : action
    ));
  };

  const handleActionBlur = (id: number, text: string) => {
    if (text.trim() === '') {
      setActions(actions.filter(action => action.id !== id));
    }
  };

  return (
    <>
    <h2 className="text-2xl font-bold">세부목표와 행동</h2>
    <h3 className="text-lg font-semibold text-gray-600 mb-6">세부목표 {stepNumber}</h3>
    <div className="w-full text-left space-y-4">
      <input
        type="text"
        placeholder={`세부목표를 입력하세요. (15자 이내)`}
        className="w-full bg-gray-100 rounded-md p-3 text-sm placeholder-gray-400"
      />
      <DeadlineSection hasCheckbox={true} />
      <div className="border border-gray-200 rounded-md p-3">
        <div className="flex items-center justify-between">
          <label className="text-sm font-bold">목표 달성 기준</label>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div className="mt-2 flex bg-gray-100 rounded-md p-1 text-sm">
          <button
            onClick={() => setCriteriaType('self-check')}
            className={`flex-1 rounded-md p-2 font-semibold transition-all ${
              criteriaType === 'self-check'
                ? 'bg-white shadow'
                : 'bg-transparent text-gray-500'
            }`}
          >
            스스로 체크하기
          </button>
          <button
            onClick={() => setCriteriaType('count')}
            className={`flex-1 rounded-md p-2 transition-all relative ${
              criteriaType === 'count'
                ? 'bg-white shadow font-semibold'
                : 'bg-transparent text-gray-500'
            }`}
          >
            <input
              type="number"
              value={countValue}
              onChange={(e) => setCountValue(e.target.value)}
              onClick={(e) => {
                e.stopPropagation();
                setCriteriaType('count');
              }}
              className={`inline-block w-8 text-center bg-transparent border-b-2 mr-2 ${
                criteriaType === 'count' ? 'border-black' : 'border-gray-400'
              } focus:outline-none`}
            />
            회 이상 수행
          </button>
        </div>
      </div>
      <div className="border border-gray-200 rounded-md p-3">
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
                      src={action.hasSchedule || action.isScheduleOpen ? '/assets/repeat-active.png' : '/assets/repeat.png'}
                      alt="repeat"
                      width={13}
                      height={13}
                    />
                  </button>
                </div>
              </div>
              {action.isScheduleOpen && (
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
            className="w-1/2 mx-auto text-center text-xs text-white mt-2 py-2 rounded-md block"
            style={{ backgroundColor: 'var(--main-color)' }}
          >
            + 새 행동목표 추가
          </button>
        </div>
      </div>
    </div>
    </>
  );
};


// 메인 페이지
export default function GoalSettingPage() {
  const [currentStep, setCurrentStep] = useState(1);

  const handleNext = () => {
    setCurrentStep((prev) => (prev < STEPS.length ? prev + 1 : prev));
  };

  const handleBack = () => {
      setCurrentStep((prev) => (prev > 1 ? prev - 1 : prev));
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <FinalGoalStep />;
      case 2:
        return <SubGoalStep stepNumber={1} />;
      case 3:
        return <SubGoalStep stepNumber={2} />;
      case 4:
        return <SubGoalStep stepNumber={3} />;
      case 5:
        return <VillageNameStep />;
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

      <div className="bg-white p-6 h-full flex flex-col">
        <ProgressBar currentStep={currentStep} />

        <div className="flex-grow mt-8">
          {renderStepContent()}
        </div>

        <button
          onClick={handleNext}
          className="w-full py-3 mt-8 bg-black text-white rounded-lg font-bold text-lg"
        >
          {currentStep === STEPS.length ? '완료' : '다음'}
        </button>
      </div>
    </div>
  );
}

