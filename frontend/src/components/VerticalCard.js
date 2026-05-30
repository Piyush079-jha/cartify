import React, { useContext } from 'react'
import scrollTop from '../helpers/scrollTop'
import displayINRCurrency from '../helpers/displayCurrency'
import Context from '../context'
import addToCart from '../helpers/addToCart'
import { Link } from 'react-router-dom'

const VerticalCard = ({ loading, data = [], isDark = false }) => {
  const loadingList = new Array(13).fill(null)
  const { fetchUserAddToCart } = useContext(Context)

  const handleAddToCart = async (e, id) => {
    e.preventDefault()
    await addToCart(e, id)
    fetchUserAddToCart()
  }

  const surface = isDark ? '#161616' : '#ffffff'
  const text    = isDark ? '#e8e4dc' : '#1a1814'
  const muted   = isDark ? '#555'    : '#aaa'
  const border  = isDark ? 'rgba(255,255,255,0.07)' : 'rgba(26,24,20,0.09)'
  const gold    = '#c9a84c'

  return (
    <>
      <style>{`
        .vc-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 1px;
        }
        .vc-card {
          text-decoration: none;
          display: block;
          background: ${surface};
          border: 0.5px solid ${border};
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
          position: relative;
          overflow: hidden;
        }
        .vc-card:hover {
          border-color: ${gold};
          box-shadow: 0 12px 40px rgba(0,0,0,0.09);
          z-index: 1;
        }
        .vc-img-wrap {
          height: 200px;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
          background: ${isDark ? 'rgba(255,255,255,0.02)' : '#f7f6f4'};
          border-bottom: 0.5px solid ${border};
        }
        .vc-img-wrap img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          mix-blend-mode: ${isDark ? 'lighten' : 'multiply'};
          transition: transform 0.4s ease;
        }
        .vc-card:hover .vc-img-wrap img { transform: scale(1.07); }

        @keyframes vcShimmer {
          0%   { opacity: 0.3; }
          50%  { opacity: 0.6; }
          100% { opacity: 0.3; }
        }
        .vc-skeleton { animation: vcShimmer 1.6s infinite; }

        .vc-add-btn {
          width: 100%; padding: 9px 0;
          border: 0.5px solid ${border};
          background: transparent; color: ${muted};
          font-size: 10px; font-weight: 400;
          letter-spacing: 0.12em; text-transform: uppercase;
          cursor: pointer; transition: all 0.2s ease;
          font-family: 'DM Sans', -apple-system, sans-serif;
        }
        .vc-add-btn:hover {
          border-color: ${gold};
          color: ${gold};
          background: rgba(201,168,76,0.04);
        }

        @media (max-width: 1024px) {
          .vc-grid { grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); }
        }
        @media (max-width: 768px) {
          .vc-grid { grid-template-columns: repeat(auto-fill, minmax(155px, 1fr)); }
          .vc-img-wrap { height: 160px !important; padding: 16px !important; }
          .vc-name { font-size: 12px !important; }
          .vc-price { font-size: 14px !important; }
        }
        @media (max-width: 480px) {
          .vc-grid { grid-template-columns: repeat(2, 1fr); }
          .vc-img-wrap { height: 135px !important; padding: 12px !important; }
          .vc-info { padding: 10px 12px !important; }
          .vc-name { font-size: 11px !important; min-height: 32px !important; }
          .vc-price { font-size: 13px !important; }
          .vc-add-btn { font-size: 9px !important; padding: 8px 0 !important; }
          .vc-badge { font-size: 8px !important; padding: 2px 5px !important; }
        }
      `}</style>

      <div className="vc-grid">
        {loading ? (
          loadingList.map((_, index) => (
            <div key={index} className="vc-skeleton" style={{
              height: '300px',
              background: isDark ? 'rgba(255,255,255,0.04)' : '#f2f1ef',
              border: `0.5px solid ${border}`,
            }} />
          ))
        ) : (
          data.map((product, index) => (
            <Link
              to={"/product/" + product?._id}
              key={index}
              onClick={scrollTop}
              className="vc-card"
            >
              {/* Discount Badge */}
              {product?.price > product?.sellingPrice && (
                <div className="vc-badge" style={{
                  position: 'absolute', top: '10px', right: '10px',
                  background: isDark ? 'rgba(201,168,76,0.15)' : 'rgba(201,168,76,0.12)',
                  color: gold, fontSize: '9px', fontWeight: 500,
                  padding: '2px 6px', letterSpacing: '0.06em', zIndex: 2
                }}>
                  −{Math.round(((product.price - product.sellingPrice) / product.price) * 100)}%
                </div>
              )}

              {/* Image */}
              <div className="vc-img-wrap">
                <img src={product?.productImage?.[0]} alt={product?.productName} />
              </div>

              {/* Info */}
              <div className="vc-info" style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <p style={{ fontSize: '9px', color: gold, letterSpacing: '0.1em', textTransform: 'uppercase', margin: 0, fontFamily: 'DM Sans, sans-serif' }}>
                  {product?.category}
                </p>
                <h2 className="vc-name" style={{
                  fontSize: '12px', fontWeight: 400,
                  color: text, margin: 0,
                  overflow: 'hidden', textOverflow: 'ellipsis',
                  display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
                  lineHeight: 1.55, minHeight: '37px',
                  fontFamily: 'Georgia, "Times New Roman", serif',
                  letterSpacing: '0.01em'
                }}>
                  {product?.productName}
                </h2>

                <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', margin: '6px 0 8px', flexWrap: 'wrap' }}>
                  <span className="vc-price" style={{ fontSize: '15px', fontWeight: 500, color: text, letterSpacing: '-0.01em', fontFamily: 'DM Sans, sans-serif' }}>
                    {displayINRCurrency(product?.sellingPrice)}
                  </span>
                  {product?.price !== product?.sellingPrice && (
                    <span style={{ fontSize: '11px', color: muted, textDecoration: 'line-through', fontFamily: 'DM Sans, sans-serif' }}>
                      {displayINRCurrency(product?.price)}
                    </span>
                  )}
                </div>

                <button className="vc-add-btn" onClick={(e) => handleAddToCart(e, product?._id)}>
                  Add to Cart
                </button>
              </div>
            </Link>
          ))
        )}
      </div>
    </>
  )
}

export default VerticalCard