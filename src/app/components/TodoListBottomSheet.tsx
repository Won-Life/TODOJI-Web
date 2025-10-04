"use client"
import { useState } from "react";
import BottomSheet from '../components/BottomSheet';
import TodoListContent from "./TodoListContent";

export const TodoListBottomSheet = () => {
  const [isTodoBottomSheetOpen, setIsTodoBottomSheetOpen] = useState(true);
  {/* 날짜별 투두 리스트 데이터 관리할 것 */}
  return (
    <>
      <BottomSheet isOpen = {true} onClose={()=>setIsTodoBottomSheetOpen(false)}>
        <TodoListContent /> {/* dump 컴포넌트로 설정하기 _ UI 렌더링 로직 집중*/}
      </BottomSheet>
    </>
  )
}