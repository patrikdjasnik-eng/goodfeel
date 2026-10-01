import { describe, expect, it } from 'vitest';
import {
  workmojiById,
  workmojiByToken,
  workmojiCatalog,
  workmojiCategories,
  workmojiTokenPattern
} from './catalog';

describe('workmoji katalog', () => {
  it('má kompletní katalog s unikátními id i tokeny', () => {
    const ids = workmojiCatalog.map((workmoji) => workmoji.id);
    const tokens = workmojiCatalog.map((workmoji) => workmoji.token);

    expect(workmojiCatalog.length).toBeGreaterThan(0);
    expect(new Set(ids).size).toBe(ids.length);
    expect(new Set(tokens).size).toBe(tokens.length);
  });

  it('každý token odpovídá vyhledávacímu vzoru použitému při renderování', () => {
    workmojiCatalog.forEach((workmoji) => {
      expect(workmoji.token).toMatch(/^:gf-[a-z0-9-]+:$/);

      workmojiTokenPattern.lastIndex = 0;
      expect(workmojiTokenPattern.test(workmoji.token)).toBe(true);
    });
  });

  it('kategorie použití v katalogu odpovídají tabům pickeru', () => {
    const pickerCategoryIds = new Set(workmojiCategories.map(({ id }) => id));
    const usedCategories = new Set(workmojiCatalog.map(({ category }) => category));

    usedCategories.forEach((category) => {
      expect(pickerCategoryIds.has(category)).toBe(true);
    });
  });

  it('workmojiByToken a workmojiById pokrývají celý katalog', () => {
    expect(workmojiByToken.size).toBe(workmojiCatalog.length);
    expect(workmojiById.size).toBe(workmojiCatalog.length);

    workmojiCatalog.forEach((workmoji) => {
      expect(workmojiByToken.get(workmoji.token)).toBe(workmoji);
      expect(workmojiById.get(workmoji.id)).toBe(workmoji);
    });
  });

  it('katalog neobsahuje tokeny, které by vzor nerozpoznal z více slov', () => {
    workmojiCatalog.forEach((workmoji) => {
      expect(workmoji.token.split(/:gf-|:/).filter(Boolean)[0]).toMatch(/^[a-z0-9-]+$/);
    });
  });
});