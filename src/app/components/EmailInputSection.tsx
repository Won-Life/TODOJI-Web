'use client';
import { useState, useEffect } from 'react';

interface EmailInputSectionProps {
  email?: string;
  domain?: string;
  onEmailChange?: (email: string, domain: string) => void;
}

export const EmailInputSection: React.FC<EmailInputSectionProps> = ({
  email: propEmail,
  domain: propDomain,
  onEmailChange,
}) => {
  const [email, setEmail] = useState(propEmail || '');
  const [emailDomain, setEmailDomain] = useState(propDomain || 'naver.com');

  useEffect(() => {
    if (propEmail !== undefined) setEmail(propEmail);
  }, [propEmail]);

  useEffect(() => {
    if (propDomain !== undefined) setEmailDomain(propDomain);
  }, [propDomain]);

  const handleEmailChange = (value: string) => {
    setEmail(value);
    onEmailChange?.(value, emailDomain);
  };

  const handleDomainChange = (value: string) => {
    setEmailDomain(value);
    onEmailChange?.(email, value);
  };

  const handleDuplicateCheck = () => {
    alert('중복 확인 기능이 구현될 예정입니다.');
  };

  return (
    <div className="flex gap-2 items-center">
      <div className="flex flex-[8] bg-gray-100 rounded-md">
        <input
          type="text"
          placeholder="이메일 입력"
          value={email}
          onChange={(e) => handleEmailChange(e.target.value)}
          className="w-20 pl-3 py-3 rounded-lg"
        />
        <div className="flex items-center py-1 px-2 gap-1">
          <span>@</span>
          <select
            value={emailDomain}
            onChange={(e) => handleDomainChange(e.target.value)}
            className="px-2 py-1 bg-white rounded-lg items-center"
          >
            <option>naver.com</option>
            <option>gmail.com</option>
            <option>daum.net</option>
          </select>
        </div>
      </div>
      <button
        type="button"
        onClick={handleDuplicateCheck}
        className="flex-shrink-0 flex-[2] px-4 py-3 bg-black text-white rounded-md text-xs"
      >
        중복 확인
      </button>
    </div>
  );
};
