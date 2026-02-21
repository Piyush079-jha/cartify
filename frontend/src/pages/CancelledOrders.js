import React, { useState, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaArrowLeft, FaBox } from 'react-icons/fa'
import { MdInventory } from 'react-icons/md'
import SummaryApi from '../common'
import Context from '../context'

const paymentLabel = { card: '💳 Card', upi: '📱 UPI', netbanking: '🏦 Net Banking', cod: '🚚 COD' }
const fmt = (d) => new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })

export default function CancelledOrders() {
    const navigate = useNavigate()
    const context = useContext(Context)
    const isDark = context?.isDark || false

    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)
    const [selected, setSelected] = useState(null)
    const [mobileView, setMobileView] = useState('list')

    const t = {
        bg:         isDark ? '#0f172a' : '#f8fafc',
        card:       isDark ? '#1e293b' : '#ffffff',
        cardBorder: isDark ? '#334155' : '#e2e8f0',
        text:       isDark ? '#f1f5f9' : '#0f172a',
        textSub:    isDark ? '#94a3b8' : '#64748b',
        textMuted:  isDark ? '#64748b' : '#94a3b8',
        navBg:      isDark ? '#1e293b' : '#ffffff',
        navBorder:  isDark ? '#334155' : '#e2e8f0',
        chipBg:     isDark ? '#0f172a' : '#f1f5f9',
        chipBorder: isDark ? '#334155' : '#e2e8f0',
        itemBg:     isDark ? '#0f172a' : '#f8fafc',
        itemBorder: isDark ? '#1e293b' : '#e2e8f0',
        rowBorder:  isDark ? '#1e293b' : '#f1f5f9',
    }

    useEffect(() => { fetchCancelledOrders() }, [])

    const fetchCancelledOrders = async () => {
        try {
            const res = await fetch(SummaryApi.getOrders.url, {
                method: SummaryApi.getOrders.method,
                credentials: 'include'
            })
            if (res.status === 401) { navigate('/login'); return }
            const data = await res.json()
            if (data.success) {
                const cancelled = data.data.filter(o => o.orderStatus === 'cancelled')
                setOrders(cancelled)
                if (cancelled.length > 0) setSelected(cancelled[0]._id)
            }
        } catch (e) { console.error(e) }
        finally { setLoading(false) }
    }

    const order = orders.find(o => o._id === selected)

    if (loading) return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: t.bg }}>
            <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
            <div style={{ width: 36, height: 36, border: `3px solid ${t.cardBorder}`, borderTop: '3px solid #ef4444', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
        </div>
    )

    return (
        <div style={{ minHeight: '100vh', background: t.bg, fontFamily: "'Inter',-apple-system,sans-serif" }}>
            <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
            <style>{`
                @keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
                @keyframes spin{to{transform:rotate(360deg)}}
                .ocard{transition:all 0.18s ease;cursor:pointer;}
                .ocard:hover{border-color:#ef4444!important;transform:translateY(-1px);box-shadow:0 6px 20px rgba(239,68,68,0.18)!important;}
                .co-wrapper{max-width:1100px;margin:0 auto;padding:28px 20px;display:grid;grid-template-columns:290px 1fr;gap:22px;align-items:start;}
                @media(max-width:768px){
                    .co-wrapper{grid-template-columns:1fr!important;padding:14px 12px!important;gap:0!important;}
                    .co-mobile-back{display:flex!important;}
                }
            `}</style>

            {/* NAVBAR */}
            <div style={{ background: t.navBg, borderBottom: `1px solid ${t.navBorder}`, height: 58, display: 'flex', alignItems: 'center', padding: '0 clamp(14px,4vw,28px)', gap: 14, position: 'sticky', top: 0, zIndex: 20, boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
                <button
                    onClick={() => mobileView === 'detail' ? setMobileView('list') : navigate('/order-tracking')}
                    style={{ width: 34, height: 34, borderRadius: 9, background: t.chipBg, border: `1px solid ${t.chipBorder}`, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: t.textSub }}>
                    <FaArrowLeft size={11} />
                </button>
                <span style={{ fontWeight: 700, fontSize: '1rem', color: t.text }}>Cancelled Orders</span>
                {orders.length > 0 && (
                    <span style={{ marginLeft: 'auto', fontSize: '0.75rem', color: isDark ? '#f87171' : '#b91c1c', fontWeight: 600, background: isDark ? '#450a0a' : '#fef2f2', padding: '3px 10px', borderRadius: 20, border: `1px solid ${isDark ? '#7f1d1d' : '#fecaca'}` }}>
                        {orders.length} cancelled
                    </span>
                )}
            </div>

            {/* EMPTY STATE */}
            {orders.length === 0 ? (
                <div style={{ textAlign: 'center', padding: 'clamp(60px,15vw,100px) 20px', animation: 'fadeUp 0.4s ease' }}>
                    <MdInventory size={56} color={t.textMuted} />
                    <h3 style={{ color: t.text, marginTop: 16, fontWeight: 700, fontSize: '1.1rem' }}>No cancelled orders</h3>
                    <p style={{ color: t.textSub, fontSize: '0.85rem', marginBottom: 24 }}>You haven't cancelled any orders yet.</p>
                    <button onClick={() => navigate('/')} style={{ padding: '11px 28px', background: '#6366f1', border: 'none', borderRadius: 10, color: '#fff', fontWeight: 600, cursor: 'pointer', fontSize: '0.88rem', boxShadow: '0 4px 14px rgba(99,102,241,0.3)' }}>
                        Continue Shopping
                    </button>
                </div>
            ) : (
                <div className="co-wrapper">

                    {/* LEFT LIST */}
                    <div style={{ display: mobileView === 'detail' ? 'none' : 'flex', flexDirection: 'column', gap: 10, position: 'sticky', top: 72, maxHeight: 'calc(100vh - 90px)', overflowY: 'auto', paddingRight: 4 }}>
                        <p style={{ margin: '0 0 6px', fontSize: '0.68rem', fontWeight: 700, color: t.textMuted, textTransform: 'uppercase', letterSpacing: '0.07em' }}>Cancelled Orders</p>
                        {orders.map(o => {
                            const isSel = selected === o._id
                            return (
                                <div key={o._id} className="ocard"
                                    onClick={() => { setSelected(o._id); setMobileView('detail') }}
                                    style={{ background: t.card, borderRadius: 14, padding: '14px 16px', border: isSel ? '2px solid #ef4444' : `1.5px solid ${t.cardBorder}`, boxShadow: isSel ? '0 6px 24px rgba(239,68,68,0.2)' : isDark ? 'none' : '0 1px 3px rgba(0,0,0,0.05)', opacity: 0.9 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8, gap: 6 }}>
                                        <span style={{ fontSize: '0.68rem', color: t.textMuted, fontWeight: 600, fontFamily: 'monospace', background: t.chipBg, padding: '2px 6px', borderRadius: 5, border: `1px solid ${t.chipBorder}` }}>
                                            #{o._id.slice(-8).toUpperCase()}
                                        </span>
                                        <span style={{ fontSize: '0.65rem', padding: '3px 9px', borderRadius: 20, background: isDark ? '#450a0a' : '#fef2f2', color: isDark ? '#f87171' : '#b91c1c', fontWeight: 700, border: `1px solid ${isDark ? '#7f1d1d' : '#fecaca'}`, display: 'flex', alignItems: 'center', gap: 4 }}>
                                            <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#ef4444', display: 'inline-block' }} />
                                            Cancelled
                                        </span>
                                    </div>
                                    <p style={{ margin: '0 0 2px', fontWeight: 800, fontSize: 'clamp(0.9rem,3vw,1.05rem)', color: t.text }}>₹{o.totalAmount?.toLocaleString('en-IN')}</p>
                                    <p style={{ margin: '0 0 10px', fontSize: '0.7rem', color: t.textMuted, fontWeight: 500 }}>{fmt(o.createdAt)}</p>
                                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                                        <span style={{ fontSize: '0.68rem', color: t.textSub, background: t.chipBg, border: `1px solid ${t.chipBorder}`, borderRadius: 6, padding: '2px 8px', fontWeight: 600 }}>
                                            {paymentLabel[o.paymentMethod] || o.paymentMethod}
                                        </span>
                                        <span style={{ fontSize: '0.68rem', color: t.textMuted, background: t.itemBg, border: `1px solid ${t.itemBorder}`, borderRadius: 6, padding: '2px 8px', fontWeight: 500 }}>
                                            {o.items?.length} item{o.items?.length !== 1 ? 's' : ''}
                                        </span>
                                    </div>
                                </div>
                            )
                        })}
                    </div>

                    {/* RIGHT DETAIL */}
                    {order && (
                        <div style={{ display: mobileView === 'list' ? 'none' : 'flex', flexDirection: 'column', gap: 16, animation: 'fadeUp 0.3s ease' }}>

                            {/* Mobile back */}
                            <button className="co-mobile-back"
                                onClick={() => setMobileView('list')}
                                style={{ display: 'none', alignItems: 'center', gap: 8, background: 'none', border: `1px solid ${t.cardBorder}`, borderRadius: 10, padding: '8px 14px', color: t.textSub, cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600, width: 'fit-content', fontFamily: 'inherit' }}>
                                <FaArrowLeft size={10} /> Back to List
                            </button>

                            {/* Header — Red gradient for cancelled */}
                            <div style={{ background: 'linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)', borderRadius: 18, padding: 'clamp(16px,4vw,24px) clamp(16px,4vw,26px)', color: '#fff', boxShadow: '0 8px 30px rgba(239,68,68,0.35)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20, flexWrap: 'wrap', gap: 10 }}>
                                    <div>
                                        <p style={{ margin: '0 0 4px', fontSize: '0.68rem', fontWeight: 600, opacity: 0.75, textTransform: 'uppercase', letterSpacing: '0.07em' }}>Order ID</p>
                                        <p style={{ margin: 0, fontWeight: 700, fontSize: 'clamp(0.78rem,2.5vw,0.95rem)', fontFamily: 'monospace', letterSpacing: '0.05em' }}>#{order._id.slice(-12).toUpperCase()}</p>
                                    </div>
                                    <span style={{ fontSize: '0.72rem', padding: '5px 14px', borderRadius: 20, background: 'rgba(255,255,255,0.2)', color: '#fff', fontWeight: 700, backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.3)' }}>
                                        ❌ Cancelled
                                    </span>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14 }}>
                                    {[
                                        { label: 'Placed On', val: fmt(order.createdAt) },
                                        { label: 'Payment', val: paymentLabel[order.paymentMethod] || order.paymentMethod },
                                        { label: 'Total Amount', val: `₹${order.totalAmount?.toLocaleString('en-IN')}` },
                                    ].map(r => (
                                        <div key={r.label} style={{ background: 'rgba(255,255,255,0.15)', borderRadius: 12, padding: '12px 14px', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.2)' }}>
                                            <p style={{ margin: '0 0 3px', fontSize: '0.62rem', opacity: 0.75, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{r.label}</p>
                                            <p style={{ margin: 0, fontWeight: 700, fontSize: 'clamp(0.72rem,2vw,0.85rem)' }}>{r.val}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Cancelled info banner */}
                            <div style={{ background: isDark ? '#450a0a' : '#fef2f2', border: `1px solid ${isDark ? '#7f1d1d' : '#fecaca'}`, borderRadius: 14, padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 12 }}>
                                <span style={{ fontSize: '1.4rem' }}>❌</span>
                                <div>
                                    <p style={{ margin: '0 0 2px', fontWeight: 700, fontSize: '0.88rem', color: isDark ? '#f87171' : '#b91c1c' }}>Order Cancelled</p>
                                    <p style={{ margin: 0, fontSize: '0.78rem', color: isDark ? '#fca5a5' : '#ef4444', lineHeight: 1.5 }}>Refund (if applicable) will be processed within 5–7 business days to your original payment method.</p>
                                </div>
                            </div>

                            {/* Items */}
                            <div style={{ background: t.card, borderRadius: 16, padding: 'clamp(16px,4vw,22px) clamp(16px,4vw,26px)', border: `1px solid ${t.cardBorder}`, boxShadow: isDark ? 'none' : '0 1px 6px rgba(0,0,0,0.04)' }}>
                                <p style={{ margin: '0 0 16px', fontWeight: 700, fontSize: '0.9rem', color: t.text }}>
                                    Items Ordered <span style={{ fontWeight: 500, color: t.textMuted, fontSize: '0.8rem' }}>({order.items?.length})</span>
                                </p>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                                    {order.items?.map((item, i) => (
                                        <div key={i} style={{ display: 'flex', gap: 'clamp(8px,3vw,14px)', alignItems: 'center', padding: 'clamp(10px,3vw,12px) clamp(10px,3vw,14px)', background: t.itemBg, borderRadius: 12, border: `1px solid ${t.itemBorder}`, opacity: 0.85 }}>
                                            <div style={{ width: 'clamp(40px,10vw,52px)', height: 'clamp(40px,10vw,52px)', borderRadius: 10, background: t.card, border: `1px solid ${t.cardBorder}`, overflow: 'hidden', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                {item.productImage ? <img src={item.productImage} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain' }} /> : <FaBox color={t.textMuted} size={18} />}
                                            </div>
                                            <div style={{ flex: 1, minWidth: 0 }}>
                                                <p style={{ margin: 0, fontWeight: 600, fontSize: 'clamp(0.78rem,2.5vw,0.86rem)', color: t.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.productName}</p>
                                                <p style={{ margin: '3px 0 0', fontSize: 'clamp(0.68rem,2vw,0.73rem)', color: t.textSub, fontWeight: 500 }}>Qty: {item.quantity} × ₹{item.price?.toLocaleString('en-IN')}</p>
                                            </div>
                                            <p style={{ margin: 0, fontWeight: 700, fontSize: 'clamp(0.8rem,2.5vw,0.9rem)', color: t.text, flexShrink: 0 }}>₹{(item.price * item.quantity)?.toLocaleString('en-IN')}</p>
                                        </div>
                                    ))}
                                </div>
                                <div style={{ marginTop: 14, paddingTop: 14, borderTop: `1px solid ${t.rowBorder}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ fontWeight: 600, fontSize: '0.9rem', color: t.textSub }}>Total Amount</span>
                                    <span style={{ fontWeight: 800, fontSize: 'clamp(1rem,3vw,1.2rem)', color: isDark ? '#f87171' : '#b91c1c' }}>₹{order.totalAmount?.toLocaleString('en-IN')}</span>
                                </div>
                            </div>

                            {/* Address + Info */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                                <div style={{ background: t.card, borderRadius: 16, padding: 'clamp(14px,4vw,20px) clamp(14px,4vw,22px)', border: `1px solid ${t.cardBorder}`, boxShadow: isDark ? 'none' : '0 1px 6px rgba(0,0,0,0.04)' }}>
                                    <p style={{ margin: '0 0 14px', fontWeight: 700, fontSize: '0.88rem', color: t.text, display: 'flex', alignItems: 'center', gap: 7 }}>
                                        <span style={{ width: 28, height: 28, borderRadius: 8, background: isDark ? '#422006' : '#fef3c7', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem' }}>📍</span>
                                        Delivery Address
                                    </p>
                                    <p style={{ margin: '0 0 3px', fontWeight: 700, fontSize: '0.85rem', color: t.text }}>{order.deliveryAddress?.name}</p>
                                    <p style={{ margin: '0 0 2px', fontSize: '0.8rem', color: t.textSub, lineHeight: 1.6 }}>{order.deliveryAddress?.address}</p>
                                    <p style={{ margin: '0 0 2px', fontSize: '0.8rem', color: t.textSub }}>{order.deliveryAddress?.city}, {order.deliveryAddress?.state}</p>
                                    <p style={{ margin: '0 0 6px', fontSize: '0.8rem', color: t.textSub }}>PIN: {order.deliveryAddress?.pincode}</p>
                                    <p style={{ margin: 0, fontSize: '0.8rem', color: '#818cf8', fontWeight: 600 }}>📞 {order.deliveryAddress?.phone}</p>
                                </div>

                                <div style={{ background: t.card, borderRadius: 16, padding: 'clamp(14px,4vw,20px) clamp(14px,4vw,22px)', border: `1px solid ${t.cardBorder}`, boxShadow: isDark ? 'none' : '0 1px 6px rgba(0,0,0,0.04)' }}>
                                    <p style={{ margin: '0 0 14px', fontWeight: 700, fontSize: '0.88rem', color: t.text, display: 'flex', alignItems: 'center', gap: 7 }}>
                                        <span style={{ width: 28, height: 28, borderRadius: 8, background: isDark ? '#1e3a5f' : '#dbeafe', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem' }}>🧾</span>
                                        Order Info
                                    </p>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                                        {[
                                            { label: 'Payment Method', val: paymentLabel[order.paymentMethod] || order.paymentMethod },
                                            { label: 'Payment Status', val: order.paymentStatus === 'paid' ? '✅ Paid' : '⏳ Pending', color: order.paymentStatus === 'paid' ? (isDark ? '#4ade80' : '#15803d') : (isDark ? '#fbbf24' : '#b45309'), bg: order.paymentStatus === 'paid' ? (isDark ? '#052e16' : '#f0fdf4') : (isDark ? '#431407' : '#fffbeb') },
                                            { label: 'Order Status', val: '❌ Cancelled', color: isDark ? '#f87171' : '#b91c1c', bg: isDark ? '#450a0a' : '#fef2f2' },
                                        ].map(r => (
                                            <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 10px', background: t.itemBg, borderRadius: 8, border: `1px solid ${t.itemBorder}` }}>
                                                <span style={{ fontSize: '0.78rem', color: t.textSub, fontWeight: 500 }}>{r.label}</span>
                                                <span style={{ fontSize: '0.78rem', fontWeight: 700, color: r.color || t.text, background: r.bg, padding: r.bg ? '2px 8px' : 0, borderRadius: r.bg ? 6 : 0 }}>{r.val}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}