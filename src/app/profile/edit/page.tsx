'use client';
import type { NextPage } from 'next';
import { BsCardImage } from 'react-icons/bs';
import { useState } from 'react';
import { EmailInputSection } from '@/app/components/EmailInputSection';
import DetailHeader from '@/app/components/DetailHeader';

// 각 입력 필드 섹션을 위한 컴포넌트
const InputSection = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="w-full">
    <label className="mb-2 block text-base font-bold text-gray-800">{label}</label>
    {children}
  </div>
);

// 기본 입력 필드 스타일
const inputStyle = "w-full rounded-lg border border-gray-200 bg-gray-100 p-3 text-gray-800 focus:border-green-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-200 placeholder-gray-400";

const EditProfilePage: NextPage = () => {
  const [email, setEmail] = useState('');
  const [emailDomain, setEmailDomain] = useState('naver.com');

  return (
    <div className="flex flex-col min-h-screen items-center bg-white">
      <DetailHeader title={'계정 정보 수정'} />
      <main className="flex flex-col w-full max-w-md flex-grow gap-6 py-6 px-3">
        <div className="self-center relative h-25 w-25 flex-shrink-0 rounded-md bg-gray-200">
          <div className="absolute flex h-6 w-6  rounded-full items-center justify-center bg-white bottom-1 right-1">
            <BsCardImage className="h-3 w-3 text-black" />
          </div>
        </div>
        <form className="flex flex-col gap-6">
          <InputSection label="닉네임">
            <input
              type="text"
              placeholder="닉네임을 입력해주세요"
              defaultValue="" // 회원가입 시 입력한 사용자 이름
              className={inputStyle}
            />
          </InputSection>

          <InputSection label="이메일">
            <EmailInputSection
              email={email}
              domain={emailDomain}
              onEmailChange={(newEmail, newDomain) => {
                setEmail(newEmail);
                setEmailDomain(newDomain);
              }}
            />
          </InputSection>

          <InputSection label="전화번호">
            <div className="flex gap-2 items-center">
              <div className="flex flex-1 min-w-0 overflow-hidden items-center gap-2">
                <input
                  type="tel"
                  placeholder="전화번호를 입력해주세요"
                  className={`${inputStyle} flex-grow`}
                  />
              </div>
              <button
                type="button"
                className="shrink-0 w-22 rounded-lg bg-gray-200 px-4 py-3 text-xs font-bold text-gray-600 transition-colors hover:bg-gray-300"
                >
                문자 인증
              </button>
            </div>
          </InputSection>

          <div className="pt-4">
             <button
                type="button"
                className="w-full rounded-lg border-2 border-green-500 bg-white py-3 font-bold text-green-500 transition-colors hover:bg-green-50"
              >
                비밀번호 변경
              </button>
          </div>
        </form>
      </main>

      <footer className="mx-auto w-full max-w-md pt-8 p-6">
        <button
          type="submit"
          className="w-full rounded-xl bg-green-400 py-4 text-lg font-bold text-white transition-colors hover:bg-green-500"
        >
          저장
        </button>
      </footer>
    </div>
  );
};

export default EditProfilePage;