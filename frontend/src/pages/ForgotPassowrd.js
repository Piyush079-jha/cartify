import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { MdEmail } from 'react-icons/md'
import { toast } from 'react-toastify'
import SummaryApi from '../common'

const ForgotPassword = () => {
  const [email, setEmail]     = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent]       = useState(false)

  const gold        = '#c9a84c'
  const border      = 'rgba(255,255,255,0.07)'
  const muted       = 'rgba(160,152,144,0.7)'
  const text        = '#e8e4dc'
  const goldBorder  = 'rgba(201,168,76,0.25)'
  const goldBg      = 'rgba(201,168,76,0.07)'

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email) return toast.error('Please enter your email')
    setLoading(true)
    try {
      const response = await fetch(SummaryApi.forgotPassword?.url || '/api/forgot-password', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ email })
      })
      const data = await response.json()
      if (data.success) { setSent(true); toast.success(data.message || 'Reset link sent!') }
      else toast.error(data.message || 'Something went wrong')
    } catch {
      toast.error('Failed to send reset email. Try again.')
    }
    setLoading(false)
  }

  return (
    <>
      <style>{`
        @keyframes fpFadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .fp-input {
          width: 100%; padding: 11px 14px;
          background: rgba(255,255,255,0.03);
          border: 0.5px solid ${border};
          color: ${text}; font-size: 13px;
          outline: none; box-sizing: border-box;
          transition: border-color 0.2s ease, background 0.2s ease;
          font-family: 'DM Sans', sans-serif;
          letter-spacing: 0.02em; border-radius: 1px;
        }
        .fp-input::placeholder { color: rgba(255,255,255,0.18); }
        .fp-input:focus {
          border-color: ${gold};
          background: ${goldBg};
        }
        .fp-btn {
          width: 100%; padding: 13px;
          background: transparent;
          border: 0.5px solid ${gold};
          color: ${gold}; font-size: 11px;
          font-weight: 500; letter-spacing: 0.16em;
          text-transform: uppercase; cursor: pointer;
          transition: all 0.25s ease;
          font-family: 'DM Sans', sans-serif;
          border-radius: 1px;
        }
        .fp-btn:hover:not(:disabled) {
          background: ${gold}; color: #0a0a0a;
          letter-spacing: 0.2em;
          box-shadow: 0 0 24px rgba(201,168,76,0.2);
        }
        .fp-btn:disabled { opacity: 0.4; cursor: not-allowed; }
      `}</style>

      <div style={{
        minHeight: '100vh',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '20px',
        background: '#0a0a0a'
      }}>
        {/* Subtle background texture */}
        <div style={{
          position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0,
          background: 'radial-gradient(ellipse 60% 50% at 50% 0%, rgba(201,168,76,0.04) 0%, transparent 70%)'
        }} />

        <div style={{
          position: 'relative', zIndex: 1,
          width: '100%', maxWidth: '400px',
          background: '#111110',
          border: `0.5px solid ${border}`,
          padding: '40px 36px',
          boxShadow: '0 40px 80px rgba(0,0,0,0.5)',
          animation: 'fpFadeUp 0.4s ease'
        }}>

          {/* Gold top accent */}
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0,
            height: '1.5px', background: gold
          }} />

          {!sent ? (
            <>
              {/* Icon */}
              <div style={{
                width: '44px', height: '44px',
                border: `0.5px solid ${goldBorder}`,
                background: goldBg,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '20px', color: gold,
                margin: '0 auto 28px'
              }}>
                <MdEmail />
              </div>

              {/* Heading */}
              <h2 style={{
                fontFamily: 'Cormorant Garamond, Georgia, serif',
                fontSize: '28px', fontWeight: 300,
                color: text, textAlign: 'center',
                margin: '0 0 8px', letterSpacing: '-0.01em'
              }}>
                Forgot Password
              </h2>
              <p style={{
                color: muted, fontSize: '12px',
                textAlign: 'center', margin: '0 0 32px',
                lineHeight: 1.7, letterSpacing: '0.03em',
                fontFamily: 'DM Sans, sans-serif'
              }}>
                Enter your email address and we'll send you a link to reset your password.
              </p>

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{
                    fontSize: '9px', fontWeight: 500,
                    letterSpacing: '0.18em', textTransform: 'uppercase',
                    color: muted, display: 'block', marginBottom: '7px',
                    fontFamily: 'DM Sans, sans-serif'
                  }}>
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    required
                    className="fp-input"
                  />
                </div>

                <button type="submit" disabled={loading} className="fp-btn" style={{ marginTop: '4px' }}>
                  {loading ? 'Sending...' : 'Send Reset Link'}
                </button>
              </form>
            </>
          ) : (
            /* Success state */
            <div style={{ textAlign: 'center', animation: 'fpFadeUp 0.3s ease' }}>
              {/* Check icon */}
              <div style={{
                width: '44px', height: '44px',
                border: `0.5px solid rgba(168,192,128,0.35)`,
                background: 'rgba(168,192,128,0.08)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '18px', color: '#a8c080',
                margin: '0 auto 28px'
              }}>
                ✓
              </div>

              <h2 style={{
                fontFamily: 'Cormorant Garamond, Georgia, serif',
                fontSize: '26px', fontWeight: 300,
                color: text, margin: '0 0 8px', letterSpacing: '-0.01em'
              }}>
                Check Your Email
              </h2>
              <p style={{
                color: muted, fontSize: '12px',
                lineHeight: 1.7, margin: '0 0 6px',
                letterSpacing: '0.03em', fontFamily: 'DM Sans, sans-serif'
              }}>
                We've sent a reset link to
              </p>
              <p style={{
                color: gold, fontSize: '13px',
                fontWeight: 500, margin: '0 0 28px',
                letterSpacing: '0.04em', fontFamily: 'DM Sans, sans-serif',
                wordBreak: 'break-all'
              }}>
                {email}
              </p>

              <div style={{ height: '0.5px', background: border, margin: '0 0 24px' }} />

              <button
                onClick={() => { setSent(false); setEmail('') }}
                className="fp-btn"
                style={{ fontSize: '10px' }}
              >
                Try a different email
              </button>
            </div>
          )}

          {/* Back to login */}
          <p style={{
            textAlign: 'center', marginTop: '28px',
            fontSize: '12px', color: muted,
            fontFamily: 'DM Sans, sans-serif', letterSpacing: '0.03em'
          }}>
            Remember your password?{' '}
            <Link to="/login" style={{
              color: gold, fontWeight: 500,
              textDecoration: 'none', letterSpacing: '0.04em',
              transition: 'opacity 0.15s'
            }}
              onMouseEnter={e => e.currentTarget.style.opacity = '0.7'}
              onMouseLeave={e => e.currentTarget.style.opacity = '1'}
            >
              Back to Login
            </Link>
          </p>
        </div>
      </div>
    </>
  )
}

export default ForgotPassword