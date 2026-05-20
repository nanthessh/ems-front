export default function Logo({ size = 36, showText = true }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', cursor: 'pointer' }}>
      {/* Icon Mark */}
      <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="40" height="40" rx="10" fill="url(#logoGrad)" />
        {/* People icon */}
        <circle cx="15" cy="14" r="4" fill="white" fillOpacity="0.95" />
        <path d="M7 26c0-4 3.6-7 8-7s8 3 8 7" stroke="white" strokeWidth="2" strokeLinecap="round" fill="none" fillOpacity="0.95" />
        {/* Plus / add icon */}
        <circle cx="28" cy="22" r="7" fill="white" fillOpacity="0.15" />
        <line x1="28" y1="18" x2="28" y2="26" stroke="white" strokeWidth="2" strokeLinecap="round" />
        <line x1="24" y1="22" x2="32" y2="22" stroke="white" strokeWidth="2" strokeLinecap="round" />
        <defs>
          <linearGradient id="logoGrad" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#2563eb" />
            <stop offset="100%" stopColor="#7c3aed" />
          </linearGradient>
        </defs>
      </svg>
      {showText && (
        <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
          <span style={{
            fontSize: '1.1rem', fontWeight: 800, letterSpacing: '0.5px',
            background: 'linear-gradient(135deg, #60a5fa, #a78bfa)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text'
          }}>EMS</span>
          <span style={{ fontSize: '0.55rem', color: 'rgba(255,255,255,0.4)', letterSpacing: '1.5px', textTransform: 'uppercase', fontWeight: 500 }}>Workforce</span>
        </div>
      )}
    </div>
  )
}
