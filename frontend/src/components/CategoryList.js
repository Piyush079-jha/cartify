import React, { useEffect, useState } from 'react'
import SummaryApi from '../common'
import { Link } from 'react-router-dom'

const CategoryList = ({ isDark }) => {
  const [categoryProduct, setCategoryProduct] = useState([])
  const [loading, setLoading] = useState(false)
  const categoryLoading = new Array(13).fill(null)

  const bg     = isDark ? '#0e0e0e' : '#faf9f7'
  const text   = isDark ? '#a09890' : '#888'
  const border = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(26,24,20,0.08)'
  const gold   = '#c9a84c'
  const label  = isDark ? '#e8e4dc' : '#1a1814'

  const fetchCategoryProduct = async () => {
    setLoading(true)
    const response = await fetch(SummaryApi.categoryProduct.url)
    const dataResponse = await response.json()
    setLoading(false)
    setCategoryProduct(dataResponse.data)
  }

  useEffect(() => { fetchCategoryProduct() }, [])

  return (
    <>
      <style>{`
        @keyframes clFadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
        .cl-scroll { display: flex; align-items: center; gap: 0; overflow-x: auto; scrollbar-width: none; }
        .cl-scroll::-webkit-scrollbar { display: none; }
        .cl-item { display: flex; flex-direction: column; align-items: center; gap: 10px; flex-shrink: 0;
          padding: 20px 18px; text-decoration: none; transition: all 0.25s ease; cursor: pointer;
          border-right: 0.5px solid ${border}; }
        .cl-item:first-child { border-left: 0.5px solid ${border}; }
        .cl-item:hover .cl-img-box { border-color: ${gold}; }
        .cl-item:hover .cl-label { color: ${label} !important; }
        .cl-img-box { width: 64px; height: 64px; border-radius: '2px';
          border: 0.5px solid ${border}; background: ${isDark ? '#1a1a1a' : '#fff'};
          display: flex; align-items: center; justify-content: center;
          overflow: hidden; padding: 10px; transition: border-color 0.25s ease; }
        @media (max-width: 768px) {
          .cl-item { padding: 16px 12px; gap: 8px; }
          .cl-img-box { width: 52px; height: 52px; padding: 8px; }
        }
        @media (max-width: 480px) {
          .cl-item { padding: 14px 10px; }
          .cl-img-box { width: 44px; height: 44px; }
        }
      `}</style>

      <div style={{ background: bg, borderBottom: `0.5px solid ${border}` }}>
        {/* Section label */}
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '24px 32px 0' }}>
          <p style={{ fontSize: '10px', letterSpacing: '0.14em', textTransform: 'uppercase', color: text, margin: 0 }}>Shop by Category</p>
        </div>

        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 32px' }}>
          <div className="cl-scroll">
            {loading ? (
              categoryLoading.map((_, i) => (
                <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', flexShrink: 0, padding: '20px 18px', borderRight: `0.5px solid ${border}` }}>
                  <div style={{ width: '64px', height: '64px', background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(26,24,20,0.04)', border: `0.5px solid ${border}` }} />
                  <div style={{ width: '48px', height: '10px', background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(26,24,20,0.04)' }} />
                </div>
              ))
            ) : (
              categoryProduct.map((product, index) => (
                <Link
                  to={"/product-category?category=" + product?.category}
                  key={product?.category}
                  className="cl-item"
                  style={{ opacity: 0, animation: `clFadeIn 0.4s ease forwards ${index * 0.04}s` }}
                >
                  <div className="cl-img-box">
                    <img
                      src={product?.productImage[0]}
                      alt={product?.category}
                      style={{ width: '100%', height: '100%', objectFit: 'contain', mixBlendMode: isDark ? 'normal' : 'multiply' }}
                    />
                  </div>
                  <p className="cl-label" style={{
                    fontSize: '10px', fontWeight: 400, color: text,
                    textTransform: 'capitalize', textAlign: 'center', margin: 0,
                    letterSpacing: '0.06em', transition: 'color 0.25s ease'
                  }}>{product?.category}</p>
                </Link>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default CategoryList