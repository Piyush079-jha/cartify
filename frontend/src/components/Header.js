import React, { useContext, useState, useEffect, useRef } from 'react'
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
  const [scrolled, setScrolled] = useState(false)
  const [searchFocused, setSearchFocused] = useState(false)
  const [cartBounce, setCartBounce] = useState(false)
  const context = useContext(Context)
  const navigate = useNavigate()
  const searchInput = useLocation()
  const URLSearch = new URLSearchParams(searchInput?.search)
  const searchQuery = URLSearch.getAll("q")
  const [search, setSearch] = useState(searchQuery)
  const prevCart = useRef(context?.cartProductCount)

  const bg     = isDark ? 'rgba(10,10,10,0.85)'  : 'rgba(250,249,247,0.85)'
  const bgSolid= isDark ? '#0a0a0a' : '#faf9f7'
  const text   = isDark ? '#e8e4dc' : '#1a1814'
  const muted  = isDark ? '#666' : '#aaa'
  const border = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(26,24,20,0.1)'
  const surface= isDark ? '#141414' : '#ffffff'
  const gold   = '#c9a84c'
  const goldGlow = isDark ? '0 0 20px rgba(201,168,76,0.25)' : '0 0 20px rgba(201,168,76,0.15)'

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (prevCart.current !== context?.cartProductCount && context?.cartProductCount > 0) {
      setCartBounce(true)
      setTimeout(() => setCartBounce(false), 600)
    }
    prevCart.current = context?.cartProductCount
  }, [context?.cartProductCount])

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
    padding: '10px 14px', fontSize: '12px', fontWeight: 400,
    color: text, textDecoration: 'none', whiteSpace: 'nowrap',
    transition: 'all 0.2s ease', cursor: 'pointer',
    border: 'none', background: 'transparent',
    width: '100%', textAlign: 'left', letterSpacing: '0.04em',
    fontFamily: "'DM Sans', -apple-system, sans-serif"
  }

  const navLinks = [
    { label: 'All Products', path: '/product-category' },
    { label: 'Mobiles', path: '/product-category?category=mobiles' },
    { label: 'Cameras', path: '/product-category?category=camera' },
    { label: 'Audio', path: '/product-category?category=earphones' },
    { label: 'Watches', path: '/product-category?category=watches' },
  ]

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500&display=swap');

        @keyframes dropdownSlide {
          from { opacity:0; transform:translateY(-6px) scale(0.98); }
          to   { opacity:1; transform:translateY(0)   scale(1); }
        }
        @keyframes cartBounce {
          0%,100% { transform: scale(1) rotate(0deg); }
          25%      { transform: scale(1.3) rotate(-12deg); }
          50%      { transform: scale(1.1) rotate(8deg); }
          75%      { transform: scale(1.2) rotate(-5deg); }
        }
        @keyframes badgePop {
          0%   { transform: scale(0); }
          70%  { transform: scale(1.2); }
          100% { transform: scale(1); }
        }
        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes mobileSlide {
          from { opacity:0; transform:translateY(-4px); }
          to   { opacity:1; transform:translateY(0); }
        }

        .hdr-root {
          font-family: 'DM Sans', -apple-system, sans-serif;
        }
        .hdr-nav-link {
          font-size: 11px; letter-spacing: 0.13em; text-transform: uppercase;
          color: ${muted}; text-decoration: none; font-weight: 400;
          padding: 6px 0; position: relative; transition: color 0.25s ease;
        }
        .hdr-nav-link::after {
          content: ''; position: absolute; bottom: 0; left: 0; right: 0;
          height: 0.5px; background: ${gold};
          transform: scaleX(0); transform-origin: left;
          transition: transform 0.3s cubic-bezier(0.4,0,0.2,1);
        }
        .hdr-nav-link:hover { color: ${text}; }
        .hdr-nav-link:hover::after { transform: scaleX(1); }

        .hdr-search-input {
          flex: 1; border: none; background: transparent;
          padding: 10px 14px; font-size: 12px; outline: none;
          color: ${text}; letter-spacing: 0.03em;
          font-family: 'DM Sans', -apple-system, sans-serif;
        }
        .hdr-search-input::placeholder { color: ${muted}; }

        .hdr-icon-btn {
          transition: color 0.2s ease, transform 0.2s ease;
          color: ${muted};
        }
        .hdr-icon-btn:hover { color: ${gold} !important; transform: translateY(-1px); }

        .hdr-menu-item:hover {
          background: ${isDark ? 'rgba(201,168,76,0.06)' : 'rgba(201,168,76,0.05)'} !important;
          color: ${gold} !important;
          padding-left: 18px !important;
        }
        .hdr-avatar-btn {
          transition: all 0.2s ease;
        }
        .hdr-avatar-btn:hover {
          border-color: ${gold} !important;
          box-shadow: ${goldGlow} !important;
        }

        .hdr-mobile-btn { display: none !important; }
        .hdr-search-desktop { display: flex !important; }

        @media (max-width: 900px) { .hdr-nav-links { display: none !important; } }
        @media (max-width: 768px) {
          .hdr-search-desktop { display: none !important; }
          .hdr-mobile-btn { display: flex !important; }
        }
      `}</style>

      <header className="hdr-root" style={{
        height: '60px',
        background: scrolled ? bg : bgSolid,
        backdropFilter: scrolled ? 'blur(20px) saturate(1.4)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(20px) saturate(1.4)' : 'none',
        borderBottom: `0.5px solid ${scrolled ? border : border}`,
        boxShadow: scrolled ? (isDark ? '0 8px 32px rgba(0,0,0,0.4)' : '0 8px 32px rgba(0,0,0,0.06)') : 'none',
        position: 'fixed', width: '100%', top: 0, zIndex: 50,
        transition: 'background 0.4s ease, backdrop-filter 0.4s ease, box-shadow 0.4s ease'
      }}>
        <div style={{
          height: '100%', maxWidth: '1400px', margin: '0 auto',
          display: 'flex', alignItems: 'center',
          padding: '0 32px', justifyContent: 'space-between', gap: '24px'
        }}>

          {/* Logo */}
          <div style={{ flexShrink: 0, transition: 'transform 0.3s ease' }}
            onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.02)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
          >
            <Link to={"/"}>
              <Logo w={72} h={40} isDark={isDark} />
            </Link>
          </div>

          {/* Nav links */}
          <nav className="hdr-nav-links" style={{ display: 'flex', alignItems: 'center', gap: '28px' }}>
            {navLinks.map(({ label, path }) => (
              <Link key={label} to={path} className="hdr-nav-link">{label}</Link>
            ))}
          </nav>

          {/* Search */}
          <div className="hdr-search-desktop" style={{ flex: 1, maxWidth: '360px' }}>
            <div style={{
              display: 'flex', alignItems: 'center', width: '100%',
              background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(26,24,20,0.03)',
              border: `0.5px solid ${searchFocused ? gold : border}`,
              borderRadius: '2px', overflow: 'hidden',
              boxShadow: searchFocused ? goldGlow : 'none',
              transition: 'border-color 0.25s ease, box-shadow 0.25s ease'
            }}>
              <input
                className="hdr-search-input"
                type='text'
                placeholder='Search products...'
                onChange={handleSearch}
                value={search}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
              />
              <div style={{
                width: '40px', height: '40px', display: 'flex',
                alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', color: searchFocused ? gold : muted,
                fontSize: '14px', flexShrink: 0,
                transition: 'color 0.2s ease'
              }}>
                <GrSearch />
              </div>
            </div>
          </div>

          {/* Right */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexShrink: 0 }}>

            {/* Mobile search */}
            <div className="hdr-mobile-btn" style={{ alignItems: 'center', cursor: 'pointer', color: muted, fontSize: '17px' }}
              onClick={() => setMobileSearchOpen(p => !p)}>
              <GrSearch />
            </div>

            <DarkModeToggle isDark={isDark} toggleDarkMode={toggleDarkMode} />

            {/* User avatar */}
            {user?._id && (
              <div style={{ position: 'relative' }}>
                <div className="hdr-avatar-btn"
                  style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '34px', height: '34px', borderRadius: '50%', border: `0.5px solid ${border}`, color: muted, fontSize: '18px' }}
                  onClick={() => setMenuDisplay(p => !p)}>
                  {user?.profilePic
                    ? <img src={user?.profilePic} style={{ width: '34px', height: '34px', borderRadius: '50%', objectFit: 'cover' }} alt={user?.name} />
                    : <FaRegCircleUser />}
                </div>

                {menuDisplay && (
                  <div style={{
                    position: 'absolute', top: '46px', right: 0,
                    background: surface, border: `0.5px solid ${border}`,
                    boxShadow: isDark ? '0 20px 60px rgba(0,0,0,0.6)' : '0 20px 60px rgba(0,0,0,0.1)',
                    padding: '6px', minWidth: '200px', zIndex: 100,
                    animation: 'dropdownSlide 0.2s ease',
                    backdropFilter: 'blur(12px)'
                  }}>
                    <div style={{ padding: '12px 14px', borderBottom: `0.5px solid ${border}`, marginBottom: '4px' }}>
                      <p style={{ fontSize: '12px', fontWeight: 500, color: text, margin: 0, textTransform: 'capitalize', letterSpacing: '0.03em' }}>{user?.name || 'User'}</p>
                      <p style={{ fontSize: '10px', color: gold, margin: '2px 0 0', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
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
                            <span style={{ fontSize: '12px', color: muted }}>{item.icon}</span>{item.label}
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
                            <span style={{ fontSize: '12px', color: muted }}>{item.icon}</span>{item.label}
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
              <Link to={"/cart"} style={{ position: 'relative', fontSize: '18px', display: 'flex', alignItems: 'center' }}
                className="hdr-icon-btn">
                <FaShoppingCart style={{
                  animation: cartBounce ? 'cartBounce 0.5s ease' : 'none',
                  display: 'block'
                }} />
                {context?.cartProductCount > 0 && (
                  <div style={{
                    position: 'absolute', top: '-7px', right: '-9px',
                    background: gold, color: '#fff',
                    minWidth: '17px', height: '17px', borderRadius: '10px',
                    fontSize: '9px', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', fontWeight: 600, padding: '0 4px',
                    animation: 'badgePop 0.3s cubic-bezier(0.34,1.56,0.64,1)',
                    letterSpacing: 0
                  }}>
                    {context?.cartProductCount}
                  </div>
                )}
              </Link>
            )}

            {/* Sign In */}
            {!user?._id && (
              <Link to={"/login"} style={{
                padding: '7px 18px', border: `0.5px solid ${border}`,
                color: text, fontWeight: 400, fontSize: '11px',
                letterSpacing: '0.12em', textTransform: 'uppercase',
                textDecoration: 'none', transition: 'all 0.25s ease',
                background: 'transparent', borderRadius: '2px',
                position: 'relative', overflow: 'hidden'
              }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = gold
                  e.currentTarget.style.color = '#fff'
                  e.currentTarget.style.borderColor = gold
                  e.currentTarget.style.boxShadow = goldGlow
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'transparent'
                  e.currentTarget.style.color = text
                  e.currentTarget.style.borderColor = border
                  e.currentTarget.style.boxShadow = 'none'
                }}
              >Sign In</Link>
            )}

            {/* Hamburger */}
            <div className="hdr-mobile-btn" style={{ alignItems: 'center', cursor: 'pointer', color: muted, fontSize: '18px', transition: 'color 0.2s ease' }}
              onClick={() => setMobileMenuOpen(p => !p)}
              onMouseEnter={e => e.currentTarget.style.color = gold}
              onMouseLeave={e => e.currentTarget.style.color = muted}
            >
              {mobileMenuOpen ? <FaTimes /> : <FaBars />}
            </div>
          </div>
        </div>

        {/* Mobile Search */}
        {mobileSearchOpen && (
          <div style={{
            position: 'absolute', top: '60px', left: 0, right: 0,
            background: isDark ? 'rgba(10,10,10,0.97)' : 'rgba(250,249,247,0.97)',
            backdropFilter: 'blur(20px)',
            borderBottom: `0.5px solid ${border}`,
            padding: '12px 16px', zIndex: 49,
            animation: 'mobileSlide 0.2s ease'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(26,24,20,0.04)', border: `0.5px solid ${border}`, borderRadius: '2px', overflow: 'hidden' }}>
              <input type='text' placeholder='Search products...'
                style={{ flex: 1, border: 'none', background: 'transparent', padding: '10px 14px', fontSize: '13px', outline: 'none', color: text, fontFamily: 'DM Sans, sans-serif' }}
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
            background: isDark ? 'rgba(14,14,14,0.97)' : 'rgba(255,255,255,0.97)',
            backdropFilter: 'blur(20px)',
            borderBottom: `0.5px solid ${border}`,
            padding: '8px', zIndex: 49,
            animation: 'mobileSlide 0.2s ease'
          }}>
            <div style={{ padding: '12px 14px 14px', borderBottom: `0.5px solid ${border}`, marginBottom: '4px' }}>
              <p style={{ fontWeight: 500, color: text, margin: 0, textTransform: 'capitalize', fontSize: '13px' }}>{user?.name}</p>
              <p style={{ fontSize: '10px', color: gold, margin: '3px 0 0', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{user?.role === ROLE.ADMIN ? 'Administrator' : 'Member'}</p>
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