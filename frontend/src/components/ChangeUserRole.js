import React, { useState } from 'react'
import ROLE from '../common/role'
import { IoMdClose } from "react-icons/io"
import SummaryApi from '../common'
import { toast } from 'react-toastify'

const ChangeUserRole = ({ name, email, role, userId, onClose, callFunc }) => {
  const [userRole, setUserRole] = useState(role)

  const gold       = '#c9a84c'
  const border     = 'rgba(255,255,255,0.08)'
  const muted      = 'rgba(160,152,144,0.7)'
  const text       = '#e8e4dc'
  const goldBg     = 'rgba(201,168,76,0.07)'
  const goldBorder = 'rgba(201,168,76,0.22)'

  const updateUserRole = async () => {
    const fetchResponse = await fetch(SummaryApi.updateUser.url, {
      method: SummaryApi.updateUser.method,
      credentials: 'include',
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ userId, role: userRole })
    })
    const responseData = await fetchResponse.json()
    if (responseData.success) {
      toast.success(responseData.message)
      onClose()
      callFunc()
    } else {
      toast.error(responseData.message)
    }
  }

  return (
    <>
      <style>{`
        @keyframes curSlideUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .cur-select {
          width: 100%; padding: 11px 14px;
          background: rgba(255,255,255,0.03);
          border: 0.5px solid ${border};
          color: ${text}; font-size: 13px;
          outline: none; cursor: pointer;
          transition: border-color 0.2s ease, background 0.2s ease;
          font-family: 'DM Sans', sans-serif;
          letter-spacing: 0.02em; border-radius: 1px;
          box-sizing: border-box;
        }
        .cur-select option { background: #111110; color: ${text}; }
        .cur-select:focus {
          border-color: ${gold};
          background: ${goldBg};
        }
        .cur-btn {
          flex: 1; padding: 12px;
          font-size: 10px; font-weight: 500;
          letter-spacing: 0.14em; text-transform: uppercase;
          cursor: pointer; transition: all 0.22s ease;
          font-family: 'DM Sans', sans-serif;
          border-radius: 1px;
        }
        .cur-btn-cancel {
          background: transparent;
          border: 0.5px solid ${border};
          color: ${muted};
        }
        .cur-btn-cancel:hover {
          border-color: rgba(255,255,255,0.2);
          color: ${text};
        }
        .cur-btn-update {
          background: transparent;
          border: 0.5px solid ${gold};
          color: ${gold};
        }
        .cur-btn-update:hover {
          background: ${gold};
          color: #0a0a0a;
          box-shadow: 0 0 20px rgba(201,168,76,0.2);
          letter-spacing: 0.18em;
        }
        .cur-close-btn {
          width: 30px; height: 30px;
          border: 0.5px solid ${border};
          background: transparent;
          color: ${muted}; font-size: 16px;
          cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          transition: all 0.2s ease; border-radius: 1px; flex-shrink: 0;
        }
        .cur-close-btn:hover {
          border-color: rgba(192,120,120,0.5);
          color: #c07878;
        }
      `}</style>

      <div style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: 'rgba(0,0,0,0.78)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '20px'
      }}>
        <div style={{
          background: '#111110',
          border: `0.5px solid ${border}`,
          width: '100%', maxWidth: '400px',
          boxShadow: '0 40px 80px rgba(0,0,0,0.6)',
          animation: 'curSlideUp 0.25s ease',
          overflow: 'hidden', borderRadius: '1px',
          position: 'relative'
        }}>

          {/* Gold top accent */}
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0,
            height: '1.5px', background: gold
          }} />

          {/* Header */}
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
            padding: '22px 24px 20px',
            borderBottom: `0.5px solid ${border}`
          }}>
            <div>
              <h2 style={{
                fontFamily: 'Cormorant Garamond, Georgia, serif',
                fontSize: '22px', fontWeight: 300,
                color: text, margin: '0 0 4px', letterSpacing: '-0.01em'
              }}>
                Change User Role
              </h2>
              <p style={{
                color: muted, fontSize: '11px', margin: 0,
                letterSpacing: '0.04em', fontFamily: 'DM Sans, sans-serif'
              }}>
                Update permissions for this user
              </p>
            </div>
            <button className="cur-close-btn" onClick={onClose} aria-label="Close">
              <IoMdClose />
            </button>
          </div>

          {/* Body */}
          <div style={{ padding: '24px' }}>

            {/* User info */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: '14px',
              padding: '14px 16px',
              border: `0.5px solid ${goldBorder}`,
              background: goldBg,
              marginBottom: '22px'
            }}>
              {/* Avatar */}
              <div style={{
                width: '40px', height: '40px', flexShrink: 0,
                border: `0.5px solid ${goldBorder}`,
                background: 'rgba(201,168,76,0.1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: gold, fontSize: '16px', fontWeight: 500,
                fontFamily: 'DM Sans, sans-serif'
              }}>
                {name?.charAt(0)?.toUpperCase()}
              </div>
              <div style={{ minWidth: 0 }}>
                <p style={{
                  color: text, fontWeight: 400, fontSize: '13px',
                  margin: '0 0 3px', letterSpacing: '0.02em',
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  fontFamily: 'DM Sans, sans-serif'
                }}>
                  {name}
                </p>
                <p style={{
                  color: muted, fontSize: '11px', margin: 0,
                  letterSpacing: '0.02em',
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  fontFamily: 'DM Sans, sans-serif'
                }}>
                  {email}
                </p>
              </div>
            </div>

            {/* Role selector */}
            <div style={{ marginBottom: '22px' }}>
              <label style={{
                fontSize: '9px', fontWeight: 500,
                letterSpacing: '0.18em', textTransform: 'uppercase',
                color: muted, display: 'block', marginBottom: '8px',
                fontFamily: 'DM Sans, sans-serif'
              }}>
                Select Role
              </label>
              <select
                value={userRole}
                onChange={e => setUserRole(e.target.value)}
                className="cur-select"
              >
                {Object.values(ROLE).map(el => (
                  <option key={el} value={el}>{el}</option>
                ))}
              </select>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '1px' }}>
              <button className="cur-btn cur-btn-cancel" onClick={onClose}>
                Cancel
              </button>
              <button className="cur-btn cur-btn-update" onClick={updateUserRole}>
                Update Role
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default ChangeUserRole