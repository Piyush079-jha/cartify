import React, { useEffect, useState } from 'react'
import SummaryApi from '../common'
import { Link } from 'react-router-dom'

const CategoryList = ({ isDark }) => {
  const [categoryProduct, setCategoryProduct] = useState([])
  const [loading, setLoading] = useState(false)
  const [activeCategory, setActiveCategory] = useState(null)
  const categoryLoading = new Array(13).fill(null)

  const bg       = isDark ? '#0e0e0e'                  : '#faf9f7'
  const surface  = isDark ? '#161616'                  : '#ffffff'
  const text     = isDark ? 'rgba(160,152,144,0.9)'    : 'rgba(100,96,90,0.9)'
  const textHover= isDark ? '#e8e4dc'                  : '#1a1814'
  const border   = isDark ? 'rgba(255,255,255,0.07)'   : 'rgba(26,24,20,0.07)'
  const borderHover = isDark ? 'rgba(201,168,76,0.6)'  : 'rgba(201,168,76,0.7)'
  const gold     = '#c9a84c'
  const imgBlend = isDark ? 'normal'                   : 'multiply'

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
        .cl-wrap {
          background: ${bg};
          border-bottom: 0.5px solid ${border};
          position: relative;
        }

        /* Gold top accent line */
        .cl-wrap::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 0.5px;
          background: linear-gradient(90deg, transparent, ${gold}, transparent);
          opacity: 0.25;
        }

        .cl-inner {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 32px;
        }

        /* Eyebrow label */
        .cl-eyebrow {
          padding: 20px 0 0;
          font-size: 9px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: ${isDark ? 'rgba(255,255,255,0.2)' : 'rgba(26,24,20,0.3)'};
          font-weight: 400;
        }

        .cl-scroll {
          display: flex;
          align-items: stretch;
          overflow-x: auto;
          scrollbar-width: none;
          gap: 0;
        }
        .cl-scroll::-webkit-scrollbar { display: none; }

        .cl-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 11px;
          flex-shrink: 0;
          padding: 18px 20px 20px;
          text-decoration: none;
          cursor: pointer;
          border-right: 0.5px solid ${border};
          position: relative;
          transition: background 0.22s ease;
          min-width: 92px;
        }
        .cl-item:first-child {
          border-left: 0.5px solid ${border};
        }
        .cl-item::after {
          content: '';
          position: absolute;
          bottom: 0; left: 0; right: 0;
          height: 1.5px;
          background: ${gold};
          transform: scaleX(0);
          transform-origin: center;
          transition: transform 0.28s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .cl-item:hover::after,
        .cl-item.active::after {
          transform: scaleX(1);
        }
        .cl-item:hover {
          background: ${isDark ? 'rgba(201,168,76,0.04)' : 'rgba(201,168,76,0.03)'};
        }

        .cl-img-ring {
          width: 62px;
          height: 62px;
          border: 0.5px solid ${border};
          background: ${isDark ? 'rgba(255,255,255,0.02)' : '#f8f7f5'};
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          padding: 10px;
          transition: border-color 0.25s ease, transform 0.25s ease, box-shadow 0.25s ease;
          flex-shrink: 0;
          border-radius: 2px;
        }
        .cl-item:hover .cl-img-ring,
        .cl-item.active .cl-img-ring {
          border-color: ${borderHover};
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(201,168,76,0.15);
        }

        .cl-img-ring img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          mix-blend-mode: ${imgBlend};
          transition: transform 0.3s ease;
        }
        .cl-item:hover .cl-img-ring img {
          transform: scale(1.1);
        }

        .cl-label {
          font-size: 10px;
          font-weight: 400;
          color: ${text};
          text-transform: capitalize;
          text-align: center;
          margin: 0;
          letter-spacing: 0.06em;
          transition: color 0.22s ease;
          white-space: nowrap;
          line-height: 1;
        }
        .cl-item:hover .cl-label,
        .cl-item.active .cl-label {
          color: ${textHover};
        }

        /* Skeleton */
        .cl-skeleton {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 11px;
          flex-shrink: 0;
          padding: 18px 20px 20px;
          border-right: 0.5px solid ${border};
          min-width: 92px;
        }
        .cl-skel-img {
          width: 62px;
          height: 62px;
          background: ${isDark ? 'rgba(255,255,255,0.04)' : 'rgba(26,24,20,0.04)'};
          border: 0.5px solid ${border};
          animation: clPulse 1.8s ease-in-out infinite;
        }
        .cl-skel-txt {
          width: 44px;
          height: 9px;
          background: ${isDark ? 'rgba(255,255,255,0.04)' : 'rgba(26,24,20,0.04)'};
          animation: clPulse 1.8s ease-in-out infinite 0.2s;
        }

        @keyframes clPulse {
          0%, 100% { opacity: 0.6; }
          50%       { opacity: 0.25; }
        }

        @keyframes clFadeIn {
          from { opacity: 0; transform: translateY(5px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        @media (max-width: 768px) {
          .cl-inner { padding: 0 20px; }
          .cl-item  { padding: 14px 14px 16px; min-width: 78px; }
          .cl-img-ring { width: 52px; height: 52px; padding: 8px; }
          .cl-label { font-size: 9px; }
        }
        @media (max-width: 480px) {
          .cl-inner { padding: 0 12px; }
          .cl-item  { padding: 12px 11px 14px; min-width: 68px; }
          .cl-img-ring { width: 44px; height: 44px; padding: 7px; }
        }
      `}</style>

      <div className="cl-wrap">
        <div className="cl-inner">
          <p className="cl-eyebrow">Shop by Category</p>
          <div className="cl-scroll">

            {loading ? (
              categoryLoading.map((_, i) => (
                <div key={i} className="cl-skeleton">
                  <div className="cl-skel-img" />
                  <div className="cl-skel-txt" />
                </div>
              ))
            ) : (
              categoryProduct.map((product, index) => (
                <Link
                  to={"/product-category?category=" + product?.category}
                  key={product?.category}
                  className={`cl-item${activeCategory === product?.category ? ' active' : ''}`}
                  style={{
                    opacity: 0,
                    animation: `clFadeIn 0.38s ease forwards ${index * 0.038}s`
                  }}
                  onMouseEnter={() => setActiveCategory(product?.category)}
                  onMouseLeave={() => setActiveCategory(null)}
                >
                  <div className="cl-img-ring">
                    <img
                      src={product?.productImage[0]}
                      alt={product?.category}
                    />
                  </div>
                  <p className="cl-label">{product?.category}</p>
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