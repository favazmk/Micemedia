/** Decorative graphic that fills the empty middle of the "Why brands choose us" cards. */
export default function PillarVisual({ kind }: { kind: 'experience' | 'standard' | 'promise' }) {
  return (
    <div className="relative flex-1 min-h-0 my-2 hidden lg:block overflow-hidden text-red-500 pointer-events-none" aria-hidden="true">
      <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet" className="absolute inset-0 w-full h-full overflow-visible">
        <defs>
          <radialGradient id={`pv-glow-${kind}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0.28" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx="50" cy="50" r="46" fill={`url(#pv-glow-${kind})`} />

        {kind === 'experience' && (
          <>
            <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeOpacity="0.25" strokeDasharray="1 4" strokeLinecap="round" />
            {[0, 1.2, 2.4].map((d) => (
              <circle key={d} className="pv-pulse" style={{ ['--d' as string]: `${d}s` }} cx="50" cy="50" r="34" fill="none" stroke="currentColor" strokeWidth="1.2" />
            ))}
            <g className="pv-spin"><circle cx="50" cy="10" r="2.6" fill="currentColor" /></g>
            <path d="M50 34 L54 46 L66 50 L54 54 L50 66 L46 54 L34 50 L46 46 Z" fill="currentColor" />
          </>
        )}

        {kind === 'standard' && (
          <>
            <g className="pv-spin pv-spin--slow"><circle cx="50" cy="50" r="38" fill="none" stroke="currentColor" strokeOpacity="0.45" strokeDasharray="2 5" strokeLinecap="round" /></g>
            <circle cx="50" cy="50" r="27" fill="none" stroke="currentColor" strokeOpacity="0.3" />
            <g stroke="currentColor" strokeOpacity="0.5" strokeWidth="1.2" strokeLinecap="round">
              <line x1="50" y1="6" x2="50" y2="16" /><line x1="50" y1="84" x2="50" y2="94" />
              <line x1="6" y1="50" x2="16" y2="50" /><line x1="84" y1="50" x2="94" y2="50" />
            </g>
            <path className="pv-draw" d="M18 64 C 30 22, 46 92, 60 52 S 80 36, 86 36" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
            <circle cx="18" cy="64" r="3" fill="currentColor" /><circle cx="86" cy="36" r="3" fill="currentColor" />
          </>
        )}

        {kind === 'promise' && (
          <>
            {[0, 1].map((i) => (
              <path key={i} className="pv-pulse" style={{ ['--d' as string]: `${i * 1.4}s` }} d="M22 34 Q50 8 78 34" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
            ))}
            {[18, 30, 44, 60, 44, 30, 18].map((h, i) => (
              <rect key={i} className="pv-bar" style={{ ['--d' as string]: `${i * 0.18}s` }} x={14 + i * 12} y={86 - h} width="7" height={h} rx="3.5" fill="currentColor" fillOpacity={0.55 + (h / 60) * 0.45} />
            ))}
          </>
        )}
      </svg>
    </div>
  );
}
