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
  const glowGradientId = `goodfeel-glow-${id}`;

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
          x2="55"
          y1="8"
          y2="58"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor="#b06cff" />
          <stop offset="0.48" stopColor="#7748ff" />
          <stop offset="1" stopColor="#4e42ff" />
        </linearGradient>

        <linearGradient
          id={glowGradientId}
          x1="12"
          x2="45"
          y1="45"
          y2="56"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor="#5de8ff" />
          <stop offset="0.55" stopColor="#58a8ff" />
          <stop offset="1" stopColor="#7267ff" />
        </linearGradient>
      </defs>

      <circle
        cx="30"
        cy="33"
        fill="none"
        r="20"
        stroke={`url(#${mainGradientId})`}
        strokeDasharray="104 22"
        strokeLinecap="round"
        strokeWidth="10.5"
        transform="rotate(-27 30 33)"
      />

      <path
        d="M18 43.5C23.5 49 31 51.3 38.6 48.6C42.2 47.3 45.4 45.1 47.8 42.2"
        fill="none"
        stroke={`url(#${glowGradientId})`}
        strokeLinecap="round"
        strokeWidth="4.2"
      />

      <path
        d="M34.8 31.7H48.7"
        fill="none"
        stroke={`url(#${mainGradientId})`}
        strokeLinecap="round"
        strokeWidth="6.5"
      />

      <circle cx="50.8" cy="12.2" fill={`url(#${mainGradientId})`} r="4.5" />
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
