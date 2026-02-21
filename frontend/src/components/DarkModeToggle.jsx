

import React from 'react'
import { HiMoon, HiSun } from 'react-icons/hi'

const DarkModeToggle = ({ isDark, toggleDarkMode }) => {
  return (
    <button
      onClick={toggleDarkMode}
      style={{
        position: 'relative',
        width: '56px',
        height: '28px',
        borderRadius: '14px',
        border: 'none',
        background: isDark 
          ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
          : 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        boxShadow: isDark
          ? '0 4px 12px rgba(102, 126, 234, 0.4)'
          : '0 4px 12px rgba(240, 147, 251, 0.4)',
        display: 'flex',
        alignItems: 'center',
        padding: '3px'
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'scale(1.05)'
        e.currentTarget.style.boxShadow = isDark
          ? '0 6px 20px rgba(102, 126, 234, 0.5)'
          : '0 6px 20px rgba(240, 147, 251, 0.5)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'scale(1)'
        e.currentTarget.style.boxShadow = isDark
          ? '0 4px 12px rgba(102, 126, 234, 0.4)'
          : '0 4px 12px rgba(240, 147, 251, 0.4)'
      }}
    >
      {/* Toggle Circle */}
      <div style={{
        width: '22px',
        height: '22px',
        borderRadius: '50%',
        background: '#ffffff',
        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        transform: isDark ? 'translateX(28px)' : 'translateX(0)',
        fontSize: '12px',
        color: isDark ? '#667eea' : '#f5576c'
      }}>
        {isDark ? <HiMoon /> : <HiSun />}
      </div>
    </button>
  )
}

export default DarkModeToggle