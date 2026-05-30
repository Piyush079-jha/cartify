import React, { useContext, useState } from 'react'
import Logo from './Logo'
import { GrSearch } from "react-icons/gr";
import { FaRegCircleUser } from "react-icons/fa6";
import { FaShoppingCart, FaHeart, FaBox, FaUsers, FaTachometerAlt, FaSignOutAlt, FaClipboardList, FaBars, FaTimes } from "react-icons/fa";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import SummaryApi from '../common';
import { toast } from 'react-toastify'
import { setUserDetails } from '../store/userSlice';
import ROLE from '../common/role';
import Context from '../context';
import DarkModeToggle from './DarkModeToggle';

const Header = ({ isDark, toggleDarkMode }) => {
  const user = useSelector(state => state?.user?.user)
  const dispatch = useDispatch()
  const [menuDisplay, setMenuDisplay] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false)
  const context = useContext(Context)
  const navigate = useNavigate()
  const searchInput = useLocation()
  const URLSearch = new URLSearchParams(searchInput?.search)
  const searchQuery = URLSearch.getAll("q")
  const [search, setSearch] = useState(searchQuery)

  // Palette
  const bg      = isDark ? '#0e0e0e' : '#faf9f7'
  const text     = isDark ? '#e8e4dc' : '#1a1814'
  const muted    = isDark ? '#888' : '#999'
  const border   = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(26,24,20,0.1)'
  const surface  = isDark ? '#1c1c1c' : '#ffffff'
  const gold     = '#c9a84c'

  const handleLogout = async () => {
    const fetchData = await fetch(SummaryApi.logout_user.url, {
      method: SummaryApi.logout_user.method,
      credentials: 'include'
    })
    const data = await fetchData.json()
    if (data.success) {
      toast.success(data.message)
      dispatch(setUserDetails(null))
      navigate("/")
    }
    if (data.error) toast.error(data.message)
  }

  const handleSearch = (e) => {
    const { value } = e.target
    setSearch(value)
    if (value) navigate(`/search?q=${value}`)
    else navigate("/search")
  }

  const closeMenu = () => { setMenuDisplay(false); setMobileMenuOpen(false) }

  const menuItemStyle = {
    display: 'flex', alignItems: 'center', gap: '10px',
    padding: '10px 14px', fontSize: '13px', fontWeight: 400,
    color: text, textDecoration: 'none', whiteSpace: 'nowrap',
    transition: 'all 0.2s ease', cursor: 'pointer',
    border: 'none', background: 'transparent',
    width: '100%', textAlign: 'left', letterSpacing: '0.02em'
  }

  return (
    <>
      <style>{`
        @keyframes dropdownSlide {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .hdr-nav-link {
          font-size: 12px; letter-spacing: 0.12em; text-transform: uppercase;
          color: ${muted}; text-decoration: none; font-weight: 400;
          transition: color 0.2s ease; padding: 4px 0;
          border-bottom: 1px solid transparent;
        }
        .hdr-nav-link:hover { color: ${text}; border-bottom-color: ${gold}; }
        .hdr-search-input::placeholder { color: ${muted}; }
        .hdr-icon-btn { transition: color 0.2s ease; }
        .hdr-icon-btn:hover { color: ${gold} !important; }
        .hdr-menu-item:hover { background: ${isDark ? 'rgba(201,168,76,0.08)' : 'rgba(201,168,76,0.06)'} !important; color: ${gold} !important; }
        .hdr-mobile-btn { display: none !important; }
        .hdr-search-desktop { display: flex !important; }
        @media (max-width: 900px) {
          .hdr-nav-links { display: none !important; }
        }
        @media (max-width: 768px) {
          .hdr-search-desktop { display: none !important; }
          .hdr-mobile-btn { display: flex !important; }
        }
      `}</style>

      <header style={{
        height: '60px', background: bg,
        borderBottom: `0.5px solid ${border}`,
        position: 'fixed', width: '100%', top: 0, zIndex: 50,
        transition: 'all 0.3s ease'
      }}>
        <div style={{
          height: '100%', maxWidth: '1400px', margin: '0 auto',
          display: 'flex', alignItems: 'center',
          padding: '0 32px', justifyContent: 'space-between', gap: '24px'
        }}>

          {/* Logo */}
          <div style={{ flexShrink: 0 }}>
            <Link to={"/"}>
              <Logo w={72} h={40} isDark={isDark} />
            </Link>
          </div>

          {/* Nav links — desktop */}
          <nav className="hdr-nav-links" style={{ display: 'flex', alignItems: 'center', gap: '28px' }}>
            {['All Products', 'Mobiles', 'Cameras', 'Audio', 'Watches'].map(label => (
              <Link key={label}
                to={label === 'All Products' ? '/product-category' : `/product-category?category=${label.toLowerCase()}`}
                className="hdr-nav-link">{label}</Link>
            ))}
          </nav>

          {/* Search — desktop */}
          <div className="hdr-search-desktop" style={{ flex: 1, maxWidth: '380px' }}>
            <div style={{
              display: 'flex', alignItems: 'center', width: '100%',
              background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(26,24,20,0.04)',
              border: `0.5px solid ${border}`, borderRadius: '2px', overflow: 'hidden'
            }}>
              <input
                className="hdr-search-input"
                type='text'
                placeholder='Search products...'
                style={{
                  flex: 1, border: 'none', background: 'transparent',
                  padding: '10px 14px', fontSize: '13px', outline: 'none',
                  color: text, letterSpacing: '0.02em'
                }}
                onChange={handleSearch} value={search}
              />
              <div style={{
                width: '40px', height: '40px', display: 'flex',
                alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', color: muted, fontSize: '14px', flexShrink: 0
              }}>
                <GrSearch />
              </div>
            </div>
          </div>

          {/* Right side */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexShrink: 0 }}>

            {/* Mobile search */}
            <div className="hdr-mobile-btn" style={{ alignItems: 'center', cursor: 'pointer', color: muted, fontSize: '17px' }}
              onClick={() => setMobileSearchOpen(p => !p)}>
              <GrSearch />
            </div>

            <DarkModeToggle isDark={isDark} toggleDarkMode={toggleDarkMode} />

            {/* User */}
            {user?._id && (
              <div style={{ position: 'relative' }}>
                <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '34px', height: '34px', borderRadius: '50%', border: `0.5px solid ${border}`, color: muted, fontSize: '18px', transition: 'all 0.2s ease' }}
                  onClick={() => setMenuDisplay(p => !p)}>
                  {user?.profilePic
                    ? <img src={user?.profilePic} style={{ width: '34px', height: '34px', borderRadius: '50%', objectFit: 'cover' }} alt={user?.name} />
                    : <FaRegCircleUser />}
                </div>

                {menuDisplay && (
                  <div style={{
                    position: 'absolute', top: '46px', right: 0,
                    background: surface,
                    border: `0.5px solid ${border}`,
                    borderRadius: '2px',
                    boxShadow: isDark ? '0 16px 48px rgba(0,0,0,0.5)' : '0 16px 48px rgba(0,0,0,0.08)',
                    padding: '6px', minWidth: '200px', zIndex: 100,
                    animation: 'dropdownSlide 0.2s ease'
                  }}>
                    <div style={{ padding: '12px 14px', borderBottom: `0.5px solid ${border}`, marginBottom: '4px' }}>
                      <p style={{ fontSize: '13px', fontWeight: 500, color: text, margin: 0, textTransform: 'capitalize', letterSpacing: '0.02em' }}>{user?.name || 'User'}</p>
                      <p style={{ fontSize: '11px', color: gold, margin: '2px 0 0', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                        {user?.role === ROLE.ADMIN ? 'Administrator' : 'Member'}
                      </p>
                    </div>

                    {user?.role === ROLE.ADMIN && (
                      <>
                        {[
                          { to: '/admin-panel/all-products', icon: <FaTachometerAlt />, label: 'Dashboard' },
                          { to: '/admin-panel/all-products', icon: <FaBox />, label: 'All Products' },
                          { to: '/admin-panel/all-users', icon: <FaUsers />, label: 'All Users' },
                        ].map(item => (
                          <Link key={item.label} to={item.to} style={menuItemStyle} className="hdr-menu-item" onClick={closeMenu}>
                            <span style={{ fontSize: '13px', color: muted }}>{item.icon}</span> {item.label}
                          </Link>
                        ))}
                      </>
                    )}

                    {user?.role !== ROLE.ADMIN && (
                      <>
                        {[
                          { to: '/cart', icon: <FaShoppingCart />, label: 'My Cart' },
                          { to: '/wishlist', icon: <FaHeart />, label: 'Wishlist' },
                          { to: '/my-orders', icon: <FaClipboardList />, label: 'Orders' },
                        ].map(item => (
                          <Link key={item.label} to={item.to} style={menuItemStyle} className="hdr-menu-item" onClick={closeMenu}>
                            <span style={{ fontSize: '13px', color: muted }}>{item.icon}</span> {item.label}
                          </Link>
                        ))}
                      </>
                    )}

                    <div style={{ borderTop: `0.5px solid ${border}`, margin: '4px 0' }} />
                    <button onClick={() => { handleLogout(); closeMenu() }}
                      style={{ ...menuItemStyle, color: '#b04040' }} className="hdr-menu-item">
                      <FaSignOutAlt /> Sign out
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Cart */}
            {user?._id && (
              <Link to={"/cart"} style={{ position: 'relative', fontSize: '18px', color: muted, display: 'flex', alignItems: 'center' }} className="hdr-icon-btn">
                <FaShoppingCart />
                {context?.cartProductCount > 0 && (
                  <div style={{
                    position: 'absolute', top: '-7px', right: '-9px',
                    background: gold, color: '#fff',
                    minWidth: '17px', height: '17px', borderRadius: '10px',
                    fontSize: '9px', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', fontWeight: 600, padding: '0 4px', letterSpacing: 0
                  }}>
                    {context?.cartProductCount}
                  </div>
                )}
              </Link>
            )}

            {/* Login */}
            {!user?._id && (
              <Link to={"/login"} style={{
                padding: '7px 18px', border: `0.5px solid ${border}`,
                color: text, fontWeight: 400, fontSize: '12px',
                letterSpacing: '0.1em', textTransform: 'uppercase',
                textDecoration: 'none', transition: 'all 0.2s ease',
                background: 'transparent', borderRadius: '2px'
              }}
                onMouseEnter={e => { e.currentTarget.style.background = gold; e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = gold }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = text; e.currentTarget.style.borderColor = border }}
              >Sign In</Link>
            )}

            {/* Hamburger */}
            <div className="hdr-mobile-btn" style={{ alignItems: 'center', cursor: 'pointer', color: muted, fontSize: '18px' }}
              onClick={() => setMobileMenuOpen(p => !p)}>
              {mobileMenuOpen ? <FaTimes /> : <FaBars />}
            </div>
          </div>
        </div>

        {/* Mobile Search */}
        {mobileSearchOpen && (
          <div style={{
            position: 'absolute', top: '60px', left: 0, right: 0,
            background: bg, borderBottom: `0.5px solid ${border}`,
            padding: '10px 16px', zIndex: 49, animation: 'dropdownSlide 0.2s ease'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(26,24,20,0.04)', border: `0.5px solid ${border}`, borderRadius: '2px', overflow: 'hidden' }}>
              <input type='text' placeholder='Search products...'
                style={{ flex: 1, border: 'none', background: 'transparent', padding: '10px 14px', fontSize: '13px', outline: 'none', color: text }}
                onChange={handleSearch} value={search} autoFocus />
              <div style={{ width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: muted, fontSize: '14px' }}>
                <GrSearch />
              </div>
            </div>
          </div>
        )}

        {/* Mobile Menu */}
        {mobileMenuOpen && user?._id && (
          <div style={{
            position: 'absolute', top: '60px', left: 0, right: 0,
            background: surface, borderBottom: `0.5px solid ${border}`,
            padding: '8px', zIndex: 49, animation: 'dropdownSlide 0.2s ease'
          }}>
            <div style={{ padding: '10px 14px 12px', borderBottom: `0.5px solid ${border}`, marginBottom: '4px' }}>
              <p style={{ fontWeight: 500, color: text, margin: 0, textTransform: 'capitalize', fontSize: '13px' }}>{user?.name}</p>
              <p style={{ fontSize: '11px', color: gold, margin: '2px 0 0', letterSpacing: '0.06em', textTransform: 'uppercase' }}>{user?.role === ROLE.ADMIN ? 'Administrator' : 'Member'}</p>
            </div>
            {user?.role === ROLE.ADMIN ? (
              <>
                <Link to="/admin-panel/all-products" style={menuItemStyle} onClick={closeMenu}><FaTachometerAlt /> Dashboard</Link>
                <Link to="/admin-panel/all-products" style={menuItemStyle} onClick={closeMenu}><FaBox /> All Products</Link>
                <Link to="/admin-panel/all-users" style={menuItemStyle} onClick={closeMenu}><FaUsers /> All Users</Link>
              </>
            ) : (
              <>
                <Link to="/cart" style={menuItemStyle} onClick={closeMenu}><FaShoppingCart /> My Cart</Link>
                <Link to="/wishlist" style={menuItemStyle} onClick={closeMenu}><FaHeart /> Wishlist</Link>
                <Link to="/my-orders" style={menuItemStyle} onClick={closeMenu}><FaClipboardList /> Orders</Link>
              </>
            )}
            <div style={{ borderTop: `0.5px solid ${border}`, margin: '4px 0' }} />
            <button onClick={() => { handleLogout(); closeMenu() }} style={{ ...menuItemStyle, color: '#b04040', width: '100%' }}>
              <FaSignOutAlt /> Sign out
            </button>
          </div>
        )}
      </header>
    </>
  )
}

export default Header