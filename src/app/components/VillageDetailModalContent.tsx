'use client';

import React from 'react';
import { FaPencilAlt } from 'react-icons/fa';

interface VillageDetailProps {
    village: any,
    onClose: () => void;
}

const mockVillageData = {
    name: "뭐시기 마을",
    startDate: "2025년 9월 1일",
    manager: "닉네임",
    totalActions: 37,
    finalGoal: "외국계 기업 취업",
    subGoals: [
        { name: "영어 공부", actions: ["토익 공부", "영어 신문 읽기", "미드 시청"] },
        { name: "면접 준비", actions: ["자기소개 준비", "모의 면접"] },
    ]
};

const VillageDetailModalContent: React.FC<VillageDetailProps> = ({ village, onClose }) => {
    const data = mockVillageData;

    const renderActions = (actions: string[]) => (
        <ul className="text-sm text-gray-700 space-y-1">
            {actions.map((action, index) => (
                <li key={index} className="border-b border-border/50 py-1">{action}</li>
            ))}
        </ul>
    );

    const renderSubGoals = data.subGoals.map((goal, goalIndex) => (
        <div key={goalIndex} className="flex mb-4 items-start">
            {/* 세부 목표명 */}
            <div className="w-3/7 flex items-center space-x-1 font-bold text-foreground pt-1">
                <p className="items-center">{goalIndex + 1}.&nbsp;</p>
                <span className="inline-flex items-center px-2 py-1 bg-secondary rounded-sm text-sm">
                    {goal.name}
                    <FaPencilAlt className="ml-1 w-3 h-3 text-muted-foreground cursor-pointer" />
                </span>
            </div>
            {/* 행동 리스트 */}
            <div className="flex-1">
                {renderActions(goal.actions)}
            </div>
        </div>
    ));

    return (
        <>
            <div className="flex flex-col space-y-4 overflow-y-auto max-h-[70vh]">
                {/* 상단 정보 및 프로필 영역 */}
                <div className="flex items-center space-x-2 pb-2">
                    <div className="w-13 h-13 bg-gray-200 rounded-md flex-shrink-0"></div>
                    <div className="flex flex-col w-full">
                        <h2 className="text-md font-bold text-foreground flex items-center">
                            {village} <FaPencilAlt className="ml-2 w-3 h-3 text-muted-foreground cursor-pointer" />
                        </h2>
                        <div className="flex w-full justify-between pr-2">
                            <p className="text-xs text-muted-foreground">시작일: {data.startDate}</p>
                            <p className="text-xs text-muted-foreground">관리자: {data.manager}</p>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col space-y-6 px-2">
                    {/* 총 수행 횟수 */}
                    <div className="text-lg font-bold text-foreground">
                        <p className="text-sm font-normal font-bold text-gray-700">수행한 총 행동 갯수</p>
                        {data.totalActions}개
                    </div>

                    {/* 최종 목표 */}
                    <div className="space-y-2">
                        <h3 className="text-md font-semibold text-gray-700">최종목표</h3>
                        <div className="px-3 py-2 bg-secondary rounded-lg text-foreground font-medium">
                            {data.finalGoal}
                        </div>
                    </div>

                    {/* 세부 목표 및 행동 목록 */}
                    <div className="space-y-2">
                        <div className="flex text-md font-bold text-gray-700 pb-2">
                            <h3 className="w-3/7 pr-4">세부 목표</h3>
                            <h3 className="w-4/7">행동</h3>
                        </div>
                        <div>
                            {renderSubGoals}
                        </div>
                    </div>
                </div>

            </div>
            {/* 닫기 버튼 (sticky bottom을 위해 스크롤 영역 밖에 배치하는 것이 좋지만, 여기서는 간단히 구현) */}
            <div>
                <button
                    onClick={onClose}
                    className="w-full py-3 bg-black text-white rounded-lg font-semibold hover:opacity-90 transition-opacity"
                    >
                    닫기
                </button>
            </div>
        </>
    );
};

export default VillageDetailModalContent;
