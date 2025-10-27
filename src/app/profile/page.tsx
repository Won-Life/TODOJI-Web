import type { NextPage } from 'next';
import { IoSettingsOutline } from 'react-icons/io5';
import { BsCardImage } from 'react-icons/bs';
import { MdChevronRight } from 'react-icons/md';
import Link from 'next/link';
import DetailHeader from '../components/DetailHeader';


const InfoLink = ({ children }: { children: React.ReactNode }) => (
  <button className="flex w-full items-center justify-between rounded-xl bg-white p-4 text-left shadow-sm transition-colors hover:bg-gray-50">
    <span className="text-gray-800">{children}</span>
    <MdChevronRight className="h-5 w-5 text-gray-400" />
  </button>
);

const ProfilePage: NextPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <DetailHeader title={'개인 정보'} showBackButton={false} />
      <main className="mx-auto max-w-md py-4 px-3 pt-6">
        <header className="flex items-center justify-between">
          <h1 className="text-xl font-extrabold text-gray-900 pb-1">프로필</h1>
          <button aria-label="Settings">
            <IoSettingsOutline className="h-4 w-4" />
          </button>
        </header>

        <section className="mb-8 rounded-xl bg-white p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="relative h-25 w-25 flex-shrink-0 rounded-md bg-gray-200">
              <div className="absolute h-6 w-6 flex rounded-full items-center justify-center bg-white bottom-1 right-1">
                <BsCardImage className="h-3 w-3 text-black" />
              </div>
            </div>
            <div className="flex-grow">
              <p className="text-lg font-semibold text-gray-900">닉네임</p>
              <p className="mb-3 text-sm text-gray-500">email@email.com</p>
              <Link href="/profile/edit">
                <button className="rounded-lg bg-green-500 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-green-600">
                  계정 정보 수정
                </button>
              </Link>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="mb-3 px-2 text-base font-bold text-gray-800">스토어</h2>
          <InfoLink>캐시 스토어</InfoLink>
        </section>

        <section>
          <h2 className="mb-3 px-2 text-base font-bold text-gray-800">정보</h2>
          <div className="flex flex-col gap-2">
            <InfoLink>앱 기본 정보</InfoLink>
            <InfoLink>앱 버전 정보</InfoLink>
            <InfoLink>서비스 이용약관</InfoLink>
            <InfoLink>개인정보 처리 방침</InfoLink>
          </div>
        </section>
      </main>
    </div>
  );
};

export default ProfilePage;