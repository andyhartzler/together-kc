import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

// LedgerRow: the "label ..... figure" row of the PAPER TRAIL system. Label
// on the left (wraps to two lines at 320px), dotted leader filling the gap,
// tabular figure bottom-aligned on the right. `total` prints the double
// rule-total above the row and sets the label in tracked caps. Purely
// presentational: for the posting animation, wrap rows in motion elements
// using riseVariants + ledgerDelay from './motion'.

export function Leader({ className }: { className?: string }) {
  return <span aria-hidden="true" className={cn('leader', className)} />;
}

const LABEL_SIZE = {
  sm: 'text-[0.8125rem]',
  md: 'text-[0.9375rem]',
  lg: 'text-base',
} as const;

const FIGURE_SIZE = {
  sm: 'text-[0.9375rem]',
  md: 'text-[1.0625rem]',
  lg: 'text-[1.25rem]',
} as const;

export interface LedgerRowProps {
  label: ReactNode;
  figure: ReactNode;
  /** Fine-print second line under the label (address, caption). */
  sublabel?: ReactNode;
  /** Figure color override, e.g. accentInk(name).inkOnPaper. Default ink. */
  figureColor?: string;
  /** Total row: double rule above, label in tracked caps, w800 figure. */
  total?: boolean;
  size?: 'sm' | 'md' | 'lg';
  /** Rendered element. Default 'div'; use 'li' inside ledger lists. */
  as?: 'div' | 'li';
  className?: string;
  labelClassName?: string;
  figureClassName?: string;
}

export function LedgerRow({
  label,
  figure,
  sublabel,
  figureColor,
  total = false,
  size = 'md',
  as = 'div',
  className,
  labelClassName,
  figureClassName,
}: LedgerRowProps) {
  const Tag = as as 'div';
  return (
    <Tag className={cn('block', className)}>
      {total && <span aria-hidden="true" className="rule-total block" />}
      <div className={cn('flex items-end gap-2', total && 'pt-2')}>
        <span
          className={cn(
            'min-w-0 text-ink',
            LABEL_SIZE[size],
            total ? 'font-bold uppercase tracking-[0.08em]' : 'font-medium',
            labelClassName
          )}
        >
          {label}
          {sublabel && (
            <span className="type-fine block font-normal normal-case tracking-normal">
              {sublabel}
            </span>
          )}
        </span>
        <Leader />
        <span
          className={cn(
            'shrink-0 whitespace-nowrap text-ink tabular-nums',
            FIGURE_SIZE[size],
            total ? 'font-extrabold' : 'font-bold',
            figureClassName
          )}
          style={figureColor ? { color: figureColor } : undefined}
        >
          {figure}
        </span>
      </div>
    </Tag>
  );
}

export default LedgerRow;
