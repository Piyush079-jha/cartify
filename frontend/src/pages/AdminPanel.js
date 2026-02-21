import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { FaUsers, FaBox } from "react-icons/fa"
import { FaRegCircleUser } from "react-icons/fa6"
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom'
import ROLE from '../common/role'

const AdminPanel = () => {
  const user = useSelector(state => state?.user?.user)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    if (user?.role !== ROLE.ADMIN) {
      navigate("/")
    }
  }, [user])

  const navItems = [
    { path: 'all-products', label: 'All Products', icon: <FaBox /> },
    { path: 'all-users', label: 'All Users', icon: <FaUsers /> },
  ]

  const isActive = (path) => location.pathname.includes(path)

  return (
    <div style={{
      minHeight: 'calc(100vh - 72px)',
      display: 'flex',
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 60%, #0f3460 100%)' // ✅ Fixed: was '#f4f6fb'
    }}>

      {/* Sidebar */}
      <aside style={{
        width: '260px',
        minWidth: '260px',
        background: 'linear-gradient(180deg, #12122a 0%, #0e1836 60%, #0a2847 100%)',
        minHeight: '100%',
        display: 'flex',
        flexDirection: 'column',
        padding: '24px 0',
        boxShadow: '4px 0 24px rgba(0,0,0,0.3)',
        borderRight: '1px solid rgba(255,255,255,0.07)'
      }}>

        {/* Admin Profile */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '24px 20px 32px',
          borderBottom: '1px solid rgba(255,255,255,0.1)'
        }}>
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '36px',
            color: '#fff',
            marginBottom: '12px',
            boxShadow: '0 8px 24px rgba(102, 126, 234, 0.4)',
            border: '3px solid rgba(255,255,255,0.2)'
          }}>
            {user?.profilePic ? (
              <img src={user?.profilePic} style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover' }} alt={user?.name} />
            ) : (
              <FaRegCircleUser />
            )}
          </div>
          <p style={{
            color: '#fff',
            fontWeight: 700,
            fontSize: '16px',
            textTransform: 'capitalize',
            margin: '0 0 4px'
          }}>
            {user?.name}
          </p>
          <span style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: '#fff',
            fontSize: '11px',
            fontWeight: 700,
            padding: '3px 12px',
            borderRadius: '20px',
            letterSpacing: '1px'
          }}>
            👑 ADMIN
          </span>
        </div>

        {/* Nav Links */}
        <nav style={{ padding: '20px 12px', flex: 1 }}>
          <p style={{
            color: 'rgba(255,255,255,0.4)',
            fontSize: '11px',
            fontWeight: 700,
            letterSpacing: '2px',
            padding: '0 12px',
            marginBottom: '12px',
            textTransform: 'uppercase'
          }}>
            Management
          </p>
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 16px',
                borderRadius: '12px',
                marginBottom: '6px',
                textDecoration: 'none',
                fontSize: '14px',
                fontWeight: 600,
                color: isActive(item.path) ? '#fff' : 'rgba(255,255,255,0.65)',
                background: isActive(item.path)
                  ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                  : 'transparent',
                boxShadow: isActive(item.path)
                  ? '0 4px 16px rgba(102, 126, 234, 0.35)'
                  : 'none',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={e => {
                if (!isActive(item.path)) {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.08)'
                  e.currentTarget.style.color = '#fff'
                }
              }}
              onMouseLeave={e => {
                if (!isActive(item.path)) {
                  e.currentTarget.style.background = 'transparent'
                  e.currentTarget.style.color = 'rgba(255,255,255,0.65)'
                }
              }}
            >
              <span style={{ fontSize: '16px' }}>{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Back to Store */}
        <div style={{ padding: '12px' }}>
          <Link
            to="/"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '12px 16px',
              borderRadius: '12px',
              textDecoration: 'none',
              fontSize: '13px',
              fontWeight: 600,
              color: 'rgba(255,255,255,0.5)',
              border: '1px solid rgba(255,255,255,0.1)',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.color = '#fff'
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.color = 'rgba(255,255,255,0.5)'
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'
            }}
          >
            ← Back to Store
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{
        flex: 1,
        padding: '28px',
        overflowY: 'auto',
        background: 'transparent'  
      }}>
        <Outlet />
      </main>
    </div>
  )
}

export default AdminPanel