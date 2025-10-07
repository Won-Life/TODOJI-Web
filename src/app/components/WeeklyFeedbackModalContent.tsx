'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { FaChevronDown, FaChevronUp, FaPlus, FaCheckSquare } from 'react-icons/fa';

interface FeedbackItem {
    id: number;
    text: string;
    checked: boolean;
}

interface ActionItem {
    id: number;
    name: string;
    performed: number;
    recommended: number;
    totalPerformed: number;
    isRecommended: boolean;
    feedbacks: FeedbackItem[];
    isExpanded: boolean;
}

interface WeeklyFeedbackModalProps {
    onClose: () => void;
    villageName: string;
}

// --- Mock Data ---
const initialActions: ActionItem[] = [
    // 추천된 행동
    { id: 1, name: "영어 신문 읽기", performed: 3, recommended: 5, totalPerformed: 15, isRecommended: true, isExpanded: false,
        feedbacks: [
            { id: 101, text: "머릿속으로 내용 정리하며 읽기", checked: false },
            { id: 102, text: "속발음하지 않기", checked: true },
        ]
    },
    { id: 2, name: "자기소개 준비", performed: 2, recommended: 3, totalPerformed: 13, isRecommended: true, isExpanded: false,
        feedbacks: [
            { id: 101, text: "머릿속으로 내용 정리하며 읽기", checked: false },
            { id: 102, text: "속발음하지 않기", checked: false },
        ]},
    { id: 3, name: "뭐시기 준비", performed: 2, recommended: 2, totalPerformed: 8, isRecommended: true, isExpanded: false, feedbacks: [] },

    // 추천되지 않은 행동
    { id: 4, name: "이런저런거", performed: 0, recommended: 0, totalPerformed: 17, isRecommended: false, isExpanded: false, feedbacks: [] },
    { id: 5, name: "저런그런거", performed: 0, recommended: 0, totalPerformed: 8, isRecommended: false, isExpanded: false, feedbacks: [] },
    { id: 6, name: "그런이런거", performed: 0, recommended: 0, totalPerformed: 11, isRecommended: false, isExpanded: false, feedbacks: [] },
];

