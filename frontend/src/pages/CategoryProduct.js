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

  const pageBg       = isDark ? '#1a1a1a' : '#f9f9fb'
  const topbarBg     = isDark ? 'rgba(26,26,26,0.95)' : 'rgba(255,255,255,0.95)'
  const topbarBorder = isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.06)'
  const sidebarBg    = isDark ? '#1a1a1a' : '#ffffff'
  const sidebarBorder= isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.06)'
  const textPrimary  = isDark ? '#ffffff' : '#111111'
  const textMuted    = isDark ? 'rgba(255,255,255,0.5)' : '#999999'
  const accent       = '#667eea'
  const accentBg     = isDark ? 'rgba(102,126,234,0.15)' : 'rgba(102,126,234,0.08)'
  const accentBorder = isDark ? 'rgba(102,126,234,0.35)' : 'rgba(102,126,234,0.2)'
  const catItemColor = isDark ? 'rgba(255,255,255,0.6)' : '#555555'
  const catItemHover = isDark ? 'rgba(102,126,234,0.1)' : 'rgba(102,126,234,0.06)'
  const sortBg       = isDark ? 'rgba(255,255,255,0.05)' : '#f7f7f7'
  const sortBorder   = isDark ? 'rgba(255,255,255,0.1)' : '#efefef'
  const drawerBg     = isDark ? '#1a1a1a' : '#ffffff'
  const sectionLabel = isDark ? 'rgba(255,255,255,0.3)' : '#999999'

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
    <div style={{ minHeight: '100vh', background: pageBg, color: textPrimary, fontFamily: "'DM Sans', -apple-system, sans-serif", transition: 'background 0.3s, color 0.3s' }}>
      <style>{`
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: ${isDark ? 'rgba(255,255,255,0.1)' : '#d0d0e0'}; border-radius: 2px; }
        @keyframes fadeIn { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
        @keyframes slideUp { from { transform:translateY(100%); } to { transform:translateY(0); } }

        .cp-sidebar {
          width: 210px; min-width: 210px;
          background: ${sidebarBg};
          border-right: 1px solid ${sidebarBorder};
          padding: 20px 12px;
          height: calc(100vh - 64px);
          position: sticky; top: 64px;
          overflow-y: auto;
          transition: background 0.3s;
          box-shadow: ${isDark ? '4px 0 20px rgba(0,0,0,0.3)' : '4px 0 20px rgba(0,0,0,0.04)'};
        }
        .cp-section-label { font-size: 10px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; color: ${sectionLabel}; margin-bottom: 8px; padding: 0 4px; }
        .cp-cat-item { display: flex; align-items: center; gap: 9px; padding: 9px 10px; border-radius: 9px; cursor: pointer; transition: all 0.15s ease; border: 1px solid transparent; margin-bottom: 2px; font-size: 13px; font-weight: 500; color: ${catItemColor}; position: relative; user-select: none; }
        .cp-cat-item:hover { background: ${catItemHover}; color: ${accent}; }
        .cp-cat-item.active { background: ${accentBg}; border-color: ${accentBorder}; color: ${accent}; }
        .cp-cat-item.active::before { content: ''; position: absolute; left: 0; top: 20%; bottom: 20%; width: 2.5px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 2px; }
        .cp-check { width: 15px; height: 15px; border-radius: 4px; border: 1.5px solid ${isDark ? 'rgba(255,255,255,0.2)' : '#d0d0e0'}; display: flex; align-items: center; justify-content: center; flex-shrink: 0; font-size: 8px; transition: all 0.15s; margin-left: auto; }
        .cp-cat-item.active .cp-check { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-color: #667eea; color: white; }

        .sort-toggle { display: flex; align-items: center; background: ${sortBg}; border: 1px solid ${sortBorder}; border-radius: 10px; padding: 3px; gap: 2px; transition: background 0.3s; }
        .sort-divider { width: 1px; height: 14px; background: ${sortBorder}; flex-shrink: 0; }
        .sort-lbl { font-size: 10px; font-weight: 700; color: ${sectionLabel}; letter-spacing: 0.1em; text-transform: uppercase; padding: 0 10px; white-space: nowrap; flex-shrink: 0; }
        .sort-btn { padding: 6px 10px; border-radius: 7px; border: none; background: transparent; color: ${catItemColor}; font-size: 12px; font-weight: 600; cursor: pointer; font-family: inherit; transition: all 0.15s; white-space: nowrap; }
        .sort-btn:hover { color: ${accent}; background: ${accentBg}; }
        .sort-btn.active { background: ${accentBg}; color: ${accent}; box-shadow: inset 0 0 0 1px ${accentBorder}; }

        .filter-tag { display: inline-flex; align-items: center; gap: 4px; padding: 3px 9px; background: ${accentBg}; border: 1px solid ${accentBorder}; border-radius: 20px; font-size: 11px; font-weight: 600; color: ${accent}; }
        .cp-main { flex: 1; padding: 20px 24px; height: calc(100vh - 64px); overflow-y: auto; animation: fadeIn 0.3s ease; }

        .mobile-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.6); backdrop-filter: blur(6px); z-index: 300; display: flex; align-items: flex-end; }
        .mobile-drawer { background: ${drawerBg}; border-radius: 20px 20px 0 0; border-top: 1px solid ${topbarBorder}; padding: 20px 20px 40px; width: 100%; max-height: 82vh; overflow-y: auto; animation: slideUp 0.25s ease; }
        .drawer-pill { width: 36px; height: 4px; background: ${isDark ? 'rgba(255,255,255,0.15)' : '#e0e0e8'}; border-radius: 2px; margin: 0 auto 20px; }

        .mobile-filter-btn { display: none !important; }

        /* Topbar responsive */
        .cp-topbar-inner { display: flex; align-items: center; gap: 16px; justify-content: space-between; padding: 0 20px; width: 100%; }
        .cp-sort-wrap { display: flex; align-items: center; gap: 8px; flex-shrink: 0; }

        @media (max-width: 860px) {
          .cp-sidebar { display: none !important; }
          .mobile-filter-btn { display: flex !important; }
          .cp-main { height: auto !important; padding: 14px !important; }
        }
        @media (max-width: 600px) {
          .sort-lbl { display: none !important; }
          .sort-divider { display: none !important; }
          .sort-toggle { padding: 2px !important; }
          .sort-btn { padding: 6px 8px !important; font-size: 11px !important; }
          .cp-topbar-inner { padding: 0 12px !important; gap: 8px !important; }
          .topbar-title { font-size: 15px !important; max-width: 160px !important; }
          .cp-main { padding: 10px !important; }
        }
        @media (max-width: 400px) {
          .topbar-title { font-size: 14px !important; max-width: 120px !important; }
          .sort-btn { padding: 5px 6px !important; }
        }
      `}</style>

      {/* TOPBAR */}
      <div style={{ position: 'sticky', top: 0, zIndex: 100, background: topbarBg, backdropFilter: 'blur(16px)', borderBottom: `1px solid ${topbarBorder}`, boxShadow: isDark ? '0 4px 20px rgba(0,0,0,0.5)' : '0 4px 20px rgba(0,0,0,0.08)', height: '56px', display: 'flex', alignItems: 'center', transition: 'background 0.3s' }}>
        <div className="cp-topbar-inner">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
            <h1 className="topbar-title" style={{ fontSize: '18px', fontWeight: 700, letterSpacing: '-0.03em', margin: 0, lineHeight: 1, color: textPrimary, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '280px' }}>
              {titleText}
            </h1>
            {!loading && data.length > 0 && (
              <span style={{ flexShrink: 0, background: accentBg, border: `1px solid ${accentBorder}`, color: accent, padding: '2px 8px', borderRadius: '20px', fontSize: '11px', fontWeight: 700 }}>
                {data.length}
              </span>
            )}
          </div>

          <div className="cp-sort-wrap">
            <div className="sort-toggle">
              <span className="sort-lbl">Sort</span>
              <div className="sort-divider" />
              <button className={`sort-btn ${sortBy === '' ? 'active' : ''}`} onClick={() => handleSort('')}>Default</button>
              <button className={`sort-btn ${sortBy === 'asc' ? 'active' : ''}`} onClick={() => handleSort('asc')}>↑ Low</button>
              <button className={`sort-btn ${sortBy === 'dsc' ? 'active' : ''}`} onClick={() => handleSort('dsc')}>↓ High</button>
            </div>
            <button className="mobile-filter-btn"
              onClick={() => setSidebarOpen(true)}
              style={{ padding: '7px 12px', borderRadius: '9px', border: `1px solid ${accentBorder}`, background: accentBg, color: accent, fontSize: '12px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', alignItems: 'center', gap: '5px' }}
            >
              ⚙️ Filter {activeCount > 0 && `(${activeCount})`}
            </button>
          </div>
        </div>
      </div>

      {/* BODY */}
      <div style={{ display: 'flex' }}>
        {/* SIDEBAR */}
        <aside className="cp-sidebar">
          {activeCount > 0 && (
            <div style={{ marginBottom: '20px', padding: '12px', background: accentBg, border: `1px solid ${accentBorder}`, borderRadius: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '10px', fontWeight: 700, color: accent, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Active</span>
                <button onClick={clearAll} style={{ background: 'none', border: 'none', color: '#f87171', fontSize: '11px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>Clear all</button>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                {filterCategoryList.map(cat => (
                  <span key={cat} className="filter-tag">
                    {categoryEmojis[cat] || '📦'} {cat.charAt(0).toUpperCase() + cat.slice(1)}
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
                <span style={{ fontSize: '15px', flexShrink: 0 }}>{categoryEmojis[categoryName?.value] || '📦'}</span>
                <span style={{ flex: 1 }}>{categoryName?.label}</span>
                <span className="cp-check">{isActive && '✓'}</span>
              </label>
            )
          })}
        </aside>

        {/* MAIN */}
        <main className="cp-main">
          {!loading && data.length === 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '55vh', gap: '14px', animation: 'fadeIn 0.3s ease' }}>
              <div style={{ fontSize: '52px' }}>🔍</div>
              <p style={{ fontSize: '18px', fontWeight: 700, color: textMuted, margin: 0 }}>No products found</p>
              <button onClick={clearAll} style={{ padding: '9px 22px', background: accentBg, border: `1px solid ${accentBorder}`, borderRadius: '10px', color: accent, fontSize: '13px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
                Browse All
              </button>
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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: textPrimary, margin: 0 }}>Filter & Sort</h3>
              <button onClick={() => setSidebarOpen(false)} style={{ background: isDark ? 'rgba(255,255,255,0.05)' : '#f0f0f5', border: 'none', color: textMuted, width: '30px', height: '30px', borderRadius: '50%', cursor: 'pointer', fontSize: '14px' }}>✕</button>
            </div>
            <div className="cp-section-label">Sort By</div>
            <div style={{ display: 'flex', gap: '6px', marginBottom: '20px' }}>
              {[{ v: '', l: 'Default' }, { v: 'asc', l: '↑ Low' }, { v: 'dsc', l: '↓ High' }].map(s => (
                <button key={s.v} className={`sort-btn ${sortBy === s.v ? 'active' : ''}`}
                  style={{ flex: 1, border: `1px solid ${sortBorder}`, borderRadius: '9px' }}
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
                  <span style={{ fontSize: '15px' }}>{categoryEmojis[categoryName?.value] || '📦'}</span>
                  <span style={{ flex: 1 }}>{categoryName?.label}</span>
                  <span className="cp-check">{isActive && '✓'}</span>
                </label>
              )
            })}
            {activeCount > 0 && (
              <button onClick={() => { clearAll(); setSidebarOpen(false) }}
                style={{ marginTop: '16px', width: '100%', padding: '11px', background: 'none', border: '1px solid rgba(239,68,68,0.25)', borderRadius: '10px', color: '#f87171', fontSize: '13px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}
              >Clear All</button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default CategoryProduct