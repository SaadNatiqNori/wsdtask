// Line-art illustrations for the Location section's centre (one per tab).
// Transparent SVGs sized to a 520×520 viewBox so they scale to any box.
// `#161A24` node fills match the section background.

const DOT = {
  fill: 'none',
  stroke: 'rgba(226,234,242,0.55)',
  strokeWidth: 1.6,
  strokeLinecap: 'round',
  strokeDasharray: '0.1 6',
}
const SOLID = {
  fill: 'none',
  stroke: 'rgba(226,234,242,0.82)',
  strokeWidth: 1.6,
}

const ORBIT_NODES = [
  { n: '01', x: 424, y: 78 },
  { n: '02', x: 168, y: 129 },
  { n: '03', x: 308, y: 305 },
  { n: '04', x: 225, y: 416 },
]

export function OrbitSVG(props) {
  return (
    <svg viewBox="0 0 520 520" fill="none" {...props}>
      <circle cx="260" cy="260" r="245" {...DOT} />
      <circle cx="260" cy="260" r="160" {...DOT} />
      <circle cx="260" cy="260" r="66" {...DOT} />
      <circle cx="260" cy="260" r="23" {...DOT} />
      <circle cx="260" cy="260" r="4.5" fill="rgba(226,234,242,0.55)" />
      {ORBIT_NODES.map((nd) => (
        <g key={nd.n}>
          <circle cx={nd.x} cy={nd.y} r="21" {...DOT} fill="#161A24" />
          <text
            x={nd.x}
            y={nd.y}
            textAnchor="middle"
            dominantBaseline="central"
            fill="rgba(226,234,242,0.85)"
            fontSize="14"
            fontFamily="'Akkurat Mono', monospace"
          >
            {nd.n}
          </text>
        </g>
      ))}
    </svg>
  )
}

export function ShieldSVG(props) {
  return (
    <svg viewBox="0 0 520 520" fill="none" {...props}>
      {/* top chevron */}
      <path d="M150 118 L260 86 L370 118" {...DOT} />
      {/* side arcs */}
      <path d="M96 168 C70 246, 70 358, 104 440" {...DOT} />
      <path d="M424 168 C450 246, 450 358, 416 440" {...DOT} />
      {/* outer shield */}
      <path
        d="M118 158 L260 122 L402 158 L402 262 C402 348, 344 402, 260 432 C176 402, 118 348, 118 262 Z"
        {...SOLID}
      />
      {/* inner shield */}
      <path
        d="M166 182 L260 158 L354 182 L354 256 C354 314, 314 350, 260 368 C206 350, 166 314, 166 256 Z"
        {...DOT}
      />
    </svg>
  )
}

export function CirclesSVG(props) {
  return (
    <svg viewBox="0 0 520 520" fill="none" {...props}>
      <circle cx="288" cy="290" r="158" {...SOLID} />
      <circle cx="198" cy="222" r="122" {...DOT} />
      <circle cx="120" cy="122" r="52" {...SOLID} />
      <circle cx="90" cy="100" r="36" {...DOT} />
      <circle cx="396" cy="408" r="46" {...DOT} />
      <circle cx="424" cy="432" r="16" {...SOLID} />
    </svg>
  )
}
