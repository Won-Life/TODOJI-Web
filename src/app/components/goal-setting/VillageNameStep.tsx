'use client'
import React from 'react';

interface VillageNameStepProps {
  value: string;
  onChange: (name: string) => void;
}

export default function VillageNameStep({ value, onChange }: VillageNameStepProps) {
  return (
    <>
      <h2 className="flex-1 text-2xl font-bold mb-6">마을 이름</h2>
      <div className="relative w-full">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="마을 이름을 입력해주세요."
          className="w-full bg-gray-100 rounded-md p-3 text-sm placeholder-gray-400"
        />
        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">마을</span>
      </div>
    </>
  );
}
