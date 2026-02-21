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

  const cardStyle = {
    borderRadius: '18px',
    overflow: 'hidden',
    textDecoration: 'none',
    display: 'block',
    background: isDark ? 'rgba(255,255,255,0.05)' : '#ffffff',
    border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #efefef',
    transition: 'all 0.3s ease',
    position: 'relative',
  }

  return (
    <>
      <style>{`
        .vc-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 16px;
        }
        .vc-img-wrap {
          height: 180px;
          overflow: hidden;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .vc-img-wrap img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          transition: transform 0.4s ease;
          position: relative;
          z-index: 1;
        }
        .vc-card:hover .vc-img-wrap img {
          transform: scale(1.15);
        }
        @keyframes vcShimmer {
          0% { opacity: 0.4; }
          50% { opacity: 0.7; }
          100% { opacity: 0.4; }
        }
        .vc-skeleton {
          animation: vcShimmer 1.5s infinite;
          border-radius: 18px;
        }
        .vc-add-btn {
          margin-top: 4px;
          padding: 10px;
          border-radius: 12px;
          border: none;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: #fff;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          width: 100%;
          box-shadow: 0 4px 14px rgba(102,126,234,0.28);
          font-family: inherit;
        }
        .vc-add-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(102,126,234,0.4);
        }

        @media (max-width: 1024px) {
          .vc-grid {
            grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
            gap: 14px;
          }
        }
        @media (max-width: 768px) {
          .vc-grid {
            grid-template-columns: repeat(auto-fill, minmax(155px, 1fr));
            gap: 12px;
          }
          .vc-img-wrap { height: 150px !important; }
          .vc-name { font-size: 13px !important; }
          .vc-price { font-size: 15px !important; }
          .vc-add-btn { font-size: 12px !important; padding: 9px !important; }
        }
        @media (max-width: 480px) {
          .vc-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 10px;
          }
          .vc-img-wrap { height: 130px !important; }
          .vc-name { font-size: 12px !important; min-height: 34px !important; }
          .vc-price { font-size: 14px !important; }
          .vc-add-btn { font-size: 11px !important; padding: 8px !important; border-radius: 10px !important; }
          .vc-info { padding: 10px 12px !important; }
          .vc-badge { font-size: 9px !important; padding: 3px 6px !important; }
        }
        @media (max-width: 360px) {
          .vc-grid { gap: 8px; }
          .vc-img-wrap { height: 110px !important; }
        }
      `}</style>

      <div className="vc-grid">
        {loading ? (
          loadingList.map((_, index) => (
            <div key={index} className="vc-skeleton" style={{
              height: '300px',
              background: isDark ? 'rgba(255,255,255,0.06)' : '#f0f0f0',
              border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #efefef',
            }} />
          ))
        ) : (
          data.map((product, index) => (
            <Link
              to={"/product/" + product?._id}
              key={index}
              onClick={scrollTop}
              className="vc-card"
              style={cardStyle}
              onMouseEnter={e => {
                e.currentTarget.style.boxShadow = '0 16px 36px rgba(102,126,234,0.22)'
                e.currentTarget.style.transform = 'translateY(-5px)'
                e.currentTarget.style.borderColor = 'rgba(102,126,234,0.35)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.boxShadow = 'none'
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.borderColor = isDark ? 'rgba(255,255,255,0.1)' : '#efefef'
              }}
            >
              {/* Discount Badge */}
              {product?.price > product?.sellingPrice && (
                <div className="vc-badge" style={{
                  position: 'absolute', top: '10px', right: '10px',
                  background: 'linear-gradient(135deg, #f093fb, #f5576c)',
                  color: '#fff', fontSize: '10px', fontWeight: 700,
                  padding: '4px 8px', borderRadius: '8px', zIndex: 2,
                  boxShadow: '0 3px 10px rgba(245,87,108,0.35)'
                }}>
                  {Math.round(((product.price - product.sellingPrice) / product.price) * 100)}% OFF
                </div>
              )}

              {/* Image - NO padding so zoom works properly */}
              <div className="vc-img-wrap" style={{
                background: isDark
                  ? 'linear-gradient(135deg, rgba(255,255,255,0.03), rgba(255,255,255,0.05))'
                  : 'linear-gradient(135deg, #fafafa, #f2f2f2)',
              }}>
                <div style={{
                  position: 'absolute', width: '90px', height: '90px',
                  background: 'rgba(102,126,234,0.08)', borderRadius: '50%',
                  filter: 'blur(22px)', top: '50%', left: '50%',
                  transform: 'translate(-50%,-50%)', pointerEvents: 'none', zIndex: 0
                }} />
                <img
                  src={product?.productImage?.[0]}
                  alt={product?.productName}
                />
              </div>

              {/* Info */}
              <div className="vc-info" style={{ padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <h2 className="vc-name" style={{
                  fontSize: '13px', fontWeight: 600,
                  color: isDark ? '#ffffff' : '#111111',
                  margin: 0, overflow: 'hidden', textOverflow: 'ellipsis',
                  display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
                  lineHeight: '1.45', minHeight: '38px'
                }}>
                  {product?.productName}
                </h2>

                <p style={{ fontSize: '11px', fontWeight: 600, color: '#667eea', textTransform: 'capitalize', margin: 0, letterSpacing: '0.03em' }}>
                  {product?.category}
                </p>

                <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginTop: '2px', flexWrap: 'wrap' }}>
                  <span className="vc-price" style={{ fontSize: '16px', fontWeight: 700, background: 'linear-gradient(135deg, #667eea, #764ba2)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                    {displayINRCurrency(product?.sellingPrice)}
                  </span>
                  {product?.price !== product?.sellingPrice && (
                    <span style={{ fontSize: '11px', color: isDark ? 'rgba(255,255,255,0.35)' : '#bbbbbb', textDecoration: 'line-through' }}>
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