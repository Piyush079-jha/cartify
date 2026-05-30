import React, { useContext, useEffect, useState } from 'react'
import SummaryApi from '../common'
import Context from '../context'
import displayINRCurrency from '../helpers/displayCurrency'
import { MdDelete } from "react-icons/md"
import { FaShoppingCart, FaHeart, FaTimes, FaLock } from "react-icons/fa"
import { toast } from 'react-toastify'
import { useNavigate, useOutletContext } from 'react-router-dom'

const Cart = () => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [wishlistDialog, setWishlistDialog] = useState(null)
  const context = useContext(Context)
  const navigate = useNavigate()
  const { isDark } = useOutletContext()
  const loadingCart = new Array(4).fill(null)

  const bg      = isDark ? '#0e0e0e'                  : '#faf9f7'
  const surface = isDark ? '#161616'                  : '#ffffff'
  const surfaceAlt = isDark ? '#1c1c1c'               : '#fdfcfa'
  const text    = isDark ? '#e8e4dc'                  : '#1a1814'
  const muted   = isDark ? 'rgba(160,152,144,0.8)'    : 'rgba(130,125,118,0.9)'
  const border  = isDark ? 'rgba(255,255,255,0.07)'   : 'rgba(26,24,20,0.08)'
  const imgBg   = isDark ? 'rgba(255,255,255,0.02)'   : '#f7f6f4'
  const gold    = '#c9a84c'
  const goldGlow = 'rgba(201,168,76,0.15)'

  const totalQty   = data.reduce((p, c) => p + c.quantity, 0)
  const totalPrice = data.reduce((p, c) => p + (c.quantity * c?.productId?.sellingPrice), 0)

  const fetchData = async () => {
    const response = await fetch(SummaryApi.addToCartProductView.url, {
      method: SummaryApi.addToCartProductView.method,
      credentials: 'include',
      headers: { "content-type": 'application/json' },
    })
    const responseData = await response.json()
    if (responseData.success) setData(responseData.data)
  }

  useEffect(() => {
    setLoading(true)
    fetchData().finally(() => setLoading(false))
  }, [])

  const increaseQty = async (id, qty) => {
    const response = await fetch(SummaryApi.updateCartProduct.url, {
      method: SummaryApi.updateCartProduct.method,
      credentials: 'include',
      headers: { "content-type": 'application/json' },
      body: JSON.stringify({ _id: id, quantity: qty + 1 })
    })
    const responseData = await response.json()
    if (responseData.success) fetchData()
  }

  const decreaseQty = async (id, qty) => {
    if (qty >= 2) {
      const response = await fetch(SummaryApi.updateCartProduct.url, {
        method: SummaryApi.updateCartProduct.method,
        credentials: 'include',
        headers: { "content-type": 'application/json' },
        body: JSON.stringify({ _id: id, quantity: qty - 1 })
      })
      const responseData = await response.json()
      if (responseData.success) fetchData()
    }
  }

  const handleDeleteClick = (product) => {
    setWishlistDialog({
      show: true,
      cartItemId: product?._id,
      productId: product?.productId?._id,
      productName: product?.productId?.productName,
      productImage: product?.productId?.productImage[0]
    })
  }

  const handleMoveToWishlist = async () => {
    try {
      await fetch(SummaryApi.addToWishlist.url, {
        method: SummaryApi.addToWishlist.method,
        credentials: 'include',
        headers: { "content-type": 'application/json' },
        body: JSON.stringify({ productId: wishlistDialog.productId })
      })
      await deleteFromCart(wishlistDialog.cartItemId)
      toast.success('Moved to wishlist!')
    } catch { toast.error('Something went wrong') }
    setWishlistDialog(null)
  }

  const handleJustDelete = async () => {
    await deleteFromCart(wishlistDialog.cartItemId)
    setWishlistDialog(null)
  }

  const deleteFromCart = async (id) => {
    const response = await fetch(SummaryApi.deleteCartProduct.url, {
      method: SummaryApi.deleteCartProduct.method,
      credentials: 'include',
      headers: { "content-type": 'application/json' },
      body: JSON.stringify({ _id: id })
    })
    const responseData = await response.json()
    if (responseData.success) { fetchData(); context.fetchUserAddToCart() }
  }

  const handleProceedToPayment = () => {
    if (data.length === 0) { toast.error('Your cart is empty!'); return }
    navigate('/payment', { state: { cartItems: data, totalAmount: totalPrice } })
  }

  return (
    <>
      <style>{`
        .cart-page {
          min-height: 100vh;
          background: ${bg};
          padding: 32px 24px 64px;
          transition: background 0.3s ease;
        }
        .cart-inner { max-width: 1100px; margin: 0 auto; }

        /* Header */
        .cart-header {
          display: flex;
          align-items: flex-end;
          gap: 16px;
          margin-bottom: 36px;
          padding-bottom: 20px;
          border-bottom: 0.5px solid ${border};
        }
        .cart-title {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: 34px;
          font-weight: 300;
          color: ${text};
          margin: 0;
          letter-spacing: -0.01em;
          line-height: 1;
        }
        .cart-count-badge {
          font-size: 9px;
          font-weight: 500;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: ${gold};
          background: rgba(201,168,76,0.1);
          border: 0.5px solid rgba(201,168,76,0.25);
          padding: 4px 10px;
          margin-bottom: 4px;
        }

        /* Layout */
        .cart-layout {
          display: flex;
          gap: 24px;
          align-items: flex-start;
        }
        .cart-items-col {
          flex: 1;
          min-width: 0;
          display: flex;
          flex-direction: column;
          gap: 1px;
        }

        /* Cart item card */
        .cart-item {
          display: flex;
          align-items: center;
          background: ${surface};
          border: 0.5px solid ${border};
          overflow: hidden;
          transition: border-color 0.22s ease, box-shadow 0.22s ease;
          position: relative;
        }
        .cart-item::before {
          content: '';
          position: absolute;
          left: 0; top: 0; bottom: 0;
          width: 1.5px;
          background: ${gold};
          transform: scaleY(0);
          transform-origin: bottom;
          transition: transform 0.28s ease;
        }
        .cart-item:hover { border-color: ${gold}; }
        .cart-item:hover::before { transform: scaleY(1); }

        .cart-img-box {
          width: 108px;
          height: 108px;
          flex-shrink: 0;
          background: ${imgBg};
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 16px;
          border-right: 0.5px solid ${border};
        }
        .cart-img-box img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          mix-blend-mode: ${isDark ? 'lighten' : 'multiply'};
          transition: transform 0.3s ease;
        }
        .cart-item:hover .cart-img-box img { transform: scale(1.06); }

        .cart-info {
          flex: 1;
          padding: 16px 18px;
          display: flex;
          flex-direction: column;
          gap: 8px;
          min-width: 0;
        }
        .cart-item-top {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 10px;
        }
        .cart-category {
          font-size: 8.5px;
          color: ${gold};
          letter-spacing: 0.12em;
          text-transform: uppercase;
          margin: 0 0 4px;
        }
        .cart-name {
          font-size: 13px;
          font-weight: 400;
          color: ${text};
          margin: 0;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          letter-spacing: 0.01em;
        }

        /* Delete button */
        .cart-del-btn {
          width: 30px;
          height: 30px;
          border: 0.5px solid ${border};
          background: transparent;
          color: ${muted};
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          font-size: 15px;
          flex-shrink: 0;
          transition: all 0.2s ease;
          border-radius: 1px;
        }
        .cart-del-btn:hover {
          border-color: rgba(180,60,60,0.5);
          color: #b44040;
          background: rgba(180,60,60,0.06);
        }

        /* Qty controls */
        .cart-bottom-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 10px;
        }
        .cart-qty {
          display: flex;
          align-items: center;
          gap: 0;
          border: 0.5px solid ${border};
        }
        .cart-qty-btn {
          width: 30px;
          height: 30px;
          border: none;
          background: transparent;
          color: ${muted};
          font-size: 16px;
          font-weight: 400;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
          font-family: inherit;
        }
        .cart-qty-btn:hover {
          background: rgba(201,168,76,0.08);
          color: ${gold};
        }
        .cart-qty-num {
          min-width: 32px;
          text-align: center;
          font-size: 13px;
          font-weight: 500;
          color: ${text};
          border-left: 0.5px solid ${border};
          border-right: 0.5px solid ${border};
          height: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* Price */
        .cart-price-col { text-align: right; }
        .cart-price-total {
          font-size: 16px;
          font-weight: 500;
          color: ${text};
          letter-spacing: -0.01em;
        }
        .cart-price-unit {
          font-size: 11px;
          color: ${muted};
          margin-top: 2px;
        }

        /* Summary panel */
        .cart-summary {
          width: 290px;
          flex-shrink: 0;
          background: ${isDark ? '#111110' : '#111110'};
          border: 0.5px solid rgba(255,255,255,0.07);
          padding: 28px;
          position: sticky;
          top: 80px;
        }
        .cart-summary-title {
          font-size: 9px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.3);
          margin: 0 0 20px;
          padding-bottom: 16px;
          border-bottom: 0.5px solid rgba(255,255,255,0.07);
        }
        .cart-summary-row {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          margin-bottom: 14px;
        }
        .cart-summary-label {
          font-size: 12px;
          color: rgba(255,255,255,0.4);
          letter-spacing: 0.03em;
        }
        .cart-summary-value {
          font-size: 13px;
          color: rgba(255,255,255,0.85);
          font-weight: 400;
        }
        .cart-summary-total-row {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          padding-top: 16px;
          border-top: 0.5px solid rgba(255,255,255,0.07);
          margin-top: 4px;
        }
        .cart-summary-total-label {
          font-size: 11px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.5);
        }
        .cart-summary-total-value {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: 26px;
          font-weight: 300;
          color: ${gold};
          letter-spacing: -0.01em;
        }

        /* Proceed button */
        .cart-proceed-btn {
          width: 100%;
          padding: 13px;
          background: transparent;
          border: 0.5px solid ${gold};
          color: ${gold};
          font-size: 10px;
          font-weight: 500;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.25s ease;
          font-family: 'DM Sans', sans-serif;
          margin-top: 22px;
          border-radius: 1px;
        }
        .cart-proceed-btn:hover {
          background: ${gold};
          color: #0a0a0a;
          box-shadow: 0 0 24px rgba(201,168,76,0.2);
          letter-spacing: 0.22em;
        }
        .cart-secure-note {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          margin-top: 14px;
          font-size: 10px;
          color: rgba(255,255,255,0.2);
          letter-spacing: 0.06em;
        }

        /* Empty state */
        .cart-empty {
          text-align: center;
          padding: 80px 24px;
          border: 0.5px solid ${border};
          background: ${surface};
        }
        .cart-empty-icon {
          font-size: 36px;
          color: ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(26,24,20,0.08)'};
          margin-bottom: 20px;
        }
        .cart-empty-title {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: 24px;
          font-weight: 300;
          color: ${text};
          margin: 0 0 8px;
        }
        .cart-empty-sub {
          font-size: 12px;
          color: ${muted};
          letter-spacing: 0.04em;
        }

        /* Skeleton */
        .cart-skel {
          height: 108px;
          background: ${isDark ? 'rgba(255,255,255,0.03)' : 'rgba(26,24,20,0.03)'};
          border: 0.5px solid ${border};
          animation: cartPulse 1.8s ease-in-out infinite;
        }
        .cart-skel:nth-child(2) { animation-delay: 0.15s; }
        .cart-skel:nth-child(3) { animation-delay: 0.3s; }
        .cart-skel:nth-child(4) { animation-delay: 0.45s; }

        @keyframes cartPulse {
          0%, 100% { opacity: 0.6; }
          50%       { opacity: 0.25; }
        }

        /* Responsive */
        @media (max-width: 860px) {
          .cart-layout { flex-direction: column; }
          .cart-summary { width: 100% !important; position: static !important; top: auto !important; }
        }
        @media (max-width: 600px) {
          .cart-page { padding: 20px 16px 48px !important; }
          .cart-title { font-size: 26px !important; }
          .cart-img-box { width: 84px !important; height: 84px !important; padding: 12px !important; }
          .cart-info { padding: 12px 14px !important; }
          .cart-name { font-size: 12px !important; }
          .cart-summary { padding: 20px !important; }
        }
        @media (max-width: 400px) {
          .cart-img-box { width: 70px !important; height: 70px !important; }
          .cart-name { white-space: normal !important; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; }
        }
      `}</style>

      <div className="cart-page">
        <div className="cart-inner">

          {/* Header */}
          <div className="cart-header">
            <h1 className="cart-title">Your Cart</h1>
            {data.length > 0 && (
              <span className="cart-count-badge">
                {data.length} item{data.length > 1 ? 's' : ''}
              </span>
            )}
          </div>

          {/* Empty state */}
          {data.length === 0 && !loading && (
            <div className="cart-empty">
              <div className="cart-empty-icon"><FaShoppingCart /></div>
              <h2 className="cart-empty-title">Your cart is empty</h2>
              <p className="cart-empty-sub">Add products to get started</p>
            </div>
          )}

          <div className="cart-layout">

            {/* Items */}
            <div className="cart-items-col">
              {loading ? (
                loadingCart.map((_, i) => (
                  <div key={i} className="cart-skel" />
                ))
              ) : (
                data.map((product) => (
                  <div key={product?._id} className="cart-item">
                    <div className="cart-img-box">
                      <img
                        src={product?.productId?.productImage[0]}
                        alt={product?.productId?.productName}
                      />
                    </div>
                    <div className="cart-info">
                      <div className="cart-item-top">
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p className="cart-category">{product?.productId?.category}</p>
                          <h3 className="cart-name">{product?.productId?.productName}</h3>
                        </div>
                        <button
                          className="cart-del-btn"
                          onClick={() => handleDeleteClick(product)}
                          aria-label="Remove item"
                        >
                          <MdDelete />
                        </button>
                      </div>
                      <div className="cart-bottom-row">
                        <div className="cart-qty">
                          <button className="cart-qty-btn" onClick={() => decreaseQty(product?._id, product?.quantity)}>−</button>
                          <span className="cart-qty-num">{product?.quantity}</span>
                          <button className="cart-qty-btn" onClick={() => increaseQty(product?._id, product?.quantity)}>+</button>
                        </div>
                        <div className="cart-price-col">
                          <p className="cart-price-total">
                            {displayINRCurrency(product?.productId?.sellingPrice * product?.quantity)}
                          </p>
                          <p className="cart-price-unit">
                            {displayINRCurrency(product?.productId?.sellingPrice)} × {product?.quantity}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Summary */}
            {!loading && data.length > 0 && (
              <div className="cart-summary">
                <p className="cart-summary-title">Order Summary</p>

                <div className="cart-summary-row">
                  <span className="cart-summary-label">Items</span>
                  <span className="cart-summary-value">{totalQty}</span>
                </div>
                <div className="cart-summary-row">
                  <span className="cart-summary-label">Subtotal</span>
                  <span className="cart-summary-value">{displayINRCurrency(totalPrice)}</span>
                </div>
                <div className="cart-summary-row">
                  <span className="cart-summary-label">Delivery</span>
                  <span style={{ fontSize: '12px', color: 'rgba(100,200,120,0.8)', letterSpacing: '0.06em' }}>Free</span>
                </div>

                <div className="cart-summary-total-row">
                  <span className="cart-summary-total-label">Total</span>
                  <span className="cart-summary-total-value">{displayINRCurrency(totalPrice)}</span>
                </div>

                <button className="cart-proceed-btn" onClick={handleProceedToPayment}>
                  Proceed to Payment
                </button>

                <div className="cart-secure-note">
                  <FaLock style={{ fontSize: '9px' }} />
                  <span>Secure & encrypted checkout</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Wishlist Dialog */}
        {wishlistDialog?.show && (
          <div style={{
            position: 'fixed', inset: 0,
            background: 'rgba(0,0,0,0.75)',
            backdropFilter: 'blur(8px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 1000, padding: '20px'
          }}>
            <div style={{
              background: '#111110',
              border: '0.5px solid rgba(255,255,255,0.08)',
              padding: '32px',
              maxWidth: '340px', width: '100%',
              boxShadow: '0 40px 80px rgba(0,0,0,0.6)',
              textAlign: 'center'
            }}>
              {/* Product image */}
              <div style={{
                width: '64px', height: '64px',
                background: 'rgba(255,255,255,0.03)',
                border: '0.5px solid rgba(255,255,255,0.08)',
                margin: '0 auto 20px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                overflow: 'hidden', padding: '8px'
              }}>
                <img src={wishlistDialog.productImage} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain', mixBlendMode: 'lighten' }} />
              </div>

              <FaHeart style={{ fontSize: '20px', color: '#c9a84c', marginBottom: '12px' }} />
              <h3 style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: '22px', fontWeight: 300, color: '#e8e4dc', margin: '0 0 8px' }}>
                Save to Wishlist?
              </h3>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px', margin: '0 0 28px', lineHeight: 1.7, letterSpacing: '0.03em' }}>
                Move <span style={{ color: '#e8e4dc' }}>{wishlistDialog.productName}</span> to your wishlist before removing?
              </p>

              <div style={{ display: 'flex', gap: '1px' }}>
                <button
                  onClick={handleJustDelete}
                  style={{
                    flex: 1, padding: '12px',
                    background: 'transparent',
                    border: '0.5px solid rgba(255,255,255,0.1)',
                    color: 'rgba(255,255,255,0.45)',
                    fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase',
                    cursor: 'pointer', transition: 'all 0.2s ease',
                    fontFamily: 'DM Sans, sans-serif', borderRadius: '1px'
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(180,60,60,0.5)'; e.currentTarget.style.color = '#b44040' }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = 'rgba(255,255,255,0.45)' }}
                >
                  <FaTimes style={{ marginRight: '6px', fontSize: '9px' }} />
                  Remove
                </button>
                <button
                  onClick={handleMoveToWishlist}
                  style={{
                    flex: 1, padding: '12px',
                    background: 'transparent',
                    border: '0.5px solid rgba(201,168,76,0.5)',
                    color: '#c9a84c',
                    fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase',
                    cursor: 'pointer', transition: 'all 0.2s ease',
                    fontFamily: 'DM Sans, sans-serif', borderRadius: '1px'
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = '#c9a84c'; e.currentTarget.style.color = '#0a0a0a' }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#c9a84c' }}
                >
                  <FaHeart style={{ marginRight: '6px', fontSize: '9px' }} />
                  Save It
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default Cart