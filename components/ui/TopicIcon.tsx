import type { CSSProperties } from 'react';

export interface TopicIconProps {
  id: string;
  className?: string;
  style?: CSSProperties;
}

// Per-measure line-art icon. Used at card scale as the measure mark and at hero
// scale (enlarged, low opacity) as the per-measure motif, so a measure looks
// identical on the hub card and on its detail hero. Reused by both pages.
export function TopicIcon({ id, className, style }: TopicIconProps) {
  const common = {
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.6,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  };

  switch (id) {
    case 'clean-water':
      return (
        <svg viewBox="0 0 24 24" className={className} style={style} {...common}>
          <path d="M12 3c3.6 4.6 6 7.2 6 10.2a6 6 0 0 1-12 0C6 10.2 8.4 7.6 12 3z" />
          <path d="M9.5 13.5a2.5 2.5 0 0 0 2.5 2.5" />
        </svg>
      );
    case 'sewers':
      return (
        <svg viewBox="0 0 24 24" className={className} style={style} {...common}>
          <path d="M2 8c1.8-2 3.7-2 5.5 0s3.7 2 5.5 0 3.7-2 5.5 0" />
          <path d="M2 13c1.8-2 3.7-2 5.5 0s3.7 2 5.5 0 3.7-2 5.5 0" />
          <path d="M2 18c1.8-2 3.7-2 5.5 0s3.7 2 5.5 0 3.7-2 5.5 0" />
        </svg>
      );
    case 'housing':
      return (
        <svg viewBox="0 0 24 24" className={className} style={style} {...common}>
          <path d="M3 11.5 12 4l9 7.5" />
          <path d="M5.5 10v9.5h13V10" />
          <path d="M10 19.5v-5h4v5" />
        </svg>
      );
    case 'civic-buildings':
      return (
        <svg viewBox="0 0 24 24" className={className} style={style} {...common}>
          <path d="M3 9.5 12 4l9 5.5" />
          <path d="M5 9.5V18M9 9.5V18M15 9.5V18M19 9.5V18" />
          <path d="M3.5 18h17M3 21h18" />
        </svg>
      );
    case 'central-city':
    default:
      return (
        <svg viewBox="0 0 24 24" className={className} style={style} {...common}>
          <path d="M3 21V9l4-2.2V21" />
          <path d="M9 21V4.5l5-2.5V21" />
          <path d="M16 21v-9l5-2.2V21" />
          <path d="M2 21h20" />
        </svg>
      );
  }
}

export default TopicIcon;
