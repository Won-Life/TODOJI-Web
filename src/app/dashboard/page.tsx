'use client'

import { useState } from 'react';
import CalendarCard from '../components/CalendarCard';
import DonutChartStats from '../components/DonutChartStats';
import FeedbackList from '../components/FeedbackList';
import GoalCard from '../components/GoalCard';
import { CityBuildingInfo } from '../components/CityBuildingInfo';
import VillageSelector from '../components/VillageSelector';

type Tab = 'goal' | 'village';

const mockVillages = [
  {
    id: 1,
    name: '열공의 숲 🌳',
    goal: 'Next.js 프로젝트 완성',
    createdDate: '2025/09/15',
    imageUrl: 'https://via.placeholder.com/150/8BC34A/FFFFFF?text=Study',
  },
  {
    id: 2,
    name: '건강한 도시 🏋️',
    goal: '주 3회 헬스장 가기',
    createdDate: '2025/10/01',
    imageUrl: 'https://via.placeholder.com/150/4CAF50/FFFFFF?text=Health',
  },
];

export default function Page() {
  const [activeTab, setActiveTab] = useState<Tab>('goal');
  const [selectedVillageId, setSelectedVillageId] = useState(mockVillages[0].id);

  return (
    <div className="bg-gray-50 min-h-screen">
      <VillageSelector
        villages={mockVillages}
        selectedVillageId={selectedVillageId}
        onSelectVillage={setSelectedVillageId}
        maxVillages={3}
      />
      <main className="flex-col space-y-5 container mx-auto p-4 max-w-sm ">
        <header className="flex items-center space-x-2 mb-4">
          <button
            onClick={() => setActiveTab('goal')}
            className={`px-4 py-2 text-sm font-semibold rounded-lg shadow-sm transition-colors ${
              activeTab === 'goal'
                ? 'text-white bg-green-500'
                : 'text-gray-700 bg-gray-200'
            }`}
          >
            목표
          </button>
          <button
            onClick={() => setActiveTab('village')}
            className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${
              activeTab === 'village'
                ? 'text-white bg-green-500'
                : 'text-gray-700 bg-gray-200'
            }`}
          >
            마을 정보
          </button>
        </header>


        <section className="mt-8 space-y-10">
          {activeTab === 'goal' && (
            <>
              <CalendarCard />
              <GoalCard />
              <DonutChartStats />
              <FeedbackList />
            </>
          )}

          {activeTab === 'village' && (
            <CityBuildingInfo />
          )}
        </section>
      </main>
    </div>
  );
}
