'use client';

import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from 'react';

// ===== 타입 =====
export type OnboardingContextValue = {
  showOnboarding: boolean;
  setShowOnboarding: Dispatch<SetStateAction<boolean>>;
};

// ===== 컨텍스트 =====
const OnboardingContext = createContext<OnboardingContextValue | null>(null);

// 모듈 스코프에 setter 를 보관해 두고, 외부에서 직접 업데이트할 수 있게 함
let _setShowOnboarding: Dispatch<SetStateAction<boolean>> | null = null;
let _getShowOnboarding: (() => boolean) | null = null; // 함수로 보관하여 최신값 접근

/**
 * 리액트 컴포넌트 외부(예: util 모듈, webview bridge 등)에서 온보딩 표시 여부를 갱신하고 싶을 때 사용합니다.
 * OnboardingProvider 가 마운트된 이후에만 동작합니다.
 */
export function setShowOnboardingExternal(
  next: boolean | ((prev: boolean) => boolean)
) {
  if (_setShowOnboarding && _getShowOnboarding) {
    const resolved =
      typeof next === 'function'
        ? (next as (p: boolean) => boolean)(_getShowOnboarding())
        : next;
    _setShowOnboarding(resolved);
  } else {
    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.warn(
        '[OnboardingContext] setShowOnboardingExternal 호출 시 Provider 가 아직 마운트되지 않았습니다.'
      );
    }
  }
}

// ===== Provider =====
export function OnboardingProvider({
  children,
  initial = false,
}: {
  children: ReactNode;
  /** 서버/클라이언트 최초 렌더 시 기본값이 필요하면 주입 */
  initial?: boolean;
}) {
  const [showOnboarding, setShowOnboarding] = useState<boolean>(initial);

  // 최신 값을 참조하기 위한 ref (외부 업데이트 함수에서 사용)
  const valueRef = useRef(showOnboarding);
  useEffect(() => {
    valueRef.current = showOnboarding;
  }, [showOnboarding]);

  // 외부 업데이트 함수가 사용할 setter/value getter 등록
  useEffect(() => {
    _setShowOnboarding = setShowOnboarding;
    _getShowOnboarding = () => valueRef.current;
    return () => {
      _setShowOnboarding = null;
      _getShowOnboarding = null;
    };
  }, []);

  const contextValue: OnboardingContextValue = {
    showOnboarding,
    setShowOnboarding,
  };

  return (
    <OnboardingContext.Provider value={contextValue}>
      {children}
    </OnboardingContext.Provider>
  );
}

// ===== Hook =====
export function useOnboarding() {
  const ctx = useContext(OnboardingContext);
  if (!ctx) {
    throw new Error('useOnboarding must be used within <OnboardingProvider />');
  }
  return ctx;
}
