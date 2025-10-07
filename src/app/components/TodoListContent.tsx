'use client';

import React, { useState, useMemo, useCallback } from 'react';
import { FaRegSquare, FaCheckSquare } from 'react-icons/fa'; // 체크박스 아이콘

interface TodoItem {
  id: number;
  text: string;
  tag: string;
  isCompleted: boolean;
  order: number; // 리스트 정렬을 위한 초기 순서
}

// --- Mock Data ---
const initialTodos: TodoItem[] = [
  { id: 1, text: "영어 신문 읽기", tag: "영어 공부", isCompleted: false, order: 1 },
  { id: 2, text: "(누르면 전체 행동 완료로 넘어감)", tag: "면접 준비", isCompleted: false, order: 2 },
  { id: 3, text: "투두 3", tag: "직무 탐구", isCompleted: false, order: 3 },
  { id: 4, text: "보고서 초안 작성", tag: "업무", isCompleted: true, order: 4 }, // 이미 완료된 항목
];

// --- 날짜 표시 유틸리티 ---
const formatDate = (date: Date): string => {
  const options: Intl.DateTimeFormatOptions = { weekday: 'short' };
  const weekday = date.toLocaleDateString('ko-KR', options); // 요일
  const month = date.getMonth() + 1; // 1월 = 0
  const day = date.getDate();
  return `${month}월 ${day}일 ${weekday}요일`;
};

interface TodoListContentProps {
  onTodoClick: (todo: TodoItem) => void;
  onCreateClick: () => void;
}

export default function TodoListContent({ onTodoClick, onCreateClick }: TodoListContentProps) {
  const [todos, setTodos] = useState<TodoItem[]>(initialTodos);

  // 1. 할 일 상태 토글 및 리스트 이동 처리
  const handleToggle = useCallback((id: number) => {
    setTodos(prevTodos => {
      const newTodos = prevTodos.map(todo => 
        todo.id === id ? { ...todo, isCompleted: !todo.isCompleted } : todo
      );
      return newTodos;
    });
  }, []);

  // 2. 항목 정렬 및 렌더링 (map/reduce를 대신하는 useMemo의 정렬 로직)
  const sortedTodos = useMemo(() => {
    // reduce 대신 sort를 사용하여 완료된 항목을 맨 아래로 보냅니다.
    // 완료되지 않은 항목(false)이 완료된 항목(true)보다 앞으로 오도록 정렬
    return [...todos].sort((a, b) => {
      // 1순위: 완료 상태 (false < true)
      if (a.isCompleted !== b.isCompleted) {
        return a.isCompleted ? 1 : -1;
      }
      // 2순위: 초기 순서 (order)
      return a.order - b.order;
    });
  }, [todos]);

  // 3. 달성 현황 계산 (reduce 사용)
  const completedCount = todos.reduce((count, todo) => (todo.isCompleted ? count + 1 : count), 0);
  const totalCount = todos.length;

  // --- 컴포넌트 렌더링 ---

  const today = new Date(); // 디바이스 시간대 사용

  return (
    <div className="px-4 py-0 flex flex-col h-full">
      <div className="flex justify-between items-center pb-2 border-border/50">
        <div className="flex">
        <p className="text-18px font-bold text-foreground">
          {formatDate(today)}&nbsp;
        </p>
        <p>&nbsp;의 투두지</p>
        </div>
        <span className="text-sm text-muted-foreground">
          달성 현황: {completedCount}/{totalCount}
        </span>
      </div>

      {/* 투두 리스트 */}
      <div className="flex flex-col gap-2 mt-4 overflow-y-auto">
        {sortedTodos.map(todo => (
          <div
            key={todo.id}
            className={`
              flex items-center justify-between px-4 py-1.5 rounded-lg border
              transition-all duration-300 ease-in-out
              ${todo.isCompleted
                ? 'bg-muted/50 border-muted/50 text-muted-foreground opacity-60'
                : 'bg-card border-border text-foreground hover:bg-muted/30'
              }
              cursor-pointer
            `}
            onClick={() => onTodoClick(todo)}
          >
            {/* 할 일 텍스트 */}
            <div className="flex-grow min-w-0 pr-4 truncate">
              <span className={`text-[15px] ${todo.isCompleted ? 'line-through' : ''}`}>
                {todo.text}
              </span>
            </div>

            {/* 태그 및 체크박스 */}
            <div className="flex items-center space-x-3 flex-shrink-0">
              {/* 태그 (작은 회색 배경) */}
              <span className="text-[15px] px-2 py-1 bg-secondary/70 text-secondary-foreground rounded-md whitespace-nowrap">
                {todo.tag}
              </span>

              {/* 체크박스 아이콘 */}
              <div
                className="text-xl"
                onClick={(e) => {
                  e.stopPropagation();
                  handleToggle(todo.id);
                }}
              >
                {todo.isCompleted
                  ? <FaCheckSquare className="text-primary" />
                  : <FaRegSquare className="text-foreground/70" />
                }
              </div>
            </div>
          </div>
        ))}

        {/* 새 항목 추가 버튼 (점선 배경) */}
        <div className="flex items-center justify-center p-3 mt-2 border-2 border-dashed border-border/70 rounded-lg text-foreground/70"
          onClick={onCreateClick}
        >
          <button className="flex items-center space-x-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6"><circle cx="12" cy="12" r="10"></circle><path d="M12 8v8"></path><path d="M8 12h8"></path></svg>
          </button>
        </div>
      </div>
    </div>
  );
}