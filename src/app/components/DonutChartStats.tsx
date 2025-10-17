import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface Action {
  name: string;
  count: number;
}

interface SubGoal {
  name: string;
  color: string;
  actions: Action[];
}

interface StatsData {
  subGoals: SubGoal[];
}

const DonutChartStats: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [selectedSubGoal, setSelectedSubGoal] = useState<string | null>(null);

  // 샘플 데이터
  const data: StatsData = {
    subGoals: [
      {
        name: "영어 공부",
        color: "#10b981",
        actions: [
          { name: "행동명1", count: 200 },
          { name: "행동명2", count: 150 },
          { name: "행동명3", count: 160 },
        ]
      },
      {
        name: "면접 준비",
        color: "#6ee7b7",
        actions: [
          { name: "행동명1", count: 180 },
          { name: "행동명2", count: 142 },
          { name: "행동명3", count: 150 },
        ]
      },
      {
        name: "직무 탐구",
        color: "#a7f3d0",
        actions: [
          { name: "행동명1", count: 114 },
          { name: "행동명2", count: 100 },
          { name: "행동명3", count: 100 },
        ]
      }
    ]
  };

  // 세부 목표별 총합 계산
  const getSubGoalTotal = (subGoal: SubGoal): number => {
    return subGoal.actions.reduce((sum, action) => sum + action.count, 0);
  };

  // 전체 총합 계산
  const getTotalCount = (): number => {
    return data.subGoals.reduce((sum, subGoal) => sum + getSubGoalTotal(subGoal), 0);
  };

  // 선택된 세부 목표의 총합 계산
  const getSelectedTotal = (): number => {
    if (!selectedSubGoal) return getTotalCount();
    const subGoal = data.subGoals.find(sg => sg.name === selectedSubGoal);
    return subGoal ? getSubGoalTotal(subGoal) : 0;
  };

  // 도넛 차트 SVG 경로 생성
  const createDonutSegments = () => {
    const total = getTotalCount();
    let currentAngle = -90; // 12시 방향부터 시작
    const radius = 140;
    const innerRadius = 65;
    const centerX = 150;
    const centerY = 150;

    return data.subGoals.map((subGoal, index) => {
      const subGoalTotal = getSubGoalTotal(subGoal);
      const percentage = subGoalTotal / total;
      const angle = percentage * 360;

      const startAngle = (currentAngle * Math.PI) / 180;
      const endAngle = ((currentAngle + angle) * Math.PI) / 180;

      const x1 = centerX + radius * Math.cos(startAngle);
      const y1 = centerY + radius * Math.sin(startAngle);
      const x2 = centerX + radius * Math.cos(endAngle);
      const y2 = centerY + radius * Math.sin(endAngle);

      const x3 = centerX + innerRadius * Math.cos(endAngle);
      const y3 = centerY + innerRadius * Math.sin(endAngle);
      const x4 = centerX + innerRadius * Math.cos(startAngle);
      const y4 = centerY + innerRadius * Math.sin(startAngle);

      const largeArcFlag = angle > 180 ? 1 : 0;

      const path = `
        M ${x1} ${y1}
        A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}
        L ${x3} ${y3}
        A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${x4} ${y4}
        Z
      `;

      // 텍스트 위치 계산 (중간 각도)
      const midAngle = currentAngle + angle / 2;
      const textRadius = (radius + innerRadius) / 2;
      const textX = centerX + textRadius * Math.cos((midAngle * Math.PI) / 180);
      const textY = centerY + textRadius * Math.sin((midAngle * Math.PI) / 180);

      currentAngle += angle;

      const isSelected = selectedSubGoal === null || selectedSubGoal === subGoal.name;
      const fillColor = isSelected ? subGoal.color : '#d1d5db';

      return (
        <g key={index}>
          <path
            d={path}
            fill={fillColor}
            stroke="white"
            strokeWidth="2"
            onClick={() => handleSubGoalClick(subGoal.name)}
            className="cursor-pointer transition-all duration-200 hover:opacity-80"
          />
          <text
            x={textX}
            y={textY}
            textAnchor="middle"
            dominantBaseline="middle"
            className="text-xs font-small pointer-events-none"
            fill="#1f2937"
          >
            {subGoal.name}
          </text>
          <text
            x={textX}
            y={textY + 16}
            textAnchor="middle"
            dominantBaseline="middle"
            className="text-xs pointer-events-none"
            fill="#1f2937"
          >
            {subGoalTotal}회
          </text>
        </g>
      );
    });
  };

  // 세부 목표 클릭 핸들러
  const handleSubGoalClick = (subGoalName: string) => {
    if (selectedSubGoal === subGoalName) {
      setSelectedSubGoal(null); // 같은 것을 다시 클릭하면 선택 해제
    } else {
      setSelectedSubGoal(subGoalName);
    }
  };

  // 표시할 세부 목표 필터링
  const getDisplayedSubGoals = (): SubGoal[] => {
    if (selectedSubGoal === null) {
      return data.subGoals;
    }
    return data.subGoals.filter(sg => sg.name === selectedSubGoal);
  };

  return (
    <div>
      <h2 className="text-xl font-bold pl-2 mb-2">통계</h2>
      <div className="max-w-md mx-aut p-4 bg-white rounded-xl shadow-md ">
        {/* 세부목표 수행 횟수 헤더 */}
        <div className="flex justify-between items-center mb-4">
          <span className="text-sm font-medium">세부목표 수행 횟수</span>
          <span className="text-sm text-gray-600">총 {getTotalCount()}회</span>
        </div>

        {/* 도넛 차트 */}
        <div className="flex justify-center mb-3">
          <svg width="400" height="400" viewBox="0 0 300 300">
            {createDonutSegments()}
          </svg>
        </div>

        {/* 행동 수행 횟수 섹션 */}
        <div>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full flex justify-between items-center text-sm font-medium hover:bg-gray-50 p-2 rounded transition-colors"
          >
            <span>행동 수행 횟수</span>
            <div className="flex items-center gap-2">
              <span className="text-gray-600">총 {getSelectedTotal()}회</span>
              {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </div>
          </button>

          {/* 행동 목록 */}
          {isExpanded && (
            <div className="mt-4 space-y-4">
              {getDisplayedSubGoals().map((subGoal, index) => (
                <div key={index}>
                  {/* 세부 목표 태그 */}
                  <div className="inline-block px-3 py-1 rounded-full text-xs font-medium mb-2"
                      style={{ backgroundColor: subGoal.color, color: 'white' }}>
                    {subGoal.name}
                  </div>

                  {/* 세부 목표 총합 */}
                  <div className="flex justify-between items-center mb-2 px-2">
                    <span className="text-sm"></span>
                    <span className="text-sm text-gray-600">총 {getSubGoalTotal(subGoal)}회</span>
                  </div>

                  {/* 행동 목록 */}
                  <div className="space-y-2">
                    {subGoal.actions.map((action, actionIndex) => (
                      <div key={actionIndex} className="flex justify-between items-center px-2 py-1">
                        <span className="text-sm text-gray-700">{action.name} -</span>
                        <span className="text-sm text-gray-600">{action.count}회</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DonutChartStats;