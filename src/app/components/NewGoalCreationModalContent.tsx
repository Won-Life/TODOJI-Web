'use client';

import React, { useState } from 'react';
import { FaCheckSquare } from 'react-icons/fa'; // 체크 아이콘

interface NewGoalModalProps {
    onClose: () => void;
    parentTodoId?: number;
}

export default function NewGoalCreationModalContent({ onClose, parentTodoId }: NewGoalModalProps) {
    const [actionName, setActionName] = useState('');
    const [finalGoal, setFinalGoal] = useState('외국계 기업 취업'); // Mock 최종 목표
    const [subGoal, setSubGoal] = useState(''); // Mock 세부 목표

    const handleCreateGoal = () => {
        // 실제 목표 생성 로직 (API 호출, 상태 업데이트 등)을 여기에 구현할 것
        console.log("새 행동 목표 생성:", { actionName, finalGoal, subGoal, parentId: parentTodoId });
        onClose();
    };

    return (
        <div className="flex flex-col px-3 py-2">
            {/* 1. 행동명 입력 */}
            <div className="flex space-x-2 pb-6">
                <label className="text-lg font-semibold text-gray-800 mb-1">행동명:</label>
                <input
                    type="text"
                    placeholder="행동명을 작성하세요."
                    value={actionName}
                    onChange={(e) => setActionName(e.target.value)}
                    className="text-md border-b border-border/70 focus:border-primary pb-1 outline-none bg-transparent"
                />
            </div>

            {/* 2. 카테고리 (체크 아이콘 포함) */}
            <div className="flex flex-col space-y-4">
                <div className="text-lg font-semibold text-gray-800 flex items-center">
                    카테고리 <FaCheckSquare className="ml-2 w-4 h-4 text-primary" />
                </div>
                {/* 3. 최종 목표 / 세부 목표 선택 */}
                <div className="flex justify-between space-x-3 text-sm">
                    {/* 최종 목표 */}
                    <div className="flex flex-col space-y-1 w-1/2">
                        <span className="text-sm text-muted-foreground">최종목표</span>
                        <select
                            value={finalGoal}
                            onChange={(e) => setFinalGoal(e.target.value)}
                            className="p-2 border border-border rounded-lg bg-muted text-foreground"
                        >
                            <option>외국계 기업 취업</option>
                            <option>대학원 진학</option>
                        </select>
                    </div>
                    {/* 세부 목표 */}
                    <div className="flex flex-col space-y-1 w-1/2">
                        <span className="text-sm text-muted-foreground">세부목표</span>
                        <select
                            value={subGoal}
                            onChange={(e) => setSubGoal(e.target.value)}
                            className="p-2 border border-border rounded-lg bg-muted text-foreground"
                        >
                            <option value="">세부 목표 선택</option>
                            <option>영어 공부</option>
                            <option>면접 준비</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* 4. 행동 목표 생성 버튼 */}
            <button
                onClick={handleCreateGoal}
                className="w-full mt-8 py-3 bg-black text-white rounded-lg font-bold text-lg hover:opacity-90 transition-opacity"
            >
                행동 목표 생성
            </button>
        </div>
    );
}
