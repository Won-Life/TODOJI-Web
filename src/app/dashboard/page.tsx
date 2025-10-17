'use client'

import { useState } from 'react';
import CalendarCard from '../components/CalendarCard';
import DonutChartStats from '../components/DonutChartStats';
import FeedbackList from '../components/FeedbackList';
import GoalCard from '../components/GoalCard';
import { CityBuildingInfo } from '../components/CityBuildingInfo';

type Tab = 'goal' | 'village';

export default function Page() {
  const [activeTab, setActiveTab] = useState<Tab>('goal');

  return (
    <div className="bg-gray-50 min-h-screen">
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
