import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

// Sheet: the document surface of the PAPER TRAIL system. A near-white page
// sitting on the warm paper canvas with a hairline border, square-ish 3px
// corners, and a print shadow. `shadow="soft"` is the default resting sheet;
// `shadow="offset"` is the hard 4px offset used on artifacts (ballot
// clipping, utility statement, work order). `perforated` prints a dashed
// tear line across the top for ballot / receipt sheets. Purely
// presentational: wrap in a motion element for entrances.

export interface SheetProps {
  children: ReactNode;
  /** 'soft' = resting print shadow. 'offset' = hard 4px artifact shadow. */
  shadow?: 'soft' | 'offset';
  /** Prints a dashed tear line inside the top edge. */
  perforated?: boolean;
  /** Rendered element, e.g. 'section', 'article', 'figure'. Default 'div'. */
  as?: 'div' | 'section' | 'article' | 'figure' | 'aside' | 'li';
  className?: string;
}

export function Sheet({
  children,
  shadow = 'soft',
  perforated = false,
  as = 'div',
  className,
}: SheetProps) {
  const Tag = as as 'div';
  return (
    <Tag
      className={cn(
        'relative rounded-[3px] border border-hairline bg-sheet',
        shadow === 'soft' ? 'shadow-print' : 'shadow-print-offset',
        className
      )}
    >
      {perforated && <div aria-hidden="true" className="perforation mx-5 mt-4 sm:mx-6" />}
      {children}
    </Tag>
  );
}

export default Sheet;
