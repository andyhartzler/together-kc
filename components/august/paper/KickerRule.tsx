import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

// KickerRule: the lockup that replaces every pill eyebrow. A 24x3px accent
// bar beside a doc-label (uppercase, tracked, w700). On paper the label ink
// defaults to navy; on accent fields pass the field's text ink. The bar
// takes the RAW swatch (bars are fill-only, so no ink variant needed).

export interface KickerRuleProps {
  label: ReactNode;
  /** Bar fill. Raw accent swatch is correct here. Default coral. */
  bar?: string;
  /** Label text color. Default var(--ink). Use accentInk().textOnField on fields. */
  ink?: string;
  /** Rendered element. Default 'p'. */
  as?: 'p' | 'div' | 'span' | 'h2' | 'h3';
  className?: string;
}

export function KickerRule({
  label,
  bar = '#e53935',
  ink = 'var(--ink)',
  as = 'p',
  className,
}: KickerRuleProps) {
  const Tag = as as 'p';
  return (
    <Tag className={cn('flex items-center gap-3 type-doc-label-lg', className)} style={{ color: ink }}>
      <span
        aria-hidden="true"
        className="inline-block h-[3px] w-6 shrink-0"
        style={{ backgroundColor: bar }}
      />
      <span className="min-w-0">{label}</span>
    </Tag>
  );
}

export default KickerRule;
