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
          <path d="M32 8 37 24l15 5-14 6-5 17-6-16-15-5 14-7 6-16Z" fill={main} />
          <path d="m40 12 2.6 7.2L50 22l-7.4 2.8L40 32l-2.7-7.2L30 22l7.3-2.8L40 12Z" fill={accent} opacity=".82" />
          <circle cx="50" cy="14" r="2.8" fill={soft} />
          <circle cx="15" cy="47" r="2.2" fill={accent} />
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
          <path d="M43 17c-5-6-15-8-23-3-9 5-12 17-7 27 5 9 15 13 24 10 5-2 9-5 12-10" fill="none" stroke={main} strokeWidth="5.6" strokeLinecap="round" />
          <path d="m35 13-9 17h8l-5 18 16-22h-9l7-13Z" fill={accent} />
          <circle cx="18" cy="21" r="2.5" fill={soft} />
          <circle cx="48" cy="17" r="2.2" fill={soft} />
        </>
      );

    case 'gf-stackling':
      return (
        <>
          <path d="M14 12h36l4 5-4 7H14l-4-7 4-5Z" fill={main} />
          <path d="M18 27h32l4 5-4 7H18l-4-7 4-5Z" fill={accent} />
          <path d="M22 42h28l4 5-4 7H22l-4-7 4-5Z" fill={soft} />
          <circle cx="19" cy="18" r="2" fill="#0b1020" opacity=".8" />
          <circle cx="23" cy="33" r="2" fill="#0b1020" opacity=".8" />
          <circle cx="27" cy="48" r="2" fill="#0b1020" opacity=".8" />
        </>
      );

    case 'gf-bugbite':
      return (
        <>
          <path d="M22 20c0-5 4-8 10-8s10 3 10 8v25c0 5-4 8-10 8s-10-3-10-8V20Z" fill="none" stroke={main} strokeWidth="5.2" />
          <path d="M27 12V8M37 12V8M22 25h-7M22 36h-8M42 25h7M42 36h8M27 53v4M37 53v4" stroke={soft} strokeWidth="3.2" strokeLinecap="round" />
          <circle cx="28" cy="28" r="3.2" fill={accent} />
          <path d="m35 27 8 2-5 5 5 5-9 2" fill="none" stroke={accent} strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="48" cy="19" r="2.4" fill={soft} />
        </>
      );

    case 'gf-mergey':
      return (
        <>
          <path d="M13 14c0 17 7 20 19 23 12-3 19-6 19-23" fill="none" stroke={main} strokeWidth="4.8" strokeLinecap="round" />
          <path d="M32 37v15" stroke={accent} strokeWidth="5.2" strokeLinecap="round" />
          <circle cx="13" cy="13" r="4.6" fill={main} />
          <circle cx="51" cy="13" r="4.6" fill={accent} />
          <path d="m27 35 5-5 5 5-5 5-5-5Z" fill={soft} />
          <circle cx="32" cy="53" r="5" fill={accent} />
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
          <rect x="26" y="26" width="12" height="12" rx="3.5" fill={soft} transform="rotate(8 32 32)" />
          <rect x="11" y="23" width="12" height="12" rx="3.5" fill={main} transform="rotate(-12 17 29)" />
          <rect x="41" y="20" width="12" height="12" rx="3.5" fill={accent} transform="rotate(12 47 26)" />
          <rect x="20" y="41" width="11" height="11" rx="3.2" fill={accent} transform="rotate(9 25.5 46.5)" />
          <rect x="39" y="39" width="9" height="9" rx="2.8" fill={main} opacity=".72" transform="rotate(-8 43.5 43.5)" />
          <circle cx="12" cy="14" r="2.4" fill={soft} />
          <circle cx="53" cy="43" r="2" fill={soft} />
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
          <path d="M20 32c0-9 5-16 12-16s12 7 12 16-5 16-12 16-12-7-12-16Z" fill="none" stroke={main} strokeWidth="4.8" />
          <ellipse cx="32" cy="32" rx="23" ry="10" fill="none" stroke={accent} strokeWidth="3.2" transform="rotate(-16 32 32)" />
          <circle cx="32" cy="32" r="5.5" fill={soft} />
          <circle cx="31" cy="31" r="2" fill="#0b1020" />
          <circle cx="50" cy="22" r="3.2" fill={accent} />
        </>
      );

    case 'gf-contextfull':
      return (
        <>
          <path d="M12 38c-1-13 8-24 20-25 11-1 21 7 22 18" fill="none" stroke={main} strokeWidth="4.8" strokeLinecap="round" />
          <path d="M17 44c8 9 24 10 31 0 4-5 5-10 4-15" fill="none" stroke={accent} strokeWidth="4.2" strokeLinecap="round" />
          <path d="M23 24c4-6 13-7 18-2 5 5 4 13-1 18-5 4-12 4-17 0" fill="none" stroke={soft} strokeWidth="3.2" strokeLinecap="round" />
          <circle cx="18" cy="19" r="2.8" fill={accent} />
          <circle cx="43" cy="41" r="2.3" fill={soft} />
        </>
      );

    case 'gf-ghostwall':
      return (
        <>
          <path d="M16 11v42" stroke={main} strokeWidth="5.2" strokeLinecap="round" />
          <path d="M27 17v30M37 21v22M46 25v14" stroke={accent} strokeWidth="4.2" strokeLinecap="round" opacity=".92" />
          <path d="M12 18h8M12 32h8M12 46h8" stroke={soft} strokeWidth="2.4" strokeLinecap="round" opacity=".7" />
          <circle cx="51" cy="32" r="3" fill={soft} />
        </>
      );

    case 'gf-zerotrace':
      return (
        <>
          <path d="M12 45c10-3 15-9 20-15 6-7 11-12 21-14" fill="none" stroke={main} strokeWidth="3.4" strokeLinecap="round" strokeDasharray="1 7" opacity=".72" />
          <circle cx="14" cy="44" r="6" fill={main} />
          <circle cx="30" cy="32" r="4.6" fill={accent} opacity=".78" />
          <circle cx="43" cy="23" r="3.2" fill={soft} opacity=".5" />
          <circle cx="53" cy="16" r="1.8" fill={soft} opacity=".22" />
          <path d="M45 42 18 15" stroke={soft} strokeWidth="3.2" strokeLinecap="round" opacity=".75" />
        </>
      );

    case 'gf-huntmark':
      return (
        <>
          <path d="M32 9a23 23 0 1 0 20 12" fill="none" stroke={main} strokeWidth="4.8" strokeLinecap="round" />
          <circle cx="32" cy="32" r="10" fill="none" stroke={accent} strokeWidth="3.6" />
          <path d="M32 14v10M32 40v10M14 32h10M40 32h10" stroke={soft} strokeWidth="3.2" strokeLinecap="round" />
          <path d="m28 32 4-4 4 4-4 4-4-4Z" fill={soft} />
          <circle cx="49" cy="15" r="3.4" fill={accent} />
        </>
      );

    case 'gf-clientglow':
      return (
        <>
          <circle cx="18" cy="36" r="7.5" fill={main} />
          <circle cx="46" cy="31" r="7.5" fill={accent} />
          <path d="M24 34c7-9 14-10 19-5" fill="none" stroke={soft} strokeWidth="4.2" strokeLinecap="round" />
          <path d="M21 23c6-8 16-9 23-3" fill="none" stroke={main} strokeWidth="2.6" opacity=".55" strokeLinecap="round" />
          <circle cx="32" cy="18" r="3.8" fill={soft} />
        </>
      );

    case 'gf-scopeclear':
      return (
        <>
          <path d="M13 24V13h11M51 24V13H40M13 40v11h11M51 40v11H40" fill="none" stroke={main} strokeWidth="4.2" strokeLinecap="round" />
          <path d="m25 32 7-7 7 7-7 7-7-7Z" fill={accent} />
          <circle cx="32" cy="32" r="3" fill={soft} />
          <path d="M19 32h6M39 32h6" stroke={soft} strokeWidth="2.6" strokeLinecap="round" opacity=".72" />
        </>
      );

    case 'gf-delivered':
      return (
        <>
          <path d="m16 23 16-9 16 9-16 9-16-9Z" fill={main} />
          <path d="M16 23v18l16 9 16-9V23" fill="none" stroke={accent} strokeWidth="4.4" strokeLinejoin="round" />
          <path d="m26 39 4 4 9-10" fill="none" stroke={soft} strokeWidth="3.6" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M39 16c7-4 12-2 15 1" fill="none" stroke={soft} strokeWidth="2.8" strokeLinecap="round" opacity=".7" />
        </>
      );

    case 'gf-flowlock':
      return (
        <>
          <path d="M9 18h12c9 0 10 8 19 8h14M9 32h18c7 0 8 0 14 0h13M9 46h12c9 0 10-8 19-8h14" fill="none" stroke={main} strokeWidth="4.2" strokeLinecap="round" />
          <rect x="42" y="25" width="13" height="15" rx="4.5" fill={accent} />
          <path d="M45 25v-3c0-4 2-6 4-6s4 2 4 6v3" fill="none" stroke={soft} strokeWidth="2.8" strokeLinecap="round" />
          <circle cx="48.5" cy="33" r="1.8" fill="#0b1020" />
        </>
      );

    case 'gf-routepulse':
      return (
        <>
          <path d="M12 46 23 18l16 21 13-20" fill="none" stroke={main} strokeWidth="4.2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M17 34h6l3-8 6 16 4-8h6" fill="none" stroke={soft} strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" opacity=".78" />
          <circle cx="12" cy="46" r="4.3" fill={soft} />
          <circle cx="23" cy="18" r="4.3" fill={accent} />
          <circle cx="39" cy="39" r="4.3" fill={main} />
          <circle cx="52" cy="19" r="4.3" fill={accent} />
        </>
      );

    case 'gf-zerobacklog':
      return (
        <>
          <path d="M13 16h38M19 30h32M27 44h24" stroke={main} strokeWidth="6.2" strokeLinecap="round" />
          <circle cx="13" cy="16" r="4.2" fill={soft} />
          <circle cx="19" cy="30" r="3.5" fill={accent} />
          <circle cx="27" cy="44" r="3" fill={soft} />
          <path d="m13 50 7 5 11-12" fill="none" stroke={accent} strokeWidth="3.6" strokeLinecap="round" strokeLinejoin="round" />
        </>
      );

    case 'gf-respectpulse':
      return (
        <>
          <path d="M10 36c6-12 14-18 22-9 8-9 16-3 22 9" fill="none" stroke={main} strokeWidth="4.8" strokeLinecap="round" />
          <path d="M18 43c8 7 20 7 28 0" fill="none" stroke={accent} strokeWidth="4.2" strokeLinecap="round" />
          <path d="M23 20c3-4 6-5 9-1 3-4 6-3 9 1-1 6-5 9-9 12-4-3-8-6-9-12Z" fill={soft} />
        </>
      );

    case 'gf-goodvibe':
      return (
        <>
          <circle cx="32" cy="32" r="22" fill="none" stroke={main} strokeWidth="4.5" />
          <path d="M14 33c6-8 12-8 18 0s12 8 18 0" fill="none" stroke={accent} strokeWidth="4.2" strokeLinecap="round" />
          <path d="M18 24c4-4 8-4 12 0M35 22c4-4 8-4 11 0" fill="none" stroke={soft} strokeWidth="2.4" strokeLinecap="round" opacity=".7" />
          <circle cx="48" cy="16" r="3.3" fill={soft} />
        </>
      );

    case 'gf-supportlink':
      return (
        <>
          <path d="M12 37c0-9 6-15 15-15h9" fill="none" stroke={main} strokeWidth="5.4" strokeLinecap="round" />
          <path d="M52 27c0 9-6 15-15 15h-9" fill="none" stroke={accent} strokeWidth="5.4" strokeLinecap="round" />
          <path d="m26 32 6-6 6 6-6 6-6-6Z" fill={soft} />
          <circle cx="16" cy="22" r="2.6" fill={soft} />
          <circle cx="48" cy="42" r="2.6" fill={soft} />
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
