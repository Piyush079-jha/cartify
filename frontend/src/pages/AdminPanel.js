import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { FaUsers, FaBox } from 'react-icons/fa'
import { FaRegCircleUser } from 'react-icons/fa6'
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom'
import ROLE from '../common/role'

const AdminPanel = () => {
  const user     = useSelector(state => state?.user?.user)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    if (user?.role !== ROLE.ADMIN) navigate('/')
  }, [user])

  const navItems = [
    { path: 'all-products', label: 'All Products', icon: <FaBox style={{ fontSize: '12px' }} /> },
    { path: 'all-users',    label: 'All Users',    icon: <FaUsers style={{ fontSize: '12px' }} /> },
  ]

  const isActive = (path) => location.pathname.includes(path)

  const gold       = '#c9a84c'
  const border     = 'rgba(255,255,255,0.07)'
  const muted      = 'rgba(160,152,144,0.7)'
  const text       = '#e8e4dc'
  const goldBg     = 'rgba(201,168,76,0.07)'
  const goldBorder = 'rgba(201,168,76,0.22)'

  return (
    <>
      <style>{`
        .ap-nav-link {
          display: flex; align-items: center; gap: 10px;
          padding: 10px 14px;
          text-decoration: none;
          font-size: 12px; font-weight: 400;
          letter-spacing: 0.04em;
          font-family: 'DM Sans', sans-serif;
          border-left: 1.5px solid transparent;
          transition: background 0.18s ease, color 0.18s ease, border-color 0.18s ease;
          position: relative;
        }
        .ap-nav-link:hover:not(.active-link) {
          background: rgba(255,255,255,0.03);
          color: ${text} !important;
        }
        .ap-nav-link.active-link {
          border-left-color: ${gold};
          background: ${goldBg};
          color: ${gold} !important;
        }
        .ap-back-link {
          display: flex; align-items: center; gap: 8px;
          padding: 9px 14px;
          text-decoration: none;
          font-size: 10px; letter-spacing: 0.1em;
          text-transform: uppercase;
          font-family: 'DM Sans', sans-serif;
          border: 0.5px solid ${border};
          color: ${muted};
          transition: all 0.2s ease;
          border-radius: 1px;
          margin: 0 16px;
        }
        .ap-back-link:hover {
          border-color: ${goldBorder};
          color: ${gold};
        }
        @media (max-width: 768px) {
          .ap-sidebar { width: 200px !important; min-width: 200px !important; }
          .ap-main    { padding: 16px !important; }
        }
        @media (max-width: 560px) {
          .ap-sidebar { display: none !important; }
        }
      `}</style>

      <div style={{
        minHeight: 'calc(100vh - 72px)',
        display: 'flex',
        background: '#0e0e0e'
      }}>

        {/* Sidebar */}
        <aside className="ap-sidebar" style={{
          width: '220px', minWidth: '220px',
          background: '#111110',
          borderRight: `0.5px solid ${border}`,
          display: 'flex', flexDirection: 'column',
          height: 'calc(100vh - 72px)',
          position: 'sticky', top: '72px',
          overflow: 'hidden'
        }}>

          {/* Top accent */}
          <div style={{ height: '1.5px', background: gold, flexShrink: 0 }} />

          {/* Admin profile */}
          <div style={{
            padding: '24px 20px 20px',
            borderBottom: `0.5px solid ${border}`,
            flexShrink: 0
          }}>
            {/* Avatar */}
            <div style={{
              width: '48px', height: '48px',
              border: `0.5px solid ${goldBorder}`,
              background: goldBg,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '22px', color: gold,
              marginBottom: '12px', overflow: 'hidden'
            }}>
              {user?.profilePic
                ? <img src={user.profilePic} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt={user.name} />
                : <FaRegCircleUser />
              }
            </div>

            <p style={{
              color: text, fontSize: '13px', fontWeight: 400,
              margin: '0 0 6px', letterSpacing: '0.02em',
              fontFamily: 'DM Sans, sans-serif',
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
            }}>
              {user?.name}
            </p>

            <span style={{
              display: 'inline-block',
              border: `0.5px solid ${goldBorder}`,
              background: goldBg,
              color: gold,
              fontSize: '8.5px', fontWeight: 500,
              padding: '2px 8px',
              letterSpacing: '0.14em', textTransform: 'uppercase',
              fontFamily: 'DM Sans, sans-serif'
            }}>
              Admin
            </span>
          </div>

          {/* Nav */}
          <nav style={{ flex: 1, paddingTop: '16px', overflow: 'hidden' }}>
            <p style={{
              fontSize: '8.5px', fontWeight: 400, letterSpacing: '0.18em',
              textTransform: 'uppercase', color: muted,
              margin: '0 0 8px', padding: '0 14px',
              fontFamily: 'DM Sans, sans-serif'
            }}>
              Management
            </p>

            {navItems.map(item => (
              <Link
                key={item.path}
                to={item.path}
                className={`ap-nav-link${isActive(item.path) ? ' active-link' : ''}`}
                style={{ color: isActive(item.path) ? gold : muted }}
              >
                {item.icon}
                {item.label}
                {isActive(item.path) && (
                  <span style={{
                    marginLeft: 'auto',
                    width: '4px', height: '4px',
                    borderRadius: '50%',
                    background: gold, flexShrink: 0
                  }} />
                )}
              </Link>
            ))}
          </nav>

          {/* Back to store */}
          <div style={{ padding: '16px 0', borderTop: `0.5px solid ${border}`, flexShrink: 0 }}>
            <Link to="/" className="ap-back-link">
              ← Back to Store
            </Link>
          </div>
        </aside>

        {/* Main */}
        <main className="ap-main" style={{
          flex: 1, padding: '28px',
          overflowY: 'auto',
          background: '#0e0e0e'
        }}>
          <Outlet />
        </main>
      </div>
    </>
  )
}

export default AdminPanel