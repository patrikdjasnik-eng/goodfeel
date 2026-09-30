import { memo, useId, type ReactNode } from 'react';
import type { WorkmojiCategory, WorkmojiId } from '../workmoji/catalog';
import { workmojiById } from '../workmoji/catalog';

interface WorkmojiMarkProps {
  id: WorkmojiId;
  size?: number;
  className?: string;
  title?: string;
}

interface WorkmojiPalette {
  mainStart: string;
  mainEnd: string;
  accentStart: string;
  accentEnd: string;
  soft: string;
  shellStart: string;
  shellEnd: string;
}

const categoryPalette: Record<WorkmojiCategory, WorkmojiPalette> = {
  goodfeel: {
    mainStart: '#c082ff',
    mainEnd: '#684cff',
    accentStart: '#6de8ff',
    accentEnd: '#5c8dff',
    soft: '#e9ddff',
    shellStart: '#20173c',
    shellEnd: '#10162a'
  },
  code: {
    mainStart: '#9e72ff',
    mainEnd: '#574bff',
    accentStart: '#65ecff',
    accentEnd: '#4f9cff',
    soft: '#cfefff',
    shellStart: '#151d35',
    shellEnd: '#0b1121'
  },
  design: {
    mainStart: '#d17fff',
    mainEnd: '#7c58ff',
    accentStart: '#72dfff',
    accentEnd: '#a26dff',
    soft: '#f0dcff',
    shellStart: '#261630',
    shellEnd: '#121323'
  },
  ai: {
    mainStart: '#ae79ff',
    mainEnd: '#5b5cff',
    accentStart: '#75efff',
    accentEnd: '#6488ff',
    soft: '#d8ecff',
    shellStart: '#171936',
    shellEnd: '#0a1123'
  },
  cyber: {
    mainStart: '#8b72ff',
    mainEnd: '#4f56d8',
    accentStart: '#5ff1d8',
    accentEnd: '#50a7ff',
    soft: '#c9fff4',
    shellStart: '#10242e',
    shellEnd: '#0a101d'
  },
  freelance: {
    mainStart: '#c384ff',
    mainEnd: '#6c54ed',
    accentStart: '#78d9ff',
    accentEnd: '#7b86ff',
    soft: '#f1e6ff',
    shellStart: '#241936',
    shellEnd: '#111322'
  },
  operations: {
    mainStart: '#9b73ff',
    mainEnd: '#5360e8',
    accentStart: '#67e7c9',
    accentEnd: '#56a9ff',
    soft: '#d9fff1',
    shellStart: '#13242d',
    shellEnd: '#0c1220'
  },
  community: {
    mainStart: '#c27dff',
    mainEnd: '#7650f0',
    accentStart: '#72e3ff',
    accentEnd: '#7c7dff',
    soft: '#f3e9ff',
    shellStart: '#25182f',
    shellEnd: '#111320'
  }
};

