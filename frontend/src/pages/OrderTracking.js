import React, { useState, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaArrowLeft, FaBox } from 'react-icons/fa'
import { MdInventory } from 'react-icons/md'
import SummaryApi from '../common'
import Context from '../context'
import { toast } from 'react-toastify'

const statusSteps = [
  { key: 'processing', label: 'Order Placed', icon: '◌', desc: 'Order received'    },
  { key: 'confirmed',  label: 'Confirmed',    icon: '◎', desc: 'Seller confirmed'  },
  { key: 'shipped',    label: 'Shipped',       icon: '◈', desc: 'On the way'        },
  { key: 'delivered',  label: 'Delivered',     icon: '◉', desc: 'Delivered!'        },
]
const statusIndex = { processing: 0, confirmed: 1, shipped: 2, delivered: 3 }

const paymentLabel = {
  card:       'Card',
  upi:        'UPI',
  netbanking: 'Net Banking',
  cod:        'Cash on Delivery'
}

const statusMeta = {
  processing: { color: '#c9a84c', bg: 'rgba(201,168,76,0.1)',  border: 'rgba(201,168,76,0.25)',  label: 'Processing' },
  confirmed:  { color: '#7eb8a4', bg: 'rgba(126,184,164,0.1)', border: 'rgba(126,184,164,0.25)', label: 'Confirmed'  },
  shipped:    { color: '#8ab4d4', bg: 'rgba(138,180,212,0.1)', border: 'rgba(138,180,212,0.25)', label: 'Shipped'    },
  delivered:  { color: '#a8c080', bg: 'rgba(168,192,128,0.1)', border: 'rgba(168,192,128,0.25)', label: 'Delivered'  },
  cancelled:  { color: '#c07878', bg: 'rgba(192,120,120,0.1)', border: 'rgba(192,120,120,0.25)', label: 'Cancelled'  },
}

const fmt = (d) => new Date(d).toLocaleDateString('en-IN', {
  day: 'numeric', month: 'short', year: 'numeric',
  hour: '2-digit', minute: '2-digit'
})

