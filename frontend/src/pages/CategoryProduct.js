import React, { useEffect, useState, useCallback } from 'react'
import { useLocation, useNavigate, useOutletContext } from 'react-router-dom'
import productCategory from '../helpers/productCategory'
import VerticalCard from '../components/VerticalCard'
import SummaryApi from '../common'

const CategoryProduct = () => {
  const { isDark } = useOutletContext()
  const [data, setData]           = useState([])
  const [loading, setLoading]     = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sortBy, setSortBy]       = useState("")
  const navigate = useNavigate()
  const location = useLocation()

  const bg         = isDark ? '#0e0e0e'                 : '#faf9f7'
  const surface    = isDark ? '#141414'                 : '#ffffff'
  const text       = isDark ? '#e8e4dc'                 : '#1a1814'
  const muted      = isDark ? 'rgba(160,152,144,0.75)'  : 'rgba(130,125,118,0.85)'
  const border     = isDark ? 'rgba(255,255,255,0.07)'  : 'rgba(26,24,20,0.09)'
  const gold       = '#c9a84c'
  const goldBg     = isDark ? 'rgba(201,168,76,0.07)'   : 'rgba(201,168,76,0.06)'
  const goldBorder = 'rgba(201,168,76,0.22)'

  const getInitialCategories = useCallback(() => {
    const urlSearch = new URLSearchParams(location.search)
    const urlCategoryList = urlSearch.getAll("category")
    const obj = {}
    urlCategoryList.forEach(el => { obj[el] = true })
    return obj
  }, [location.search])

  const [selectCategory, setSelectCategory] = useState(getInitialCategories)

  useEffect(() => {
    const urlSearch = new URLSearchParams(location.search)
    const urlCategoryList = urlSearch.getAll("category")
    const obj = {}
    urlCategoryList.forEach(el => { obj[el] = true })
    setSelectCategory(obj)
  }, [location.search])

  const filterCategoryList = Object.keys(selectCategory).filter(k => selectCategory[k])

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const response = await fetch(SummaryApi.filterProduct.url, {
          method: SummaryApi.filterProduct.method,
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ category: filterCategoryList })
        })
        const dataResponse = await response.json()
        setData(dataResponse?.data || [])
      } catch { setData([]) }
      setLoading(false)
    }
    fetchData()
  }, [filterCategoryList.join(",")])

  const handleSelectCategory = (e) => {
    const { value, checked } = e.target
    const updatedCategories = { ...selectCategory, [value]: checked }
    setSelectCategory(updatedCategories)
    const activeCategories = Object.keys(updatedCategories).filter(k => updatedCategories[k])
    const urlFormat = activeCategories.map(el => `category=${el}`).join("&&")
    navigate("/product-category" + (urlFormat ? "?" + urlFormat : ""))
  }

  const handleSort = (value) => {
    setSortBy(value)
    if (value === 'asc') setData(prev => [...prev].sort((a, b) => a.sellingPrice - b.sellingPrice))
    if (value === 'dsc') setData(prev => [...prev].sort((a, b) => b.sellingPrice - a.sellingPrice))
  }

  const clearAll = () => { setSelectCategory({}); navigate('/product-category') }

  const activeCount = filterCategoryList.length
  const titleText   = activeCount > 0
    ? filterCategoryList.map(c => c.charAt(0).toUpperCase() + c.slice(1)).join(' & ')
    : 'All Products'

  const SidebarContent = () => (
    <>
      {activeCount > 0 && (
        <div style={{
          marginBottom: '20px',
          padding: '12px 14px',
          border: `0.5px solid ${goldBorder}`,
          background: goldBg
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span style={{
              fontSize: '9px', color: gold,
              textTransform: 'uppercase', letterSpacing: '0.14em',
              fontFamily: 'DM Sans, sans-serif'
            }}>Active</span>
            <button
              onClick={clearAll}
              style={{
                background: 'none', border: 'none', color: muted,
                fontSize: '10px', letterSpacing: '0.08em', textTransform: 'uppercase',
                cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', transition: 'color 0.15s'
              }}
              onMouseEnter={e => e.currentTarget.style.color = gold}
              onMouseLeave={e => e.currentTarget.style.color = muted}
            >
              Clear all
            </button>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
            {filterCategoryList.map(cat => (
              <span key={cat} style={{
                display: 'inline-flex', alignItems: 'center', gap: '4px',
                padding: '2px 8px',
                border: `0.5px solid ${goldBorder}`,
                fontSize: '10px', color: gold,
                letterSpacing: '0.06em', textTransform: 'uppercase',
                fontFamily: 'DM Sans, sans-serif'
              }}>
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </span>
            ))}
          </div>
        </div>
      )}

      <p style={{
        fontSize: '9px', fontWeight: 400, letterSpacing: '0.16em',
        textTransform: 'uppercase', color: muted,
        margin: '0 0 12px 4px',
        fontFamily: 'DM Sans, sans-serif'
      }}>
        Categories
      </p>

      {productCategory.map((categoryName) => {
        const isActive = !!selectCategory[categoryName?.value]
        return (
          <label
            key={categoryName?.value}
            style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              padding: '9px 10px',
              cursor: 'pointer',
              border: `0.5px solid ${isActive ? goldBorder : 'transparent'}`,
              background: isActive ? goldBg : 'transparent',
              marginBottom: '1px',
              fontSize: '12px',
              color: isActive ? gold : muted,
              fontFamily: 'DM Sans, sans-serif',
              letterSpacing: '0.03em',
              position: 'relative',
              userSelect: 'none',
              transition: 'all 0.15s ease'
            }}
            onMouseEnter={e => { if (!isActive) e.currentTarget.style.color = text }}
            onMouseLeave={e => { if (!isActive) e.currentTarget.style.color = muted }}
          >
            {isActive && (
              <span style={{
                position: 'absolute', left: 0, top: '15%', bottom: '15%',
                width: '1.5px', background: gold
              }} />
            )}
            <input
              type="checkbox"
              name="category"
              checked={isActive}
              value={categoryName?.value}
              onChange={handleSelectCategory}
              style={{ display: 'none' }}
            />
            <span style={{ flex: 1 }}>{categoryName?.label}</span>
            <span style={{
              width: '13px', height: '13px',
              border: `0.5px solid ${isActive ? gold : border}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0, fontSize: '8px',
              color: gold, transition: 'border-color 0.15s'
            }}>
              {isActive && '✓'}
            </span>
          </label>
        )
      })}
    </>
  )

  return (
    <>
      <style>{`
        @keyframes cpFadeIn {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes cpSlideUp {
          from { transform: translateY(100%); }
          to   { transform: translateY(0); }
        }

        .cp-sidebar {
          width: 220px;
          min-width: 220px;
          background: ${surface};
          border-right: 0.5px solid ${border};
          padding: 28px 14px;
          height: calc(100vh - 57px);
          position: sticky;
          top: 57px;
          overflow-y: auto;
          scrollbar-width: none;
        }
        .cp-sidebar::-webkit-scrollbar { display: none; }

        .cp-main {
          flex: 1;
          padding: 28px;
          height: calc(100vh - 57px);
          overflow-y: auto;
          animation: cpFadeIn 0.3s ease;
          scrollbar-width: none;
        }
        .cp-main::-webkit-scrollbar { display: none; }

        .sort-toggle {
          display: flex;
          align-items: center;
          border: 0.5px solid ${border};
          overflow: hidden;
          font-family: 'DM Sans', sans-serif;
        }
        .sort-lbl {
          font-size: 9px;
          color: ${muted};
          letter-spacing: 0.14em;
          text-transform: uppercase;
          padding: 0 12px;
          white-space: nowrap;
          border-right: 0.5px solid ${border};
          height: 32px;
          display: flex;
          align-items: center;
          font-family: 'DM Sans', sans-serif;
        }
        .sort-btn {
          padding: 0 12px;
          height: 32px;
          border: none;
          border-right: 0.5px solid ${border};
          background: transparent;
          color: ${muted};
          font-size: 10px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          transition: all 0.15s ease;
          white-space: nowrap;
        }
        .sort-btn:last-child { border-right: none; }
        .sort-btn:hover {
          color: ${text};
          background: ${isDark ? 'rgba(255,255,255,0.03)' : 'rgba(26,24,20,0.03)'};
        }
        .sort-btn.active {
          color: ${gold};
          background: ${goldBg};
        }

        .cp-mobile-btn { display: none !important; }

        @media (max-width: 860px) {
          .cp-sidebar    { display: none !important; }
          .cp-mobile-btn { display: flex !important; }
          .cp-main       { height: auto !important; padding: 16px !important; }
        }
        @media (max-width: 600px) {
          .sort-lbl  { display: none !important; }
          .sort-btn  { padding: 0 9px !important; font-size: 9px !important; }
        }
      `}</style>

      <div style={{ minHeight: '100vh', background: bg, color: text }}>

        {/* Topbar */}
        <div style={{
          position: 'sticky', top: 0, zIndex: 100,
          background: isDark ? 'rgba(14,14,14,0.97)' : 'rgba(250,249,247,0.97)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          borderBottom: `0.5px solid ${border}`,
          height: '57px',
          display: 'flex', alignItems: 'center',
          padding: '0 24px',
          gap: '16px',
          justifyContent: 'space-between'
        }}>
          {/* Left: title + count */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
            <h1 style={{
              fontFamily: 'Cormorant Garamond, Georgia, serif',
              fontSize: '17px', fontWeight: 300, margin: 0,
              color: text, letterSpacing: '0.01em',
              whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
              maxWidth: '280px'
            }}>
              {titleText}
            </h1>
            {!loading && data.length > 0 && (
              <span style={{
                flexShrink: 0,
                border: `0.5px solid ${border}`,
                color: muted,
                padding: '1px 8px',
                fontSize: '10px',
                letterSpacing: '0.08em',
                fontFamily: 'DM Sans, sans-serif'
              }}>
                {data.length}
              </span>
            )}
          </div>

          {/* Right: sort + mobile filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
            <div className="sort-toggle">
              <span className="sort-lbl">Sort</span>
              {[
                { v: '',    l: 'Default' },
                { v: 'asc', l: '↑ Low'   },
                { v: 'dsc', l: '↓ High'  }
              ].map(s => (
                <button
                  key={s.v}
                  className={`sort-btn${sortBy === s.v ? ' active' : ''}`}
                  onClick={() => handleSort(s.v)}
                >
                  {s.l}
                </button>
              ))}
            </div>

            <button
              className="cp-mobile-btn"
              onClick={() => setSidebarOpen(true)}
              style={{
                padding: '0 12px', height: '32px',
                border: `0.5px solid ${border}`,
                background: 'transparent', color: muted,
                fontSize: '10px', letterSpacing: '0.1em', textTransform: 'uppercase',
                cursor: 'pointer', fontFamily: 'DM Sans, sans-serif',
                alignItems: 'center', gap: '5px', transition: 'all 0.15s',
                whiteSpace: 'nowrap'
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = gold; e.currentTarget.style.color = gold }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = border; e.currentTarget.style.color = muted }}
            >
              Filter{activeCount > 0 ? ` (${activeCount})` : ''}
            </button>
          </div>
        </div>

        {/* Body */}
        <div style={{ display: 'flex' }}>

          {/* Sidebar */}
          <aside className="cp-sidebar">
            <SidebarContent />
          </aside>

          {/* Main */}
          <main className="cp-main">
            {!loading && data.length === 0 ? (
              <div style={{
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                height: '55vh', gap: '16px',
                animation: 'cpFadeIn 0.3s ease'
              }}>
                <span style={{
                  fontSize: '11px', letterSpacing: '0.16em',
                  textTransform: 'uppercase', color: muted,
                  fontFamily: 'DM Sans, sans-serif'
                }}>
                  No products found
                </span>
                <div style={{ width: '32px', height: '0.5px', background: border }} />
                <button
                  onClick={clearAll}
                  style={{
                    padding: '9px 24px',
                    border: `0.5px solid ${border}`,
                    background: 'transparent', color: muted,
                    fontSize: '10px', letterSpacing: '0.1em', textTransform: 'uppercase',
                    cursor: 'pointer', fontFamily: 'DM Sans, sans-serif',
                    transition: 'all 0.15s', borderRadius: '1px'
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = gold; e.currentTarget.style.color = gold }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = border; e.currentTarget.style.color = muted }}
                >
                  Browse All
                </button>
              </div>
            ) : (
              <VerticalCard data={data} loading={loading} isDark={isDark} />
            )}
          </main>
        </div>

        {/* Mobile drawer */}
        {sidebarOpen && (
          <div
            style={{
              position: 'fixed', inset: 0,
              background: 'rgba(0,0,0,0.72)',
              backdropFilter: 'blur(6px)',
              zIndex: 300,
              display: 'flex', alignItems: 'flex-end'
            }}
            onClick={() => setSidebarOpen(false)}
          >
            <div
              style={{
                background: surface,
                borderTop: `0.5px solid ${border}`,
                padding: '24px 20px 48px',
                width: '100%', maxHeight: '82vh',
                overflowY: 'auto',
                animation: 'cpSlideUp 0.25s ease'
              }}
              onClick={e => e.stopPropagation()}
            >
              {/* Pill */}
              <div style={{ width: '32px', height: '2px', background: border, margin: '0 auto 24px' }} />

              {/* Drawer header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h3 style={{
                  fontFamily: 'Cormorant Garamond, Georgia, serif',
                  fontSize: '18px', fontWeight: 300, color: text, margin: 0,
                  letterSpacing: '0.01em'
                }}>
                  Filter & Sort
                </h3>
                <button
                  onClick={() => setSidebarOpen(false)}
                  style={{
                    background: 'none', border: `0.5px solid ${border}`,
                    color: muted, width: '28px', height: '28px',
                    cursor: 'pointer', fontSize: '12px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'all 0.15s'
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = gold; e.currentTarget.style.color = gold }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = border; e.currentTarget.style.color = muted }}
                >
                  ✕
                </button>
              </div>

              {/* Sort */}
              <p style={{ fontSize: '9px', letterSpacing: '0.16em', textTransform: 'uppercase', color: muted, margin: '0 0 10px', fontFamily: 'DM Sans, sans-serif' }}>
                Sort By
              </p>
              <div style={{ display: 'flex', border: `0.5px solid ${border}`, marginBottom: '28px' }}>
                {[{ v: '', l: 'Default' }, { v: 'asc', l: '↑ Low' }, { v: 'dsc', l: '↓ High' }].map((s, i) => (
                  <button
                    key={s.v}
                    className={`sort-btn${sortBy === s.v ? ' active' : ''}`}
                    style={{
                      flex: 1,
                      borderRight: i < 2 ? `0.5px solid ${border}` : 'none',
                      borderTop: 'none', borderBottom: 'none', borderLeft: 'none'
                    }}
                    onClick={() => { handleSort(s.v); setSidebarOpen(false) }}
                  >
                    {s.l}
                  </button>
                ))}
              </div>

              {/* Categories */}
              <SidebarContent />

              {activeCount > 0 && (
                <button
                  onClick={() => { clearAll(); setSidebarOpen(false) }}
                  style={{
                    marginTop: '20px', width: '100%', padding: '10px',
                    background: 'none', border: `0.5px solid ${border}`,
                    color: muted, fontSize: '10px', letterSpacing: '0.1em',
                    textTransform: 'uppercase', cursor: 'pointer',
                    fontFamily: 'DM Sans, sans-serif', transition: 'all 0.15s',
                    borderRadius: '1px'
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = gold; e.currentTarget.style.color = gold }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = border; e.currentTarget.style.color = muted }}
                >
                  Clear All
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default CategoryProduct