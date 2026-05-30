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
  const [focused, setFocused] = useState("")
  const navigate = useNavigate()
  const { fetchUserDetails, fetchUserAddToCart } = useContext(Context)

  const gold        = '#c9a84c'
  const goldGlow    = '0 0 0 2px rgba(201,168,76,0.18)'
  const border      = 'rgba(255,255,255,0.09)'
  const borderFocus = gold

  const handleOnChange = (e) => {
    const { name, value } = e.target
    setData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    const dataResponse = await fetch(SummaryApi.signIn.url, {
      method: SummaryApi.signIn.method,
      credentials: 'include',
      headers: { "content-type": "application/json" },
      body: JSON.stringify(data)
    })
    const dataApi = await dataResponse.json()
    setLoading(false)
    if (dataApi.success) {
      toast.success(dataApi.message)
      navigate('/')
      fetchUserDetails()
      fetchUserAddToCart()
    }
    if (dataApi.error) toast.error(dataApi.message)
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;1,300&family=DM+Sans:wght@300;400;500&display=swap');

        .login-page {
          min-height: calc(100vh - 60px);
          background: #0a0a0a;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px 20px;
          position: relative;
          overflow: hidden;
        }

        /* Ambient background glow */
        .login-page::before {
          content: '';
          position: absolute;
          top: -20%;
          left: 50%;
          transform: translateX(-50%);
          width: 600px;
          height: 600px;
          background: radial-gradient(circle, rgba(201,168,76,0.06) 0%, transparent 70%);
          pointer-events: none;
        }

        .login-card {
          width: 100%;
          max-width: 400px;
          position: relative;
          z-index: 1;
        }

        /* Top brand mark */
        .login-brand {
          text-align: center;
          margin-bottom: 48px;
        }
        .login-brand-name {
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          font-weight: 300;
          letter-spacing: 0.4em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.25);
          margin: 0 0 8px;
        }
        .login-brand-rule {
          width: 32px;
          height: 0.5px;
          background: #c9a84c;
          margin: 0 auto;
          opacity: 0.5;
        }

        /* Avatar */
        .login-avatar {
          width: 64px;
          height: 64px;
          border-radius: 50%;
          border: 0.5px solid rgba(201,168,76,0.3);
          overflow: hidden;
          margin: 0 auto 28px;
          background: rgba(255,255,255,0.03);
          box-shadow: 0 0 32px rgba(201,168,76,0.1);
        }

        .login-heading {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: 32px;
          font-weight: 300;
          color: #e8e4dc;
          text-align: center;
          margin: 0 0 6px;
          letter-spacing: -0.01em;
          line-height: 1.2;
        }
        .login-sub {
          font-size: 12px;
          color: rgba(255,255,255,0.25);
          text-align: center;
          margin: 0 0 36px;
          letter-spacing: 0.06em;
        }

        /* Form */
        .login-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .login-label {
          font-size: 9px;
          font-weight: 500;
          color: rgba(255,255,255,0.3);
          letter-spacing: 0.18em;
          text-transform: uppercase;
          display: block;
          margin-bottom: 8px;
        }
        .login-input {
          width: 100%;
          padding: 12px 16px;
          background: rgba(255,255,255,0.03);
          border: 0.5px solid rgba(255,255,255,0.09);
          color: #e8e4dc;
          font-size: 13px;
          outline: none;
          box-sizing: border-box;
          transition: border-color 0.22s ease, box-shadow 0.22s ease;
          font-family: 'DM Sans', sans-serif;
          letter-spacing: 0.02em;
          border-radius: 1px;
        }
        .login-input::placeholder { color: rgba(255,255,255,0.18); }
        .login-input:focus {
          border-color: #c9a84c;
          box-shadow: 0 0 0 2px rgba(201,168,76,0.1);
          background: rgba(201,168,76,0.03);
        }

        .login-eye {
          position: absolute;
          right: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: rgba(255,255,255,0.25);
          cursor: pointer;
          font-size: 14px;
          transition: color 0.2s ease;
        }
        .login-eye:hover { color: #c9a84c; }

        .login-forgot {
          text-align: right;
          margin-top: 8px;
        }
        .login-forgot a {
          font-size: 11px;
          color: rgba(201,168,76,0.6);
          text-decoration: none;
          letter-spacing: 0.04em;
          transition: color 0.2s ease;
        }
        .login-forgot a:hover { color: #c9a84c; }

        .login-submit {
          width: 100%;
          padding: 13px;
          background: transparent;
          border: 0.5px solid #c9a84c;
          color: #c9a84c;
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.25s ease;
          font-family: 'DM Sans', sans-serif;
          border-radius: 1px;
          margin-top: 4px;
        }
        .login-submit:hover:not(:disabled) {
          background: #c9a84c;
          color: #0a0a0a;
          box-shadow: 0 0 24px rgba(201,168,76,0.25);
          letter-spacing: 0.22em;
        }
        .login-submit:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }

        /* Divider */
        .login-divider {
          display: flex;
          align-items: center;
          gap: 16px;
          margin: 8px 0;
        }
        .login-divider-line {
          flex: 1;
          height: 0.5px;
          background: rgba(255,255,255,0.07);
        }
        .login-divider-text {
          font-size: 10px;
          color: rgba(255,255,255,0.2);
          letter-spacing: 0.1em;
        }

        .login-signup-row {
          text-align: center;
          font-size: 12px;
          color: rgba(255,255,255,0.28);
          margin-top: 24px;
          letter-spacing: 0.03em;
        }
        .login-signup-row a {
          color: #c9a84c;
          text-decoration: none;
          transition: color 0.2s ease;
        }
        .login-signup-row a:hover { color: #e8d5a3; }

        @media (max-width: 480px) {
          .login-page { padding: 32px 20px; align-items: flex-start; padding-top: 60px; }
          .login-heading { font-size: 26px; }
        }
      `}</style>

      <section className="login-page">
        <div className="login-card">

          {/* Brand */}
          <div className="login-brand">
            <p className="login-brand-name">Cartify</p>
            <div className="login-brand-rule" />
          </div>

          {/* Avatar */}
          <div className="login-avatar">
            <img src={loginIcons} alt="login" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>

          <h1 className="login-heading">Welcome back</h1>
          <p className="login-sub">Sign in to continue</p>

          <form onSubmit={handleSubmit} className="login-form">
            <div>
              <label className="login-label">Email</label>
              <input
                type="email"
                name="email"
                placeholder="your@email.com"
                value={data.email}
                onChange={handleOnChange}
                className="login-input"
                required
              />
            </div>

            <div>
              <label className="login-label">Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="••••••••"
                  value={data.password}
                  onChange={handleOnChange}
                  className="login-input"
                  style={{ paddingRight: '44px' }}
                  required
                />
                <span className="login-eye" onClick={() => setShowPassword(p => !p)}>
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
              <div className="login-forgot">
                <Link to="/forgot-password">Forgot password?</Link>
              </div>
            </div>

            <button type="submit" className="login-submit" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="login-divider">
            <div className="login-divider-line" />
            <span className="login-divider-text">or</span>
            <div className="login-divider-line" />
          </div>

          <p className="login-signup-row">
            Don't have an account?{' '}
            <Link to="/sign-up">Create one</Link>
          </p>
        </div>
      </section>
    </>
  )
}

export default Login