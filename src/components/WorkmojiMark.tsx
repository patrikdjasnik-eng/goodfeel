import { memo, useId, type ReactNode } from 'react';
import type { WorkmojiId } from '../workmoji/catalog';
import { workmojiById } from '../workmoji/catalog';

interface WorkmojiMarkProps {
  id: WorkmojiId;
  size?: number;
  className?: string;
  title?: string;
}

const renderGlyph = (
  id: WorkmojiId,
  main: string,
  accent: string,
  soft: string
): ReactNode => {
  switch (id) {
    case 'gf-spark':
      return (
        <>
          <path d="M32 10l5.2 12.8L50 28l-12.8 5.2L32 46l-5.2-12.8L14 28l12.8-5.2L32 10Z" fill={main} />
          <circle cx="49" cy="13" r="4" fill={accent} />
          <circle cx="15" cy="49" r="3" fill={soft} />
        </>
      );

    case 'gf-proof':
      return (
        <>
          <path d="M32 8 49 15v13c0 12-7 21-17 28C22 49 15 40 15 28V15L32 8Z" fill="none" stroke={main} strokeWidth="6" strokeLinejoin="round" />
          <path d="m23 31 6 6 13-14" fill="none" stroke={accent} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
        </>
      );

    case 'gf-flow':
      return (
        <>
          <path d="M10 20c12 0 12 10 24 10s12-10 20-10" fill="none" stroke={main} strokeWidth="6" strokeLinecap="round" />
          <path d="M10 32c12 0 12 10 24 10s12-10 20-10" fill="none" stroke={accent} strokeWidth="6" strokeLinecap="round" />
          <path d="M10 44c12 0 12 8 24 8" fill="none" stroke={soft} strokeWidth="5" strokeLinecap="round" />
        </>
      );

    case 'gf-brainhit':
      return (
        <>
          <path d="M45 18a20 20 0 1 0 3 28" fill="none" stroke={main} strokeWidth="7" strokeLinecap="round" />
          <path d="m35 16-8 16h8l-6 16 15-21h-9l7-11Z" fill={accent} />
        </>
      );

    case 'gf-stackling':
      return (
        <>
          <rect x="13" y="12" width="38" height="11" rx="5.5" fill={main} />
          <rect x="17" y="27" width="34" height="11" rx="5.5" fill={accent} />
          <rect x="21" y="42" width="30" height="11" rx="5.5" fill={soft} />
          <path d="M19 17h8M23 32h8M27 47h8" stroke="#0b0e18" strokeWidth="3" strokeLinecap="round" opacity=".7" />
        </>
      );

    case 'gf-bugbite':
      return (
        <>
          <rect x="20" y="18" width="24" height="28" rx="8" fill="none" stroke={main} strokeWidth="6" />
          <path d="M26 18v-6M38 18v-6M20 25h-7M20 35h-7M44 25h7M44 35h7M26 46v6M38 46v6" stroke={soft} strokeWidth="4" strokeLinecap="round" />
          <rect x="26" y="25" width="6" height="6" rx="2" fill={accent} />
          <path d="M37 27h5M35 35l7 7" stroke={accent} strokeWidth="4" strokeLinecap="round" />
        </>
      );

    case 'gf-mergey':
      return (
        <>
          <path d="M14 15c0 18 18 13 18 31" fill="none" stroke={main} strokeWidth="6" strokeLinecap="round" />
          <path d="M50 15c0 18-18 13-18 31" fill="none" stroke={accent} strokeWidth="6" strokeLinecap="round" />
          <circle cx="14" cy="14" r="5" fill={main} />
          <circle cx="50" cy="14" r="5" fill={accent} />
          <circle cx="32" cy="50" r="6" fill={soft} />
        </>
      );

    case 'gf-greenbuild':
      return (
        <>
          <rect x="10" y="13" width="44" height="38" rx="9" fill="none" stroke={main} strokeWidth="5" />
          <path d="m18 25 7 6-7 6M31 39h13" fill="none" stroke={accent} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="47" cy="20" r="3" fill={soft} />
        </>
      );

    case 'gf-pixelbloom':
      return (
        <>
          <rect x="13" y="13" width="15" height="15" rx="5" fill={main} transform="rotate(-8 20.5 20.5)" />
          <rect x="36" y="13" width="15" height="15" rx="5" fill={accent} transform="rotate(8 43.5 20.5)" />
          <rect x="13" y="36" width="15" height="15" rx="5" fill={soft} transform="rotate(8 20.5 43.5)" />
          <rect x="36" y="36" width="15" height="15" rx="5" fill={main} transform="rotate(-8 43.5 43.5)" opacity=".75" />
          <circle cx="32" cy="32" r="5" fill="#eef5ff" />
        </>
      );

    case 'gf-perfectcurve':
      return (
        <>
          <path d="M10 44C18 12 42 12 54 30" fill="none" stroke={main} strokeWidth="6" strokeLinecap="round" />
          <path d="M10 44c18 8 34 4 44-14" fill="none" stroke={accent} strokeWidth="5" strokeLinecap="round" />
          <circle cx="10" cy="44" r="4" fill={soft} />
          <circle cx="54" cy="30" r="4" fill={accent} />
        </>
      );

    case 'gf-gridsoul':
      return (
        <>
          {[14, 27, 40].flatMap((x) =>
            [14, 27, 40].map((y) => (
              <rect
                key={`${x}-${y}`}
                x={x}
                y={y}
                width="10"
                height="10"
                rx="3"
                fill={x === 27 && y === 27 ? accent : main}
                opacity={x === 27 && y === 27 ? 1 : 0.45}
              />
            ))
          )}
          <circle cx="50" cy="14" r="4" fill={soft} />
        </>
      );

    case 'gf-thinkloop':
      return (
        <>
          <path d="M48 20c-4-7-11-11-19-10-11 1-19 10-19 21s8 20 19 21c9 1 17-4 21-12" fill="none" stroke={main} strokeWidth="6" strokeLinecap="round" />
          <path d="M48 20h-9M50 40h-9" stroke={accent} strokeWidth="5" strokeLinecap="round" />
          <circle cx="32" cy="31" r="5" fill={soft} />
        </>
      );

    case 'gf-agentawake':
      return (
        <>
          <circle cx="32" cy="32" r="9" fill={main} />
          <ellipse cx="32" cy="32" rx="22" ry="11" fill="none" stroke={accent} strokeWidth="4" transform="rotate(-18 32 32)" />
          <ellipse cx="32" cy="32" rx="22" ry="11" fill="none" stroke={soft} strokeWidth="3" transform="rotate(54 32 32)" opacity=".8" />
          <circle cx="50" cy="22" r="4" fill={accent} />
        </>
      );

    case 'gf-contextfull':
      return (
        <>
          <path d="M15 42a21 21 0 0 1 34-22" fill="none" stroke={main} strokeWidth="6" strokeLinecap="round" />
          <path d="M20 47a16 16 0 0 0 27-17" fill="none" stroke={accent} strokeWidth="5" strokeLinecap="round" />
          <path d="M25 22a10 10 0 1 1 16 13" fill="none" stroke={soft} strokeWidth="4" strokeLinecap="round" />
          <circle cx="22" cy="20" r="3" fill={accent} />
        </>
      );

    case 'gf-ghostwall':
      return (
        <>
          <path d="M18 12v40" stroke={main} strokeWidth="7" strokeLinecap="round" />
          <path d="M29 18v28M38 22v20M47 27v10" stroke={accent} strokeWidth="5" strokeLinecap="round" opacity=".9" />
          <circle cx="50" cy="32" r="3" fill={soft} />
        </>
      );

    case 'gf-zerotrace':
      return (
        <>
          <circle cx="15" cy="40" r="7" fill={main} />
          <circle cx="31" cy="31" r="5" fill={accent} opacity=".75" />
          <circle cx="44" cy="23" r="3.5" fill={soft} opacity=".45" />
          <circle cx="53" cy="17" r="2" fill={soft} opacity=".2" />
        </>
      );

    case 'gf-huntmark':
      return (
        <>
          <path d="M32 9a23 23 0 1 0 20 12" fill="none" stroke={main} strokeWidth="6" strokeLinecap="round" />
          <circle cx="32" cy="32" r="10" fill="none" stroke={accent} strokeWidth="4" />
          <path d="M32 17v7M32 40v7M17 32h7M40 32h7" stroke={soft} strokeWidth="4" strokeLinecap="round" />
          <circle cx="48" cy="16" r="4" fill={accent} />
        </>
      );

    case 'gf-clientglow':
      return (
        <>
          <circle cx="18" cy="34" r="8" fill={main} />
          <circle cx="46" cy="30" r="8" fill={accent} />
          <path d="M25 32c8-10 13-8 15-5" fill="none" stroke={soft} strokeWidth="5" strokeLinecap="round" />
          <circle cx="32" cy="18" r="4" fill={soft} />
        </>
      );

    case 'gf-scopeclear':
      return (
        <>
          <path d="M14 25V14h11M50 25V14H39M14 39v11h11M50 39v11H39" fill="none" stroke={main} strokeWidth="5" strokeLinecap="round" />
          <rect x="24" y="24" width="16" height="16" rx="5" fill={accent} opacity=".9" />
          <path d="M28 32h8" stroke="#0b0e18" strokeWidth="3" strokeLinecap="round" />
        </>
      );

    case 'gf-delivered':
      return (
        <>
          <path d="m16 23 16-9 16 9-16 9-16-9Z" fill={main} />
          <path d="M16 23v18l16 9 16-9V23" fill="none" stroke={accent} strokeWidth="5" strokeLinejoin="round" />
          <path d="M38 17c8-5 13-3 16 1" fill="none" stroke={soft} strokeWidth="4" strokeLinecap="round" />
        </>
      );

    case 'gf-flowlock':
      return (
        <>
          <path d="M10 17h12c9 0 10 8 18 8h14M10 31h17c7 0 8 0 13 0h14M10 45h12c9 0 10-8 18-8h14" fill="none" stroke={main} strokeWidth="5" strokeLinecap="round" />
          <rect x="43" y="24" width="11" height="14" rx="4" fill={accent} />
        </>
      );

    case 'gf-routepulse':
      return (
        <>
          <path d="M13 45 24 18l15 21 12-20" fill="none" stroke={main} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="13" cy="45" r="5" fill={soft} />
          <circle cx="24" cy="18" r="5" fill={accent} />
          <circle cx="39" cy="39" r="5" fill={main} />
          <circle cx="51" cy="19" r="5" fill={accent} />
        </>
      );

    case 'gf-zerobacklog':
      return (
        <>
          <rect x="13" y="14" width="38" height="8" rx="4" fill={main} />
          <rect x="19" y="28" width="32" height="8" rx="4" fill={accent} />
          <rect x="27" y="42" width="24" height="8" rx="4" fill={soft} />
          <circle cx="12" cy="46" r="4" fill={accent} />
        </>
      );

    case 'gf-respectpulse':
      return (
        <>
          <path d="M10 35c7-13 15-18 22-9 7-9 15-4 22 9" fill="none" stroke={main} strokeWidth="6" strokeLinecap="round" />
          <path d="M18 42c8 8 20 8 28 0" fill="none" stroke={accent} strokeWidth="5" strokeLinecap="round" />
          <circle cx="32" cy="24" r="4" fill={soft} />
        </>
      );

    case 'gf-goodvibe':
      return (
        <>
          <circle cx="32" cy="32" r="22" fill="none" stroke={main} strokeWidth="6" />
          <path d="M15 33c6-8 12-8 17 0s11 8 17 0" fill="none" stroke={accent} strokeWidth="5" strokeLinecap="round" />
          <circle cx="48" cy="16" r="4" fill={soft} />
        </>
      );

    case 'gf-supportlink':
      return (
        <>
          <path d="M13 36c0-8 6-14 14-14h8" fill="none" stroke={main} strokeWidth="7" strokeLinecap="round" />
          <path d="M51 28c0 8-6 14-14 14h-8" fill="none" stroke={accent} strokeWidth="7" strokeLinecap="round" />
          <circle cx="32" cy="32" r="5" fill={soft} />
        </>
      );
  }
};

