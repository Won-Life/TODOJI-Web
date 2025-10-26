'use client'
import React, { useState, useEffect } from 'react';
import { Mail, Loader2 } from 'lucide-react';
import { EmailInputSection } from '../components/EmailInputSection';
import { sendMessageToRN } from '../utils/webview';

type Screen = 'initial' | 'login' | 'error' | 'loading' | 'signup' | 'home';

interface SignupData {
  name: string;
  gender: string;
  birthYear: string;
  birthMonth: string;
  birthDay: string;
  email: string;
  emailDomain: string;
  password: string;
  passwordConfirm: string;
}

// 1. 최초 로그인 화면
const InitialScreen: React.FC<{
  onEmailLogin: () => void;
  onSocialLogin: (provider: string) => void;
  onSignupClick: () => void;
}> = ({ onEmailLogin, onSocialLogin, onSignupClick }) => (
  <div className="flex flex-col items-center justify-center min-h-screen bg-white p-6">
    <h1 className="text-2xl font-bold mb-12">로그인</h1>

    <div className="w-full max-w-xs space-y-3">
      <button
        onClick={onEmailLogin}
        className="w-full bg-black text-white py-3 rounded-lg flex items-center justify-center gap-2 font-medium"
      >
        <Mail size={20} />
        이메일로 로그인
      </button>

      <div className="text-center text-sm text-gray-600">
        또는 <button onClick={onSignupClick} className="text-blue-500 font-medium">회원가입</button>
      </div>

      <button
        onClick={() => onSocialLogin('구글')}
        className="w-full bg-white border-2 border-gray-300 text-gray-700 py-3 rounded-lg flex items-center justify-center gap-2 font-medium"
      >
        <span className="font-bold text-lg">G</span>
        구글 계정으로 로그인
      </button>

      <button
        onClick={() => onSocialLogin('카카오톡')}
        className="w-full bg-yellow-400 text-gray-900 py-3 rounded-lg flex items-center justify-center gap-2 font-medium"
      >
        <span className="font-bold">💬</span>
        카카오톡 계정으로 로그인
      </button>

      <button
        onClick={() => onSocialLogin('네이버')}
        className="w-full bg-green-500 text-white py-3 rounded-lg flex items-center justify-center gap-2 font-medium"
      >
        <span className="font-bold text-lg">N</span>
        네이버 계정으로 로그인
      </button>
    </div>
  </div>
);

// 2. 이메일 로그인 화면
const LoginScreen: React.FC<{
  email: string;
  password: string;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onLogin: () => void;
  onSignupClick: () => void;
  showError?: boolean;
}> = ({ email, password, onEmailChange, onPasswordChange, onLogin, onSignupClick, showError = false }) => (
  <div className="flex flex-col items-center justify-center min-h-screen bg-white p-6">
    <div className="w-24 h-24 bg-gray-300 mb-8 flex items-center justify-center text-sm text-gray-600">
      로고 영역
    </div>

    <div className="w-full max-w-xs space-y-3">
      <input
        type="email"
        placeholder="이메일"
        value={email}
        onChange={(e) => onEmailChange(e.target.value)}
        className="w-full px-4 py-3 bg-gray-200 rounded-lg outline-none"
      />

      <input
        type="password"
        placeholder="비밀번호"
        value={password}
        onChange={(e) => onPasswordChange(e.target.value)}
        className="w-full px-4 py-3 bg-gray-200 rounded-lg outline-none"
      />

      {showError && (
        <p className="text-red-500 text-xs">
          이메일 또는 비밀번호가 잘못 입력되었습니다. 다시 확인해 주세요.
        </p>
      )}

      <button
        onClick={onLogin}
        className="w-full bg-black text-white py-3 rounded-lg font-medium"
      >
        로그인
      </button>

      <p className="text-center text-xs text-gray-500">
        이메일 찾기 / 비밀번호 찾기
      </p>

      <p className="text-center text-sm text-gray-700 mt-6">
        회원 정보가 없으신가요?
      </p>

      <button
        onClick={onSignupClick}
        className="w-full bg-black text-white py-3 rounded-lg font-medium"
      >
        회원가입
      </button>
    </div>
  </div>
);

