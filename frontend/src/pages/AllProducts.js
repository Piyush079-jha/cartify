import React, { useEffect, useState } from 'react'
import UploadProduct from '../components/UploadProduct'
import SummaryApi from '../common'
import AdminProductCard from '../components/AdminProductCard'
import { FaPlus, FaBox } from 'react-icons/fa'

const AllProducts = () => {
  const [openUploadProduct, setOpenUploadProduct] = useState(false)
  const [allProduct, setAllProduct] = useState([])
  const [loading, setLoading] = useState(true)

  const gold       = '#c9a84c'
  const border     = 'rgba(255,255,255,0.07)'
  const muted      = 'rgba(160,152,144,0.7)'
  const text       = '#e8e4dc'
  const surface    = '#161616'
  const surfaceAlt = '#111110'

  const fetchAllProduct = async () => {
    setLoading(true)
    const response = await fetch(SummaryApi.allProduct.url)
    const dataResponse = await response.json()
    setAllProduct(dataResponse?.data || [])
    setLoading(false)
  }

  useEffect(() => { fetchAllProduct() }, [])

  const categories = [...new Set(allProduct.map(p => p.category))].length
  const avgPrice   = allProduct.length
    ? Math.round(allProduct.reduce((a, b) => a + b.sellingPrice, 0) / allProduct.length)
    : 0

  return (
    <>
      <style>{`
        .ap-wrap { animation: apFadeIn 0.4s ease; }
        @keyframes apFadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* Header */
        .ap-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-bottom: 28px;
          padding-bottom: 20px;
          border-bottom: 0.5px solid ${border};
        }
        .ap-eyebrow {
          font-size: 9px;
          font-weight: 400;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: ${gold};
          margin: 0 0 6px;
          font-family: 'DM Sans', sans-serif;
        }
        .ap-title {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: 28px;
          font-weight: 300;
          color: ${text};
          margin: 0;
          letter-spacing: -0.01em;
          line-height: 1;
        }
        .ap-count {
          font-size: 11px;
          color: ${muted};
          margin: 6px 0 0;
          font-family: 'DM Sans', sans-serif;
          letter-spacing: 0.04em;
        }

        /* Upload button */
        .ap-upload-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 11px 22px;
          background: transparent;
          border: 0.5px solid ${gold};
          color: ${gold};
          font-size: 10px;
          font-weight: 500;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.25s ease;
          font-family: 'DM Sans', sans-serif;
          border-radius: 1px;
          white-space: nowrap;
        }
        .ap-upload-btn:hover {
          background: ${gold};
          color: #0a0a0a;
          box-shadow: 0 0 24px rgba(201,168,76,0.2);
          letter-spacing: 0.18em;
        }

        /* Stats row */
        .ap-stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1px;
          margin-bottom: 24px;
          border: 0.5px solid ${border};
        }
        .ap-stat {
          background: ${surfaceAlt};
          padding: 20px 24px;
          position: relative;
          overflow: hidden;
        }
        .ap-stat::before {
          content: '';
          position: absolute;
          bottom: 0; left: 0; right: 0;
          height: 1.5px;
          background: ${gold};
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.3s ease;
        }
        .ap-stat:hover::before { transform: scaleX(1); }
        .ap-stat-label {
          font-size: 9px;
          font-weight: 400;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: ${muted};
          margin: 0 0 10px;
          font-family: 'DM Sans', sans-serif;
        }
        .ap-stat-value {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: 32px;
          font-weight: 300;
          color: ${gold};
          margin: 0;
          letter-spacing: -0.02em;
          line-height: 1;
        }

        /* Products container */
        .ap-grid-wrap {
          background: ${surfaceAlt};
          border: 0.5px solid ${border};
          padding: 20px;
        }
        .ap-grid-inner {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          max-height: calc(100vh - 400px);
          overflow-y: auto;
          scrollbar-width: thin;
          scrollbar-color: rgba(201,168,76,0.2) transparent;
          padding-right: 4px;
        }
        .ap-grid-inner::-webkit-scrollbar { width: 3px; }
        .ap-grid-inner::-webkit-scrollbar-track { background: transparent; }
        .ap-grid-inner::-webkit-scrollbar-thumb {
          background: rgba(201,168,76,0.2);
          border-radius: 1px;
        }

        /* Skeleton */
        .ap-skel {
          width: 180px;
          height: 220px;
          background: rgba(255,255,255,0.03);
          border: 0.5px solid ${border};
          animation: apPulse 1.8s ease-in-out infinite;
          border-radius: 1px;
        }
        .ap-skel:nth-child(2) { animation-delay: 0.15s; }
        .ap-skel:nth-child(3) { animation-delay: 0.3s;  }
        .ap-skel:nth-child(4) { animation-delay: 0.45s; }
        .ap-skel:nth-child(5) { animation-delay: 0.6s;  }
        .ap-skel:nth-child(6) { animation-delay: 0.75s; }

        @keyframes apPulse {
          0%, 100% { opacity: 0.6; }
          50%       { opacity: 0.2; }
        }

        /* Empty state */
        .ap-empty {
          width: 100%;
          padding: 80px 24px;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 14px;
        }
        .ap-empty-icon {
          font-size: 32px;
          color: rgba(201,168,76,0.15);
        }
        .ap-empty-title {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: 22px;
          font-weight: 300;
          color: ${text};
          margin: 0;
        }
        .ap-empty-sub {
          font-size: 12px;
          color: ${muted};
          margin: 0;
          letter-spacing: 0.04em;
          font-family: 'DM Sans', sans-serif;
        }

        @media (max-width: 768px) {
          .ap-stats { grid-template-columns: 1fr 1fr; }
          .ap-header { flex-direction: column; align-items: flex-start; gap: 16px; }
          .ap-stat-value { font-size: 26px; }
        }
        @media (max-width: 480px) {
          .ap-stats { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="ap-wrap">

        {/* Header */}
        <div className="ap-header">
          <div>
            <p className="ap-eyebrow">Admin</p>
            <h2 className="ap-title">All Products</h2>
            <p className="ap-count">{allProduct.length} products in catalogue</p>
          </div>
          <button className="ap-upload-btn" onClick={() => setOpenUploadProduct(true)}>
            <FaPlus style={{ fontSize: '9px' }} />
            Upload Product
          </button>
        </div>

        {/* Stats */}
        <div className="ap-stats">
          {[
            { label: 'Total Products', value: allProduct.length },
            { label: 'Categories',     value: categories },
            { label: 'Avg Price',      value: avgPrice ? `₹${avgPrice.toLocaleString()}` : '₹0' },
          ].map((stat, i) => (
            <div key={i} className="ap-stat">
              <p className="ap-stat-label">{stat.label}</p>
              <p className="ap-stat-value">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Grid */}
        <div className="ap-grid-wrap">
          <div className="ap-grid-inner">
            {loading ? (
              Array(6).fill(null).map((_, i) => (
                <div key={i} className="ap-skel" />
              ))
            ) : allProduct.length === 0 ? (
              <div className="ap-empty">
                <div className="ap-empty-icon"><FaBox /></div>
                <h3 className="ap-empty-title">No products yet</h3>
                <p className="ap-empty-sub">Click "Upload Product" to add your first product</p>
              </div>
            ) : (
              allProduct.map((product, index) => (
                <AdminProductCard
                  data={product}
                  key={index + "allProduct"}
                  fetchdata={fetchAllProduct}
                />
              ))
            )}
          </div>
        </div>

      </div>

      {/* Upload modal */}
      {openUploadProduct && (
        <UploadProduct
          onClose={() => setOpenUploadProduct(false)}
          fetchData={fetchAllProduct}
        />
      )}
    </>
  )
}

export default AllProducts