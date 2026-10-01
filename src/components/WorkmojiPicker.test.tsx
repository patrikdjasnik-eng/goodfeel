import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { workmojiCatalog, workmojiCategories, workmojiById } from '../workmoji/catalog';
import { WorkmojiPicker } from './WorkmojiPicker';

const setupPicker = () => {
  const onClose = vi.fn();
  const onSelect = vi.fn();

  const view = render(<WorkmojiPicker onClose={onClose} onSelect={onSelect} />);

  return { ...view, onClose, onSelect };
};

const visibleOptions = (container: HTMLElement) =>
  Array.from(container.querySelectorAll('.workmoji-option'));

describe('WorkmojiPicker', () => {
  it('nabízí všechny kategorie a v náhledu první Workmoji', () => {
    const { container } = setupPicker();
    const first = workmojiCatalog[0];

    expect(screen.getAllByRole('tab')).toHaveLength(workmojiCategories.length);
    expect(visibleOptions(container)).toHaveLength(workmojiCatalog.length);
    expect(screen.getByRole('dialog', { name: 'Goodfeel Workmoji' })).toBeInTheDocument();
    expect(screen.getAllByText(first.label).length).toBeGreaterThan(0);
    expect(screen.getByText(first.description)).toBeInTheDocument();
  });

  it('filtr kategorie zobrazí jen Workmoji dané kategorie', async () => {
    const user = userEvent.setup();
    const { container } = setupPicker();

    await user.click(screen.getByRole('tab', { name: 'Code' }));

    const expected = workmojiCatalog.filter((workmoji) => workmoji.category === 'code');
    expect(visibleOptions(container)).toHaveLength(expected.length);
    expect(screen.queryByRole('button', { name: /Good Spark/ })).toBeNull();
    expect(screen.getByRole('tab', { name: 'Code' })).toHaveAttribute('aria-selected', 'true');
  });

  it('předá vybraný Workmoji do onSelect', async () => {
    const user = userEvent.setup();
    const { onSelect } = setupPicker();

    await user.click(screen.getByRole('button', { name: 'Good Spark: Tohle má dobrý feeling.' }));

    expect(onSelect).toHaveBeenCalledTimes(1);
    expect(onSelect).toHaveBeenCalledWith(workmojiById.get('gf-spark'));
  });

  it('zavře se klávesou Escape', async () => {
    const user = userEvent.setup();
    const { onClose } = setupPicker();

    await user.keyboard('{Escape}');

    expect(onClose).toHaveBeenCalledTimes(1);
  });
});