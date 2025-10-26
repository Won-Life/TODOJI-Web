// RN WebView와 통신하기 위한 유틸 함수

interface WebViewMessage {
  type: string;
  data?: any;
}

/**
 * React Native WebView로 메시지 전송
 */
export const sendMessageToRN = (message: WebViewMessage) => {
  if (typeof window !== 'undefined' && (window as any).ReactNativeWebView) {
    (window as any).ReactNativeWebView.postMessage(JSON.stringify(message));
  } else {
    console.log('[WebView] RN WebView not available. Message:', message);
  }
};

/**
 * React Native WebView로부터 메시지 수신 리스너 등록
 */
export const addRNMessageListener = (
  callback: (message: WebViewMessage) => void
) => {
  const handleMessage = (event: MessageEvent) => {
    try {
      const message = JSON.parse(event.data);
      callback(message);
    } catch (error) {
      console.error('[WebView] Failed to parse message:', error);
    }
  };

  if (typeof window !== 'undefined') {
    window.addEventListener('message', handleMessage);
    // iOS용
    document.addEventListener('message', handleMessage as any);
  }

  return () => {
    if (typeof window !== 'undefined') {
      window.removeEventListener('message', handleMessage);
      document.removeEventListener('message', handleMessage as any);
    }
  };
};