const renderShell = (
  category: WorkmojiCategory,
  shell: string,
  shellEdge: string,
  accent: string
): ReactNode => {
  const common = (
    <>
      <circle
        cx="32"
        cy="32"
        r="27"
        fill="none"
        stroke={accent}
        strokeWidth="1"
        strokeDasharray="2 6"
        opacity=".18"
      />
      <circle cx="32" cy="32" r="22.5" fill="none" stroke="rgba(255,255,255,.045)" strokeWidth="1" />
    </>
  );

  switch (category) {
    case 'goodfeel':
      return (
        <>
          <path
            d="M32 5C46 5 57 16 57 30c0 15-10 26-25 29C17 56 7 45 7 31 7 16 18 5 32 5Z"
            fill={shell}
            stroke={shellEdge}
            strokeWidth="1.5"
          />
          <path d="M15 20c8-10 26-13 36-4" fill="none" stroke="rgba(255,255,255,.16)" strokeWidth="2" strokeLinecap="round" />
          {common}
        </>
      );
    case 'code':
      return (
        <>
          <rect x="6" y="6" width="52" height="52" rx="16" fill={shell} stroke={shellEdge} strokeWidth="1.5" />
          <path d="M15 16h25" stroke="rgba(255,255,255,.12)" strokeWidth="2" strokeLinecap="round" />
          <circle cx="47" cy="16" r="2.4" fill={accent} opacity=".68" />
          {common}
        </>
      );
    case 'design':
      return (
        <>
          <rect x="7" y="7" width="50" height="50" rx="18" fill={shell} stroke={shellEdge} strokeWidth="1.5" transform="rotate(-6 32 32)" />
          <path d="M17 49c8 5 22 5 31-2" fill="none" stroke={accent} strokeWidth="1.2" opacity=".2" strokeLinecap="round" />
          <circle cx="47" cy="17" r="2.7" fill={accent} opacity=".72" />
          {common}
        </>
      );
    case 'ai':
      return (
        <>
          <circle cx="32" cy="32" r="26" fill={shell} stroke={shellEdge} strokeWidth="1.5" />
          <ellipse cx="32" cy="32" rx="25" ry="11" fill="none" stroke={accent} strokeWidth="1.2" opacity=".24" transform="rotate(-18 32 32)" />
          <ellipse cx="32" cy="32" rx="19" ry="25" fill="none" stroke={accent} strokeWidth=".9" opacity=".1" transform="rotate(28 32 32)" />
          {common}
        </>
      );
    case 'cyber':
      return (
        <>
          <path d="M32 5 55 14v17c0 14-9 23-23 29C18 54 9 45 9 31V14L32 5Z" fill={shell} stroke={shellEdge} strokeWidth="1.5" />
          <path d="M18 18 32 12l14 6" fill="none" stroke="rgba(255,255,255,.1)" strokeWidth="2" strokeLinecap="round" />
          <path d="M18 46 32 53l14-7" fill="none" stroke={accent} strokeWidth="1" opacity=".16" strokeLinecap="round" />
          {common}
        </>
      );
    case 'freelance':
      return (
        <>
          <path d="M12 17c8-9 32-11 41 1 8 11 3 29-8 36-10 7-29 5-36-6-7-10-5-22 3-31Z" fill={shell} stroke={shellEdge} strokeWidth="1.5" />
          <path d="M16 43c10 10 26 11 36 1" fill="none" stroke={accent} strokeWidth="1.1" opacity=".18" strokeLinecap="round" />
          <circle cx="48" cy="18" r="2.7" fill={accent} opacity=".66" />
          {common}
        </>
      );
    case 'operations':
      return (
        <>
          <path d="m32 5 23 13v28L32 59 9 46V18L32 5Z" fill={shell} stroke={shellEdge} strokeWidth="1.5" />
          <path d="M17 20 32 12l15 8" fill="none" stroke="rgba(255,255,255,.1)" strokeWidth="2" strokeLinecap="round" />
          <path d="M14 40 32 51l18-10" fill="none" stroke={accent} strokeWidth="1.1" opacity=".18" />
          {common}
        </>
      );
    case 'community':
      return (
        <>
          <path d="M10 31c0-13 9-22 21-22 8 0 14 3 18 9 8 2 13 9 13 18 0 11-8 19-20 19-5 0-9-1-13-4-3 2-7 3-11 3-11 0-18-9-18-19 0-7 4-13 10-16Z" fill={shell} stroke={shellEdge} strokeWidth="1.5" />
          <circle cx="47" cy="18" r="2.7" fill={accent} opacity=".68" />
          {common}
        </>
      );
  }
};

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
          <path d="m32 8 16 8-2 20-14 18-14-18-2-20 16-8Z" fill="none" stroke={main} strokeWidth="5.5" strokeLinejoin="round" />
          <path d="m32 16 9 5-1 12-8 10-8-10-1-12 9-5Z" fill="none" stroke={accent} strokeWidth="3.2" strokeLinejoin="round" />
          <circle cx="32" cy="29" r="4.5" fill={soft} />
          <path d="m29.5 29 2 2 4-5" fill="none" stroke="#0b1020" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
        </>
      );

    case 'gf-flow':
      return (
        <>
          <path d="M8 21c9-5 14 8 24 5 8-2 11-10 24-7" fill="none" stroke={main} strokeWidth="5.5" strokeLinecap="round" />
          <path d="M8 33c10-4 15 8 25 5 8-2 11-9 23-6" fill="none" stroke={accent} strokeWidth="5" strokeLinecap="round" />
          <path d="M10 45c9-3 14 6 23 4 7-2 10-7 19-6" fill="none" stroke={soft} strokeWidth="3.8" strokeLinecap="round" opacity=".9" />
          <circle cx="20" cy="26" r="2.4" fill={soft} />
          <circle cx="44" cy="34" r="2.2" fill={main} />
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
          <path d="M14 17h36l4 8-4 22H14l-4-22 4-8Z" fill="none" stroke={main} strokeWidth="4.8" strokeLinejoin="round" />
          <path d="m21 30 6 5-6 5M32 40h11" fill="none" stroke={accent} strokeWidth="4.6" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M18 21h20" stroke={soft} strokeWidth="2.6" strokeLinecap="round" opacity=".85" />
          <circle cx="45" cy="21" r="3" fill={soft} />
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
          <path d="M10 45C17 14 41 10 54 28" fill="none" stroke={main} strokeWidth="5.4" strokeLinecap="round" />
          <path d="M10 45c17 6 34 3 44-17" fill="none" stroke={accent} strokeWidth="3.8" strokeLinecap="round" />
          <path d="M10 45 18 19M54 28 46 12" fill="none" stroke={soft} strokeWidth="1.8" opacity=".58" strokeLinecap="round" />
          <circle cx="10" cy="45" r="4.2" fill={soft} />
          <circle cx="18" cy="19" r="2.8" fill={main} />
          <circle cx="46" cy="12" r="2.8" fill={accent} />
          <circle cx="54" cy="28" r="4.2" fill={accent} />
        </>
      );

    case 'gf-gridsoul':
      return (
        <>
          {[15, 27, 39].flatMap((x) =>
            [15, 27, 39].map((y) => {
              const center = x === 27 && y === 27;
              const distance = Math.abs(x - 27) + Math.abs(y - 27);

              return (
                <rect
                  key={`${x}-${y}`}
                  x={x}
                  y={y}
                  width={center ? 12 : 9}
                  height={center ? 12 : 9}
                  rx={center ? 4 : 3}
                  fill={center ? accent : main}
                  opacity={center ? 1 : distance > 18 ? 0.34 : 0.58}
                  transform={center ? 'translate(-1 -1) rotate(8 33 33)' : undefined}
                />
              );
            })
          )}
          <circle cx="50" cy="14" r="3.6" fill={soft} />
          <path d="M46 18 40 24" stroke={soft} strokeWidth="2" opacity=".55" strokeLinecap="round" />
        </>
      );

    case 'gf-thinkloop':
      return (
        <>
          <ellipse cx="32" cy="32" rx="22" ry="13" fill="none" stroke={main} strokeWidth="4.8" transform="rotate(-18 32 32)" />
          <ellipse cx="32" cy="32" rx="18" ry="10" fill="none" stroke={accent} strokeWidth="3.6" transform="rotate(36 32 32)" opacity=".95" />
          <path d="M19 45c5 6 15 9 24 4" fill="none" stroke={soft} strokeWidth="3" strokeLinecap="round" />
          <circle cx="32" cy="32" r="5.5" fill={soft} />
          <circle cx="47" cy="20" r="3" fill={accent} />
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


const glyphTuning: Record<WorkmojiId, { x: number; y: number; scale: number; rotate?: number }> = {
  'gf-spark': { x: 8.6, y: 8.6, scale: 0.73, rotate: -2 },
  'gf-proof': { x: 8.2, y: 8.2, scale: 0.74 },
  'gf-flow': { x: 7.2, y: 7.2, scale: 0.78 },
  'gf-brainhit': { x: 8.1, y: 8.1, scale: 0.75 },
  'gf-stackling': { x: 8.3, y: 8.3, scale: 0.74 },
  'gf-bugbite': { x: 7.5, y: 7.5, scale: 0.77 },
  'gf-mergey': { x: 8.1, y: 8.1, scale: 0.75 },
  'gf-greenbuild': { x: 7.4, y: 7.4, scale: 0.77 },
  'gf-pixelbloom': { x: 8.2, y: 8.2, scale: 0.75, rotate: -1 },
  'gf-perfectcurve': { x: 7.2, y: 7.2, scale: 0.78 },
  'gf-gridsoul': { x: 7.6, y: 7.6, scale: 0.77 },
  'gf-thinkloop': { x: 7.6, y: 7.6, scale: 0.77 },
  'gf-agentawake': { x: 7.5, y: 7.5, scale: 0.77 },
  'gf-contextfull': { x: 7.7, y: 7.7, scale: 0.76 },
  'gf-ghostwall': { x: 8.2, y: 8.2, scale: 0.75 },
  'gf-zerotrace': { x: 7.8, y: 7.8, scale: 0.76 },
  'gf-huntmark': { x: 7.4, y: 7.4, scale: 0.77 },
  'gf-clientglow': { x: 7.8, y: 7.8, scale: 0.76 },
  'gf-scopeclear': { x: 7.7, y: 7.7, scale: 0.76 },
  'gf-delivered': { x: 7.7, y: 7.7, scale: 0.76 },
  'gf-flowlock': { x: 7.2, y: 7.2, scale: 0.78 },
  'gf-routepulse': { x: 7.3, y: 7.3, scale: 0.78 },
  'gf-zerobacklog': { x: 7.7, y: 7.7, scale: 0.76 },
  'gf-respectpulse': { x: 7.4, y: 7.4, scale: 0.77 },
  'gf-goodvibe': { x: 7.4, y: 7.4, scale: 0.77 },
  'gf-supportlink': { x: 7.3, y: 7.3, scale: 0.78 }
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
  const shellId = `wm-shell-${uid}`;
  const shellEdgeId = `wm-shell-edge-${uid}`;
  const workmoji = workmojiById.get(id);
  const category = workmoji?.category ?? 'goodfeel';
  const palette = categoryPalette[category];
  const label = title ?? workmoji?.label ?? 'Goodfeel Workmoji';
  const tuning = glyphTuning[id];
  const glyphTransform = `translate(${tuning.x} ${tuning.y}) scale(${tuning.scale}) rotate(${tuning.rotate ?? 0} 32 32)`;

  return (
    <svg
      aria-label={label}
      className={`workmoji-mark workmoji-mark-${category} ${className}`.trim()}
      height={size}
      role="img"
      viewBox="0 0 64 64"
      width={size}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id={mainId} x1="9" x2="54" y1="8" y2="57" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor={palette.mainStart} />
          <stop offset="1" stopColor={palette.mainEnd} />
        </linearGradient>
        <linearGradient id={accentId} x1="11" x2="52" y1="50" y2="13" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor={palette.accentStart} />
          <stop offset="1" stopColor={palette.accentEnd} />
        </linearGradient>
        <linearGradient id={softId} x1="12" x2="52" y1="14" y2="52" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor={palette.soft} />
          <stop offset="1" stopColor={palette.accentEnd} />
        </linearGradient>
        <linearGradient id={shellId} x1="10" x2="54" y1="7" y2="58" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor={palette.shellStart} />
          <stop offset="1" stopColor={palette.shellEnd} />
        </linearGradient>
        <linearGradient id={shellEdgeId} x1="12" x2="52" y1="8" y2="58" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor={palette.mainStart} stopOpacity=".32" />
          <stop offset=".55" stopColor={palette.accentStart} stopOpacity=".16" />
          <stop offset="1" stopColor="#ffffff" stopOpacity=".05" />
        </linearGradient>
      </defs>

      <g className="workmoji-aura" aria-hidden="true">
        <circle cx="32" cy="32" r="29.2" fill="none" stroke={`url(#${accentId})`} strokeWidth=".8" strokeDasharray="1 7" opacity=".22" />
        <circle cx="16" cy="46" r="1.5" fill={`url(#${softId})`} opacity=".78" />
        <circle cx="49" cy="14" r="1.2" fill={`url(#${accentId})`} opacity=".82" />
      </g>

      <g className="workmoji-shell">
        {renderShell(
          category,
          `url(#${shellId})`,
          `url(#${shellEdgeId})`,
          `url(#${accentId})`
        )}
      </g>

      <g className="workmoji-glyph" transform={glyphTransform}>
        {renderGlyph(
          id,
          `url(#${mainId})`,
          `url(#${accentId})`,
          `url(#${softId})`
        )}
      </g>

      <path
        className="workmoji-glint"
        d="M18 13c8-5 20-6 28-1"
        fill="none"
        stroke="rgba(255,255,255,.16)"
        strokeLinecap="round"
        strokeWidth="1.6"
      />
      <circle className="workmoji-core-dot" cx="47.5" cy="47" r="1.35" fill={`url(#${softId})`} opacity=".72" />
    </svg>
  );
});

WorkmojiMark.displayName = 'WorkmojiMark';