// 3. 로딩 화면
const LoadingScreen: React.FC<{
  email: string;
  password: string;
}> = ({ email, password }) => (
  <div className="flex flex-col items-center justify-center min-h-screen bg-white p-6">
    <div className="w-24 h-24 bg-gray-300 mb-8 flex items-center justify-center text-sm text-gray-600">
      로고 영역
    </div>

    <div className="w-full max-w-xs space-y-3 relative">
      <input
        type="email"
        placeholder="이메일"
        value={email}
        disabled
        className="w-full px-4 py-3 bg-gray-200 rounded-lg outline-none opacity-50"
      />

      <input
        type="password"
        placeholder="비밀번호"
        value={password}
        disabled
        className="w-full px-4 py-3 bg-gray-200 rounded-lg outline-none opacity-50"
      />

      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <Loader2 className="animate-spin" size={40} />
      </div>

      <button
        disabled
        className="w-full bg-black text-white py-3 rounded-lg font-medium opacity-50"
      >
        로그인
      </button>

      <p className="text-center text-xs text-gray-500">
        이메일 찾기 / 비밀번호 찾기
      </p>

      <p className="text-center text-sm text-gray-700 mt-6">
        회원 정보가 없으신가요?
      </p>

      <button
        disabled
        className="w-full bg-black text-white py-3 rounded-lg font-medium opacity-50"
      >
        회원가입
      </button>
    </div>
  </div>
);

