import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/react';
import { WorkmojiText } from './WorkmojiText';

describe('WorkmojiText', () => {
  it('zobrazí běžný text beze změny', () => {
    const { container } = render(<WorkmojiText text="Ahoj světe" />);

    expect(container).toHaveTextContent('Ahoj světe');
  });

  it('nahradí známý token inline Workmoji komponentou', () => {
    const { container } = render(<WorkmojiText text="Mám :gf-spark: nápad" />);

    expect(container).toHaveTextContent('Mám nápad');
    expect(container.querySelector('.workmoji-inline')).not.toBeNull();
  });

  it('ponechá neznámý token jako běžný text', () => {
    const { container } = render(<WorkmojiText text="Tohle :gf-neexistuje: zůstává" />);

    expect(container.querySelector('.workmoji-inline')).toBeNull();
    expect(container).toHaveTextContent(':gf-neexistuje:');
  });

  it('zpracuje víc tokenů naráz ve správném pořadí', () => {
    const { container } = render(<WorkmojiText text=":gf-proof: pak :gf-flow:" />);

    expect(container.querySelectorAll('.workmoji-inline')).toHaveLength(2);
    expect(container).toHaveTextContent('pak');
  });

  it('nepřelomí známý token bez okolních mezer', () => {
    const { container } = render(<WorkmojiText text="dokončeno:gf-delivered:!" />);

    expect(container.querySelector('.workmoji-inline')).not.toBeNull();
  });
});