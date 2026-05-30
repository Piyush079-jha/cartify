import React from 'react'

const Logo = ({ w, h, isDark }) => {
  const gold     = '#c9a84c'
  const goldDim  = isDark ? 'rgba(201,168,76,0.6)' : '#b8912e'
const textCol  = isDark ? '#e8e4dc' : '#1a1814'
const mutedCol = isDark ? 'rgba(255,255,255,0.28)' : 'rgba(26,24,20,0.32)'

  return (
    <>
      <style>{`
        @keyframes logoFloat {
          0%, 100% { transform: translateY(0px) rotateX(0deg); }
          50%       { transform: translateY(-3px) rotateX(4deg); }
        }
        @keyframes logoGlow {
          0%, 100% { box-shadow: 0 0 8px rgba(201,168,76,0.15), 0 2px 12px rgba(201,168,76,0.08); }
          50%       { box-shadow: 0 0 18px rgba(201,168,76,0.35), 0 4px 20px rgba(201,168,76,0.18); }
        }
        @keyframes logoShimmer {
          0%   { background-position: -100% center; }
          100% { background-position: 200% center; }
        }
        .logo-text-name {
          -webkit-text-fill-color: unset !important;
          background: none !important;
          color: ${isDark ? gold : '#1a1814'} !important;
        }
        .logo-icon {
          animation: logoFloat 3.5s ease-in-out infinite, logoGlow 3.5s ease-in-out infinite;
          transform-style: preserve-3d;
          perspective: 400px;
        }
        .logo-icon:hover {
          animation: none;
          transform: rotateY(15deg) rotateX(-5deg) scale(1.08);
          box-shadow: 4px 6px 20px rgba(201,168,76,0.35), -2px -2px 10px rgba(201,168,76,0.1) !important;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .logo-text-name {
          background: linear-gradient(
            105deg,
            ${goldDim} 0%,
            ${gold} 40%,
            #e8d5a3 55%,
            ${gold} 70%,
            ${goldDim} 100%
          );
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: logoShimmer 4s linear infinite;
        }
        .logo-wrap:hover .logo-text-name {
          animation: logoShimmer 1.2s linear infinite;
        }
      `}</style>

      <div
        className="logo-wrap"
        style={{
          display: 'flex', alignItems: 'center', gap: '11px',
          cursor: 'pointer', perspective: '600px'
        }}
      >
        {/* 3D Icon */}
        <div
          className="logo-icon"
          style={{
            width: '40px', height: '40px',
            background: isDark
              ? 'linear-gradient(145deg, #1e1c18 0%, #2a2720 50%, #1a1814 100%)'
              : 'linear-gradient(145deg, #f5f2ec 0%, #ede9e0 50%, #e8e3d8 100%)',
            border: `0.5px solid rgba(201,168,76,0.45)`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0, borderRadius: '2px',
            position: 'relative', overflow: 'hidden',
          }}
        >
          {/* Inner highlight — top edge */}
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0,
            height: '1px',
            background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.6), transparent)'
          }} />
          {/* Inner highlight — left edge */}
          <div style={{
            position: 'absolute', top: 0, bottom: 0, left: 0,
            width: '1px',
            background: 'linear-gradient(180deg, rgba(201,168,76,0.4), transparent)'
          }} />

          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path
              d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"
              stroke={gold} strokeWidth="1.5"
              strokeLinecap="round" strokeLinejoin="round"
            />
            <line
              x1="3" y1="6" x2="21" y2="6"
              stroke={gold} strokeWidth="1.5" strokeLinecap="round"
            />
            <path
              d="M16 10a4 4 0 01-8 0"
              stroke={gold} strokeWidth="1.5"
              strokeLinecap="round" strokeLinejoin="round"
            />
          </svg>
        </div>

        {/* Text */}
        <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.15 }}>
          <span
            className="logo-text-name"
            style={{
           fontSize: '20px', fontWeight: 400,
            letterSpacing: '0.08em',
            textTransform: 'lowercase',
            fontFamily: 'Cormorant Garamond, Georgia, serif',
            color: isDark ? gold : '#1a1814',
            }}
          >
            Cartify
          </span>
          <span style={{
            fontSize: '7.5px', fontWeight: 400,
            color: mutedCol,
            letterSpacing: '0.28em',
            textTransform: 'uppercase',
            fontFamily: 'DM Sans, sans-serif',
            marginTop: '1px'
          }}>
            shop here
          </span>
        </div>
      </div>
    </>
  )
}

export default Logo