export default function OrderTracking() {
  const navigate = useNavigate()
  const context  = useContext(Context)
  const isDark   = context?.isDark || false

  const [orders, setOrders]                   = useState([])
  const [loading, setLoading]                 = useState(true)
  const [selected, setSelected]               = useState(null)
  const [cancelling, setCancelling]           = useState(false)
  const [showCancelConfirm, setShowCancelConfirm] = useState(false)
  const [mobileView, setMobileView]           = useState('list')

  const bg      = isDark ? '#0e0e0e'                 : '#faf9f7'
  const surface = isDark ? '#161616'                 : '#ffffff'
  const surfaceAlt = isDark ? '#111110'              : '#f7f6f4'
  const text    = isDark ? '#e8e4dc'                 : '#1a1814'
  const muted   = isDark ? 'rgba(160,152,144,0.75)'  : 'rgba(130,125,118,0.85)'
  const border  = isDark ? 'rgba(255,255,255,0.07)'  : 'rgba(26,24,20,0.09)'
  const gold    = '#c9a84c'
  const goldBg  = isDark ? 'rgba(201,168,76,0.07)'   : 'rgba(201,168,76,0.05)'
  const goldBorder = 'rgba(201,168,76,0.22)'

  useEffect(() => { fetchOrders() }, [])

  const fetchOrders = async () => {
    try {
      const res = await fetch(SummaryApi.getOrders.url, {
        method: SummaryApi.getOrders.method,
        credentials: 'include'
      })
      if (res.status === 401) { navigate('/login'); return }
      const data = await res.json()
      if (data.success) {
        setOrders(data.data)
        if (data.data.length > 0) setSelected(data.data[0]._id)
      }
    } catch (e) { console.error(e) }
    finally { setLoading(false) }
  }

  const handleCancelOrder = async () => {
    if (!order) return
    setCancelling(true)
    try {
      const res = await fetch(SummaryApi.cancelOrder.url, {
        method: SummaryApi.cancelOrder.method,
        credentials: 'include',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ orderId: order._id })
      })
      const data = await res.json()
      if (data.success) {
        toast.success('Order cancelled')
        setShowCancelConfirm(false)
        setOrders(prev => prev.map(o =>
          o._id === order._id ? { ...o, orderStatus: 'cancelled' } : o
        ))
      } else toast.error(data.message || 'Failed to cancel order')
    } catch { toast.error('Something went wrong') }
    finally { setCancelling(false) }
  }

  const order       = orders.find(o => o._id === selected)
  const step        = order ? (statusIndex[order.orderStatus] ?? 0) : 0
  const isCancelled = order?.orderStatus === 'cancelled'
  const canCancel   = order && !isCancelled
    && order.orderStatus !== 'delivered'
    && order.orderStatus !== 'shipped'

  const sm = order ? (statusMeta[order.orderStatus] || statusMeta.processing) : statusMeta.processing

  if (loading) return (
    <div style={{
      minHeight: '100vh', display: 'flex',
      alignItems: 'center', justifyContent: 'center',
      background: bg
    }}>
      <style>{`@keyframes otSpin { to { transform: rotate(360deg) } }`}</style>
      <div style={{
        width: '28px', height: '28px',
        border: `1.5px solid ${border}`,
        borderTop: `1.5px solid ${gold}`,
        borderRadius: '50%',
        animation: 'otSpin 0.8s linear infinite'
      }} />
    </div>
  )

  return (
    <>
      <style>{`
        @keyframes otFadeUp {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes otSlideUp {
          from { opacity: 0; transform: translateY(40px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes otSpin { to { transform: rotate(360deg) } }

        .ot-page {
          min-height: 100vh;
          background: ${bg};
          font-family: 'DM Sans', -apple-system, sans-serif;
          transition: background 0.3s ease;
        }

        /* Topbar */
        .ot-topbar {
          background: ${isDark ? 'rgba(14,14,14,0.97)' : 'rgba(250,249,247,0.97)'};
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border-bottom: 0.5px solid ${border};
          height: 57px;
          display: flex;
          align-items: center;
          padding: 0 24px;
          gap: 14px;
          position: sticky;
          top: 0;
          z-index: 20;
        }
        .ot-back-btn {
          width: 32px; height: 32px;
          border: 0.5px solid ${border};
          background: transparent;
          color: ${muted};
          display: flex; align-items: center; justify-content: center;
          cursor: pointer;
          border-radius: 1px;
          transition: all 0.2s ease;
          flex-shrink: 0;
        }
        .ot-back-btn:hover { border-color: ${gold}; color: ${gold}; }
        .ot-topbar-title {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: 18px;
          font-weight: 300;
          color: ${text};
          margin: 0;
          letter-spacing: 0.01em;
        }
        .ot-topbar-count {
          margin-left: auto;
          font-size: 10px;
          color: ${muted};
          border: 0.5px solid ${border};
          padding: 2px 8px;
          letter-spacing: 0.08em;
          font-family: 'DM Sans', sans-serif;
          flex-shrink: 0;
        }

        /* Layout */
        .ot-wrapper {
          max-width: 1100px;
          margin: 0 auto;
          padding: 28px 24px 64px;
          display: grid;
          grid-template-columns: 280px 1fr;
          gap: 1px;
          align-items: start;
        }

        /* Order list */
        .ot-list {
          display: flex;
          flex-direction: column;
          gap: 1px;
          position: sticky;
          top: 72px;
          max-height: calc(100vh - 90px);
          overflow-y: auto;
          scrollbar-width: none;
          background: ${border};
        }
        .ot-list::-webkit-scrollbar { display: none; }

        /* Order list item */
        .ot-order-item {
          background: ${surface};
          padding: 16px;
          cursor: pointer;
          border-left: 1.5px solid transparent;
          transition: border-color 0.2s ease, background 0.2s ease;
          position: relative;
        }
        .ot-order-item:hover { background: ${surfaceAlt}; }
        .ot-order-item.active {
          border-left-color: ${gold};
          background: ${goldBg};
        }
        .ot-order-id {
          font-size: 9px;
          font-weight: 400;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: ${muted};
          margin: 0 0 6px;
          font-family: monospace;
        }
        .ot-order-amount {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: 20px;
          font-weight: 300;
          color: ${text};
          margin: 0 0 4px;
          letter-spacing: -0.01em;
          line-height: 1;
        }
        .ot-order-date {
          font-size: 10px;
          color: ${muted};
          margin: 0 0 10px;
          letter-spacing: 0.03em;
        }

        /* Status badge */
        .ot-badge {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          font-size: 9px;
          font-weight: 500;
          padding: 3px 8px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          border: 0.5px solid;
          font-family: 'DM Sans', sans-serif;
        }
        .ot-badge-dot {
          width: 4px; height: 4px;
          border-radius: 50%;
          flex-shrink: 0;
        }

        /* Detail column */
        .ot-detail {
          display: flex;
          flex-direction: column;
          gap: 1px;
          background: ${border};
          animation: otFadeUp 0.3s ease;
        }

        /* Detail panels */
        .ot-panel {
          background: ${surface};
          padding: 24px 28px;
        }
        .ot-panel-label {
          font-size: 9px;
          font-weight: 400;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: ${muted};
          margin: 0 0 16px;
        }

        /* Order summary header panel */
        .ot-summary-panel {
          background: ${isDark ? '#111110' : '#111110'};
          padding: 24px 28px;
          position: relative;
          overflow: hidden;
        }
        .ot-summary-panel::before {
          content: '';
          position: absolute;
          left: 0; top: 0; bottom: 0;
          width: 2px;
          background: ${gold};
        }
        .ot-summary-id {
          font-size: 9px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.3);
          margin: 0 0 4px;
          font-family: monospace;
        }
        .ot-summary-amount {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: 36px;
          font-weight: 300;
          color: ${gold};
          margin: 0 0 16px;
          letter-spacing: -0.02em;
          line-height: 1;
        }
        .ot-summary-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1px;
          background: rgba(255,255,255,0.06);
          margin-top: 16px;
        }
        .ot-summary-cell {
          background: rgba(255,255,255,0.03);
          padding: 14px 16px;
        }
        .ot-summary-cell-label {
          font-size: 8.5px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.3);
          margin: 0 0 5px;
        }
        .ot-summary-cell-value {
          font-size: 13px;
          font-weight: 400;
          color: rgba(255,255,255,0.85);
          margin: 0;
          letter-spacing: 0.01em;
        }

        /* Cancel button */
        .ot-cancel-btn {
          position: absolute;
          top: 24px; right: 28px;
          padding: 7px 14px;
          background: transparent;
          border: 0.5px solid rgba(192,120,120,0.35);
          color: rgba(192,120,120,0.8);
          font-size: 10px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          transition: all 0.2s ease;
          border-radius: 1px;
        }
        .ot-cancel-btn:hover {
          border-color: #c07878;
          color: #c07878;
          background: rgba(192,120,120,0.08);
        }

        /* Tracking */
        .ot-track-wrap {
          display: flex;
          align-items: flex-start;
          overflow-x: auto;
          scrollbar-width: none;
        }
        .ot-track-wrap::-webkit-scrollbar { display: none; }
        .ot-track-inner { display: flex; align-items: flex-start; min-width: 320px; width: 100%; }
        .ot-step {
          display: flex;
          flex-direction: column;
          align-items: center;
          flex: 1;
        }
        .ot-step-circle {
          width: 40px; height: 40px;
          border: 0.5px solid;
          display: flex; align-items: center; justify-content: center;
          font-size: 16px;
          transition: all 0.3s ease;
          position: relative;
          flex-shrink: 0;
          font-family: serif;
        }
        .ot-step-label {
          font-size: 10px;
          font-weight: 400;
          text-align: center;
          margin: 9px 0 3px;
          letter-spacing: 0.04em;
          font-family: 'DM Sans', sans-serif;
          white-space: nowrap;
        }
        .ot-step-desc {
          font-size: 9px;
          text-align: center;
          color: ${muted};
          letter-spacing: 0.04em;
          font-family: 'DM Sans', sans-serif;
          max-width: 72px;
          line-height: 1.5;
        }
        .ot-step-current {
          font-size: 8px;
          font-weight: 500;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: ${gold};
          margin-top: 5px;
          border: 0.5px solid ${goldBorder};
          padding: 2px 8px;
          font-family: 'DM Sans', sans-serif;
        }
        .ot-track-line {
          flex: 0.4;
          height: 0.5px;
          margin-top: 20px;
          transition: background 0.4s ease;
          flex-shrink: 0;
        }

        /* Item row */
        .ot-item-row {
          display: flex;
          gap: 14px;
          align-items: center;
          padding: 14px 0;
          border-bottom: 0.5px solid ${border};
        }
        .ot-item-row:last-child { border-bottom: none; }
        .ot-item-img {
          width: 52px; height: 52px;
          border: 0.5px solid ${border};
          background: ${surfaceAlt};
          flex-shrink: 0;
          overflow: hidden;
          display: flex; align-items: center; justify-content: center;
          padding: 6px;
        }
        .ot-item-img img { width: 100%; height: 100%; object-fit: contain; mix-blend-mode: ${isDark ? 'lighten' : 'multiply'}; }
        .ot-item-name {
          flex: 1;
          font-size: 12px;
          font-weight: 400;
          color: ${text};
          margin: 0 0 3px;
          overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
          letter-spacing: 0.01em;
        }
        .ot-item-qty {
          font-size: 10px;
          color: ${muted};
          margin: 0;
          letter-spacing: 0.04em;
        }
        .ot-item-price {
          font-size: 14px;
          font-weight: 500;
          color: ${text};
          flex-shrink: 0;
          letter-spacing: -0.01em;
          font-family: 'DM Sans', sans-serif;
        }

        /* Address grid */
        .ot-addr-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1px;
          background: ${border};
        }

        /* Info rows */
        .ot-info-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px 12px;
          border-bottom: 0.5px solid ${border};
        }
        .ot-info-row:last-child { border-bottom: none; }
        .ot-info-key {
          font-size: 11px;
          color: ${muted};
          letter-spacing: 0.04em;
        }
        .ot-info-val {
          font-size: 11px;
          font-weight: 500;
          color: ${text};
          letter-spacing: 0.02em;
        }

        /* Empty state */
        .ot-empty {
          text-align: center;
          padding: 100px 20px;
          animation: otFadeUp 0.4s ease;
        }

        /* Mobile */
        .ot-mobile-back { display: none; }

        @media (max-width: 860px) {
          .ot-wrapper {
            grid-template-columns: 1fr;
            padding: 0;
            gap: 0;
          }
          .ot-list { position: static; max-height: none; }
          .ot-mobile-back { display: flex; }
          .ot-summary-grid { grid-template-columns: 1fr 1fr; }
        }
        @media (max-width: 600px) {
          .ot-summary-grid { grid-template-columns: 1fr; }
          .ot-addr-grid    { grid-template-columns: 1fr; }
          .ot-panel        { padding: 18px 20px; }
          .ot-summary-panel { padding: 20px; }
          .ot-cancel-btn   { position: static; margin-top: 16px; width: 100%; }
          .ot-summary-amount { font-size: 28px; }
        }
      `}</style>

      <div className="ot-page">

        {/* Topbar */}
        <div className="ot-topbar">
          <button
            className="ot-back-btn"
            onClick={() => mobileView === 'detail' ? setMobileView('list') : navigate('/')}
            aria-label="Back"
          >
            <FaArrowLeft style={{ fontSize: '10px' }} />
          </button>
          <h1 className="ot-topbar-title">My Orders</h1>
          {orders.length > 0 && (
            <span className="ot-topbar-count">
              {orders.length} order{orders.length !== 1 ? 's' : ''}
            </span>
          )}
        </div>

        {/* Empty state */}
        {orders.length === 0 ? (
          <div className="ot-empty">
            <MdInventory style={{ fontSize: '40px', color: muted, marginBottom: '16px' }} />
            <h3 style={{
              fontFamily: 'Cormorant Garamond, Georgia, serif',
              fontSize: '24px', fontWeight: 300, color: text,
              margin: '0 0 8px'
            }}>
              No orders yet
            </h3>
            <p style={{ fontSize: '12px', color: muted, margin: '0 0 28px', letterSpacing: '0.04em' }}>
              Start shopping to see your orders here
            </p>
            <button
              onClick={() => navigate('/')}
              style={{
                padding: '11px 28px',
                background: 'transparent',
                border: `0.5px solid ${gold}`,
                color: gold,
                fontSize: '10px', fontWeight: 500,
                letterSpacing: '0.16em', textTransform: 'uppercase',
                cursor: 'pointer', transition: 'all 0.25s ease',
                fontFamily: 'DM Sans, sans-serif', borderRadius: '1px'
              }}
              onMouseEnter={e => { e.currentTarget.style.background = gold; e.currentTarget.style.color = '#0a0a0a' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = gold }}
            >
              Browse Products
            </button>
          </div>
        ) : (
          <div className="ot-wrapper">

            {/* ── Order List */}
            <div
              className="ot-list"
              style={{ display: mobileView === 'detail' ? 'none' : 'flex' }}
            >
              {orders.map(o => {
                const isSel = selected === o._id
                const isOCancelled = o.orderStatus === 'cancelled'
                const meta = statusMeta[o.orderStatus] || statusMeta.processing

                return (
                  <div
                    key={o._id}
                    className={`ot-order-item${isSel ? ' active' : ''}`}
                    onClick={() => { setSelected(o._id); setMobileView('detail') }}
                  >
                    <p className="ot-order-id">#{o._id.slice(-10).toUpperCase()}</p>
                    <p className="ot-order-amount">₹{o.totalAmount?.toLocaleString('en-IN')}</p>
                    <p className="ot-order-date">{fmt(o.createdAt)}</p>
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', alignItems: 'center' }}>
                      <span
                        className="ot-badge"
                        style={{ color: meta.color, background: meta.bg, borderColor: meta.border }}
                      >
                        <span className="ot-badge-dot" style={{ background: meta.color }} />
                        {meta.label}
                      </span>
                      <span style={{
                        fontSize: '9px', color: muted,
                        border: `0.5px solid ${border}`,
                        padding: '2px 6px', letterSpacing: '0.06em',
                        fontFamily: 'DM Sans, sans-serif'
                      }}>
                        {o.items?.length} item{o.items?.length !== 1 ? 's' : ''}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* ── Order Detail */}
            {order && (
              <div
                className="ot-detail"
                style={{ display: mobileView === 'list' ? 'none' : 'flex' }}
              >

                {/* Mobile back */}
                <button
                  className="ot-mobile-back"
                  onClick={() => setMobileView('list')}
                  style={{
                    alignItems: 'center', gap: '8px',
                    background: 'none',
                    border: `0.5px solid ${border}`,
                    color: muted,
                    padding: '10px 16px',
                    cursor: 'pointer',
                    fontSize: '10px', letterSpacing: '0.1em', textTransform: 'uppercase',
                    fontFamily: 'DM Sans, sans-serif', transition: 'all 0.15s'
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = gold; e.currentTarget.style.color = gold }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = border; e.currentTarget.style.color = muted }}
                >
                  <FaArrowLeft style={{ fontSize: '9px' }} /> Back to Orders
                </button>

                {/* Summary panel */}
                <div className="ot-summary-panel">
                  <p className="ot-summary-id">#{order._id.slice(-14).toUpperCase()}</p>
                  <p className="ot-summary-amount">
                    ₹{order.totalAmount?.toLocaleString('en-IN')}
                  </p>

                  {/* Status badge + cancel */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                    <span
                      className="ot-badge"
                      style={{ color: sm.color, background: sm.bg, borderColor: sm.border }}
                    >
                      <span className="ot-badge-dot" style={{ background: sm.color }} />
                      {sm.label}
                    </span>
                    {canCancel && (
                      <button
                        className="ot-cancel-btn"
                        onClick={() => setShowCancelConfirm(true)}
                      >
                        Cancel Order
                      </button>
                    )}
                  </div>

                  {/* Summary cells */}
                  <div className="ot-summary-grid">
                    {[
                      { label: 'Placed On',  value: fmt(order.createdAt)                              },
                      { label: 'Payment',    value: paymentLabel[order.paymentMethod] || order.paymentMethod },
                      { label: 'Items',      value: `${order.items?.length} item${order.items?.length !== 1 ? 's' : ''}` },
                    ].map((c, i) => (
                      <div key={i} className="ot-summary-cell">
                        <p className="ot-summary-cell-label">{c.label}</p>
                        <p className="ot-summary-cell-value">{c.value}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Cancelled banner */}
                {isCancelled && (
                  <div className="ot-panel" style={{ borderLeft: `1.5px solid rgba(192,120,120,0.5)` }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                      <span style={{
                        width: '36px', height: '36px',
                        border: '0.5px solid rgba(192,120,120,0.3)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: '#c07878', fontSize: '14px', flexShrink: 0
                      }}>✕</span>
                      <div>
                        <p style={{ margin: '0 0 4px', fontSize: '13px', fontWeight: 500, color: '#c07878', letterSpacing: '0.02em' }}>
                          Order Cancelled
                        </p>
                        <p style={{ margin: 0, fontSize: '12px', color: muted, lineHeight: 1.7, letterSpacing: '0.02em' }}>
                          Refund (if applicable) will be processed within 5–7 business days.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Tracking */}
                {!isCancelled && (
                  <div className="ot-panel">
                    <p className="ot-panel-label">Order Tracking</p>
                    <div className="ot-track-wrap">
                      <div className="ot-track-inner">
                        {statusSteps.map((s, i) => {
                          const done   = i <= step
                          const active = i === step
                          return (
                            <React.Fragment key={s.key}>
                              <div className="ot-step">
                                <div
                                  className="ot-step-circle"
                                  style={{
                                    borderColor: active ? gold : done ? 'rgba(201,168,76,0.4)' : border,
                                    background: active
                                      ? goldBg
                                      : done
                                        ? isDark ? 'rgba(201,168,76,0.04)' : 'rgba(201,168,76,0.04)'
                                        : 'transparent',
                                    color: active ? gold : done ? 'rgba(201,168,76,0.7)' : muted,
                                    boxShadow: active ? `0 0 0 5px ${goldBg}` : 'none'
                                  }}
                                >
                                  {s.icon}
                                </div>
                                <p
                                  className="ot-step-label"
                                  style={{ color: active ? gold : done ? text : muted }}
                                >
                                  {s.label}
                                </p>
                                <p className="ot-step-desc">{s.desc}</p>
                                {active && <span className="ot-step-current">Current</span>}
                              </div>
                              {i < statusSteps.length - 1 && (
                                <div
                                  className="ot-track-line"
                                  style={{
                                    background: i < step
                                      ? `linear-gradient(90deg, ${gold}, rgba(201,168,76,0.4))`
                                      : border
                                  }}
                                />
                              )}
                            </React.Fragment>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                )}

                {/* Items */}
                <div className="ot-panel">
                  <p className="ot-panel-label">
                    Items Ordered — {order.items?.length} item{order.items?.length !== 1 ? 's' : ''}
                  </p>
                  {order.items?.map((item, i) => (
                    <div key={i} className="ot-item-row">
                      <div className="ot-item-img">
                        {item.productImage
                          ? <img src={item.productImage} alt="" />
                          : <FaBox style={{ color: muted, fontSize: '16px' }} />
                        }
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p className="ot-item-name">{item.productName}</p>
                        <p className="ot-item-qty">
                          Qty: {item.quantity} × ₹{item.price?.toLocaleString('en-IN')}
                        </p>
                      </div>
                      <p className="ot-item-price">
                        ₹{(item.price * item.quantity)?.toLocaleString('en-IN')}
                      </p>
                    </div>
                  ))}
                  {/* Total row */}
                  <div style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
                    paddingTop: '16px', borderTop: `0.5px solid ${border}`, marginTop: '4px'
                  }}>
                    <span style={{ fontSize: '10px', letterSpacing: '0.14em', textTransform: 'uppercase', color: muted }}>
                      Total
                    </span>
                    <span style={{
                      fontFamily: 'Cormorant Garamond, Georgia, serif',
                      fontSize: '24px', fontWeight: 300, color: gold,
                      letterSpacing: '-0.01em'
                    }}>
                      ₹{order.totalAmount?.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                {/* Address + Info */}
                <div className="ot-addr-grid">
                  {/* Delivery address */}
                  <div className="ot-panel">
                    <p className="ot-panel-label">Delivery Address</p>
                    <p style={{ fontSize: '13px', fontWeight: 500, color: text, margin: '0 0 8px', letterSpacing: '0.01em' }}>
                      {order.deliveryAddress?.name}
                    </p>
                    <p style={{ fontSize: '12px', color: muted, margin: '0 0 2px', lineHeight: 1.7, letterSpacing: '0.02em' }}>
                      {order.deliveryAddress?.address}
                    </p>
                    <p style={{ fontSize: '12px', color: muted, margin: '0 0 2px', letterSpacing: '0.02em' }}>
                      {order.deliveryAddress?.city}, {order.deliveryAddress?.state}
                    </p>
                    <p style={{ fontSize: '12px', color: muted, margin: '0 0 10px', letterSpacing: '0.02em' }}>
                      PIN: {order.deliveryAddress?.pincode}
                    </p>
                    <p style={{ fontSize: '11px', color: gold, margin: 0, letterSpacing: '0.04em' }}>
                      {order.deliveryAddress?.phone}
                    </p>
                  </div>

                  {/* Order info */}
                  <div className="ot-panel">
                    <p className="ot-panel-label">Order Info</p>
                    <div style={{ background: surfaceAlt, border: `0.5px solid ${border}` }}>
                      {[
                        { key: 'Payment Method', val: paymentLabel[order.paymentMethod] || order.paymentMethod },
                        {
                          key: 'Payment Status',
                          val: order.paymentStatus === 'paid' ? 'Paid' : 'Pending',
                          color: order.paymentStatus === 'paid' ? '#a8c080' : '#c9a84c'
                        },
                        { key: 'Delivery', val: 'Free', color: '#a8c080' },
                      ].map((r, i) => (
                        <div key={i} className="ot-info-row">
                          <span className="ot-info-key">{r.key}</span>
                          <span className="ot-info-val" style={{ color: r.color || text }}>
                            {r.val}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

              </div>
            )}
          </div>
        )}

        {/* Cancel confirmation modal */}
        {showCancelConfirm && (
          <div
            style={{
              position: 'fixed', inset: 0, zIndex: 9999,
              background: 'rgba(0,0,0,0.78)',
              backdropFilter: 'blur(10px)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              padding: '20px'
            }}
            onClick={e => { if (e.target === e.currentTarget) setShowCancelConfirm(false) }}
          >
            <div style={{
              background: '#111110',
              border: '0.5px solid rgba(255,255,255,0.08)',
              padding: '32px',
              maxWidth: '380px', width: '100%',
              boxShadow: '0 40px 80px rgba(0,0,0,0.6)',
              animation: 'otSlideUp 0.25s ease'
            }}>
              {/* Header */}
              <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                <div style={{
                  width: '48px', height: '48px',
                  border: '0.5px solid rgba(192,120,120,0.3)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 16px',
                  color: '#c07878', fontSize: '18px'
                }}>✕</div>
                <h2 style={{
                  fontFamily: 'Cormorant Garamond, Georgia, serif',
                  fontSize: '24px', fontWeight: 300,
                  color: '#e8e4dc', margin: '0 0 8px'
                }}>
                  Cancel Order?
                </h2>
                <p style={{
                  fontSize: '12px', color: 'rgba(255,255,255,0.4)',
                  margin: 0, lineHeight: 1.7, letterSpacing: '0.03em'
                }}>
                  Order <span style={{ fontFamily: 'monospace', color: 'rgba(255,255,255,0.7)', letterSpacing: '0.06em' }}>
                    #{order?._id.slice(-10).toUpperCase()}
                  </span> will be permanently cancelled.
                </p>
              </div>

              {/* Order summary */}
              <div style={{
                border: `0.5px solid rgba(255,255,255,0.07)`,
                background: 'rgba(255,255,255,0.02)',
                padding: '16px',
                marginBottom: '16px'
              }}>
                {[
                  { label: 'Amount', value: `₹${order?.totalAmount?.toLocaleString('en-IN')}` },
                  { label: 'Items',  value: `${order?.items?.length} item${order?.items?.length !== 1 ? 's' : ''}` },
                ].map((r, i) => (
                  <div key={i} style={{
                    display: 'flex', justifyContent: 'space-between',
                    alignItems: 'baseline',
                    paddingBottom: i === 0 ? '10px' : 0,
                    borderBottom: i === 0 ? '0.5px solid rgba(255,255,255,0.05)' : 'none',
                    paddingTop: i === 1 ? '10px' : 0
                  }}>
                    <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)', letterSpacing: '0.04em' }}>{r.label}</span>
                    <span style={{ fontSize: '13px', fontWeight: 400, color: 'rgba(255,255,255,0.8)' }}>{r.value}</span>
                  </div>
                ))}
              </div>

              {/* Refund note */}
              <p style={{
                fontSize: '11px',
                color: 'rgba(201,168,76,0.7)',
                background: 'rgba(201,168,76,0.06)',
                border: '0.5px solid rgba(201,168,76,0.15)',
                padding: '10px 14px',
                margin: '0 0 22px',
                lineHeight: 1.7, letterSpacing: '0.03em'
              }}>
                Refund (if applicable) will be processed within 5–7 business days.
              </p>

              {/* Actions */}
              <div style={{ display: 'flex', gap: '1px' }}>
                <button
                  onClick={() => setShowCancelConfirm(false)}
                  style={{
                    flex: 1, padding: '13px',
                    background: 'transparent',
                    border: '0.5px solid rgba(255,255,255,0.1)',
                    color: 'rgba(255,255,255,0.45)',
                    fontSize: '10px', letterSpacing: '0.14em', textTransform: 'uppercase',
                    cursor: 'pointer', fontFamily: 'DM Sans, sans-serif',
                    transition: 'all 0.2s ease', borderRadius: '1px'
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)'; e.currentTarget.style.color = 'rgba(255,255,255,0.7)' }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = 'rgba(255,255,255,0.45)' }}
                >
                  Keep Order
                </button>
                <button
                  onClick={handleCancelOrder}
                  disabled={cancelling}
                  style={{
                    flex: 1, padding: '13px',
                    background: 'transparent',
                    border: `0.5px solid rgba(192,120,120,${cancelling ? '0.2' : '0.5'})`,
                    color: cancelling ? 'rgba(192,120,120,0.3)' : '#c07878',
                    fontSize: '10px', letterSpacing: '0.14em', textTransform: 'uppercase',
                    cursor: cancelling ? 'not-allowed' : 'pointer',
                    fontFamily: 'DM Sans, sans-serif',
                    transition: 'all 0.2s ease', borderRadius: '1px'
                  }}
                  onMouseEnter={e => { if (!cancelling) { e.currentTarget.style.background = 'rgba(192,120,120,0.12)'; e.currentTarget.style.borderColor = '#c07878' }}}
                  onMouseLeave={e => { if (!cancelling) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'rgba(192,120,120,0.5)' }}}
                >
                  {cancelling ? 'Cancelling...' : 'Confirm Cancel'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}