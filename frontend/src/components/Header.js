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
  const [searchFocused, setSearchFocused] = useState(false)
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false)
  const context = useContext(Context)
  const navigate = useNavigate()
  const searchInput = useLocation()
  const URLSearch = new URLSearchParams(searchInput?.search)
  const searchQuery = URLSearch.getAll("q")
  const [search, setSearch] = useState(searchQuery)

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
    if (data.error) {
      toast.error(data.message)
    }
  }

  const handleSearch = (e) => {
    const { value } = e.target
    setSearch(value)
    if (value) {
      navigate(`/search?q=${value}`)
    } else {
      navigate("/search")
    }
  }

  const closeMenu = () => {
    setMenuDisplay(false)
    setMobileMenuOpen(false)
  }

  const menuItemStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '11px 16px',
    borderRadius: '10px',
    fontSize: '14px',
    fontWeight: 500,
    color: isDark ? '#e0e0e0' : '#333',
    textDecoration: 'none',
    whiteSpace: 'nowrap',
    transition: 'all 0.2s ease',
    cursor: 'pointer',
    border: 'none',
    background: 'transparent',
    width: '100%',
    textAlign: 'left'
  }

  const bg = isDark ? '#1a1a1a' : '#ffffff'
  const border = isDark ? '1px solid rgba(255,255,255,0.15)' : '1px solid rgba(0,0,0,0.06)'

  return (
    <>
      <style>{`
        @keyframes dropdownSlide {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes mobileSlide {
          from { opacity: 0; transform: translateY(-100%); }
          to { opacity: 1; transform: translateY(0); }
        }
        .header-search-desktop { display: flex; }
        .header-search-mobile { display: none; }
        .header-mobile-btn { display: none; }
        .header-right-desktop { display: flex; }

        @media (max-width: 768px) {
          .header-search-desktop { display: none !important; }
          .header-mobile-btn { display: flex !important; }
          .header-right-desktop { gap: 12px !important; }
          .header-login-btn { padding: 8px 14px !important; font-size: 13px !important; }
        }

        @media (max-width: 480px) {
          .header-inner { padding: 0 14px !important; gap: 12px !important; }
        }
      `}</style>

      <header style={{
        height: '64px',
        background: bg,
        borderBottom: border,
        position: 'fixed',
        width: '100%',
        top: 0,
        zIndex: 50,
        boxShadow: isDark ? '0 4px 20px rgba(0,0,0,0.5)' : '0 4px 20px rgba(0,0,0,0.08)',
        transition: 'all 0.3s ease'
      }}>
        <div className="header-inner" style={{
          height: '100%',
          maxWidth: '1280px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          padding: '0 24px',
          justifyContent: 'space-between',
          gap: '24px'
        }}>

          {/* Logo */}
          <div style={{ flexShrink: 0 }}>
            <Link to={"/"}>
              <Logo w={80} h={44} isDark={isDark} />
            </Link>
          </div>

          {/* Search Bar — Desktop */}
          <div className="header-search-desktop" style={{ flex: 1, maxWidth: '560px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              width: '100%',
              background: searchFocused
                ? (isDark ? 'rgba(102,126,234,0.2)' : 'rgba(102,126,234,0.08)')
                : (isDark ? 'rgba(255,255,255,0.1)' : '#f7f7f7'),
              borderRadius: '14px',
              border: searchFocused ? '2px solid #667eea' : '2px solid transparent',
              overflow: 'hidden',
              transition: 'all 0.3s ease',
              boxShadow: searchFocused ? '0 8px 24px rgba(102,126,234,0.15)' : 'none'
            }}>
              <input
                type='text'
                placeholder='Search for products, brands and more...'
                style={{
                  flex: 1,
                  border: 'none',
                  background: 'transparent',
                  padding: '12px 18px',
                  fontSize: '14px',
                  outline: 'none',
                  color: isDark ? '#fff' : '#333',
                  fontWeight: 500
                }}
                onChange={handleSearch}
                value={search}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
              />
              <div style={{
                width: '48px',
                height: '48px',
                background: 'linear-gradient(135deg, #667eea, #764ba2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: 'white',
                fontSize: '17px',
                flexShrink: 0
              }}>
                <GrSearch />
              </div>
            </div>
          </div>

          {/* Right Side */}
          <div className="header-right-desktop" style={{ display: 'flex', alignItems: 'center', gap: '18px', flexShrink: 0 }}>

            {/* Mobile Search Icon */}
            <div className="header-mobile-btn" style={{ display: 'none', alignItems: 'center', cursor: 'pointer', color: '#667eea', fontSize: '20px' }}
              onClick={() => setMobileSearchOpen(prev => !prev)}>
              <GrSearch />
            </div>

            {/* Dark Mode */}
            <DarkModeToggle isDark={isDark} toggleDarkMode={toggleDarkMode} />

            {/* User Avatar */}
            <div style={{ position: 'relative' }}>
              {user?._id && (
                <div
                  style={{
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    background: isDark ? 'rgba(102,126,234,0.2)' : 'linear-gradient(135deg, rgba(102,126,234,0.15), rgba(118,75,162,0.15))',
                    fontSize: '22px',
                    color: '#667eea',
                    transition: 'all 0.3s ease',
                  }}
                  onClick={() => setMenuDisplay(prev => !prev)}
                >
                  {user?.profilePic ? (
                    <img src={user?.profilePic} style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #667eea' }} alt={user?.name} />
                  ) : (
                    <FaRegCircleUser />
                  )}
                </div>
              )}

              {/* Dropdown */}
              {menuDisplay && user?._id && (
                <div style={{
                  position: 'absolute',
                  top: '52px',
                  right: 0,
                  background: isDark ? '#2d2d2d' : '#ffffff',
                  borderRadius: '16px',
                  boxShadow: isDark ? '0 12px 40px rgba(0,0,0,0.6)' : '0 12px 40px rgba(0,0,0,0.15)',
                  padding: '8px',
                  minWidth: '210px',
                  border: isDark ? '1px solid rgba(255,255,255,0.15)' : '1px solid rgba(0,0,0,0.06)',
                  zIndex: 100,
                  animation: 'dropdownSlide 0.3s ease'
                }}>
                  <div style={{ padding: '12px 16px', borderBottom: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #f0f0f0', marginBottom: '6px' }}>
                    <p style={{ fontSize: '15px', fontWeight: 700, color: isDark ? '#fff' : '#111', margin: 0, textTransform: 'capitalize' }}>{user?.name || 'User'}</p>
                    <p style={{ fontSize: '12px', color: '#667eea', margin: '2px 0 0 0', fontWeight: 500 }}>
                      {user?.role === ROLE.ADMIN ? '👑 Administrator' : '👤 Customer'}
                    </p>
                  </div>

                  {user?.role === ROLE.ADMIN && (
                    <>
                      {[
                        { to: '/admin-panel/all-products', icon: <FaTachometerAlt style={{ color: '#667eea' }}/>, label: 'Dashboard' },
                        { to: '/admin-panel/all-products', icon: <FaBox style={{ color: '#667eea' }}/>, label: 'All Products' },
                        { to: '/admin-panel/all-users', icon: <FaUsers style={{ color: '#667eea' }}/>, label: 'All Users' },
                      ].map(item => (
                        <Link key={item.label} to={item.to} style={menuItemStyle} onClick={closeMenu}
                          onMouseEnter={e => { e.currentTarget.style.background = isDark ? 'rgba(102,126,234,0.2)' : 'rgba(102,126,234,0.08)'; e.currentTarget.style.color = '#667eea' }}
                          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = isDark ? '#e0e0e0' : '#333' }}>
                          {item.icon} {item.label}
                        </Link>
                      ))}
                    </>
                  )}

                  {user?.role !== ROLE.ADMIN && (
                    <>
                      {[
                        { to: '/cart', icon: <FaShoppingCart style={{ color: '#667eea' }}/>, label: 'My Cart' },
                        { to: '/wishlist', icon: <FaHeart style={{ color: '#f5576c' }}/>, label: 'My Wishlist' },
                        { to: '/my-orders', icon: <FaClipboardList style={{ color: '#667eea' }}/>, label: 'My Orders' },
                      ].map(item => (
                        <Link key={item.label} to={item.to} style={menuItemStyle} onClick={closeMenu}
                          onMouseEnter={e => { e.currentTarget.style.background = isDark ? 'rgba(102,126,234,0.2)' : 'rgba(102,126,234,0.08)'; e.currentTarget.style.color = '#667eea' }}
                          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = isDark ? '#e0e0e0' : '#333' }}>
                          {item.icon} {item.label}
                        </Link>
                      ))}
                    </>
                  )}

                  <div style={{ borderTop: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #f0f0f0', margin: '6px 0' }} />
                  <button onClick={() => { handleLogout(); closeMenu() }}
                    style={{ ...menuItemStyle, color: '#f5576c', width: '100%' }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(245,87,108,0.1)' }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}>
                    <FaSignOutAlt style={{ color: '#f5576c' }} /> Logout
                  </button>
                </div>
              )}
            </div>

            {/* Cart Icon */}
            {user?._id && (
              <Link to={"/cart"} style={{ position: 'relative', fontSize: '24px', color: '#667eea', display: 'flex', alignItems: 'center', transition: 'all 0.3s ease' }}>
                <FaShoppingCart />
                {context?.cartProductCount > 0 && (
                  <div style={{
                    position: 'absolute', top: '-9px', right: '-11px',
                    background: 'linear-gradient(135deg, #f093fb, #f5576c)',
                    color: 'white', minWidth: '20px', height: '20px',
                    borderRadius: '10px', fontSize: '10px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 700, padding: '0 5px',
                    boxShadow: '0 4px 12px rgba(245,87,108,0.4)'
                  }}>
                    {context?.cartProductCount}
                  </div>
                )}
              </Link>
            )}

            {/* Login Button */}
            {!user?._id && (
              <Link to={"/login"} className="header-login-btn"
                style={{
                  padding: '9px 20px', borderRadius: '12px',
                  background: 'linear-gradient(135deg, #667eea, #764ba2)',
                  color: '#fff', fontWeight: 600, fontSize: '14px',
                  textDecoration: 'none', transition: 'all 0.3s ease',
                  boxShadow: '0 6px 20px rgba(102,126,234,0.3)'
                }}>
                Login
              </Link>
            )}

            {/* Hamburger — Mobile */}
            <div className="header-mobile-btn" style={{ display: 'none', alignItems: 'center', cursor: 'pointer', color: '#667eea', fontSize: '22px' }}
              onClick={() => setMobileMenuOpen(prev => !prev)}>
              {mobileMenuOpen ? <FaTimes /> : <FaBars />}
            </div>
          </div>
        </div>

        {/* Mobile Search Bar */}
        {mobileSearchOpen && (
          <div style={{
            position: 'absolute', top: '64px', left: 0, right: 0,
            background: bg, borderBottom: border,
            padding: '10px 16px', zIndex: 49,
            animation: 'dropdownSlide 0.2s ease'
          }}>
            <div style={{
              display: 'flex', alignItems: 'center',
              background: isDark ? 'rgba(255,255,255,0.1)' : '#f7f7f7',
              borderRadius: '12px', border: '2px solid #667eea', overflow: 'hidden'
            }}>
              <input type='text' placeholder='Search products...'
                style={{ flex: 1, border: 'none', background: 'transparent', padding: '11px 16px', fontSize: '14px', outline: 'none', color: isDark ? '#fff' : '#333' }}
                onChange={handleSearch} value={search} autoFocus
              />
              <div style={{ width: '44px', height: '44px', background: 'linear-gradient(135deg, #667eea, #764ba2)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'white', fontSize: '16px', flexShrink: 0 }}>
                <GrSearch />
              </div>
            </div>
          </div>
        )}

        {/* Mobile Menu */}
        {mobileMenuOpen && user?._id && (
          <div style={{
            position: 'absolute', top: '64px', left: 0, right: 0,
            background: isDark ? '#2d2d2d' : '#fff',
            borderBottom: border, padding: '12px 16px',
            zIndex: 49, animation: 'dropdownSlide 0.25s ease',
            boxShadow: '0 8px 24px rgba(0,0,0,0.12)'
          }}>
            <div style={{ padding: '10px 14px 14px', borderBottom: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #f0f0f0', marginBottom: '8px' }}>
              <p style={{ fontWeight: 700, color: isDark ? '#fff' : '#111', margin: 0, textTransform: 'capitalize' }}>{user?.name}</p>
              <p style={{ fontSize: '12px', color: '#667eea', margin: '2px 0 0', fontWeight: 500 }}>{user?.role === ROLE.ADMIN ? '👑 Administrator' : '👤 Customer'}</p>
            </div>

            {user?.role === ROLE.ADMIN ? (
              <>
                <Link to="/admin-panel/all-products" style={menuItemStyle} onClick={closeMenu}><FaTachometerAlt style={{ color: '#667eea' }}/> Dashboard</Link>
                <Link to="/admin-panel/all-products" style={menuItemStyle} onClick={closeMenu}><FaBox style={{ color: '#667eea' }}/> All Products</Link>
                <Link to="/admin-panel/all-users" style={menuItemStyle} onClick={closeMenu}><FaUsers style={{ color: '#667eea' }}/> All Users</Link>
              </>
            ) : (
              <>
                <Link to="/cart" style={menuItemStyle} onClick={closeMenu}><FaShoppingCart style={{ color: '#667eea' }}/> My Cart</Link>
                <Link to="/wishlist" style={menuItemStyle} onClick={closeMenu}><FaHeart style={{ color: '#f5576c' }}/> My Wishlist</Link>
                <Link to="/my-orders" style={menuItemStyle} onClick={closeMenu}><FaClipboardList style={{ color: '#667eea' }}/> My Orders</Link>
              </>
            )}

            <div style={{ borderTop: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #f0f0f0', margin: '8px 0' }}/>
            <button onClick={() => { handleLogout(); closeMenu() }} style={{ ...menuItemStyle, color: '#f5576c', width: '100%' }}>
              <FaSignOutAlt style={{ color: '#f5576c' }}/> Logout
            </button>
          </div>
        )}
      </header>
    </>
  )
}

export default Header