export const WorkmojiMark = memo(({
  id,
  size = 28,
  className = '',
  title
}: WorkmojiMarkProps) => {
  const uid = useId().replace(/:/g, '');
  const mainId = `wm-main-${uid}`;
  const accentId = `wm-accent-${uid}`;
  const softId = `wm-soft-${uid}`;
  const workmoji = workmojiById.get(id);
  const label = title ?? workmoji?.label ?? 'Goodfeel Workmoji';

  return (
    <svg
      aria-label={label}
      className={`workmoji-mark ${className}`.trim()}
      height={size}
      role="img"
      viewBox="0 0 64 64"
      width={size}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id={mainId} x1="9" x2="54" y1="8" y2="57" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#bd75ff" />
          <stop offset=".5" stopColor="#8656ff" />
          <stop offset="1" stopColor="#6048ff" />
        </linearGradient>
        <linearGradient id={accentId} x1="11" x2="52" y1="50" y2="13" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#67e4ff" />
          <stop offset=".52" stopColor="#55b7ff" />
          <stop offset="1" stopColor="#7770ff" />
        </linearGradient>
        <linearGradient id={softId} x1="12" x2="52" y1="14" y2="52" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#f0eaff" />
          <stop offset=".45" stopColor="#b89cff" />
          <stop offset="1" stopColor="#6fbfff" />
        </linearGradient>
      </defs>

      {renderGlyph(
        id,
        `url(#${mainId})`,
        `url(#${accentId})`,
        `url(#${softId})`
      )}
    </svg>
  );
});

WorkmojiMark.displayName = 'WorkmojiMark';