export default function WeeklyFeedbackModalContent({ onClose, villageName }: WeeklyFeedbackModalProps) {
    const [actions, setActions] = useState<ActionItem[]>(initialActions);

    const recommendedActions = useMemo(() => actions.filter(a => a.isRecommended), [actions]);
    const unrecommendedActions = useMemo(() => actions.filter(a => !a.isRecommended), [actions]);

    // 1. 행동 확장/축소 토글
    const toggleExpansion = useCallback((id: number) => {
        setActions(prev => prev.map(a => a.id === id ? { ...a, isExpanded: !a.isExpanded } : a));
    }, []);

    // 2. 수행 횟수 증감
    const updatePerformedCount = useCallback((id: number, delta: 1 | -1) => {
        setActions(prev => prev.map(a =>
            a.id === id ? { ...a, performed: Math.max(0, a.performed + delta) } : a
        ));
    }, []);

    // 3. 피드백 체크박스 토글
    const toggleFeedback = useCallback((actionId: number, feedbackId: number) => {
        setActions(prev => prev.map(action => {
            if (action.id === actionId) {
                const newFeedbacks = action.feedbacks.map(fb =>
                    fb.id === feedbackId ? { ...fb, checked: !fb.checked } : fb
                );
                return { ...action, feedbacks: newFeedbacks };
            }
            return action;
        }));
    }, []);


    // 4. 단일 행동 항목 렌더링
    const renderActionItem = (action: ActionItem) => (
        <div key={action.id} className="p-3 bg-card border border-border rounded-xl shadow-sm space-y-2">
            {/* 상단: 행동 이름, 증감 버튼, 총 수행 횟수 */}
            <div className="flex justify-between items-start">
                {/* 행동명 및 확장 토글 */}
                <div
                    className="flex items-center cursor-pointer"
                    onClick={() => toggleExpansion(action.id)}
                >
                    <span className="text-lg font-semibold text-foreground mr-2">{action.name}</span>
                    {action.isExpanded
                        ? <FaChevronUp className="w-3 h-3 text-muted-foreground" />
                        : <FaChevronDown className="w-3 h-3 text-muted-foreground" />
                    }
                </div>

                {/* 수행 횟수 컨트롤 */}
                {action.isRecommended ? (
                    <div className="flex items-center space-x-1">
                        <button
                            onClick={() => updatePerformedCount(action.id, -1)}
                            className="px-2 py-1 text-xs font-bold rounded bg-muted text-foreground hover:bg-muted/70 transition-colors"
                        >
                            LESS
                        </button>
                        <button
                            onClick={() => updatePerformedCount(action.id, 1)}
                            className="px-2 py-1 text-xs font-bold rounded bg-black text-white hover:opacity-90 transition-opacity"
                        >
                            MORE
                        </button>
                    </div>
                ) : (
                    // 추천되지 않은 행동의 MORE 버튼
                    <div className="flex items-center space-x-1">
                        <button className="px-2 py-1 text-xs font-bold rounded bg-black text-white">
                            MORE
                        </button>
                    </div>
                )}
            </div>
            {/* 하단: 수행 횟수 정보 */}
            <div className="flex justify-between items-center text-sm text-muted-foreground">
                <span className="text-sm">수행 {action.performed}번 / 추천 {action.recommended}번</span>
                <span className="text-sm font-semibold">총 수행횟수 {action.totalPerformed}번</span>
            </div>

            {/* 확장된 피드백 체크리스트 */}
            {action.isExpanded && action.feedbacks.length > 0 && (
                <div className="pt-2 border-t border-border/50 space-y-2">
                    {action.feedbacks.map(fb => (
                        <div
                            key={fb.id}
                            className={`flex justify-between items-center p-2 rounded-lg cursor-pointer transition-colors ${fb.checked ? 'bg-muted/70' : 'bg-card'}`}
                            onClick={() => toggleFeedback(action.id, fb.id)}
                        >
                            <span className={`text-sm ${fb.checked ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                                {fb.text}
                            </span>
                            <div className="text-xl">
                                {fb.checked
                                    ? <FaCheckSquare className="text-primary" />
                                    : <FaCheckSquare className="text-muted/50" />
                                }
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );

    // 5. 추천 행동 / 비추천 행동 섹션 렌더링
    const renderActionSection = (title: string, actions: ActionItem[]) => (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">
                {title} <span className="text-primary">{actions.length}개</span>
            </h3>
            <div className="space-y-3">
                {actions.map(renderActionItem)}
            </div>
            {/* 더보기 버튼 */}
            <button className="flex items-center justify-center w-full py-2 text-primary font-semibold space-x-2">
                <FaPlus className="w-4 h-4" />
                <span>더보기</span>
            </button>
        </div>
    );

    return (
        <div className="flex flex-col h-full space-y-6 p-6">
            {/* 모달 제목 및 날짜 */}
            <header className="text-center space-y-1">
                <h2 className="text-2xl font-bold text-foreground">{villageName} 주간 피드백</h2>
                <p className="text-sm text-muted-foreground">2025년 9월 1주차</p>
            </header>

            {/* 스크롤 가능한 메인 컨텐츠 */}
            <div className="flex-grow overflow-y-auto space-y-6">
                {/* 추천된 행동 섹션 */}
                {renderActionSection("이번 주 추천된 행동", recommendedActions)}

                {/* 추천되지 않은 행동 섹션 */}
                {renderActionSection("이번 주 추천되지 않은 행동", unrecommendedActions)}
            </div>
            {/* 하단 버튼 영역 */}
            <footer className="flex justify-between space-x-3 pt-3">
                <button className="flex-1 py-3 bg-muted rounded-lg text-foreground font-semibold hover:bg-muted/80">
                    통계 보러가기
                </button>
                <button
                    onClick={onClose}
                    className="flex-1 py-3 bg-black text-white rounded-lg font-bold hover:opacity-90"
                >
                    확인
                </button>
            </footer>
        </div>
    );
}
