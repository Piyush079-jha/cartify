import React, { useEffect, useState } from 'react'
import { useLocation, useOutletContext } from 'react-router-dom'
import SummaryApi from '../common'
import VerticalCard from '../components/VerticalCard'

const SearchProduct = () => {
  const query = useLocation()
  const [data, setData]       = useState([])
  const [loading, setLoading] = useState(false)

  const { isDark = false } = useOutletContext() || {}

  const bg     = isDark ? '#0e0e0e' : '#faf9f7'
  const text   = isDark ? '#e8e4dc' : '#1a1814'
  const muted  = isDark ? 'rgba(160,152,144,0.75)' : 'rgba(130,125,118,0.85)'
  const border = isDark ? 'rgba(255,255,255,0.07)'  : 'rgba(26,24,20,0.09)'
  const gold   = '#c9a84c'

  const searchTerm = new URLSearchParams(query.search).get('q') || ''

  const fetchProduct = async () => {
    setLoading(true)
    const response = await fetch(SummaryApi.searchProduct.url + query.search)
    const dataResponse = await response.json()
    setLoading(false)
    setData(dataResponse.data)
  }

  useEffect(() => { fetchProduct() }, [query])

  return (
    <>
      <style>{`
        .sp-page {
          min-height: 100vh;
          background: ${bg};
          transition: background 0.3s ease;
        }

        /* Topbar */
        .sp-topbar {
          position: sticky;
          top: 0;
          z-index: 50;
          background: ${isDark ? 'rgba(14,14,14,0.97)' : 'rgba(250,249,247,0.97)'};
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border-bottom: 0.5px solid ${border};
          height: 57px;
          display: flex;
          align-items: center;
          padding: 0 32px;
          gap: 14px;
        }
        .sp-topbar-title {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: 17px;
          font-weight: 300;
          color: ${text};
          margin: 0;
          letter-spacing: 0.01em;
        }
        .sp-topbar-divider {
          width: 0.5px;
          height: 16px;
          background: ${border};
          flex-shrink: 0;
        }
        .sp-topbar-query {
          font-size: 13px;
          font-weight: 400;
          color: ${gold};
          font-family: 'DM Sans', sans-serif;
          letter-spacing: 0.02em;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 240px;
        }
        .sp-topbar-count {
          margin-left: auto;
          border: 0.5px solid ${border};
          color: ${muted};
          padding: '1px 8px';
          font-size: 10px;
          letter-spacing: 0.08em;
          font-family: 'DM Sans', sans-serif;
          white-space: nowrap;
          padding: 2px 8px;
          flex-shrink: 0;
        }

        /* Body */
        .sp-body {
          max-width: 1400px;
          margin: 0 auto;
          padding: 32px 28px 64px;
        }

        /* Loading state */
        .sp-loading {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 40vh;
          gap: 16px;
        }
        .sp-loading-dot {
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: ${gold};
          animation: spPulse 1.2s ease-in-out infinite;
        }
        .sp-loading-dot:nth-child(2) { animation-delay: 0.2s; }
        .sp-loading-dot:nth-child(3) { animation-delay: 0.4s; }
        @keyframes spPulse {
          0%, 100% { opacity: 0.2; transform: scale(0.8); }
          50%       { opacity: 1;   transform: scale(1.2); }
        }

        /* Empty state */
        .sp-empty {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 45vh;
          gap: 14px;
          animation: spFadeIn 0.4s ease;
        }
        .sp-empty-glyph {
          font-size: 40px;
          color: ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(26,24,20,0.05)'};
          line-height: 1;
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-weight: 300;
          user-select: none;
        }
        .sp-empty-title {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: 22px;
          font-weight: 300;
          color: ${text};
          margin: 0;
          letter-spacing: 0.01em;
        }
        .sp-empty-sub {
          font-size: 12px;
          color: ${muted};
          margin: 0;
          letter-spacing: 0.06em;
          font-family: 'DM Sans', sans-serif;
          text-align: center;
          max-width: 260px;
          line-height: 1.7;
        }
        .sp-empty-rule {
          width: 32px;
          height: 0.5px;
          background: ${border};
        }

        /* Results */
        .sp-results { animation: spFadeIn 0.35s ease; }

        @keyframes spFadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        @media (max-width: 768px) {
          .sp-body     { padding: 20px 16px 48px; }
          .sp-topbar   { padding: 0 20px; gap: 10px; }
          .sp-topbar-query { max-width: 140px; }
        }
      `}</style>

      <div className="sp-page">

        {/* Topbar */}
        <div className="sp-topbar">
          <h1 className="sp-topbar-title">Search</h1>
          {searchTerm && (
            <>
              <div className="sp-topbar-divider" />
              <span className="sp-topbar-query">"{searchTerm}"</span>
            </>
          )}
          {!loading && data.length > 0 && (
            <span className="sp-topbar-count">
              {data.length} result{data.length !== 1 ? 's' : ''}
            </span>
          )}
        </div>

        {/* Body */}
        <div className="sp-body">

          {/* Loading */}
          {loading && (
            <div className="sp-loading">
              <div style={{ display: 'flex', gap: '6px' }}>
                <div className="sp-loading-dot" />
                <div className="sp-loading-dot" />
                <div className="sp-loading-dot" />
              </div>
              <span style={{
                fontSize: '10px', letterSpacing: '0.16em',
                textTransform: 'uppercase', color: muted,
                fontFamily: 'DM Sans, sans-serif'
              }}>
                Searching
              </span>
            </div>
          )}

          {/* Empty */}
          {!loading && data.length === 0 && (
            <div className="sp-empty">
              <div className="sp-empty-glyph">∅</div>
              <h2 className="sp-empty-title">No results found</h2>
              <div className="sp-empty-rule" />
              <p className="sp-empty-sub">
                {searchTerm
                  ? `We couldn't find anything for "${searchTerm}". Try a different term.`
                  : 'Enter a search term above to find products.'
                }
              </p>
            </div>
          )}

          {/* Results */}
          {!loading && data.length > 0 && (
            <div className="sp-results">
              <VerticalCard loading={loading} data={data} isDark={isDark} />
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default SearchProduct