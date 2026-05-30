import React, { useContext, useEffect, useRef, useState, useCallback } from 'react'
import fetchCategoryWiseProduct from '../helpers/fetchCategoryWiseProduct'
import displayINRCurrency from '../helpers/displayCurrency'
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa6'
import { Link } from 'react-router-dom'
import addToCart from '../helpers/addToCart'
import Context from '../context'

const HorizontalCardProduct = ({ category, heading, isDark = false }) => {
  const [data, setData]         = useState([])
  const [loading, setLoading]   = useState(true)
  const [hoveredId, setHoveredId] = useState(null)
  const [btnHovered, setBtnHovered] = useState(null)
  const loadingList = new Array(6).fill(null)
  const scrollElement = useRef()
  const { fetchUserAddToCart } = useContext(Context)

  /* ── Tokens ── */
  const bg      = isDark ? '#0e0e0e'                 : '#faf9f7'
  const surface = isDark ? '#161616'                 : '#ffffff'
  const surfaceHover = isDark ? '#1c1c1c'            : '#fdfcfa'
  const text    = isDark ? '#e8e4dc'                 : '#1a1814'
  const muted   = isDark ? 'rgba(160,152,144,0.8)'   : 'rgba(130,125,118,0.9)'
  const border  = isDark ? 'rgba(255,255,255,0.07)'  : 'rgba(26,24,20,0.08)'
  const imgBg   = isDark ? 'rgba(255,255,255,0.02)'  : '#f7f6f4'
  const gold    = '#c9a84c'
  const imgBlend= isDark ? 'lighten'                 : 'multiply'

  const handleAddToCart = async (e, id) => {
    await addToCart(e, id)
    fetchUserAddToCart()
  }

  const fetchData = useCallback(async () => {
    setLoading(true)
    const categoryProduct = await fetchCategoryWiseProduct(category)
    setLoading(false)
    setData(categoryProduct?.data)
  }, [category])

  useEffect(() => { fetchData() }, [fetchData])

  const scrollRight = () => {
    scrollElement.current.scrollLeft += 316
  }
  const scrollLeft = () => {
    scrollElement.current.scrollLeft -= 316
  }

  return (
    <>
      <style>{`
        .hcp-section {
          max-width: 1400px;
          margin: 0 auto;
          padding: 40px 32px 0;
          position: relative;
        }

        /* Section header */
        .hcp-header {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          margin-bottom: 18px;
        }
        .hcp-heading-group {
          display: flex;
          align-items: center;
          gap: 14px;
        }
        .hcp-heading {
          font-size: 19px;
          font-weight: 300;
          color: ${text};
          margin: 0;
          letter-spacing: -0.01em;
          font-family: 'Cormorant Garamond', Georgia, serif;
        }
        .hcp-count {
          font-size: 10px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: ${muted};
        }
        .hcp-divider-v {
          width: 0.5px;
          height: 14px;
          background: ${border};
          flex-shrink: 0;
        }

        /* View all link */
        .hcp-view-all {
          font-size: 10px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: ${muted};
          text-decoration: none;
          padding-bottom: 2px;
          border-bottom: 0.5px solid transparent;
          transition: color 0.22s ease, border-color 0.22s ease;
        }
        .hcp-view-all:hover {
          color: ${gold};
          border-bottom-color: ${gold};
        }

        /* Hairline under header */
        .hcp-rule {
          height: 0.5px;
          background: ${border};
          margin-bottom: 18px;
        }

        /* Scroll nav buttons */
        .hcp-nav {
          position: absolute;
          top: calc(50% + 20px);
          transform: translateY(-50%);
          z-index: 10;
          width: 30px;
          height: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 0.5px solid ${border};
          background: ${surface};
          color: ${muted};
          font-size: 11px;
          cursor: pointer;
          transition: border-color 0.2s ease, color 0.2s ease, box-shadow 0.2s ease;
          border-radius: 1px;
        }
        .hcp-nav:hover {
          border-color: ${gold};
          color: ${gold};
          box-shadow: 0 0 16px rgba(201,168,76,0.14);
        }

        /* Card */
        .hcp-card {
          min-width: 308px;
          max-width: 308px;
          height: 158px;
          display: flex;
          overflow: hidden;
          flex-shrink: 0;
          text-decoration: none;
          border: 0.5px solid ${border};
          background: ${surface};
          position: relative;
          transition:
            border-color 0.25s ease,
            box-shadow   0.25s ease,
            background   0.25s ease,
            transform    0.25s ease;
        }
        .hcp-card:hover {
          border-color: ${gold};
          box-shadow: 0 8px 32px rgba(${isDark ? '0,0,0,0.3' : '26,24,20,0.07'});
          background: ${surfaceHover};
          transform: translateY(-2px);
        }

        /* Gold left accent line on hover */
        .hcp-card::before {
          content: '';
          position: absolute;
          left: 0; top: 0; bottom: 0;
          width: 1.5px;
          background: ${gold};
          transform: scaleY(0);
          transform-origin: bottom;
          transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .hcp-card:hover::before {
          transform: scaleY(1);
        }

        /* Image zone */
        .hcp-img-zone {
          width: 136px;
          flex-shrink: 0;
          background: ${imgBg};
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 18px;
          overflow: hidden;
          position: relative;
          border-right: 0.5px solid ${border};
        }

        .hcp-img-zone img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          mix-blend-mode: ${imgBlend};
          transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .hcp-card:hover .hcp-img-zone img {
          transform: scale(1.08);
        }

        /* Discount badge */
        .hcp-badge {
          position: absolute;
          top: 8px; left: 8px;
          background: ${isDark ? 'rgba(201,168,76,0.12)' : 'rgba(201,168,76,0.1)'};
          color: ${gold};
          font-size: 8.5px;
          font-weight: 500;
          padding: 2px 6px;
          letter-spacing: 0.07em;
          border: 0.5px solid rgba(201,168,76,0.22);
          z-index: 2;
        }

        /* Info zone */
        .hcp-info {
          flex: 1;
          padding: 14px 16px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          min-width: 0;
        }

        .hcp-category {
          font-size: 8.5px;
          color: ${gold};
          letter-spacing: 0.12em;
          text-transform: uppercase;
          margin: 0 0 5px;
          font-weight: 400;
        }

        .hcp-name {
          font-size: 12px;
          font-weight: 400;
          color: ${text};
          margin: 0;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          line-height: 1.55;
          letter-spacing: 0.01em;
        }

        /* Price row */
        .hcp-price-row {
          display: flex;
          align-items: baseline;
          gap: 8px;
          margin-bottom: 10px;
        }
        .hcp-price {
          font-size: 15px;
          font-weight: 500;
          color: ${text};
          letter-spacing: -0.01em;
        }
        .hcp-price-original {
          font-size: 11px;
          color: ${muted};
          text-decoration: line-through;
        }

        /* Add to cart button */
        .hcp-cart-btn {
          width: 100%;
          padding: 8px 0;
          border: 0.5px solid ${border};
          background: transparent;
          color: ${muted};
          font-size: 10px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.22s ease;
          font-family: 'DM Sans', -apple-system, sans-serif;
          border-radius: 1px;
          position: relative;
          overflow: hidden;
        }
        .hcp-cart-btn::after {
          content: '';
          position: absolute;
          inset: 0;
          background: ${gold};
          opacity: 0;
          transition: opacity 0.22s ease;
        }
        .hcp-cart-btn:hover {
          border-color: ${gold};
          color: ${gold};
          background: rgba(201,168,76,0.05);
        }

        /* Skeleton */
        .hcp-skel-card {
          min-width: 308px;
          max-width: 308px;
          height: 158px;
          display: flex;
          overflow: hidden;
          flex-shrink: 0;
          border: 0.5px solid ${border};
          background: ${surface};
          opacity: 0.45;
        }
        .hcp-skel-img {
          width: 136px;
          flex-shrink: 0;
          background: ${isDark ? 'rgba(255,255,255,0.03)' : 'rgba(26,24,20,0.03)'};
          animation: hcpPulse 1.8s ease-in-out infinite;
          border-right: 0.5px solid ${border};
        }
        .hcp-skel-line {
          background: ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(26,24,20,0.05)'};
          animation: hcpPulse 1.8s ease-in-out infinite;
          border-radius: 1px;
        }

        @keyframes hcpPulse {
          0%, 100% { opacity: 0.7; }
          50%       { opacity: 0.3; }
        }

        @media (max-width: 768px) {
          .hcp-section { padding: 28px 20px 0; }
          .hcp-card { min-width: 268px; max-width: 268px; height: 148px; }
          .hcp-img-zone { width: 112px; }
          .hcp-skel-card { min-width: 268px; max-width: 268px; height: 148px; }
          .hcp-skel-img { width: 112px; }
        }
        @media (max-width: 480px) {
          .hcp-card { min-width: 240px; max-width: 240px; height: 138px; }
          .hcp-img-zone { width: 98px; padding: 12px; }
          .hcp-skel-card { min-width: 240px; max-width: 240px; height: 138px; }
          .hcp-skel-img { width: 98px; }
        }
      `}</style>

      <div className="hcp-section">

        {/* Section header */}
        <div className="hcp-header">
          <div className="hcp-heading-group">
            <h2 className="hcp-heading">{heading}</h2>
            <div className="hcp-divider-v" />
            <span className="hcp-count">
              {data.length > 0 ? `${data.length} items` : ''}
            </span>
          </div>
          <Link
            to={`/product-category?category=${category}`}
            className="hcp-view-all"
          >
            View All
          </Link>
        </div>

        {/* Hairline */}
        <div className="hcp-rule" />

        {/* Nav buttons */}
        <button
          className="hcp-nav"
          onClick={scrollLeft}
          style={{ left: '-15px' }}
          aria-label="Scroll left"
        >
          <FaAngleLeft />
        </button>
        <button
          className="hcp-nav"
          onClick={scrollRight}
          style={{ right: '-15px' }}
          aria-label="Scroll right"
        >
          <FaAngleRight />
        </button>

        {/* Card track */}
        <div
          ref={scrollElement}
          style={{
            display: 'flex',
            gap: '1px',
            overflowX: 'auto',
            scrollbarWidth: 'none',
            scrollBehavior: 'smooth'
          }}
        >
          {loading ? (
            loadingList.map((_, i) => (
              <div key={i} className="hcp-skel-card">
                <div className="hcp-skel-img" />
                <div style={{ flex: 1, padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div className="hcp-skel-line" style={{ height: '10px', width: '80%' }} />
                  <div className="hcp-skel-line" style={{ height: '9px', width: '50%', animationDelay: '0.1s' }} />
                  <div className="hcp-skel-line" style={{ height: '13px', width: '55%', marginTop: 'auto', animationDelay: '0.2s' }} />
                  <div className="hcp-skel-line" style={{ height: '27px', animationDelay: '0.3s' }} />
                </div>
              </div>
            ))
          ) : (
            data.map((product) => {
              const discount = product?.price > product?.sellingPrice
                ? Math.round(((product.price - product.sellingPrice) / product.price) * 100)
                : null

              return (
                <Link
                  to={"product/" + product?._id}
                  key={product?._id}
                  className="hcp-card"
                  onMouseEnter={() => setHoveredId(product?._id)}
                  onMouseLeave={() => setHoveredId(null)}
                >
                  {/* Image */}
                  <div className="hcp-img-zone">
                    {discount && (
                      <div className="hcp-badge">−{discount}%</div>
                    )}
                    <img
                      src={product.productImage[0]}
                      alt={product.productName}
                    />
                  </div>

                  {/* Info */}
                  <div className="hcp-info">
                    <div>
                      <p className="hcp-category">{product?.category}</p>
                      <h3 className="hcp-name">{product?.productName}</h3>
                    </div>
                    <div>
                      <div className="hcp-price-row">
                        <span className="hcp-price">
                          {displayINRCurrency(product?.sellingPrice)}
                        </span>
                        {product?.price !== product?.sellingPrice && (
                          <span className="hcp-price-original">
                            {displayINRCurrency(product?.price)}
                          </span>
                        )}
                      </div>
                      <button
                        className="hcp-cart-btn"
                        onClick={(e) => handleAddToCart(e, product?._id)}
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </Link>
              )
            })
          )}
        </div>
      </div>
    </>
  )
}

export default HorizontalCardProduct