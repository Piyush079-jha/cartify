import React, { useContext, useState } from 'react'
import loginIcons from '../assest/signin.gif'
import { FaEye, FaEyeSlash } from "react-icons/fa"
import { Link, useNavigate } from 'react-router-dom'
import SummaryApi from '../common'
import { toast } from 'react-toastify'
import Context from '../context'

const Login = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [data, setData] = useState({ email: "", password: "" })
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { fetchUserDetails, fetchUserAddToCart } = useContext(Context)

  const handleOnChange = (e) => {
    const { name, value } = e.target
    setData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    const dataResponse = await fetch(SummaryApi.signIn.url, {
      method: SummaryApi.signIn.method, credentials: 'include',
      headers: { "content-type": "application/json" }, body: JSON.stringify(data)
    })
    const dataApi = await dataResponse.json()
    setLoading(false)
    if (dataApi.success) { toast.success(dataApi.message); navigate('/'); fetchUserDetails(); fetchUserAddToCart() }
    if (dataApi.error) toast.error(dataApi.message)
  }

  const inputStyle = {
    width: '100%', padding: '13px 16px',
    background: 'rgba(255,255,255,0.07)',
    border: '1px solid rgba(255,255,255,0.13)',
    borderRadius: '12px', color: '#fff', fontSize: '14px',
    outline: 'none', boxSizing: 'border-box',
    transition: 'border 0.2s', fontFamily: 'inherit'
  }

  return (
    <>
      <style>{`
        .login-section { min-height: calc(100vh - 64px); background: linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%); display: flex; align-items: center; justify-content: center; padding: 20px 16px; }
        .login-card { background: linear-gradient(160deg, #1a1a2e 0%, #16213e 60%, #0f3460 100%); border-radius: 24px; padding: 40px 36px; width: 100%; max-width: 420px; box-shadow: 0 32px 80px rgba(0,0,0,0.5); border: 1px solid rgba(255,255,255,0.1); }
        @media (max-width: 480px) {
          .login-card { padding: 28px 20px !important; border-radius: 20px !important; }
          .login-section { padding: 16px 12px !important; align-items: flex-start !important; padding-top: 40px !important; }
        }
      `}</style>

      <section className="login-section">
        <div className="login-card">
          <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', margin: '0 auto 20px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 24px rgba(102,126,234,0.4)', border: '3px solid rgba(255,255,255,0.15)', overflow: 'hidden' }}>
            <img src={loginIcons} alt='login' style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <h2 style={{ color: '#fff', fontWeight: 800, fontSize: '22px', textAlign: 'center', margin: '0 0 6px' }}>Welcome Back</h2>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px', textAlign: 'center', margin: '0 0 28px' }}>Sign in to your account</p>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 700, color: 'rgba(255,255,255,0.5)', letterSpacing: '1px', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>Email</label>
              <input type='email' name='email' placeholder='enter your email' value={data.email} onChange={handleOnChange} required style={inputStyle}
                onFocus={e => e.target.style.border = '1px solid #667eea'}
                onBlur={e => e.target.style.border = '1px solid rgba(255,255,255,0.13)'}
              />
            </div>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 700, color: 'rgba(255,255,255,0.5)', letterSpacing: '1px', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>Password</label>
              <div style={{ position: 'relative' }}>
                <input type={showPassword ? "text" : "password"} name='password' placeholder='enter your password' value={data.password} onChange={handleOnChange} required style={{ ...inputStyle, paddingRight: '44px' }}
                  onFocus={e => e.target.style.border = '1px solid #667eea'}
                  onBlur={e => e.target.style.border = '1px solid rgba(255,255,255,0.13)'}
                />
                <span onClick={() => setShowPassword(p => !p)} style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', fontSize: '16px' }}>
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
              <div style={{ textAlign: 'right', marginTop: '8px' }}>
                <Link to='/forgot-password' style={{ color: '#a78bfa', fontSize: '13px', textDecoration: 'none', fontWeight: 500 }}>Forgot password?</Link>
              </div>
            </div>
            <button type='submit' disabled={loading}
              style={{ marginTop: '8px', padding: '14px', background: loading ? 'rgba(102,126,234,0.5)' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: '#fff', border: 'none', borderRadius: '12px', fontSize: '15px', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', boxShadow: '0 4px 16px rgba(102,126,234,0.35)', transition: 'all 0.3s', letterSpacing: '0.5px' }}
              onMouseEnter={e => { if (!loading) { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(102,126,234,0.5)' } }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(102,126,234,0.35)' }}
            >{loading ? 'Signing in...' : 'Login'}</button>
          </form>

          <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.45)', fontSize: '14px', marginTop: '24px' }}>
            Don't have an account?{' '}
            <Link to="/sign-up" style={{ color: '#a78bfa', fontWeight: 700, textDecoration: 'none' }}>Sign up</Link>
          </p>
        </div>
      </section>
    </>
  )
}

export default Login