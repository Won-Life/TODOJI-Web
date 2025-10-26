'use client';

import { useRouter } from 'next/navigation';
import { IoIosArrowBack } from "react-icons/io";

type DetailHeaderProps = {
  title: string;
  showBackButton?: boolean;
};

/**
 * 상세 페이지용 헤더 컴포넌트
 * @param title - 헤더 중앙에 표시될 제목
 */
export default function DetailHeader({ title, showBackButton = true }: DetailHeaderProps) {
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  return (
    <header className="sticky top-0 z-10 flex items-center justify-center py-3 bg-gray-50 shadow-md w-full">
      {showBackButton &&
        <button
        onClick={handleBack}
        className="absolute left-2 p-2 text-gray-700"
        aria-label="Go back"
        >
          <IoIosArrowBack className="w-4 h-4" />
        </button>
      }
      <h1 className="text-base font-bold text-gray-900">{title}</h1>
    </header>
  );
}
