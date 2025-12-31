'use client';

import { useState } from 'react';

import { useRouter } from 'next/navigation';

import { Key, Copy, Download, AlertTriangle, Check } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/shared/components';
import { cn } from '@/shared/lib/utils';

interface RecoveryKeyDisplayProps {
  recoveryKey: string;
  onComplete?: () => void;
}

export function RecoveryKeyDisplay({
  recoveryKey,
  onComplete,
}: RecoveryKeyDisplayProps) {
  const router = useRouter();
  const [isCopied, setIsCopied] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(recoveryKey);
      setIsCopied(true);
      toast.success('복구 키가 복사되었습니다');
      setTimeout(() => setIsCopied(false), 2000);
    } catch {
      toast.error('복사에 실패했습니다');
    }
  };

  const handleDownload = () => {
    const blob = new Blob([`Selah 복구 키\n\n${recoveryKey}\n`], {
      type: 'text/plain',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'selah-recovery-key.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('복구 키가 저장되었습니다');
  };

  const handleComplete = () => {
    if (onComplete) {
      onComplete();
    } else {
      router.push('/');
    }
  };

  return (
    <div className="space-y-8">
      {/* 헤더 */}
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-gold/20 to-gold/40">
          <Key className="h-9 w-9 text-gold" />
        </div>
        <h1 className="font-serif text-2xl font-bold text-deep-brown">
          복구 키를 저장하세요
        </h1>
        <p className="mt-2 text-soft-brown">
          PIN을 잊어버렸을 때 이 키로 암호화된 데이터를 복구할 수 있습니다.
        </p>
      </div>

      {/* 복구 키 표시 */}
      <div className="rounded-lg border-2 border-dashed border-sand bg-cream/50 p-6">
        <p className="mb-2 text-center text-xs uppercase tracking-wider text-soft-brown">
          나의 복구 키
        </p>
        <p className="break-all text-center font-mono text-lg font-medium tracking-wider text-deep-brown">
          {recoveryKey}
        </p>
      </div>

      {/* 액션 버튼 */}
      <div className="flex gap-3">
        <button
          type="button"
          onClick={handleCopy}
          className={cn(
            'flex flex-1 items-center justify-center gap-2 rounded-lg border border-sand py-3',
            'text-deep-brown transition-all duration-200',
            'hover:border-soft-brown hover:bg-cream',
            isCopied && 'border-green-500 text-green-600'
          )}
        >
          {isCopied ? (
            <Check className="h-5 w-5" />
          ) : (
            <Copy className="h-5 w-5" />
          )}
          {isCopied ? '복사됨' : '복사'}
        </button>
        <button
          type="button"
          onClick={handleDownload}
          className={cn(
            'flex flex-1 items-center justify-center gap-2 rounded-lg border border-sand py-3',
            'text-deep-brown transition-all duration-200',
            'hover:border-soft-brown hover:bg-cream'
          )}
        >
          <Download className="h-5 w-5" />
          저장
        </button>
      </div>

      {/* 경고 */}
      <div className="rounded-lg bg-red-50 p-4">
        <div className="flex items-start gap-3">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-red-500" />
          <div className="space-y-2">
            <p className="font-medium text-red-700">
              반드시 안전하게 보관하세요
            </p>
            <ul className="space-y-1 text-sm text-red-600">
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-red-500" />
                이 키는 지금만 확인할 수 있습니다
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-red-500" />
                서버에 저장되지 않아 다시 볼 수 없습니다
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-red-500" />
                분실 시 암호화된 기도 내용을 복구할 수 없습니다
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* 확인 체크박스 */}
      <label className="flex cursor-pointer items-start gap-3">
        <input
          type="checkbox"
          checked={isConfirmed}
          onChange={(e) => setIsConfirmed(e.target.checked)}
          className="sr-only"
        />
        <div
          className={cn(
            'flex h-6 w-6 shrink-0 items-center justify-center rounded border-2',
            'transition-all duration-200',
            isConfirmed
              ? 'border-green-500 bg-green-500'
              : 'border-sand hover:border-soft-brown'
          )}
        >
          {isConfirmed && <Check className="h-4 w-4 text-white" />}
        </div>
        <span className="text-sm text-deep-brown">
          복구 키를 안전한 곳에 저장했습니다
        </span>
      </label>

      {/* 계속 버튼 */}
      <Button onClick={handleComplete} disabled={!isConfirmed}>
        시작하기
      </Button>
    </div>
  );
}
