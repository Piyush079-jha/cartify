import React, { useState } from 'react'
import { useLocation, useNavigate, Link } from 'react-router-dom'
import { MdLock } from 'react-icons/md'
import { toast } from 'react-toastify'
import SummaryApi from '../common'

const ResetPassword = () => {
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [done, setDone] = useState(false)
    const [showPass, setShowPass] = useState(false)

    const location = useLocation()
    const navigate = useNavigate()

    const urlParams = new URLSearchParams(location.search)
    const token = urlParams.get('token')
    const email = urlParams.get('email')

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (newPassword !== confirmPassword) return toast.error("Passwords don't match!")
        if (newPassword.length < 6) return toast.error("Password must be at least 6 characters")

        setLoading(true)
        try {
            const response = await fetch(SummaryApi.resetPassword.url, {
                method: SummaryApi.resetPassword.method,
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify({ email, token, newPassword })
            })
            const data = await response.json()
            if (data.success) { setDone(true); toast.success(data.message) }
            else toast.error(data.message)
        } catch (err) {
            toast.error('Something went wrong. Please try again.')
        }
        setLoading(false)
    }

    const inputStyle = {
        width: '100%', padding: '12px 16px',
        background: 'rgba(255,255,255,0.07)',
        border: '1px solid rgba(255,255,255,0.13)',
        borderRadius: '12px', color: '#fff',
        fontSize: '14px', outline: 'none',
        boxSizing: 'border-box', transition: 'border 0.2s'
    }

    const labelStyle = {
        fontSize: '11px', fontWeight: 700, letterSpacing: '1px',
        textTransform: 'uppercase', color: 'rgba(255,255,255,0.45)',
        display: 'block', marginBottom: '8px'
    }

    if (!token || !email) {
        return (
            <div style={{
                minHeight: '100vh', display: 'flex', alignItems: 'center',
                justifyContent: 'center', padding: '20px',
                background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)'
            }}>
                <div style={{
                    textAlign: 'center', color: '#fff',
                    background: 'rgba(255,255,255,0.05)',
                    borderRadius: '24px', padding: '40px',
                    border: '1px solid rgba(255,255,255,0.1)'
                }}>
                    <p style={{ fontSize: '18px', fontWeight: 700, marginBottom: '16px' }}>❌ Invalid Reset Link</p>
                    <Link to='/forgot-password' style={{ color: '#667eea', fontWeight: 700 }}>Request a new one</Link>
                </div>
            </div>
        )
    }

    return (
        <div style={{
            minHeight: '100vh', display: 'flex',
            alignItems: 'center', justifyContent: 'center',
            padding: '20px',
            background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)'
        }}>
            <div style={{
                width: '100%', maxWidth: '440px',
                background: 'rgba(255,255,255,0.05)',
                backdropFilter: 'blur(20px)',
                borderRadius: '24px', padding: '40px 36px',
                border: '1px solid rgba(255,255,255,0.1)',
                boxShadow: '0 32px 80px rgba(0,0,0,0.4)'
            }}>
                <div style={{
                    width: '64px', height: '64px', borderRadius: '50%',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '28px', color: '#fff', margin: '0 auto 24px',
                    boxShadow: '0 8px 24px rgba(102,126,234,0.4)'
                }}>
                    <MdLock />
                </div>

                {!done ? (
                    <>
                        <h2 style={{ color: '#fff', fontWeight: 800, fontSize: '24px', textAlign: 'center', margin: '0 0 8px' }}>
                            Set New Password
                        </h2>
                        <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '14px', textAlign: 'center', margin: '0 0 32px' }}>
                            Choose a strong password for your account
                        </p>

                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                            <div>
                                <label style={labelStyle}>New Password</label>
                                <div style={{ position: 'relative' }}>
                                    <input
                                        type={showPass ? 'text' : 'password'}
                                        value={newPassword}
                                        onChange={e => setNewPassword(e.target.value)}
                                        placeholder='Enter new password'
                                        required
                                        style={inputStyle}
                                        onFocus={e => e.target.style.border = '1px solid #667eea'}
                                        onBlur={e => e.target.style.border = '1px solid rgba(255,255,255,0.13)'}
                                    />
                                    <button type='button' onClick={() => setShowPass(!showPass)} style={{
                                        position: 'absolute', right: '12px', top: '50%',
                                        transform: 'translateY(-50%)', background: 'none',
                                        border: 'none', cursor: 'pointer',
                                        color: 'rgba(255,255,255,0.4)', fontSize: '18px'
                                    }}>
                                        {showPass ? '🙈' : '👁️'}
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label style={labelStyle}>Confirm Password</label>
                                <input
                                    type='password'
                                    value={confirmPassword}
                                    onChange={e => setConfirmPassword(e.target.value)}
                                    placeholder='Confirm new password'
                                    required
                                    style={inputStyle}
                                    onFocus={e => e.target.style.border = '1px solid #667eea'}
                                    onBlur={e => e.target.style.border = '1px solid rgba(255,255,255,0.13)'}
                                />
                            </div>

                            <button
                                type='submit'
                                disabled={loading}
                                style={{
                                    padding: '13px',
                                    background: loading ? 'rgba(102,126,234,0.5)' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                    color: '#fff', border: 'none', borderRadius: '12px',
                                    fontSize: '15px', fontWeight: 700,
                                    cursor: loading ? 'not-allowed' : 'pointer',
                                    boxShadow: '0 4px 16px rgba(102,126,234,0.35)',
                                    transition: 'all 0.3s', marginTop: '4px'
                                }}
                            >
                                {loading ? 'Resetting...' : 'Reset Password'}
                            </button>
                        </form>
                    </>
                ) : (
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '48px', marginBottom: '16px' }}>✅</div>
                        <h2 style={{ color: '#fff', fontWeight: 800, fontSize: '22px', margin: '0 0 10px' }}>Password Reset!</h2>
                        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px', margin: '0 0 28px' }}>
                            Your password has been updated successfully.
                        </p>
                        <button
                            onClick={() => navigate('/login')}
                            style={{
                                padding: '12px 32px',
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                border: 'none', borderRadius: '12px',
                                color: '#fff', fontSize: '14px', fontWeight: 700,
                                cursor: 'pointer', boxShadow: '0 4px 16px rgba(102,126,234,0.35)'
                            }}
                        >
                            Go to Login
                        </button>
                    </div>
                )}

                <p style={{ textAlign: 'center', marginTop: '28px', fontSize: '14px', color: 'rgba(255,255,255,0.4)' }}>
                    <Link to='/login' style={{ color: '#667eea', fontWeight: 700, textDecoration: 'none' }}>← Back to Login</Link>
                </p>
            </div>
        </div>
    )
}

export default ResetPassword