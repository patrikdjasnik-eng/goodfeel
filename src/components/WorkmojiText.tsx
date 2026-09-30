import { Fragment, memo } from 'react';
import { WorkmojiMark } from './WorkmojiMark';
import {
  workmojiByToken,
  workmojiTokenPattern,
  type WorkmojiId
} from '../workmoji/catalog';

interface WorkmojiTextProps {
  text: string;
}

export const WorkmojiText = memo(({ text }: WorkmojiTextProps) => {
  const parts = text.split(workmojiTokenPattern);

  return (
    <>
      {parts.map((part, index) => {
        const workmoji = workmojiByToken.get(part);

        if (!workmoji) {
          return <Fragment key={`${part}-${index}`}>{part}</Fragment>;
        }

        return (
          <span
            className="workmoji-inline"
            key={`${workmoji.id}-${index}`}
            title={workmoji.label}
          >
            <WorkmojiMark id={workmoji.id as WorkmojiId} size={22} />
          </span>
        );
      })}
    </>
  );
});

WorkmojiText.displayName = 'WorkmojiText';
