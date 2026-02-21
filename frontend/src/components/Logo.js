import React from 'react'

const Logo = ({ w, h, isDark }) => {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
    }}>
      {/* Shopping Bag Icon - gradient styled */}
      <div style={{
        width: '42px',
        height: '42px',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        borderRadius: '12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
        flexShrink: 0
      }}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path
            d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <line
            x1="3" y1="6" x2="21" y2="6"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M16 10a4 4 0 01-8 0"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {/* Text */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        lineHeight: '1.1'
      }}>
        <span style={{
          fontSize: '22px',
          fontWeight: '800',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          letterSpacing: '1px',
          textTransform: 'lowercase',
        }}>
         Cartify
        </span>
        <span style={{
          fontSize: '10px',
          fontWeight: '600',
          color: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.4)',
          letterSpacing: '3px',
          textTransform: 'uppercase',
        }}>
          shop here
        </span>
      </div>
    </div>
  )
}

export default Logo