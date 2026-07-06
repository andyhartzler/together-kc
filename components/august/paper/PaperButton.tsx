import Link from 'next/link';
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

// PaperButton: the printed rectangular button of the PAPER TRAIL system.
// Primary is the coral rectangle with a hard navy offset shadow that lifts
// on hover and presses flat on click. Secondary is a bordered navy
// rectangle that fills on hover. Paper is the primary flipped for accent
// fields (paper bg, navy text, navy shadow). Pass `href` to render a Link,
// otherwise it renders a <button>.

type PaperButtonVariant = 'primary' | 'secondary' | 'paper';
type PaperButtonSize = 'sm' | 'md';

const BASE = cn(
  'inline-flex items-center justify-center gap-2 rounded-[3px] font-bold whitespace-nowrap',
  'transition-[transform,box-shadow,background-color,color] duration-200 motion-reduce:transition-none',
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral focus-visible:ring-offset-2 focus-visible:ring-offset-paper'
);

const SIZE: Record<PaperButtonSize, string> = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-7 py-3.5 text-base',
};

const HARD_SHADOW = cn(
  'shadow-[4px_4px_0_var(--ink)]',
  'hover:-translate-x-[2px] hover:-translate-y-[2px] hover:shadow-[6px_6px_0_var(--ink)]',
  'active:translate-x-[2px] active:translate-y-[2px] active:shadow-none',
  'motion-reduce:hover:translate-x-0 motion-reduce:hover:translate-y-0'
);

const VARIANT: Record<PaperButtonVariant, string> = {
  primary: cn('bg-coral text-paper hover:bg-coral-press', HARD_SHADOW),
  secondary: cn(
    'border-2 border-ink bg-transparent text-ink',
    'hover:bg-ink hover:text-paper active:translate-y-px'
  ),
  paper: cn('bg-paper text-ink hover:bg-sheet', HARD_SHADOW),
};

interface CommonProps {
  variant?: PaperButtonVariant;
  size?: PaperButtonSize;
  className?: string;
  children: ReactNode;
}

type PaperLinkProps = CommonProps & { href: string } & Omit<
    AnchorHTMLAttributes<HTMLAnchorElement>,
    'href' | 'className' | 'children'
  >;

type PaperBtnProps = CommonProps & { href?: undefined } & Omit<
    ButtonHTMLAttributes<HTMLButtonElement>,
    'className' | 'children'
  >;

export type PaperButtonProps = PaperLinkProps | PaperBtnProps;

export function PaperButton(props: PaperButtonProps) {
  const { variant = 'primary', size = 'md', className, children } = props;
  const classes = cn(BASE, SIZE[size], VARIANT[variant], className);

  if (props.href !== undefined) {
    const { href, variant: _v, size: _s, className: _c, children: _ch, ...rest } = props;
    return (
      <Link href={href} className={classes} {...rest}>
        {children}
      </Link>
    );
  }

  const { variant: _v, size: _s, className: _c, children: _ch, type = 'button', ...rest } = props;
  return (
    <button type={type} className={classes} {...rest}>
      {children}
    </button>
  );
}

export default PaperButton;
