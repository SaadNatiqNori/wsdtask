// Built-in line-art icons for the Services section, matching the design set.
// Stroke uses currentColor so the section's text colour drives them. Selected in
// the CMS by `icon` key; an uploaded image overrides the built-in.

const base = {
  viewBox: '0 0 48 48',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.1,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
}

function Security({ className }) {
  return (
    <svg {...base} className={className}>
      <path d="M24 5 L40 11 V23 C40 33 33 39.5 24 43.5 C15 39.5 8 33 8 23 V11 Z" />
      <path
        d="M24 11 L34 15 V23 C34 30 29 34.5 24 37.5 C19 34.5 14 30 14 23 V15 Z"
        strokeDasharray="2 2.4"
        opacity="0.55"
      />
    </svg>
  )
}

function Internet({ className }) {
  return (
    <svg {...base} className={className}>
      <circle cx="24" cy="33" r="1.6" fill="currentColor" stroke="none" />
      <path d="M17 28 A 10 10 0 0 1 31 28" />
      <path d="M13 23.5 A 16 16 0 0 1 35 23.5" strokeDasharray="2 2.4" opacity="0.7" />
      <path d="M9 19 A 22 22 0 0 1 39 19" strokeDasharray="2 2.4" opacity="0.5" />
    </svg>
  )
}

function Electricity({ className }) {
  return (
    <svg {...base} className={className}>
      <path d="M13 17 H8 V31 H13" />
      <path d="M35 17 H40 V31 H35" />
      <line x1="20" y1="15" x2="20" y2="33" />
      <line x1="24" y1="13" x2="24" y2="35" />
      <line x1="28" y1="15" x2="28" y2="33" />
    </svg>
  )
}

function Parking({ className }) {
  return (
    <svg {...base} className={className}>
      <path d="M17 11 H11 V37 H17" />
      <path d="M23 37 V11 H31 A6.5 6.5 0 0 1 31 24 H23" />
    </svg>
  )
}

const ICONS = {
  security: Security,
  internet: Internet,
  electricity: Electricity,
  parking: Parking,
}

export const SERVICE_ICON_KEYS = Object.keys(ICONS)

export function ServiceIcon({ name, className = 'h-9 w-9' }) {
  const Icon = ICONS[name] ?? Security
  return <Icon className={className} />
}
