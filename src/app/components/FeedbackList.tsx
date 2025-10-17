import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Trash2, Plus } from 'lucide-react';

interface Action {
  name: string;
  feedbacks: string[];
}

interface SubGoal {
  name: string;
  tag: string;
  color: string;
  actions: Action[];
}

interface FeedbackData {
  subGoals: SubGoal[];
}

const FeedbackList: React.FC = () => {
  // 샘플 데이터
  const [data, setData] = useState<FeedbackData>({
    subGoals: [
      {
        name: "영어 공부",
        tag: "세부목표 1",
        color: "#10b981",
        actions: [
          { name: "행동 -", feedbacks: ["피드백 -", "피드백 -", "피드백 -"] },
          { name: "행동 -", feedbacks: ["피드백 -", "피드백 -"] },
          { name: "행동 -", feedbacks: ["피드백 -"] },
        ]
      },
      {
        name: "면접 준비",
        tag: "세부목표 2",
        color: "#6ee7b7",
        actions: [
          { name: "행동 -", feedbacks: ["피드백 -", "피드백 -"] },
          { name: "행동 -", feedbacks: ["피드백 -"] },
          { name: "행동 -", feedbacks: ["피드백 -", "피드백 -", "피드백 -"] },
        ]
      },
      {
        name: "직무 탐구",
        tag: "세부목표 3",
        color: "#a7f3d0",
        actions: [
          { name: "행동 -", feedbacks: ["피드백 -"] },
          { name: "행동 -", feedbacks: ["피드백 -", "피드백 -"] },
          { name: "행동 -", feedbacks: ["피드백 -"] },
        ]
      }
    ]
  });

  // 펼쳐진 행동을 추적 (subGoalIndex-actionIndex 형태)
  const [expandedActions, setExpandedActions] = useState<Set<string>>(new Set());
  
  // 새 피드백 입력 중인 행동 추적
  const [addingFeedback, setAddingFeedback] = useState<string | null>(null);
  const [newFeedbackText, setNewFeedbackText] = useState<string>("");

  // 행동 펼치기/접기 토글
  const toggleAction = (subGoalIndex: number, actionIndex: number) => {
    const key = `${subGoalIndex}-${actionIndex}`;
    const newExpanded = new Set(expandedActions);
    
    if (newExpanded.has(key)) {
      newExpanded.delete(key);
      // 접을 때 입력 중이던 피드백도 취소
      if (addingFeedback === key) {
        setAddingFeedback(null);
        setNewFeedbackText("");
      }
    } else {
      newExpanded.add(key);
    }
    
    setExpandedActions(newExpanded);
  };

  // 피드백 삭제
  const deleteFeedback = (subGoalIndex: number, actionIndex: number, feedbackIndex: number) => {
    const newData = { ...data };
    newData.subGoals[subGoalIndex].actions[actionIndex].feedbacks.splice(feedbackIndex, 1);
    setData(newData);
    
    // TODO: 서버에 삭제 요청 전송
  };

  // 피드백 추가 모드 시작
  const startAddingFeedback = (subGoalIndex: number, actionIndex: number) => {
    const key = `${subGoalIndex}-${actionIndex}`;
    setAddingFeedback(key);
    setNewFeedbackText("");
  };

  // 피드백 추가 완료
  const addFeedback = (subGoalIndex: number, actionIndex: number) => {
    if (newFeedbackText.trim() === "") return;

    const newData = { ...data };
    newData.subGoals[subGoalIndex].actions[actionIndex].feedbacks.push(newFeedbackText);
    setData(newData);
    
    setAddingFeedback(null);
    setNewFeedbackText("");
    
    // TODO: 서버에 추가 요청 전송
    // await addFeedbackAPI(subGoalId, actionId, newFeedbackText);
  };

  // 피드백 추가 취소
  const cancelAddingFeedback = () => {
    setAddingFeedback(null);
    setNewFeedbackText("");
  };

  const isExpanded = (subGoalIndex: number, actionIndex: number): boolean => {
    return expandedActions.has(`${subGoalIndex}-${actionIndex}`);
  };

  const isAddingFeedback = (subGoalIndex: number, actionIndex: number): boolean => {
    return addingFeedback === `${subGoalIndex}-${actionIndex}`;
  };

  return (
    <div>
      <h2 className="text-xl font-bold pl-2 mb-2">피드백 확인</h2>
      <div className="max-w-md mx-auto bg-gray-50 min-h-screen">
        {/* 세부 목표별 카드 */}
        <div className="space-y-4">
          {data.subGoals.map((subGoal, subGoalIndex) => (
            <div key={subGoalIndex} className="bg-white rounded-xl p-4 shadow-sm">
              {/* 세부 목표 태그 */}
              <div className="inline-block px-3 py-1 rounded-full text-xs font-medium mb-3"
                  style={{ backgroundColor: subGoal.color, color: 'white' }}>
                {subGoal.tag}
              </div>

              {/* 세부 목표 이름 */}
              <h3 className="text-lg font-bold mb-3">{subGoal.name}</h3>

              {/* 행동 목록 */}
              <div className="space-y-2">
                {subGoal.actions.map((action, actionIndex) => (
                  <div key={actionIndex} className="bg-white shadow-md -shadow-md rounded-md px-2">
                    {/* 행동 헤더 */}
                    <button
                      onClick={() => toggleAction(subGoalIndex, actionIndex)}
                      className="w-full flex justify-between items-center py-2 hover:bg-gray-50 rounded transition-colors"
                    >
                      <span className="text-sm">{action.name}</span>
                      {isExpanded(subGoalIndex, actionIndex) ? 
                        <ChevronUp size={16} className="text-gray-500" /> : 
                        <ChevronDown size={16} className="text-gray-500" />
                      }
                    </button>

                    {/* 피드백 리스트 (펼쳐졌을 때) */}
                    {isExpanded(subGoalIndex, actionIndex) && (
                      <div className="space-y-2">
                        {action.feedbacks.map((feedback, feedbackIndex) => (
                          <div key={feedbackIndex} className="flex justify-between items-center px-2 py-1 shadow-md rounded-md">
                            <span className="text-sm text-gray-700">{feedback}</span>
                            <button
                              onClick={() => deleteFeedback(subGoalIndex, actionIndex, feedbackIndex)}
                              className="p-1 hover:bg-red-50 rounded transition-colors"
                            >
                              <Trash2 size={14} className="text-gray-400 hover:text-red-500" />
                            </button>
                          </div>
                        ))}

                        {/* 새 피드백 입력 필드 */}
                        {isAddingFeedback(subGoalIndex, actionIndex) && (
                          <div className="flex gap-2 mt-2">
                            <input
                              type="text"
                              value={newFeedbackText}
                              onChange={(e) => setNewFeedbackText(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  addFeedback(subGoalIndex, actionIndex);
                                } else if (e.key === 'Escape') {
                                  cancelAddingFeedback();
                                }
                              }}
                              placeholder="피드백 입력..."
                              className="flex-1 px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                              autoFocus
                            />
                            <button
                              onClick={() => addFeedback(subGoalIndex, actionIndex)}
                              className="px-3 py-2 bg-green-500 text-white text-sm rounded-lg hover:bg-green-600 transition-colors"
                            >
                              추가
                            </button>
                            <button
                              onClick={cancelAddingFeedback}
                              className="px-3 py-2 bg-gray-200 text-gray-700 text-sm rounded-lg hover:bg-gray-300 transition-colors"
                            >
                              취소
                            </button>
                          </div>
                        )}

                        {/* + 버튼 */}
                        {!isAddingFeedback(subGoalIndex, actionIndex) && (
                          <div className="flex justify-center my-2">
                            <button
                              onClick={() => startAddingFeedback(subGoalIndex, actionIndex)}
                              className="w-8 h-8 flex items-center justify-center bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
                            >
                              <Plus size={16} />
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeedbackList;