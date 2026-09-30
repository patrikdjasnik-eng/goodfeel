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
          y1="7"
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
          x1="13"
          x2="44"
          y1="43"
          y2="52"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor="#67e4ff" />
          <stop offset="0.46" stopColor="#55b7ff" />
          <stop offset="1" stopColor="#6869ff" />
        </linearGradient>
      </defs>

      <circle
        cx="29.5"
        cy="33.5"
        fill="none"
        r="20"
        stroke={`url(#${mainGradientId})`}
        strokeDasharray="101 25"
        strokeLinecap="round"
        strokeWidth="10.8"
        transform="rotate(-26 29.5 33.5)"
      />

      <path
        d="M17.2 43.3C22.8 49 30.8 51.5 38.7 48.9C42.3 47.7 45.5 45.7 48.1 42.9"
        fill="none"
        stroke={`url(#${flowGradientId})`}
        strokeLinecap="round"
        strokeWidth="4.4"
      />

      <path
        d="M34.2 31.6H47.8"
        fill="none"
        stroke={`url(#${mainGradientId})`}
        strokeLinecap="round"
        strokeWidth="6.7"
      />

      <circle cx="50.7" cy="12.2" fill={`url(#${mainGradientId})`} r="4.3" />
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
