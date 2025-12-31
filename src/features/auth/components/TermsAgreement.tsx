'use client';

import { useState } from 'react';

import { Check, ChevronRight } from 'lucide-react';

import { cn } from '@/shared/lib/utils';

interface TermsAgreementProps {
  onAgree: () => void;
}

interface TermItem {
  id: string;
  label: string;
  required: boolean;
  url?: string;
}

const TERMS: TermItem[] = [
  {
    id: 'service',
    label: '서비스 이용약관',
    required: true,
    url: '/terms/service',
  },
  {
    id: 'privacy',
    label: '개인정보 처리방침',
    required: true,
    url: '/terms/privacy',
  },
  {
    id: 'age',
    label: '만 14세 이상입니다',
    required: true,
  },
];

export function TermsAgreement({ onAgree }: TermsAgreementProps) {
  const [agreed, setAgreed] = useState<Record<string, boolean>>({});

  const allRequired = TERMS.filter((t) => t.required).every((t) => agreed[t.id]);

  const handleToggle = (id: string) => {
    setAgreed((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleToggleAll = () => {
    const allChecked = TERMS.every((t) => agreed[t.id]);
    const newState: Record<string, boolean> = {};
    TERMS.forEach((t) => {
      newState[t.id] = !allChecked;
    });
    setAgreed(newState);
  };

  const allChecked = TERMS.every((t) => agreed[t.id]);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="font-serif text-2xl font-bold text-deep-brown">
          약관 동의
        </h1>
        <p className="mt-2 text-soft-brown">
          서비스 이용을 위해 약관에 동의해주세요
        </p>
      </div>

      <div className="space-y-3">
        {/* 전체 동의 */}
        <button
          type="button"
          onClick={handleToggleAll}
          className={cn(
            'flex w-full items-center gap-3 rounded-lg border-2 p-4 text-left transition-colors',
            allChecked
              ? 'border-deep-brown bg-deep-brown/5'
              : 'border-sand hover:border-soft-brown'
          )}
        >
          <div
            className={cn(
              'flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-colors',
              allChecked
                ? 'border-deep-brown bg-deep-brown'
                : 'border-soft-brown'
            )}
          >
            {allChecked && <Check className="h-4 w-4 text-white" />}
          </div>
          <span className="font-medium text-deep-brown">전체 동의</span>
        </button>

        {/* 개별 약관 */}
        <div className="space-y-2 rounded-lg border border-sand p-4">
          {TERMS.map((term) => (
            <div
              key={term.id}
              className="flex items-center justify-between py-2"
            >
              <button
                type="button"
                onClick={() => handleToggle(term.id)}
                className="flex items-center gap-3"
              >
                <div
                  className={cn(
                    'flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 transition-colors',
                    agreed[term.id]
                      ? 'border-deep-brown bg-deep-brown'
                      : 'border-sand'
                  )}
                >
                  {agreed[term.id] && <Check className="h-3 w-3 text-white" />}
                </div>
                <span className="text-sm text-deep-brown">
                  {term.required && (
                    <span className="mr-1 text-red-500">[필수]</span>
                  )}
                  {term.label}
                </span>
              </button>
              {term.url && (
                <a
                  href={term.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-soft-brown hover:text-deep-brown"
                >
                  <ChevronRight className="h-5 w-5" />
                </a>
              )}
            </div>
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={onAgree}
        disabled={!allRequired}
        className={cn(
          'w-full rounded-lg py-4 font-medium transition-colors',
          allRequired
            ? 'bg-deep-brown text-white hover:bg-deep-brown/90'
            : 'bg-sand text-soft-brown cursor-not-allowed'
        )}
      >
        다음
      </button>
    </div>
  );
}
