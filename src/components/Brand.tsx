import { memo, useId } from 'react';

interface BrandMarkProps {
  className?: string;
}

interface BrandLockupProps {
  compact?: boolean;
}

export const BrandMark = memo(({ className = '' }: BrandMarkProps) => {
  const gradientId = useId().replace(/:/g, '');

  return (
    <svg
      aria-hidden="true"
      className={`brand-mark ${className}`.trim()}
      viewBox="0 0 64 64"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id={gradientId} x1="15" x2="53" y1="13" y2="57" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#7a43ff" />
          <stop offset="0.52" stopColor="#6436fa" />
          <stop offset="1" stopColor="#4b2bdc" />
        </linearGradient>
      </defs>

      <circle
        cx="29.5"
        cy="35"
        fill="none"
        r="18.5"
        stroke={`url(#${gradientId})`}
        strokeDasharray="98.5 18"
        strokeLinecap="round"
        strokeWidth="11.5"
              />

      <ellipse
        cx="51"
        cy="12.5"
        fill={`url(#${gradientId})`}
        rx="6"
        ry="4.75"
        transform="rotate(-37 51 12.5)"
      />
    </svg>
  );
});

BrandMark.displayName = 'BrandMark';

export const BrandLockup = memo(({ compact = false }: BrandLockupProps) => (
  <div className={`brand-lockup ${compact ? 'brand-lockup-compact' : ''}`.trim()}>
    <BrandMark />
    <div className="brand-copy">
      <strong>Goodfeel</strong>
      <span>
        People. Work. Progress. <b aria-hidden="true">+</b>
      </span>
    </div>
  </div>
));

BrandLockup.displayName = 'BrandLockup';
