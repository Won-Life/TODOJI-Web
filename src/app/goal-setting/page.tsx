'use client'
import React, { useState, FC } from 'react';

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

// 최종 목표 설정 페이지
const FinalGoalStep = () => {
  const [deadlineType, setDeadlineType] = useState<'date' | 'period'>('date');
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date(new Date().setDate(new Date().getDate() + 30)));
  const [period, setPeriod] = useState<string>('100');

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

  return (
    <>
      <h2 className="text-2xl font-bold mb-6">나의 최종목표는?</h2>
      <div className="w-full h-40 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>
      <input
        type="text"
        placeholder="최종 목표를 입력하세요. (ex. 외국계 기업 취업)"
        className="w-full bg-gray-100 rounded-md p-3 text-sm placeholder-gray-400 mb-6"
      />
      <div className="w-full">
        <p className="font-bold mb-2 text-left">마감 기한</p>
        <div className="flex bg-gray-100 rounded-md p-1 text-sm mb-2">
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
              className="flex items-center justify-between bg-gray-100 rounded-md p-3 cursor-pointer">
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
              className="w-full bg-gray-100 rounded-md p-3 text-sm placeholder-gray-400 text-right pr-12"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">일</span>
          </div>
        )}
      </div>
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
const SubGoalStep: FC<{ stepNumber: number }> = ({ stepNumber }) => (
  <>
    <h2 className="text-2xl font-bold">세부목표와 행동</h2>
    <h3 className="text-lg font-semibold text-gray-600 mb-6">세부목표 {stepNumber}</h3>
    <div className="w-full text-left space-y-4">
      <input
        type="text"
        placeholder={`세부목표를 입력하세요. (15자 이내)`}
        className="w-full bg-gray-100 rounded-md p-3 text-sm placeholder-gray-400"
      />
      <div className="flex items-center justify-between p-3 border border-gray-200 rounded-md">
        <label htmlFor="period-check" className="text-sm">마감 기한</label>
        <input type="checkbox" id="period-check" className="form-checkbox h-5 w-5 text-black rounded focus:ring-black" />
      </div>
      <div className="border border-gray-200 rounded-md p-3">
        <div className="flex items-center justify-between">
          <label className="text-sm font-bold">목표 달성 기준</label>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div className="mt-2 flex bg-gray-100 rounded-md p-1 text-sm">
          <button className="flex-1 bg-white rounded-md p-2 font-semibold shadow">스스로 체크하기</button>
          <button className="flex-1 p-2 text-gray-500">____회 이상 수행</button>
        </div>
      </div>
      <div className="border border-gray-200 rounded-md p-3">
        <p className="text-sm font-bold mb-2">행동목표</p>
        <div className="space-y-2 text-sm">
          <p>1. 어학공부 하기</p>
          <p>2. 어학공부 하기</p>
          <p className="text-gray-300">3. .....................</p>
        </div>
      </div>
    </div>
  </>
);


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

