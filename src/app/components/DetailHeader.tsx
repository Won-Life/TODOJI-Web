'use client';

import { useRouter } from 'next/navigation';
import { IoArrowBack } from 'react-icons/io5';

type DetailHeaderProps = {
  title: string;
};

/**
 * 상세 페이지용 헤더 컴포넌트
 * @param title - 헤더 중앙에 표시될 제목
 */
export default function DetailHeader({ title }: DetailHeaderProps) {
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  return (
    <header className="sticky top-0 z-10 flex items-center justify-center py-4 bg-gray-50 border-b border-gray-200 w-full relative">
      <button
        onClick={handleBack}
        className="absolute left-4 p-2 text-gray-700"
        aria-label="Go back"
      >
        <IoArrowBack className="w-6 h-6" />
      </button>
      <h1 className="text-lg font-bold text-gray-900">{title}</h1>
    </header>
  );
}
