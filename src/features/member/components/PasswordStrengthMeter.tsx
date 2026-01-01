'use client';

import { calculatePasswordStrength } from '@/features/member/utils/schemas';
import { cn } from '@/shared/lib/utils';

interface PasswordStrengthMeterProps {
  password: string;
}

export function PasswordStrengthMeter({ password }: PasswordStrengthMeterProps) {
  const { score, label } = calculatePasswordStrength(password);

  const getBarColor = (index: number) => {
    if (score === 0) return 'bg-sand';
    if (index >= score) return 'bg-sand';

    if (score <= 1) return 'bg-red-500';
    if (score === 2) return 'bg-gold';
    if (score === 3) return 'bg-green-500';
    return 'bg-green-600';
  };

  if (!password) return null;

  return (
    <div className="space-y-1">
      <div className="flex gap-1.5">
        {[0, 1, 2, 3].map((index) => (
          <div
            key={index}
            className={cn(
              'h-1 flex-1 rounded-full transition-colors duration-200',
              getBarColor(index)
            )}
          />
        ))}
      </div>
      {label && (
        <p
          className={cn(
            'text-right text-xs',
            score <= 1 && 'text-red-500',
            score === 2 && 'text-gold',
            score >= 3 && 'text-green-600'
          )}
        >
          {label}
        </p>
      )}
    </div>
  );
}
