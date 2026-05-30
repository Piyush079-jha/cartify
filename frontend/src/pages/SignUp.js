import React, { useState } from 'react'
import loginIcons from '../assest/signin.gif'
import { FaEye, FaEyeSlash } from "react-icons/fa"
import { Link, useNavigate } from 'react-router-dom'
import imageTobase64 from '../helpers/imageTobase64'
import SummaryApi from '../common'
import { toast } from 'react-toastify'

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState({ email: "", password: "", name: "", confirmPassword: "", profilePic: "" })
  const navigate = useNavigate()

  const handleOnChange = (e) => {
    const { name, value } = e.target
    setData(prev => ({ ...prev, [name]: value }))
  }

  const handleUploadPic = async (e) => {
    const file = e.target.files[0]
    const imagePic = await imageTobase64(file)
    setData(prev => ({ ...prev, profilePic: imagePic }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (data.password !== data.confirmPassword) {
      toast.error("Passwords do not match")
      return
    }
    setLoading(true)
    const dataResponse = await fetch(SummaryApi.signUP.url, {
      method: SummaryApi.signUP.method,
      headers: { "content-type": "application/json" },
      body: JSON.stringify(data)
    })
    const dataApi = await dataResponse.json()
    setLoading(false)
    if (dataApi.success) { toast.success(dataApi.message); navigate("/login") }
    if (dataApi.error) toast.error(dataApi.message)
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;1,300&family=DM+Sans:wght@300;400;500&display=swap');

        .signup-page {
          min-height: calc(100vh - 60px);
          background: #0a0a0a;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px 20px;
          position: relative;
          overflow: hidden;
        }
        .signup-page::before {
          content: '';
          position: absolute;
          top: -10%;
          left: 50%;
          transform: translateX(-50%);
          width: 600px;
          height: 600px;
          background: radial-gradient(circle, rgba(201,168,76,0.05) 0%, transparent 70%);
          pointer-events: none;
        }

        .signup-card {
          width: 100%;
          max-width: 400px;
          position: relative;
          z-index: 1;
        }

        .signup-brand {
          text-align: center;
          margin-bottom: 36px;
        }
        .signup-brand-name {
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          font-weight: 300;
          letter-spacing: 0.4em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.25);
          margin: 0 0 8px;
        }
        .signup-brand-rule {
          width: 32px;
          height: 0.5px;
          background: #c9a84c;
          margin: 0 auto;
          opacity: 0.5;
        }

        /* Avatar upload */
        .signup-avatar-wrap {
          display: flex;
          justify-content: center;
          margin-bottom: 28px;
        }
        .signup-avatar-label {
          cursor: pointer;
          position: relative;
          display: block;
        }
        .signup-avatar-ring {
          width: 72px;
          height: 72px;
          border-radius: 50%;
          border: 0.5px solid rgba(201,168,76,0.35);
          overflow: hidden;
          background: rgba(255,255,255,0.03);
          box-shadow: 0 0 28px rgba(201,168,76,0.1);
          position: relative;
          transition: border-color 0.25s ease, box-shadow 0.25s ease;
        }
        .signup-avatar-label:hover .signup-avatar-ring {
          border-color: rgba(201,168,76,0.7);
          box-shadow: 0 0 32px rgba(201,168,76,0.2);
        }
        .signup-avatar-overlay {
          position: absolute;
          bottom: 0; left: 0; right: 0;
          background: rgba(0,0,0,0.6);
          color: rgba(255,255,255,0.7);
          font-size: 8px;
          font-weight: 500;
          text-align: center;
          padding: 5px 0;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }

        .signup-heading {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: 30px;
          font-weight: 300;
          color: #e8e4dc;
          text-align: center;
          margin: 0 0 6px;
          letter-spacing: -0.01em;
        }
        .signup-sub {
          font-size: 12px;
          color: rgba(255,255,255,0.25);
          text-align: center;
          margin: 0 0 32px;
          letter-spacing: 0.06em;
        }

        .signup-form {
          display: flex;
          flex-direction: column;
          gap: 18px;
        }
        .signup-label {
          font-size: 9px;
          font-weight: 500;
          color: rgba(255,255,255,0.3);
          letter-spacing: 0.18em;
          text-transform: uppercase;
          display: block;
          margin-bottom: 7px;
        }
        .signup-input {
          width: 100%;
          padding: 12px 16px;
          background: rgba(255,255,255,0.03);
          border: 0.5px solid rgba(255,255,255,0.09);
          color: #e8e4dc;
          font-size: 13px;
          outline: none;
          box-sizing: border-box;
          transition: border-color 0.22s ease, box-shadow 0.22s ease, background 0.22s ease;
          font-family: 'DM Sans', sans-serif;
          letter-spacing: 0.02em;
          border-radius: 1px;
        }
        .signup-input::placeholder { color: rgba(255,255,255,0.18); }
        .signup-input:focus {
          border-color: #c9a84c;
          box-shadow: 0 0 0 2px rgba(201,168,76,0.1);
          background: rgba(201,168,76,0.03);
        }

        .signup-eye {
          position: absolute;
          right: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: rgba(255,255,255,0.25);
          cursor: pointer;
          font-size: 14px;
          transition: color 0.2s ease;
        }
        .signup-eye:hover { color: #c9a84c; }

        .signup-submit {
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
        .signup-submit:hover:not(:disabled) {
          background: #c9a84c;
          color: #0a0a0a;
          box-shadow: 0 0 24px rgba(201,168,76,0.25);
          letter-spacing: 0.22em;
        }
        .signup-submit:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }

        .signup-divider {
          display: flex;
          align-items: center;
          gap: 16px;
          margin: 8px 0;
        }
        .signup-divider-line {
          flex: 1;
          height: 0.5px;
          background: rgba(255,255,255,0.07);
        }
        .signup-divider-text {
          font-size: 10px;
          color: rgba(255,255,255,0.2);
          letter-spacing: 0.1em;
        }

        .signup-login-row {
          text-align: center;
          font-size: 12px;
          color: rgba(255,255,255,0.28);
          margin-top: 24px;
          letter-spacing: 0.03em;
        }
        .signup-login-row a {
          color: #c9a84c;
          text-decoration: none;
          transition: color 0.2s ease;
        }
        .signup-login-row a:hover { color: #e8d5a3; }

        @media (max-width: 480px) {
          .signup-page { padding: 32px 20px; align-items: flex-start; padding-top: 48px; }
          .signup-heading { font-size: 26px; }
        }
      `}</style>

      <section className="signup-page">
        <div className="signup-card">

          <div className="signup-brand">
            <p className="signup-brand-name">Cartify</p>
            <div className="signup-brand-rule" />
          </div>

          <div className="signup-avatar-wrap">
            <label htmlFor="profilePicUpload" className="signup-avatar-label">
              <div className="signup-avatar-ring">
                <img
                  src={data.profilePic || loginIcons}
                  alt="profile"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div className="signup-avatar-overlay">Upload</div>
              </div>
              <input
                type="file"
                id="profilePicUpload"
                onChange={handleUploadPic}
                style={{ display: 'none' }}
              />
            </label>
          </div>

          <h1 className="signup-heading">Create account</h1>
          <p className="signup-sub">Join Cartify today</p>

          <form onSubmit={handleSubmit} className="signup-form">
            <div>
              <label className="signup-label">Full Name</label>
              <input
                type="text"
                name="name"
                placeholder="Your full name"
                value={data.name}
                onChange={handleOnChange}
                className="signup-input"
                required
              />
            </div>

            <div>
              <label className="signup-label">Email</label>
              <input
                type="email"
                name="email"
                placeholder="your@email.com"
                value={data.email}
                onChange={handleOnChange}
                className="signup-input"
                required
              />
            </div>

            <div>
              <label className="signup-label">Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="••••••••"
                  value={data.password}
                  onChange={handleOnChange}
                  className="signup-input"
                  style={{ paddingRight: '44px' }}
                  required
                />
                <span className="signup-eye" onClick={() => setShowPassword(p => !p)}>
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
            </div>

            <div>
              <label className="signup-label">Confirm Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="••••••••"
                  value={data.confirmPassword}
                  onChange={handleOnChange}
                  className="signup-input"
                  style={{ paddingRight: '44px' }}
                  required
                />
                <span className="signup-eye" onClick={() => setShowConfirmPassword(p => !p)}>
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
            </div>

            <button type="submit" className="signup-submit" disabled={loading}>
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <div className="signup-divider">
            <div className="signup-divider-line" />
            <span className="signup-divider-text">or</span>
            <div className="signup-divider-line" />
          </div>

          <p className="signup-login-row">
            Already have an account?{' '}
            <Link to="/login">Sign in</Link>
          </p>
        </div>
      </section>
    </>
  )
}

export default SignUp