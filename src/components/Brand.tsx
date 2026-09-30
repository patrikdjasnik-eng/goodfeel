import { memo, useId } from 'react';

interface BrandMarkProps {
  className?: string;
}

interface BrandLockupProps {
  compact?: boolean;
}

export const BrandMark = memo(({ className = '' }: BrandMarkProps) => {
  const id = useId().replace(/:/g, '');
  const mainGradientId = `goodfeel-main-${id}`;
  const flowGradientId = `goodfeel-flow-${id}`;

  return (
    <svg
      aria-hidden="true"
      className={`brand-mark ${className}`.trim()}
      viewBox="0 0 64 64"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient
          id={mainGradientId}
          x1="11"
          x2="54"
          y1="8"
          y2="57"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor="#bd75ff" />
          <stop offset="0.38" stopColor="#8b54ff" />
          <stop offset="0.72" stopColor="#6848ff" />
          <stop offset="1" stopColor="#5542ff" />
        </linearGradient>

        <linearGradient
          id={flowGradientId}
          x1="11"
          x2="43"
          y1="41"
          y2="54"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor="#67e4ff" />
          <stop offset="0.46" stopColor="#55b7ff" />
          <stop offset="1" stopColor="#6869ff" />
        </linearGradient>
      </defs>

      <path
        d="M45.5 17.2C40.8 12 34.5 9.8 27.7 10.5C17.3 11.6 9.5 20.2 9.5 31.2C9.5 43.7 18.7 53.3 30.8 53.3C42.6 53.3 51.2 45.6 51.2 35.9V31.4H37.8"
        fill="none"
        stroke={`url(#${mainGradientId})`}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="10.6"
      />

      <path
        d="M14.2 41.5C18.4 48.5 25.3 52.3 32.9 52.4C37.3 52.5 41.5 51.3 45 49.2"
        fill="none"
        stroke={`url(#${flowGradientId})`}
        strokeLinecap="round"
        strokeWidth="4.2"
      />

      <circle cx="50.7" cy="11.8" fill={`url(#${mainGradientId})`} r="4.15" />
    </svg>
  );
});

BrandMark.displayName = 'BrandMark';

export const BrandLockup = memo(({ compact = false }: BrandLockupProps) => (
  <div className={`brand-lockup ${compact ? 'brand-lockup-compact' : ''}`.trim()}>
    <BrandMark />
    <div className="brand-copy">
      <div className="brand-name" aria-label="Goodfeel">
        <span className="brand-name-good">Good</span>
        <span className="brand-name-feel">feel</span>
      </div>
      <div className="brand-tagline">
        People. Work. Progress. <b aria-hidden="true">+</b>
      </div>
    </div>
  </div>
));

BrandLockup.displayName = 'BrandLockup';
