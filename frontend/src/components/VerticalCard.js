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

  const surface  = isDark ? '#161616'                : '#ffffff'
  const text     = isDark ? '#e8e4dc'                : '#1a1814'
  const muted    = isDark ? 'rgba(160,152,144,0.8)'  : 'rgba(130,125,118,0.9)'
  const border   = isDark ? 'rgba(255,255,255,0.07)' : 'rgba(26,24,20,0.08)'
  const imgBg    = isDark ? 'rgba(255,255,255,0.02)' : '#f7f6f4'
  const gold     = '#c9a84c'
  const imgBlend = isDark ? 'lighten'                : 'multiply'

  return (
    <>
      <style>{`
        .vc-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 1px;
        }

        /* Card */
        .vc-card {
          text-decoration: none;
          display: flex;
          flex-direction: column;
          background: ${surface};
          border: 0.5px solid ${border};
          overflow: hidden;
          position: relative;
          transition:
            border-color 0.25s ease,
            box-shadow   0.25s ease,
            transform    0.25s ease;
        }
        .vc-card:hover {
          border-color: ${gold};
          box-shadow: 0 12px 40px rgba(${isDark ? '0,0,0,0.35' : '26,24,20,0.09'});
          transform: translateY(-3px);
          z-index: 1;
        }

        /* Gold top bar on hover */
        .vc-card::after {
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
        .vc-card:hover::after { transform: scaleX(1); }

        /* Image zone */
        .vc-img-wrap {
          height: 200px;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
          background: ${imgBg};
          border-bottom: 0.5px solid ${border};
          flex-shrink: 0;
        }
        .vc-img-wrap img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          mix-blend-mode: ${imgBlend};
          transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .vc-card:hover .vc-img-wrap img { transform: scale(1.08); }

        /* Discount badge */
        .vc-badge {
          position: absolute;
          top: 10px;
          right: 10px;
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
        .vc-info {
          padding: 14px 16px;
          display: flex;
          flex-direction: column;
          gap: 5px;
          flex: 1;
        }
        .vc-cat {
          font-size: 8.5px;
          color: ${gold};
          letter-spacing: 0.12em;
          text-transform: uppercase;
          margin: 0;
          font-family: 'DM Sans', sans-serif;
          font-weight: 400;
        }
        .vc-name {
          font-size: 12px;
          font-weight: 400;
          color: ${text};
          margin: 0;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          line-height: 1.58;
          min-height: 38px;
          font-family: 'Cormorant Garamond', Georgia, serif;
          letter-spacing: 0.01em;
        }

        /* Price row */
        .vc-price-row {
          display: flex;
          align-items: baseline;
          gap: 8px;
          margin: 5px 0 8px;
          flex-wrap: wrap;
        }
        .vc-price {
          font-size: 15px;
          font-weight: 500;
          color: ${text};
          letter-spacing: -0.01em;
          font-family: 'DM Sans', sans-serif;
        }
        .vc-price-orig {
          font-size: 11px;
          color: ${muted};
          text-decoration: line-through;
          font-family: 'DM Sans', sans-serif;
        }

        /* Cart button */
        .vc-add-btn {
          width: 100%;
          padding: 10px 0;
          border: 0.5px solid ${border};
          background: transparent;
          color: ${muted};
          font-size: 10px;
          font-weight: 400;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.22s ease;
          font-family: 'DM Sans', sans-serif;
          border-radius: 1px;
          margin-top: auto;
        }
        .vc-add-btn:hover {
          border-color: ${gold};
          color: ${isDark ? '#fff' : '#1a1814'};
          background: ${gold};
          letter-spacing: 0.16em;
        }

        /* Skeleton */
        .vc-skeleton {
          height: 300px;
          background: ${isDark ? 'rgba(255,255,255,0.03)' : 'rgba(26,24,20,0.03)'};
          border: 0.5px solid ${border};
          animation: vcPulse 1.8s ease-in-out infinite;
          border-radius: 1px;
        }
        .vc-skeleton:nth-child(2)  { animation-delay: 0.08s;  }
        .vc-skeleton:nth-child(3)  { animation-delay: 0.16s;  }
        .vc-skeleton:nth-child(4)  { animation-delay: 0.24s;  }
        .vc-skeleton:nth-child(5)  { animation-delay: 0.32s;  }
        .vc-skeleton:nth-child(6)  { animation-delay: 0.40s;  }
        .vc-skeleton:nth-child(7)  { animation-delay: 0.48s;  }
        .vc-skeleton:nth-child(8)  { animation-delay: 0.56s;  }
        .vc-skeleton:nth-child(9)  { animation-delay: 0.64s;  }
        .vc-skeleton:nth-child(10) { animation-delay: 0.72s;  }
        .vc-skeleton:nth-child(11) { animation-delay: 0.80s;  }
        .vc-skeleton:nth-child(12) { animation-delay: 0.88s;  }
        .vc-skeleton:nth-child(13) { animation-delay: 0.96s;  }

        @keyframes vcPulse {
          0%, 100% { opacity: 0.65; }
          50%       { opacity: 0.25; }
        }

        /* Responsive */
        @media (max-width: 1024px) {
          .vc-grid { grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); }
        }
        @media (max-width: 768px) {
          .vc-grid    { grid-template-columns: repeat(auto-fill, minmax(155px, 1fr)); }
          .vc-img-wrap { height: 160px; padding: 16px; }
          .vc-name    { font-size: 11px; }
          .vc-price   { font-size: 14px; }
        }
        @media (max-width: 480px) {
          .vc-grid     { grid-template-columns: repeat(2, 1fr); }
          .vc-img-wrap { height: 135px; padding: 12px; }
          .vc-info     { padding: 10px 12px; }
          .vc-name     { font-size: 11px; min-height: 34px; }
          .vc-price    { font-size: 13px; }
          .vc-add-btn  { font-size: 9px; padding: 8px 0; }
          .vc-badge    { font-size: 8px; padding: 2px 5px; }
        }
      `}</style>

      <div className="vc-grid">
        {loading ? (
          loadingList.map((_, index) => (
            <div key={index} className="vc-skeleton" />
          ))
        ) : (
          data.map((product, index) => {
            const discount = product?.price > product?.sellingPrice
              ? Math.round(((product.price - product.sellingPrice) / product.price) * 100)
              : null

            return (
              <Link
                to={"/product/" + product?._id}
                key={index}
                onClick={scrollTop}
                className="vc-card"
              >
                {/* Discount badge */}
                {discount && (
                  <div className="vc-badge">−{discount}%</div>
                )}

                {/* Image */}
                <div className="vc-img-wrap">
                  <img src={product?.productImage?.[0]} alt={product?.productName} />
                </div>

                {/* Info */}
                <div className="vc-info">
                  <p className="vc-cat">{product?.category}</p>
                  <h2 className="vc-name">{product?.productName}</h2>

                  <div className="vc-price-row">
                    <span className="vc-price">
                      {displayINRCurrency(product?.sellingPrice)}
                    </span>
                    {product?.price !== product?.sellingPrice && (
                      <span className="vc-price-orig">
                        {displayINRCurrency(product?.price)}
                      </span>
                    )}
                  </div>

                  <button
                    className="vc-add-btn"
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
    </>
  )
}

export default VerticalCard