import React from 'react'
import { HiMoon, HiSun } from 'react-icons/hi'

const DarkModeToggle = ({ isDark, toggleDarkMode }) => {
  const gold   = '#c9a84c'
  const border = isDark ? 'rgba(255,255,255,0.12)' : 'rgba(26,24,20,0.15)'

  return (
    <button
      onClick={toggleDarkMode}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      style={{
        position: 'relative',
        width: '48px', height: '26px',
        borderRadius: '1px',
        border: `0.5px solid ${border}`,
        background: 'transparent',
        cursor: 'pointer',
        transition: 'border-color 0.25s ease',
        display: 'flex', alignItems: 'center',
        padding: '3px',
        flexShrink: 0
      }}
      onMouseEnter={e => e.currentTarget.style.borderColor = gold}
      onMouseLeave={e => e.currentTarget.style.borderColor = border}
    >
      {/* Track fill */}
      <div style={{
        position: 'absolute', inset: 0,
        background: isDark
          ? 'rgba(201,168,76,0.1)'
          : 'rgba(26,24,20,0.04)',
        transition: 'background 0.3s ease'
      }} />

      {/* Thumb */}
      <div style={{
        position: 'relative', zIndex: 1,
        width: '20px', height: '20px',
        background: isDark ? gold : 'rgba(26,24,20,0.15)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), background 0.3s ease',
        transform: isDark ? 'translateX(22px)' : 'translateX(0)',
        fontSize: '11px',
        color: isDark ? '#0a0a0a' : 'rgba(26,24,20,0.5)',
        borderRadius: '1px',
        flexShrink: 0
      }}>
        {isDark ? <HiMoon /> : <HiSun />}
      </div>
    </button>
  )
}

export default DarkModeToggle