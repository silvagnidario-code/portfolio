import type { SVGProps } from 'react'

/**
 * The icon set. Stroked rather than filled, 1.5 units on a 24 grid: the same
 * low-contrast, open-shape logic as the typeface, so an icon next to a label
 * does not read heavier than the word.
 *
 * Every icon is `aria-hidden`: it never carries the meaning on its own, the
 * control around it does.
 */

type IconProps = SVGProps<SVGSVGElement>

function Icon({ children, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="20"
      height="20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      {children}
    </svg>
  )
}

/** Language. A globe, never a flag: a flag is a country, not a language. */
export function GlobeIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18" />
      <path d="M12 3c2.5 2.7 2.5 15.3 0 18-2.5-2.7-2.5-15.3 0-18Z" />
    </Icon>
  )
}

export function SunIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <circle cx="12" cy="12" r="4.5" />
      <path d="M12 2v2M12 20v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M2 12h2M20 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" />
    </Icon>
  )
}

export function MoonIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5Z" />
    </Icon>
  )
}

/** Follow the system: a screen, which is what decides when nobody else does. */
export function AutoIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <rect x="2.5" y="4" width="19" height="13" rx="1.5" />
      <path d="M8 20h8M12 17v3" />
    </Icon>
  )
}

export function CheckIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="m4 12.5 5 5L20 6.5" />
    </Icon>
  )
}

/** Closes the lightbox and anything else that needs a plain dismiss. */
export function CloseIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M6 6l12 12M18 6 6 18" />
    </Icon>
  )
}

export function ChevronLeftIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M14.5 5.5 8 12l6.5 6.5" />
    </Icon>
  )
}

export function ChevronRightIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M9.5 5.5 16 12l-6.5 6.5" />
    </Icon>
  )
}

/** Four open corners, the fullscreen-enlarge convention: hovers a gallery thumbnail. */
export function ExpandIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M4 9V5a1 1 0 0 1 1-1h4" />
      <path d="M15 4h4a1 1 0 0 1 1 1v4" />
      <path d="M4 15v4a1 1 0 0 0 1 1h4" />
      <path d="M20 15v4a1 1 0 0 1-1 1h-4" />
    </Icon>
  )
}

/** Four corners folding inward: ExpandIcon reversed, for leaving fullscreen. */
export function CollapseIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M9 4v4a1 1 0 0 1-1 1H4" />
      <path d="M15 4v4a1 1 0 0 0 1 1h4" />
      <path d="M9 20v-4a1 1 0 0 0-1-1H4" />
      <path d="M15 20v-4a1 1 0 0 1 1-1h4" />
    </Icon>
  )
}

/** Resumes a paused gallery video. Filled, unlike the rest of the set. */
export function PlayIcon(props: IconProps) {
  return (
    <Icon {...props} fill="currentColor" stroke="none">
      <path d="M8 5.5v13l11-6.5-11-6.5Z" />
    </Icon>
  )
}

/** Stops a playing gallery video. */
export function PauseIcon(props: IconProps) {
  return (
    <Icon {...props} fill="currentColor" stroke="none">
      <rect x="6.5" y="5" width="4" height="14" rx="1" />
      <rect x="13.5" y="5" width="4" height="14" rx="1" />
    </Icon>
  )
}

export function MuteIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M4 9.5h3.5L12 6v12l-4.5-3.5H4v-5Z" />
      <path d="M16 9.5 21 14.5" />
      <path d="M21 9.5 16 14.5" />
    </Icon>
  )
}

export function UnmuteIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M4 9.5h3.5L12 6v12l-4.5-3.5H4v-5Z" />
      <path d="M16.5 9c1.2 1 1.2 5 0 6" />
      <path d="M19 7c2.4 2.2 2.4 7.8 0 10" />
    </Icon>
  )
}
