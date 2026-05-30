import React, { useEffect, useState, useCallback } from 'react'
import { useLocation, useNavigate, useOutletContext } from 'react-router-dom'
import productCategory from '../helpers/productCategory'
import VerticalCard from '../components/VerticalCard'
import SummaryApi from '../common'

const categoryEmojis = {
  airpodes: '🎧', camera: '📷', earphones: '🎵', mobiles: '📱',
  mouse: '🖱️', refrigerator: '❄️', speakers: '🔊', televisions: '📺',
  trimmers: '✂️', watches: '⌚', printers: '🖨️', processor: '💻'
}

const CategoryProduct = () => {
  const { isDark } = useOutletContext()
  const [data, setData] = useState([])
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sortBy, setSortBy] = useState("")

  const bg      = isDark ? '#0e0e0e' : '#faf9f7'
  const surface = isDark ? '#141414' : '#ffffff'
  const text    = isDark ? '#e8e4dc' : '#1a1814'
  const muted   = isDark ? '#555' : '#aaa'
  const border  = isDark ? 'rgba(255,255,255,0.07)' : 'rgba(26,24,20,0.09)'
  const gold    = '#c9a84c'
  const goldBg  = isDark ? 'rgba(201,168,76,0.08)' : 'rgba(201,168,76,0.07)'
  const goldBorder = 'rgba(201,168,76,0.25)'

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
      } catch (err) { setData([]) }
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
  const titleText = activeCount > 0
    ? filterCategoryList.map(c => c.charAt(0).toUpperCase() + c.slice(1)).join(' & ')
    : 'All Products'

  return (
    <div style={{ minHeight: '100vh', background: bg, color: text, fontFamily: 'Georgia, "Times New Roman", serif' }}>
      <style>{`
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: ${border}; border-radius: 1px; }

        @keyframes fadeIn { from { opacity:0; transform:translateY(6px); } to { opacity:1; transform:translateY(0); } }
        @keyframes slideUp { from { transform:translateY(100%); } to { transform:translateY(0); } }

        .cp-sidebar {
          width: 220px; min-width: 220px;
          background: ${surface};
          border-right: 0.5px solid ${border};
          padding: 28px 16px;
          height: calc(100vh - 57px);
          position: sticky; top: 57px;
          overflow-y: auto;
        }
        .cp-section-label {
          font-size: 9px; font-weight: 400; letter-spacing: 0.16em;
          text-transform: uppercase; color: ${muted};
          margin-bottom: 12px; padding: 0 4px;
          font-family: 'DM Sans', -apple-system, sans-serif;
        }
        .cp-cat-item {
          display: flex; align-items: center; gap: 10px;
          padding: 9px 10px; cursor: pointer;
          transition: all 0.15s ease; border: 0.5px solid transparent;
          margin-bottom: 1px;
          font-size: 12px; font-weight: 400; color: ${muted};
          font-family: 'DM Sans', -apple-system, sans-serif;
          letter-spacing: 0.03em;
          position: relative; user-select: none;
        }
        .cp-cat-item:hover { color: ${text}; background: ${isDark ? 'rgba(255,255,255,0.03)' : 'rgba(26,24,20,0.03)'}; }
        .cp-cat-item.active { border-color: ${goldBorder}; background: ${goldBg}; color: ${gold}; }
        .cp-cat-item.active::before {
          content: ''; position: absolute; left: 0; top: 15%; bottom: 15%;
          width: 1.5px; background: ${gold};
        }
        .cp-check {
          width: 13px; height: 13px;
          border: 0.5px solid ${border};
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0; font-size: 8px; margin-left: auto;
          transition: all 0.15s; color: ${gold};
        }
        .cp-cat-item.active .cp-check { border-color: ${gold}; }

        .sort-toggle {
          display: flex; align-items: center;
          border: 0.5px solid ${border};
          gap: 0; overflow: hidden;
          font-family: 'DM Sans', -apple-system, sans-serif;
        }
        .sort-lbl {
          font-size: 9px; font-weight: 400; color: ${muted};
          letter-spacing: 0.14em; text-transform: uppercase;
          padding: 0 12px; white-space: nowrap; flex-shrink: 0;
          border-right: 0.5px solid ${border};
          height: 32px; display: flex; align-items: center;
        }
        .sort-btn {
          padding: 0 12px; height: 32px;
          border: none; border-right: 0.5px solid ${border};
          background: transparent; color: ${muted};
          font-size: 10px; font-weight: 400; letter-spacing: 0.08em;
          text-transform: uppercase;
          cursor: pointer; font-family: inherit; transition: all 0.15s;
          white-space: nowrap;
        }
        .sort-btn:last-child { border-right: none; }
        .sort-btn:hover { color: ${text}; background: ${isDark ? 'rgba(255,255,255,0.03)' : 'rgba(26,24,20,0.03)'}; }
        .sort-btn.active { color: ${gold}; background: ${goldBg}; }

        .filter-tag {
          display: inline-flex; align-items: center; gap: 4px;
          padding: 2px 8px; border: 0.5px solid ${goldBorder};
          font-size: 10px; font-weight: 400; color: ${gold};
          letter-spacing: 0.06em; text-transform: uppercase;
          font-family: 'DM Sans', -apple-system, sans-serif;
        }
        .cp-main {
          flex: 1; padding: 28px 28px;
          height: calc(100vh - 57px); overflow-y: auto;
          animation: fadeIn 0.3s ease;
        }

        .mobile-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.7); z-index: 300; display: flex; align-items: flex-end; }
        .mobile-drawer {
          background: ${surface}; border-top: 0.5px solid ${border};
          padding: 24px 20px 40px; width: 100%;
          max-height: 82vh; overflow-y: auto;
          animation: slideUp 0.25s ease;
        }
        .drawer-pill { width: 32px; height: 2px; background: ${border}; margin: 0 auto 24px; }
        .mobile-filter-btn { display: none !important; }

        .cp-topbar-inner { display: flex; align-items: center; gap: 16px; justify-content: space-between; padding: 0 24px; width: 100%; }
        .cp-sort-wrap { display: flex; align-items: center; gap: 8px; flex-shrink: 0; }

        @media (max-width: 860px) {
          .cp-sidebar { display: none !important; }
          .mobile-filter-btn { display: flex !important; }
          .cp-main { height: auto !important; padding: 16px !important; }
        }
        @media (max-width: 600px) {
          .sort-lbl { display: none !important; }
          .sort-btn { padding: 0 8px !important; font-size: 9px !important; }
          .cp-topbar-inner { padding: 0 14px !important; gap: 8px !important; }
          .topbar-title { font-size: 14px !important; max-width: 160px !important; }
        }
      `}</style>

      {/* TOPBAR */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: isDark ? 'rgba(14,14,14,0.97)' : 'rgba(250,249,247,0.97)',
        backdropFilter: 'blur(12px)',
        borderBottom: `0.5px solid ${border}`,
        height: '57px', display: 'flex', alignItems: 'center',
      }}>
        <div className="cp-topbar-inner">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
            <h1 className="topbar-title" style={{
              fontSize: '16px', fontWeight: 300, margin: 0, lineHeight: 1,
              color: text, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
              maxWidth: '280px', letterSpacing: '0.01em',
              fontFamily: 'Georgia, "Times New Roman", serif'
            }}>
              {titleText}
            </h1>
            {!loading && data.length > 0 && (
              <span style={{
                flexShrink: 0, border: `0.5px solid ${border}`,
                color: muted, padding: '1px 8px',
                fontSize: '10px', fontWeight: 400, letterSpacing: '0.08em',
                fontFamily: 'DM Sans, -apple-system, sans-serif'
              }}>
                {data.length}
              </span>
            )}
          </div>

          <div className="cp-sort-wrap">
            <div className="sort-toggle">
              <span className="sort-lbl">Sort</span>
              <button className={`sort-btn ${sortBy === '' ? 'active' : ''}`} onClick={() => handleSort('')}>Default</button>
              <button className={`sort-btn ${sortBy === 'asc' ? 'active' : ''}`} onClick={() => handleSort('asc')}>↑ Low</button>
              <button className={`sort-btn ${sortBy === 'dsc' ? 'active' : ''}`} onClick={() => handleSort('dsc')}>↓ High</button>
            </div>
            <button className="mobile-filter-btn"
              onClick={() => setSidebarOpen(true)}
              style={{
                padding: '6px 12px', border: `0.5px solid ${border}`,
                background: 'transparent', color: muted,
                fontSize: '10px', fontWeight: 400, cursor: 'pointer',
                fontFamily: 'DM Sans, -apple-system, sans-serif',
                letterSpacing: '0.1em', textTransform: 'uppercase',
                alignItems: 'center', gap: '5px', transition: 'all 0.15s'
              }}
            >
              Filter {activeCount > 0 && `(${activeCount})`}
            </button>
          </div>
        </div>
      </div>

      {/* BODY */}
      <div style={{ display: 'flex' }}>
        {/* SIDEBAR */}
        <aside className="cp-sidebar">
          {activeCount > 0 && (
            <div style={{ marginBottom: '24px', padding: '12px 14px', border: `0.5px solid ${goldBorder}`, background: goldBg }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span style={{ fontSize: '9px', fontWeight: 400, color: gold, textTransform: 'uppercase', letterSpacing: '0.14em', fontFamily: 'DM Sans, sans-serif' }}>Active</span>
                <button onClick={clearAll} style={{ background: 'none', border: 'none', color: muted, fontSize: '10px', letterSpacing: '0.08em', textTransform: 'uppercase', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', transition: 'color 0.15s' }}
                  onMouseEnter={e => e.currentTarget.style.color = text}
                  onMouseLeave={e => e.currentTarget.style.color = muted}
                >Clear all</button>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                {filterCategoryList.map(cat => (
                  <span key={cat} className="filter-tag">
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </span>
                ))}
              </div>
            </div>
          )}
          <div className="cp-section-label">Categories</div>
          {productCategory.map((categoryName) => {
            const isActive = !!selectCategory[categoryName?.value]
            return (
              <label key={categoryName?.value} className={`cp-cat-item ${isActive ? 'active' : ''}`}>
                <input type='checkbox' name="category" checked={isActive} value={categoryName?.value} onChange={handleSelectCategory} style={{ display: 'none' }} />
                <span style={{ flex: 1 }}>{categoryName?.label}</span>
                <span className="cp-check">{isActive && '✓'}</span>
              </label>
            )
          })}
        </aside>

        {/* MAIN */}
        <main className="cp-main">
          {!loading && data.length === 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '55vh', gap: '16px', animation: 'fadeIn 0.3s ease' }}>
              <div style={{ fontSize: '13px', letterSpacing: '0.14em', textTransform: 'uppercase', color: muted, fontFamily: 'DM Sans, sans-serif' }}>No products found</div>
              <div style={{ width: '32px', height: '0.5px', background: border }} />
              <button onClick={clearAll} style={{ padding: '9px 24px', border: `0.5px solid ${border}`, background: 'transparent', color: muted, fontSize: '10px', fontWeight: 400, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', letterSpacing: '0.1em', textTransform: 'uppercase', transition: 'all 0.15s' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = gold; e.currentTarget.style.color = gold }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = border; e.currentTarget.style.color = muted }}
              >Browse All</button>
            </div>
          ) : (
            <VerticalCard data={data} loading={loading} isDark={isDark} />
          )}
        </main>
      </div>

      {/* MOBILE DRAWER */}
      {sidebarOpen && (
        <div className="mobile-overlay" onClick={() => setSidebarOpen(false)}>
          <div className="mobile-drawer" onClick={e => e.stopPropagation()}>
            <div className="drawer-pill" />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 300, color: text, margin: 0, fontFamily: 'Georgia, serif', letterSpacing: '0.01em' }}>Filter & Sort</h3>
              <button onClick={() => setSidebarOpen(false)} style={{ background: 'none', border: `0.5px solid ${border}`, color: muted, width: '28px', height: '28px', cursor: 'pointer', fontSize: '12px' }}>✕</button>
            </div>
            <div className="cp-section-label">Sort By</div>
            <div style={{ display: 'flex', gap: '0', marginBottom: '28px', border: `0.5px solid ${border}` }}>
              {[{ v: '', l: 'Default' }, { v: 'asc', l: '↑ Low' }, { v: 'dsc', l: '↓ High' }].map((s, i) => (
                <button key={s.v} className={`sort-btn ${sortBy === s.v ? 'active' : ''}`}
                  style={{ flex: 1, borderRight: i < 2 ? `0.5px solid ${border}` : 'none', borderTop: 'none', borderBottom: 'none', borderLeft: 'none' }}
                  onClick={() => { handleSort(s.v); setSidebarOpen(false) }}
                >{s.l}</button>
              ))}
            </div>
            <div className="cp-section-label">Categories</div>
            {productCategory.map((categoryName) => {
              const isActive = !!selectCategory[categoryName?.value]
              return (
                <label key={categoryName?.value} className={`cp-cat-item ${isActive ? 'active' : ''}`}>
                  <input type='checkbox' name="category" checked={isActive} value={categoryName?.value} onChange={handleSelectCategory} style={{ display: 'none' }} />
                  <span style={{ flex: 1 }}>{categoryName?.label}</span>
                  <span className="cp-check">{isActive && '✓'}</span>
                </label>
              )
            })}
            {activeCount > 0 && (
              <button onClick={() => { clearAll(); setSidebarOpen(false) }}
                style={{ marginTop: '20px', width: '100%', padding: '10px', background: 'none', border: `0.5px solid ${border}`, color: muted, fontSize: '10px', fontWeight: 400, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', letterSpacing: '0.1em', textTransform: 'uppercase', transition: 'all 0.15s' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = gold; e.currentTarget.style.color = gold }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = border; e.currentTarget.style.color = muted }}
              >Clear All</button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default CategoryProduct