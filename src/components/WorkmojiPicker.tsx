import { memo, useEffect, useMemo, useState } from 'react';
import { X } from 'lucide-react';
import { WorkmojiMark } from './WorkmojiMark';
import {
  workmojiCatalog,
  workmojiCategories,
  type WorkmojiCategory,
  type WorkmojiDefinition
} from '../workmoji/catalog';

interface WorkmojiPickerProps {
  onClose: () => void;
  onSelect: (workmoji: WorkmojiDefinition) => void;
}

export const WorkmojiPicker = memo(({ onClose, onSelect }: WorkmojiPickerProps) => {
  const [category, setCategory] = useState<'all' | WorkmojiCategory>('all');
  const [preview, setPreview] = useState<WorkmojiDefinition>(workmojiCatalog[0]);

  const visibleWorkmoji = useMemo(
    () =>
      category === 'all'
        ? workmojiCatalog
        : workmojiCatalog.filter((workmoji) => workmoji.category === category),
    [category]
  );

  useEffect(() => {
    const firstVisible = visibleWorkmoji[0];

    if (firstVisible) {
      setPreview(firstVisible);
    }
  }, [visibleWorkmoji]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  return (
    <section
      aria-label="Goodfeel Workmoji"
      className="workmoji-picker"
      role="dialog"
    >
      <header className="workmoji-picker-head">
        <div>
          <strong>Goodfeel Workmoji</strong>
          <span>Každý obor má vlastní způsob, jak říct „tohle sedí“.</span>
        </div>
        <button
          aria-label="Zavřít Workmoji"
          className="workmoji-close"
          onClick={onClose}
          type="button"
        >
          <X size={18} />
        </button>
      </header>

      <div className="workmoji-preview">
        <div className="workmoji-preview-mark">
          <WorkmojiMark id={preview.id} size={76} />
        </div>
        <div>
          <span>{preview.category}</span>
          <strong>{preview.label}</strong>
          <p>{preview.description}</p>
        </div>
      </div>

      <div className="workmoji-tabs" role="tablist" aria-label="Kategorie Workmoji">
        {workmojiCategories.map((item) => (
          <button
            aria-selected={category === item.id}
            className={category === item.id ? 'active' : ''}
            key={item.id}
            onClick={() => setCategory(item.id)}
            role="tab"
            type="button"
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="workmoji-grid">
        {visibleWorkmoji.map((workmoji) => (
          <button
            aria-label={`${workmoji.label}: ${workmoji.description}`}
            className={preview.id === workmoji.id ? 'workmoji-option previewed' : 'workmoji-option'}
            key={workmoji.id}
            onClick={() => onSelect(workmoji)}
            onFocus={() => setPreview(workmoji)}
            onMouseEnter={() => setPreview(workmoji)}
            title={`${workmoji.label} — ${workmoji.description}`}
            type="button"
          >
            <WorkmojiMark id={workmoji.id} size={38} />
            <span>{workmoji.label}</span>
          </button>
        ))}
      </div>
    </section>
  );
});

WorkmojiPicker.displayName = 'WorkmojiPicker';
