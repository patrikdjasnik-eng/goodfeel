import { memo, useMemo } from 'react';

interface AvatarTokenProps {
  name: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  active?: boolean;
  online?: boolean;
  className?: string;
}

const toneFromName = (name: string): 'violet' | 'blue' | 'cyan' => {
  const value = Array.from(name).reduce(
    (sum, character) => sum + character.charCodeAt(0),
    0
  );

  if (value % 3 === 0) return 'violet';
  if (value % 3 === 1) return 'blue';
  return 'cyan';
};

export const AvatarToken = memo(({
  name,
  size = 'md',
  active = false,
  online = false,
  className = ''
}: AvatarTokenProps) => {
  const initial = useMemo(
    () => name.trim().charAt(0).toUpperCase() || '?',
    [name]
  );
  const tone = useMemo(() => toneFromName(name), [name]);

  return (
    <span
      aria-label={name}
      className={[
        'avatar-token',
        `avatar-token-${size}`,
        `avatar-token-${tone}`,
        active ? 'is-active' : '',
        online ? 'is-online' : '',
        className
      ]
        .filter(Boolean)
        .join(' ')}
      role="img"
      title={name}
    >
      <span className="avatar-token-orbit" aria-hidden="true" />
      <span className="avatar-token-core" aria-hidden="true" />
      <span className="avatar-token-letter">{initial}</span>
      {online && <span className="avatar-token-status" aria-label="Online" />}
    </span>
  );
});

AvatarToken.displayName = 'AvatarToken';
