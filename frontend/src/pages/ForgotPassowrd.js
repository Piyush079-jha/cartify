import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { MdEmail } from 'react-icons/md'
import { toast } from 'react-toastify'
import SummaryApi from '../common'

const ForgotPassowrd = () => {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

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

      if (data.success) {
        setSent(true)
        toast.success(data.message || 'Reset link sent to your email!')
      } else {
        toast.error(data.message || 'Something went wrong')
      }
    } catch (err) {
      toast.error('Failed to send reset email. Try again.')
    }
    setLoading(false)
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '440px',
        background: 'rgba(255,255,255,0.05)',
        backdropFilter: 'blur(20px)',
        borderRadius: '24px',
        padding: '40px 36px',
        border: '1px solid rgba(255,255,255,0.1)',
        boxShadow: '0 32px 80px rgba(0,0,0,0.4)'
      }}>

        {/* Icon */}
        <div style={{
          width: '64px', height: '64px', borderRadius: '50%',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '28px', color: '#fff', margin: '0 auto 24px',
          boxShadow: '0 8px 24px rgba(102,126,234,0.4)'
        }}>
          <MdEmail />
        </div>

        {!sent ? (
          <>
            <h2 style={{
              color: '#fff', fontWeight: 800, fontSize: '24px',
              textAlign: 'center', margin: '0 0 8px'
            }}>
              Forgot Password?
            </h2>
            <p style={{
              color: 'rgba(255,255,255,0.45)', fontSize: '14px',
              textAlign: 'center', margin: '0 0 32px', lineHeight: '1.6'
            }}>
              Enter your email address and we'll send you a link to reset your password.
            </p>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{
                  fontSize: '11px', fontWeight: 700, letterSpacing: '1px',
                  textTransform: 'uppercase', color: 'rgba(255,255,255,0.45)',
                  display: 'block', marginBottom: '8px'
                }}>
                  Email Address
                </label>
                <input
                  type='email'
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder='Enter your email'
                  required
                  style={{
                    width: '100%', padding: '12px 16px',
                    background: 'rgba(255,255,255,0.07)',
                    border: '1px solid rgba(255,255,255,0.13)',
                    borderRadius: '12px', color: '#fff',
                    fontSize: '14px', outline: 'none',
                    boxSizing: 'border-box', transition: 'border 0.2s'
                  }}
                  onFocus={e => e.target.style.border = '1px solid #667eea'}
                  onBlur={e => e.target.style.border = '1px solid rgba(255,255,255,0.13)'}
                />
              </div>

              <button
                type='submit'
                disabled={loading}
                style={{
                  padding: '13px',
                  background: loading
                    ? 'rgba(102,126,234,0.5)'
                    : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: '#fff', border: 'none', borderRadius: '12px',
                  fontSize: '15px', fontWeight: 700,
                  cursor: loading ? 'not-allowed' : 'pointer',
                  boxShadow: '0 4px 16px rgba(102,126,234,0.35)',
                  transition: 'all 0.3s', marginTop: '4px'
                }}
                onMouseEnter={e => {
                  if (!loading) {
                    e.currentTarget.style.transform = 'translateY(-2px)'
                    e.currentTarget.style.boxShadow = '0 8px 24px rgba(102,126,234,0.45)'
                  }
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = '0 4px 16px rgba(102,126,234,0.35)'
                }}
              >
                {loading ? 'Sending...' : 'Send Reset Link'}
              </button>
            </form>
          </>
        ) : (
          /* Success State */
          <div style={{ textAlign: 'center' }}>
            <div style={{
              fontSize: '48px', marginBottom: '16px'
            }}>
              📬
            </div>
            <h2 style={{ color: '#fff', fontWeight: 800, fontSize: '22px', margin: '0 0 10px' }}>
              Check Your Email
            </h2>
            <p style={{
              color: 'rgba(255,255,255,0.5)', fontSize: '14px',
              lineHeight: '1.7', margin: '0 0 28px'
            }}>
              We've sent a password reset link to<br />
              <strong style={{ color: '#667eea' }}>{email}</strong>
            </p>
            <button
              onClick={() => { setSent(false); setEmail('') }}
              style={{
                padding: '10px 24px',
                background: 'rgba(102,126,234,0.15)',
                border: '1px solid rgba(102,126,234,0.3)',
                borderRadius: '10px', color: '#667eea',
                fontSize: '14px', fontWeight: 600, cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(102,126,234,0.25)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(102,126,234,0.15)'}
            >
              Try a different email
            </button>
          </div>
        )}

        {/* Back to Login */}
        <p style={{
          textAlign: 'center', marginTop: '28px',
          fontSize: '14px', color: 'rgba(255,255,255,0.4)'
        }}>
          Remember your password?{' '}
          <Link to='/login' style={{
            color: '#667eea', fontWeight: 700, textDecoration: 'none'
          }}>
            Back to Login
          </Link>
        </p>
      </div>
    </div>
  )
}

export default ForgotPassowrd