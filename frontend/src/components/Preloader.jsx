import { useEffect, useState } from 'react'

const Preloader = () => {
  const [hiding, setHiding] = useState(false)
  const [gone, setGone] = useState(false)

  useEffect(() => {
    // Start fade-out at 2.8s, fully remove from DOM at 3.4s
    const fadeTimer = setTimeout(() => setHiding(true), 2800)
    const removeTimer = setTimeout(() => setGone(true), 3400)
    return () => {
      clearTimeout(fadeTimer)
      clearTimeout(removeTimer)
    }
  }, [])

  if (gone) return null

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: '#ffffff',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '28px',
      zIndex: 9999,
      transition: 'opacity 0.6s ease',
      opacity: hiding ? 0 : 1,
      pointerEvents: hiding ? 'none' : 'all',
    }}>

      {/* Pulsing logo ring */}
      <div style={{ position: 'relative', width: 80, height: 80, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={pulseRingStyle(0)} />
        <div style={pulseRingStyle(0.5)} />
        <div style={{
          width: 64, height: 64, borderRadius: '50%',
          background: 'linear-gradient(135deg, #667eea, #764ba2)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          position: 'relative', zIndex: 2,
          animation: 'cartify-pulse-dot 1.6s ease-in-out infinite',
        }}>
          <span style={{ fontSize: 22, fontWeight: 700, color: '#fff', fontFamily: "'DM Sans', sans-serif" }}>C</span>
        </div>
      </div>

      {/* Brand name with shimmer */}
      <span style={{
        fontSize: 26, fontWeight: 700, letterSpacing: '-0.5px',
        fontFamily: "'DM Sans', sans-serif",
        background: 'linear-gradient(90deg, #667eea, #764ba2, #667eea)',
        backgroundSize: '200% auto',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        animation: 'cartify-shimmer 2s linear infinite',
      }}>Cartify</span>

      {/* Tagline */}
      <span style={{
        fontSize: 13, color: '#999', letterSpacing: '0.5px',
        fontFamily: "'DM Sans', sans-serif",
      }}>Premium Shopping Experience</span>

      {/* Progress bar */}
      <div style={{ width: 180, height: 2, background: '#f0f0f0', borderRadius: 999, overflow: 'hidden' }}>
        <div style={{
          height: '100%', borderRadius: 999,
          background: 'linear-gradient(90deg, #667eea, #764ba2)',
          animation: 'cartify-bar 2.2s cubic-bezier(0.4,0,0.2,1) forwards',
        }} />
      </div>

      {/* Keyframes injected once */}
      <style>{`
        @keyframes cartify-pulse-ring {
          0% { transform: scale(0.8); opacity: 1; }
          80%, 100% { transform: scale(2); opacity: 0; }
        }
        @keyframes cartify-pulse-dot {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.08); }
        }
        @keyframes cartify-shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes cartify-bar {
          0% { width: 0%; }
          100% { width: 100%; }
        }
      `}</style>
    </div>
  )
}

// Helper for the two pulse rings with different animation delays
const pulseRingStyle = (delay) => ({
  position: 'absolute', inset: 0, borderRadius: '50%',
  border: '2px solid #667eea',
  animation: `cartify-pulse-ring 1.6s cubic-bezier(0.2,0,0.8,1) ${delay}s infinite`,
})

export default Preloader