// 5. 회원가입 화면
const SignupScreen: React.FC<{
  signupData: SignupData;
  onSignupDataChange: (data: Partial<SignupData>) => void;
  onSignup: () => void;
  onBack: () => void;
}> = ({ signupData, onSignupDataChange, onSignup, onBack }) => (
  <div className="flex flex-col min-h-screen bg-white">
    <div className="bg-gray-800 text-white px-6 py-4">
      <button onClick={onBack} className="text-sm">← 뒤로가기</button>
    </div>
    <div className="flex-1 overflow-y-auto p-6">
      <h1 className="text-2xl font-bold text-center mb-8">회원가입</h1>
      <div className="max-w-sm mx-auto space-y-4">
        <div className="flex gap-2">
          <div className="flex-[7]">
            <label className="block text-sm font-medium mb-2">이름</label>
            <input
              type="text"
              placeholder="이름을 입력해 주세요"
              value={signupData.name}
              onChange={(e) => onSignupDataChange({ name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div className="flex-col flex-[3]">
            <label className="block text-sm font-medium mb-2">성별</label>
            <div className="flex-1">
              <button
                onClick={() => onSignupDataChange({ gender: '남' })}
                className={`p-3 rounded-l-lg border ${signupData.gender === '남' ? 'bg-black text-white' : 'border-gray-300'}`}
              >
                남
              </button>
              <button
                onClick={() => onSignupDataChange({ gender: '여' })}
                className={`p-3 rounded-r-lg border ${signupData.gender === '여' ? 'bg-black text-white' : 'border-gray-300'}`}
              >
                여
              </button>
            </div>
          </div>
        </div>
        {/* 이메일 */}
        <div>
          <label className="block text-sm font-medium mb-2">이메일</label>
          <EmailInputSection
            email={signupData.email}
            domain={signupData.emailDomain}
            onEmailChange={(email, domain) =>
              onSignupDataChange({ email, emailDomain: domain })
            }
          />
        </div>
        {/* 비밀번호 */}
        <div>
          <label className="block text-sm font-medium mb-2">비밀번호 입력</label>
          <input
            type="password"
            placeholder="비밀번호 입력"
            value={signupData.password}
            onChange={(e) => onSignupDataChange({ password: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          />
          <p className="text-xs text-gray-500 mt-1">
            영문, 숫자, 특수문자를 3가지 이상으로 조합해 8자 이상 16자 이하로 입력해주세요.
          </p>
        </div>

        {/* 비밀번호 확인 */}
        <div>
          <label className="block text-sm font-medium mb-2">비밀번호 확인</label>
          <input
            type="password"
            placeholder="비밀번호 재입력"
            value={signupData.passwordConfirm}
            onChange={(e) => onSignupDataChange({ passwordConfirm: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          />
        </div>

        <button
          onClick={onSignup}
          className="w-full bg-black text-white py-3 rounded-lg font-medium mt-6"
        >
          회원가입
        </button>
      </div>
    </div>
  </div>
);

// 6. 홈 화면 (간단한 데모)
const HomeScreen: React.FC<{
  onLogout: () => void;
}> = ({ onLogout }) => (
  <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
    <h1 className="text-3xl font-bold mb-4">환영합니다! 🎉</h1>
    <p className="text-gray-600 mb-8">로그인이 완료되었습니다.</p>
    <button
      onClick={onLogout}
      className="px-6 py-3 bg-black text-white rounded-lg"
    >
      로그아웃
    </button>
  </div>
);

// 메인 LoginFlow 컴포넌트
const LoginFlow: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>('initial');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [signupData, setSignupData] = useState<SignupData>({
    name: '',
    gender: '',
    birthYear: '',
    birthMonth: '',
    birthDay: '',
    email: '',
    emailDomain: 'naver.com',
    password: '',
    passwordConfirm: ''
  });

  // 로딩 후 자동으로 홈 화면으로 이동
  // useEffect(() => {
  //   if (currentScreen === 'loading') {
  //     const timer = setTimeout(() => {
  //       setCurrentScreen('home');
  //     }, 2000);
  //     return () => clearTimeout(timer);
  //   }
  // }, [currentScreen]);

  const handleEmailLogin = () => {
    setCurrentScreen('login');
  };

  const handleSocialLogin = (provider: string) => {
    alert(`${provider} 로그인 처리 중...`);
    setCurrentScreen('loading');
  };

  const handleLogin = () => {
    // 간단한 validation (테스트용)
    if (true) {
      // RN WebView로 로그인 성공 이벤트 전송
      sendMessageToRN({
        type: 'LOGIN_SUCCESS',
        data: {
          accessToken: 'mock_access_token_' + Date.now(),
          refreshToken: 'mock_refresh_token_' + Date.now(),
        },
      });
      setCurrentScreen('loading');
    } else {
      setCurrentScreen('error');
    }
  };

  const handleSignup = () => {
    alert('회원가입이 완료되었습니다!');
    setCurrentScreen('loading');
  };

  const handleSignupDataChange = (data: Partial<SignupData>) => {
    setSignupData(prev => ({ ...prev, ...data }));
  };

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen">
      {currentScreen === 'initial' && (
        <InitialScreen
          onEmailLogin={handleEmailLogin}
          onSocialLogin={handleSocialLogin}
          onSignupClick={() => setCurrentScreen('signup')}
        />
      )}
      {currentScreen === 'login' && (
        <LoginScreen
          email={email}
          password={password}
          onEmailChange={setEmail}
          onPasswordChange={setPassword}
          onLogin={handleLogin}
          onSignupClick={() => setCurrentScreen('signup')}
        />
      )}
      {currentScreen === 'error' && (
        <LoginScreen
          email={email}
          password={password}
          onEmailChange={setEmail}
          onPasswordChange={setPassword}
          onLogin={handleLogin}
          onSignupClick={() => setCurrentScreen('signup')}
          showError={true}
        />
      )}
      {currentScreen === 'loading' && (
        <LoadingScreen email={email} password={password} />
      )}
      {currentScreen === 'signup' && (
        <SignupScreen
          signupData={signupData}
          onSignupDataChange={handleSignupDataChange}
          onSignup={handleSignup}
          onBack={() => setCurrentScreen('initial')}
        />
      )}
      {currentScreen === 'home' && (
        <HomeScreen onLogout={() => setCurrentScreen('initial')} />
      )}
    </div>
  );
};

export default LoginFlow;
