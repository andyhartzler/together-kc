import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { accentInk } from '@/components/august/accent';

// FileTab: the measure-swatch tab notched into a sheet edge, in doc-label
// type. Takes the RAW swatch as fill; text ink resolves through the accent
// ink map (navy on golden/sunrise, paper on sky/navy/coral) unless
// overridden. Position it yourself: it renders in flow, so a typical use is
// absolute placement hanging off a Sheet's top edge, or a negative top
// margin on the first child.

export interface FileTabProps {
  children: ReactNode;
  /** Tab fill. Raw accent swatch or accent name ('Sky', 'golden'). */
  color: string;
  /** Text ink override. Default accentInk(color).textOnField. */
  ink?: string;
  /** 'trapezoid' = slanted file-folder sides. 'rect' = square tab. */
  shape?: 'trapezoid' | 'rect';
  className?: string;
}

export function FileTab({ children, color, ink, shape = 'trapezoid', className }: FileTabProps) {
  const inks = accentInk(color);
  return (
    <span
      className={cn('type-doc-label inline-block px-4 pb-1 pt-1.5 leading-none', className)}
      style={{
        backgroundColor: inks.field,
        color: ink ?? inks.textOnField,
        clipPath:
          shape === 'trapezoid'
            ? 'polygon(0 100%, 8px 0, calc(100% - 8px) 0, 100% 100%)'
            : undefined,
      }}
    >
      {children}
    </span>
  );
}

export default FileTab;
