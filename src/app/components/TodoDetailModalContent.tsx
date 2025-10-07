import { FaCheckSquare } from "react-icons/fa";

interface TodoDetailProps {
    todo: any;
    onClose: () => void;
}

export const TodoDetailModalContent: React.FC<TodoDetailProps> = ({ todo, onClose }) => {
    if (!todo) return <div className="p-4 text-center">할 일 정보를 불러올 수 없습니다.</div>;

    // Mock 데이터: 피드백 항목과 누적 횟수
    const feedbackList = ["속발음하지 않기", "머릿속으로 내용 정리하며 읽기", "피드백3"];
    const cumulativeCount = 8;
    const weeklyCount = 2;

    return (
        <div className="flex flex-col space-y-4">
            {/* 1. 행동명 */}
            <div className="pb-2 border-b border-border/50">
                <label className="text-sm font-semibold text-gray-500">행동명:</label>
                <input
                    type="text"
                    value={todo.text}
                    className="w-full text-lg font-bold border-none focus:ring-0 bg-transparent p-0"
                    readOnly
                />
            </div>

            {/* 2. 카테고리/목표 */}
            <div className="flex flex-col space-y-2">
                <div className="text-sm font-semibold text-gray-500 flex items-center">카테고리 <FaCheckSquare className="ml-1 text-primary w-4 h-4" /></div>
                <div className="flex space-x-3">
                    {/* 최종 목표 */}
                    <select className="flex-1 p-2 border border-border rounded-lg bg-card text-foreground">
                        <option>외국계 기업 취업</option>
                    </select>
                    {/* 세부 목표 */}
                    <select className="flex-1 p-2 border border-border rounded-lg bg-card text-foreground">
                        <option>{todo.tag}</option>
                    </select>
                </div>
            </div>

            {/* 3. 피드백 추가 */}
            <div className="pb-4 border-b border-border/50">
                <div className="flex justify-between items-center text-sm font-semibold text-gray-500 mb-2">
                    피드백 추가
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M12 8v8"></path><path d="M8 12h8"></path></svg>
                </div>
                {/* 피드백 리스트 */}
                {feedbackList.map((feedback, index) => (
                    <div key={index} className="flex justify-between items-center p-2 my-1 bg-muted rounded-lg text-foreground">
                        <span className="text-sm">{feedback}</span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
                    </div>
                ))}
            </div>

            {/* 4. 누적 횟수 */}
            <div className="text-sm text-foreground space-y-1">
                <p>누적 수행 횟수: <span className="font-bold">{cumulativeCount}회</span></p>
                <p>주간 수행 횟수: <span className="font-bold">{weeklyCount}회</span></p>
            </div>

            {/* 5. 닫기 버튼 */}
            <button
                onClick={onClose}
                className="w-full mt-6 py-3 bg-black text-white rounded-lg font-semibold hover:opacity-90 transition-opacity"
            >
                닫기
            </button>
        </div>
    );
};