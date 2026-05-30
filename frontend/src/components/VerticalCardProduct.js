import React, { useContext, useEffect, useRef, useState, useCallback } from 'react'
import fetchCategoryWiseProduct from '../helpers/fetchCategoryWiseProduct'
import displayINRCurrency from '../helpers/displayCurrency'
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa6'
import { Link } from 'react-router-dom'
import addToCart from '../helpers/addToCart'
import Context from '../context'
import WishlistButton from './WishlistButton'

const VerticalCardProduct = ({ category, heading, isDark = false }) => {
  const [data, setData]           = useState([])
  const [loading, setLoading]     = useState(true)
  const [wishlist, setWishlist]   = useState({})
  const [hoveredId, setHoveredId] = useState(null)
  const loadingList = new Array(6).fill(null)
  const scrollElement = useRef()
  const { fetchUserAddToCart } = useContext(Context)

  /* ── Tokens ── */
  const surface      = isDark ? '#161616'                : '#ffffff'
  const surfaceHover = isDark ? '#1c1c1c'                : '#fdfcfa'
  const text         = isDark ? '#e8e4dc'                : '#1a1814'
  const muted        = isDark ? 'rgba(160,152,144,0.8)'  : 'rgba(130,125,118,0.9)'
  const border       = isDark ? 'rgba(255,255,255,0.07)' : 'rgba(26,24,20,0.08)'
  const imgBg        = isDark ? 'rgba(255,255,255,0.02)' : '#f7f6f4'
  const gold         = '#c9a84c'
  const imgBlend     = isDark ? 'lighten'                : 'multiply'

  const handleAddToCart = async (e, id) => {
    await addToCart(e, id)
    fetchUserAddToCart()
  }

  const toggleWishlist = (productId) => {
    setWishlist(prev => ({ ...prev, [productId]: !prev[productId] }))
  }

  const fetchData = useCallback(async () => {
    setLoading(true)
    const categoryProduct = await fetchCategoryWiseProduct(category)
    setLoading(false)
    setData(categoryProduct?.data)
  }, [category])

  useEffect(() => { fetchData() }, [fetchData])

  const scrollRight = () => { scrollElement.current.scrollLeft += 228 }
  const scrollLeft  = () => { scrollElement.current.scrollLeft -= 228 }

  return (
    <>
      <style>{`
        .vcp-section {
          max-width: 1400px;
          margin: 0 auto;
          padding: 44px 32px 0;
          position: relative;
        }

        /* ── Responsive padding ── */
        @media (max-width: 1024px) { .vcp-section { padding: 36px 24px 0; } }
        @media (max-width: 768px)  { .vcp-section { padding: 32px 16px 0; } }
        @media (max-width: 480px)  { .vcp-section { padding: 24px 12px 0; } }

        /* Header */
        .vcp-header {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          margin-bottom: 18px;
        }
        .vcp-heading-group {
          display: flex;
          align-items: center;
          gap: 14px;
        }
        .vcp-heading {
          font-size: 19px;
          font-weight: 300;
          color: ${text};
          margin: 0;
          letter-spacing: -0.01em;
          font-family: 'Cormorant Garamond', Georgia, serif;
        }
        .vcp-count {
          font-size: 10px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: ${muted};
        }
        .vcp-divider-v {
          width: 0.5px;
          height: 14px;
          background: ${border};
          flex-shrink: 0;
        }
        .vcp-view-all {
          font-size: 10px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: ${muted};
          text-decoration: none;
          padding-bottom: 2px;
          border-bottom: 0.5px solid transparent;
          transition: color 0.22s ease, border-color 0.22s ease;
        }
        .vcp-view-all:hover {
          color: ${gold};
          border-bottom-color: ${gold};
        }
        .vcp-rule {
          height: 0.5px;
          background: ${border};
          margin-bottom: 18px;
        }

        /* Scroll buttons */
        .vcp-nav {
          position: absolute;
          top: calc(50% + 22px);
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
        .vcp-nav:hover {
          border-color: ${gold};
          color: ${gold};
          box-shadow: 0 0 16px rgba(201,168,76,0.14);
        }

        /* Card */
        .vcp-card {
          min-width: 216px;
          max-width: 216px;
          display: flex;
          flex-direction: column;
          flex-shrink: 0;
          overflow: hidden;
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
        .vcp-card:hover {
          border-color: ${gold};
          box-shadow: 0 12px 40px rgba(${isDark ? '0,0,0,0.35' : '26,24,20,0.09'});
          background: ${surfaceHover};
          transform: translateY(-3px);
        }

        /* Gold top accent line */
        .vcp-card::after {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 1.5px;
          background: ${gold};
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.32s cubic-bezier(0.4, 0, 0.2, 1);
          z-index: 3;
        }
        .vcp-card:hover::after { transform: scaleX(1); }

        /* Image zone */
        .vcp-img-zone {
          height: 210px;
          flex-shrink: 0;
          background: ${imgBg};
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 26px;
          overflow: hidden;
          border-bottom: 0.5px solid ${border};
          position: relative;
        }
        .vcp-img-zone img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          mix-blend-mode: ${imgBlend};
          transition: transform 0.45s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .vcp-card:hover .vcp-img-zone img { transform: scale(1.08); }

        /* Wishlist position */
        .vcp-wishlist {
          position: absolute;
          top: 10px;
          left: 10px;
          z-index: 3;
        }

        /* Discount badge */
        .vcp-badge {
          position: absolute;
          top: 10px; right: 10px;
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
        .vcp-info {
          padding: 15px 16px;
          display: flex;
          flex-direction: column;
          flex: 1;
        }
        .vcp-category {
          font-size: 8.5px;
          color: ${gold};
          letter-spacing: 0.12em;
          text-transform: uppercase;
          margin: 0 0 5px;
          font-weight: 400;
        }
        .vcp-name {
          font-size: 12px;
          font-weight: 400;
          color: ${text};
          margin: 0 0 auto;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          line-height: 1.58;
          letter-spacing: 0.01em;
          min-height: 38px;
        }

        /* Price row */
        .vcp-price-row {
          display: flex;
          align-items: baseline;
          gap: 8px;
          margin: 13px 0 10px;
        }
        .vcp-price {
          font-size: 15px;
          font-weight: 500;
          color: ${text};
          letter-spacing: -0.01em;
        }
        .vcp-price-original {
          font-size: 11px;
          color: ${muted};
          text-decoration: line-through;
        }

        /* Cart button */
        .vcp-cart-btn {
          width: 100%;
          padding: 10px 0;
          border: 0.5px solid ${border};
          background: transparent;
          color: ${muted};
          font-size: 10px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.22s ease;
          font-family: 'DM Sans', -apple-system, sans-serif;
          border-radius: 1px;
        }
        .vcp-cart-btn:hover {
          border-color: ${gold};
          color: ${isDark ? '#fff' : '#1a1814'};
          background: ${gold};
          letter-spacing: 0.16em;
        }

        /* Skeleton */
        .vcp-skel-card {
          min-width: 216px;
          max-width: 216px;
          display: flex;
          flex-direction: column;
          flex-shrink: 0;
          overflow: hidden;
          border: 0.5px solid ${border};
          background: ${surface};
          opacity: 0.45;
        }
        .vcp-skel-img {
          height: 210px;
          background: ${isDark ? 'rgba(255,255,255,0.03)' : 'rgba(26,24,20,0.03)'};
          animation: vcpPulse 1.8s ease-in-out infinite;
        }
        .vcp-skel-line {
          background: ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(26,24,20,0.05)'};
          animation: vcpPulse 1.8s ease-in-out infinite;
          border-radius: 1px;
        }

        @keyframes vcpPulse {
          0%, 100% { opacity: 0.65; }
          50%       { opacity: 0.25; }
        }

        @media (max-width: 768px) {
          .vcp-card      { min-width: 184px; max-width: 184px; }
          .vcp-img-zone  { height: 180px; padding: 18px; }
          .vcp-skel-card { min-width: 184px; max-width: 184px; }
          .vcp-skel-img  { height: 180px; }
        }
        @media (max-width: 480px) {
          .vcp-card      { min-width: 158px; max-width: 158px; }
          .vcp-img-zone  { height: 158px; padding: 14px; }
          .vcp-info      { padding: 12px 13px; }
          .vcp-skel-card { min-width: 158px; max-width: 158px; }
          .vcp-skel-img  { height: 158px; }
        }
      `}</style>

      <div className="vcp-section">

        {/* Header */}
        <div className="vcp-header">
          <div className="vcp-heading-group">
            <h2 className="vcp-heading">{heading}</h2>
            <div className="vcp-divider-v" />
            <span className="vcp-count">
              {data.length > 0 ? `${data.length} items` : ''}
            </span>
          </div>
          <Link
            to={`/product-category?category=${category}`}
            className="vcp-view-all"
          >
            View All
          </Link>
        </div>

        {/* Hairline */}
        <div className="vcp-rule" />

        {/* Nav buttons */}
        <button
          className="vcp-nav"
          onClick={scrollLeft}
          style={{ left: '-15px' }}
          aria-label="Scroll left"
        >
          <FaAngleLeft />
        </button>
        <button
          className="vcp-nav"
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
            gap: '12px',
            overflowX: 'auto',
            scrollbarWidth: 'none',
            scrollBehavior: 'smooth',
            paddingBottom: '6px'
          }}
        >
          {loading ? (
            loadingList.map((_, i) => (
              <div key={i} className="vcp-skel-card">
                <div className="vcp-skel-img" />
                <div style={{ padding: '15px 16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div className="vcp-skel-line" style={{ height: '10px', width: '80%' }} />
                  <div className="vcp-skel-line" style={{ height: '9px', width: '45%', animationDelay: '0.1s' }} />
                  <div className="vcp-skel-line" style={{ height: '13px', width: '58%', marginTop: '8px', animationDelay: '0.2s' }} />
                  <div className="vcp-skel-line" style={{ height: '32px', marginTop: '4px', animationDelay: '0.3s' }} />
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
                  className="vcp-card"
                  onMouseEnter={() => setHoveredId(product?._id)}
                  onMouseLeave={() => setHoveredId(null)}
                >
                  {/* Wishlist */}
                  <div className="vcp-wishlist">
                    <WishlistButton
                      productId={product?._id}
                      isInWishlist={wishlist[product?._id]}
                      onToggle={toggleWishlist}
                      isDark={isDark}
                    />
                  </div>

                  {/* Discount badge */}
                  {discount && <div className="vcp-badge">−{discount}%</div>}

                  {/* Image */}
                  <div className="vcp-img-zone">
                    <img src={product.productImage[0]} alt={product.productName} />
                  </div>

                  {/* Info */}
                  <div className="vcp-info">
                    <p className="vcp-category">{product?.category}</p>
                    <h3 className="vcp-name">{product?.productName}</h3>
                    <div className="vcp-price-row">
                      <span className="vcp-price">{displayINRCurrency(product?.sellingPrice)}</span>
                      {product?.price !== product?.sellingPrice && (
                        <span className="vcp-price-original">{displayINRCurrency(product?.price)}</span>
                      )}
                    </div>
                    <button
                      className="vcp-cart-btn"
                      onClick={(e) => handleAddToCart(e, product?._id)}
                    >
                      Add to Cart
                    </button>
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

export default VerticalCardProduct