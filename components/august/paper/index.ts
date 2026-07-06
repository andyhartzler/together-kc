// PAPER TRAIL primitives: the shared document vocabulary for the August
// 2026 ballot hub and question pages. Import from '@/components/august/paper'.

export { Sheet, type SheetProps } from './Sheet';
export { KickerRule, type KickerRuleProps } from './KickerRule';
export { LedgerRow, Leader, type LedgerRowProps } from './LedgerRow';
export { Stamp, type StampProps } from './Stamp';
export { BallotOval, type BallotOvalProps } from './BallotOval';
export { FileTab, type FileTabProps } from './FileTab';
export { PaperButton, type PaperButtonProps } from './PaperButton';
export { AugustFooter } from './AugustFooter';
export {
  PAPER_EASE,
  VIEWPORT_ONCE,
  ledgerDelay,
  ruleDrawVariants,
  riseVariants,
  stampLandVariants,
  staggerContainer,
  useRevealFailsafe,
} from './motion';
