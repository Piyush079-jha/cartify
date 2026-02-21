import React, { useState, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaArrowLeft, FaBox } from 'react-icons/fa'
import { MdInventory } from 'react-icons/md'
import SummaryApi from '../common'
import Context from '../context'
import { toast } from 'react-toastify'

const statusSteps = [
    { key: 'processing', label: 'Order Placed', icon: '📦', desc: 'Order received' },
    { key: 'confirmed',  label: 'Confirmed',    icon: '✅', desc: 'Seller confirmed' },
    { key: 'shipped',    label: 'Shipped',       icon: '🚚', desc: 'On the way' },
    { key: 'delivered',  label: 'Delivered',     icon: '🏠', desc: 'Delivered!' },
]
const statusIndex = { processing: 0, confirmed: 1, shipped: 2, delivered: 3 }
const paymentLabel = { card: '💳 Card', upi: '📱 UPI', netbanking: '🏦 Net Banking', cod: '🚚 COD' }

const statusStyle = {
    processing: { bg: '#fff7ed', text: '#c2410c', dot: '#f97316', border: '#fed7aa', darkBg: '#431407', darkText: '#fb923c', darkBorder: '#7c2d12' },
    confirmed:  { bg: '#eff6ff', text: '#1d4ed8', dot: '#3b82f6', border: '#bfdbfe', darkBg: '#1e3a5f', darkText: '#60a5fa', darkBorder: '#1e40af' },
    shipped:    { bg: '#f0f9ff', text: '#0369a1', dot: '#0ea5e9', border: '#bae6fd', darkBg: '#0c2a3e', darkText: '#38bdf8', darkBorder: '#075985' },
    delivered:  { bg: '#f0fdf4', text: '#15803d', dot: '#22c55e', border: '#bbf7d0', darkBg: '#052e16', darkText: '#4ade80', darkBorder: '#166534' },
    cancelled:  { bg: '#fef2f2', text: '#b91c1c', dot: '#ef4444', border: '#fecaca', darkBg: '#450a0a', darkText: '#f87171', darkBorder: '#7f1d1d' },
}

const fmt = (d) => new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })

export default function OrderTracking() {
    const navigate = useNavigate()
    const context = useContext(Context)
    const isDark = context?.isDark || false

    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)
    const [selected, setSelected] = useState(null)

    // ── NEW STATE (cancel + mobile)
    const [cancelling, setCancelling] = useState(false)
    const [showCancelConfirm, setShowCancelConfirm] = useState(false)
    const [mobileView, setMobileView] = useState('list') // 'list' | 'detail'

    // Theme tokens
    const t = {
        bg:         isDark ? '#0f172a' : '#f8fafc',
        card:       isDark ? '#1e293b' : '#ffffff',
        cardBorder: isDark ? '#334155' : '#e2e8f0',
        text:       isDark ? '#f1f5f9' : '#0f172a',
        textSub:    isDark ? '#94a3b8' : '#64748b',
        textMuted:  isDark ? '#64748b' : '#94a3b8',
        navBg:      isDark ? '#1e293b' : '#ffffff',
        navBorder:  isDark ? '#334155' : '#e2e8f0',
        rowBg:      isDark ? '#0f172a' : '#f8fafc',
        rowBorder:  isDark ? '#1e293b' : '#f1f5f9',
        chipBg:     isDark ? '#0f172a' : '#f1f5f9',
        chipBorder: isDark ? '#334155' : '#e2e8f0',
        trackBg:    isDark ? '#1e293b' : '#ffffff',
        trackLine:  isDark ? '#334155' : '#e2e8f0',
        itemBg:     isDark ? '#0f172a' : '#f8fafc',
        itemBorder: isDark ? '#1e293b' : '#e2e8f0',
    }

    useEffect(() => { fetchOrders() }, [])

    const fetchOrders = async () => {
        try {
            const res = await fetch(SummaryApi.getOrders.url, { method: SummaryApi.getOrders.method, credentials: 'include' })
            if (res.status === 401) { navigate('/login'); return }
            const data = await res.json()
            if (data.success) { setOrders(data.data); if (data.data.length > 0) setSelected(data.data[0]._id) }
        } catch (e) { console.error(e) }
        finally { setLoading(false) }
    }

    // ── NEW: Cancel Order handler
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
                toast.success('Order cancelled successfully')
                setShowCancelConfirm(false)
                // Update locally — no refetch needed, order stays in list as "cancelled"
                setOrders(prev => prev.map(o => o._id === order._id ? { ...o, orderStatus: 'cancelled' } : o))
            } else {
                toast.error(data.message || 'Failed to cancel order')
            }
        } catch (e) {
            toast.error('Something went wrong')
        } finally {
            setCancelling(false)
        }
    }

    const order = orders.find(o => o._id === selected)
    const step  = order ? (statusIndex[order.orderStatus] ?? 0) : 0
    const ss    = order ? (statusStyle[order.orderStatus] || statusStyle.processing) : statusStyle.processing

    // ── NEW: cancel/cancelled helpers
    const isCancelled = order?.orderStatus === 'cancelled'
    const canCancel   = order && !isCancelled && order.orderStatus !== 'delivered' && order.orderStatus !== 'shipped'

    const getBadgeStyle = (s) => isDark
        ? { bg: s.darkBg, text: s.darkText, border: s.darkBorder, dot: s.dot }
        : { bg: s.bg,     text: s.text,     border: s.border,     dot: s.dot }

    if (loading) return (
        <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background: t.bg }}>
            <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
            <div style={{ width:36, height:36, border:`3px solid ${t.cardBorder}`, borderTop:'3px solid #6366f1', borderRadius:'50%', animation:'spin 0.7s linear infinite' }} />
        </div>
    )

    return (
        <div style={{ minHeight:'100vh', background: t.bg, fontFamily:"'Inter',-apple-system,sans-serif", transition:'background 0.3s ease' }}>
            <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet"/>
            <style>{`
                @keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
                @keyframes spin{to{transform:rotate(360deg)}}
                @keyframes slideUp{from{opacity:0;transform:translateY(40px)}to{opacity:1;transform:translateY(0)}}
                .ocard{transition:all 0.18s ease;cursor:pointer;}
                .ocard:hover{border-color:#6366f1!important;transform:translateY(-1px);box-shadow:0 6px 20px rgba(99,102,241,0.18)!important;}

                /* ── RESPONSIVE ── */
                .ot-wrapper {
                    max-width: 1100px;
                    margin: 0 auto;
                    padding: 28px 20px;
                    display: grid;
                    grid-template-columns: 290px 1fr;
                    gap: 22px;
                    align-items: start;
                }
                .ot-left  { display: flex; }
                .ot-right { display: flex; }
                .ot-mobile-back { display: none; }

                @media (max-width: 768px) {
                    .ot-wrapper {
                        grid-template-columns: 1fr !important;
                        padding: 14px 12px !important;
                        gap: 0 !important;
                    }
                    /* Mobile: show list OR detail based on mobileView state — handled via inline style below */
                    .ot-mobile-back { display: flex !important; }
                    .ot-nav-title { font-size: 0.88rem !important; }
                    .ot-header-grid { grid-template-columns: 1fr 1fr !important; }
                    .ot-addr-grid { grid-template-columns: 1fr !important; }
                    .ot-track-scroll { overflow-x: auto; }
                    .ot-track-inner { min-width: 320px; }
                }

                @media (max-width: 480px) {
                    .ot-header-grid { grid-template-columns: 1fr !important; }
                }
            `}</style>

            {/* ── NAVBAR */}
            <div style={{ background: t.navBg, borderBottom:`1px solid ${t.navBorder}`, height:58, display:'flex', alignItems:'center', padding:'0 clamp(14px,4vw,28px)', gap:14, position:'sticky', top:0, zIndex:20, boxShadow:'0 1px 3px rgba(0,0,0,0.06)', transition:'all 0.3s ease' }}>
                <button
                    onClick={() => {
                        // On mobile detail view → go back to list; otherwise go home
                        if (mobileView === 'detail') { setMobileView('list') }
                        else { navigate('/') }
                    }}
                    style={{ width:34, height:34, borderRadius:9, background: t.chipBg, border:`1px solid ${t.chipBorder}`, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color: t.textSub }}>
                    <FaArrowLeft size={11}/>
                </button>
                <span className="ot-nav-title" style={{ fontWeight:700, fontSize:'1rem', color: t.text }}>My Orders</span>
                {orders.length > 0 && (
                    <span style={{ marginLeft:'auto', fontSize:'0.75rem', color: t.textSub, fontWeight:500, background: t.chipBg, padding:'3px 10px', borderRadius:20, border:`1px solid ${t.chipBorder}` }}>
                        {orders.length} order{orders.length !== 1 ? 's' : ''}
                    </span>
                )}
            </div>

            {orders.length === 0 ? (
                <div style={{ textAlign:'center', padding:'clamp(60px,15vw,100px) 20px', animation:'fadeUp 0.4s ease' }}>
                    <MdInventory size={56} color={t.textMuted}/>
                    <h3 style={{ color: t.text, marginTop:16, fontWeight:700, fontSize:'1.1rem' }}>No orders yet</h3>
                    <p style={{ color: t.textSub, fontSize:'0.85rem', marginBottom:24 }}>Start shopping to see your orders here.</p>
                    <button onClick={() => navigate('/')} style={{ padding:'11px 28px', background:'#6366f1', border:'none', borderRadius:10, color:'#fff', fontWeight:600, cursor:'pointer', fontSize:'0.88rem', boxShadow:'0 4px 14px rgba(99,102,241,0.3)' }}>
                        Start Shopping
                    </button>
                </div>
            ) : (
                <div className="ot-wrapper">

                    {/* ── LEFT LIST ── hidden on mobile when viewing detail */}
                    <div className="ot-left" style={{ flexDirection:'column', gap:10, position:'sticky', top:72, maxHeight:'calc(100vh - 90px)', overflowY:'auto', paddingRight:4,
                        // Mobile: hide list when showing detail
                        display: mobileView === 'detail' ? 'none' : 'flex'
                    }}>
                        <p style={{ margin:'0 0 6px', fontSize:'0.68rem', fontWeight:700, color: t.textMuted, textTransform:'uppercase', letterSpacing:'0.07em' }}>All Orders</p>
                        {orders.map(o => {
                            const isSel = selected === o._id
                            const isOCancelled = o.orderStatus === 'cancelled'
                            const s2 = statusStyle[o.orderStatus] || statusStyle.processing
                            const b2 = getBadgeStyle(s2)
                            return (
                                <div key={o._id} className="ocard" onClick={() => { setSelected(o._id); setMobileView('detail') }}
                                    style={{ background: t.card, borderRadius:14, padding:'14px 16px', border: isSel ? '2px solid #6366f1' : `1.5px solid ${t.cardBorder}`, boxShadow: isSel ? '0 6px 24px rgba(99,102,241,0.2)' : isDark ? 'none' : '0 1px 3px rgba(0,0,0,0.05)', transition:'all 0.3s', opacity: isOCancelled ? 0.8 : 1 }}>
                                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:8, gap:6 }}>
                                        <span style={{ fontSize:'0.68rem', color: t.textMuted, fontWeight:600, fontFamily:'monospace', background: t.chipBg, padding:'2px 6px', borderRadius:5, border:`1px solid ${t.chipBorder}` }}>
                                            #{o._id.slice(-8).toUpperCase()}
                                        </span>
                                        <span style={{ fontSize:'0.65rem', padding:'3px 9px', borderRadius:20, background: b2.bg, color: b2.text, fontWeight:700, textTransform:'capitalize', border:`1px solid ${b2.border}`, display:'flex', alignItems:'center', gap:4, flexShrink:0 }}>
                                            <span style={{ width:5, height:5, borderRadius:'50%', background: b2.dot, display:'inline-block' }}/>
                                            {isOCancelled ? 'Cancelled' : o.orderStatus}
                                        </span>
                                    </div>
                                    <p style={{ margin:'0 0 2px', fontWeight:800, fontSize:'clamp(0.9rem,3vw,1.05rem)', color: t.text }}>₹{o.totalAmount?.toLocaleString('en-IN')}</p>
                                    <p style={{ margin:'0 0 10px', fontSize:'0.7rem', color: t.textMuted, fontWeight:500 }}>{fmt(o.createdAt)}</p>
                                    <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
                                        <span style={{ fontSize:'0.68rem', color: t.textSub, background: t.chipBg, border:`1px solid ${t.chipBorder}`, borderRadius:6, padding:'2px 8px', fontWeight:600 }}>
                                            {paymentLabel[o.paymentMethod] || o.paymentMethod}
                                        </span>
                                        <span style={{ fontSize:'0.68rem', color: t.textMuted, background: t.rowBg, border:`1px solid ${t.rowBorder}`, borderRadius:6, padding:'2px 8px', fontWeight:500 }}>
                                            {o.items?.length} item{o.items?.length !== 1 ? 's' : ''}
                                        </span>
                                        {/* ── NEW: cancelled tag on card */}
                                        {isOCancelled && (
                                            <span style={{ fontSize:'0.62rem', color: isDark ? '#f87171' : '#b91c1c', background: isDark ? '#450a0a' : '#fef2f2', border:`1px solid ${isDark ? '#7f1d1d' : '#fecaca'}`, borderRadius:6, padding:'2px 7px', fontWeight:700 }}>
                                                ❌ Cancelled
                                            </span>
                                        )}
                                    </div>
                                </div>
                            )
                        })}
                    </div>

                    {/* ── RIGHT DETAIL ── hidden on mobile when viewing list */}
                    {order && (
                        <div className="ot-right" style={{ flexDirection:'column', gap:16, animation:'fadeUp 0.3s ease',
                            // Mobile: hide detail when showing list
                            display: mobileView === 'list' ? 'none' : 'flex'
                        }}>

                            {/* Mobile back button */}
                            <button className="ot-mobile-back"
                                onClick={() => setMobileView('list')}
                                style={{ display:'none', alignItems:'center', gap:8, background:'none', border:`1px solid ${t.cardBorder}`, borderRadius:10, padding:'8px 14px', color: t.textSub, cursor:'pointer', fontSize:'0.8rem', fontWeight:600, width:'fit-content', fontFamily:'inherit' }}>
                                <FaArrowLeft size={10}/> Back to Orders
                            </button>

                            {/* ── Gradient Header */}
                            <div style={{ background: isCancelled ? 'linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)' : 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)', borderRadius:18, padding:'clamp(16px,4vw,24px) clamp(16px,4vw,26px)', color:'#fff', boxShadow: isCancelled ? '0 8px 30px rgba(239,68,68,0.35)' : '0 8px 30px rgba(99,102,241,0.35)' }}>
                                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:20, flexWrap:'wrap', gap:'10px' }}>
                                    <div>
                                        <p style={{ margin:'0 0 4px', fontSize:'0.68rem', fontWeight:600, opacity:0.75, textTransform:'uppercase', letterSpacing:'0.07em' }}>Order ID</p>
                                        <p style={{ margin:0, fontWeight:700, fontSize:'clamp(0.78rem,2.5vw,0.95rem)', fontFamily:'monospace', letterSpacing:'0.05em' }}>#{order._id.slice(-12).toUpperCase()}</p>
                                    </div>
                                    <div style={{ display:'flex', gap:8, alignItems:'center', flexWrap:'wrap' }}>
                                        <span style={{ fontSize:'0.72rem', padding:'5px 14px', borderRadius:20, background:'rgba(255,255,255,0.2)', color:'#fff', fontWeight:700, textTransform:'capitalize', backdropFilter:'blur(8px)', border:'1px solid rgba(255,255,255,0.3)' }}>
                                            {isCancelled ? '❌ Cancelled' : order.orderStatus}
                                        </span>
                                        {/* ── NEW: Cancel Order button in header */}
                                        {canCancel && (
                                            <button onClick={() => setShowCancelConfirm(true)}
                                                style={{ fontSize:'0.72rem', padding:'5px 14px', borderRadius:20, background:'rgba(255,255,255,0.15)', color:'#fff', fontWeight:700, border:'1.5px solid rgba(255,255,255,0.5)', cursor:'pointer', backdropFilter:'blur(8px)', transition:'all 0.2s', fontFamily:'inherit' }}
                                                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.45)'; e.currentTarget.style.borderColor = '#fff' }}
                                                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.15)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.5)' }}>
                                                ✕ Cancel Order
                                            </button>
                                        )}
                                    </div>
                                </div>
                                <div className="ot-header-grid" style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:14 }}>
                                    {[
                                        { label:'Placed On', val: fmt(order.createdAt) },
                                        { label:'Payment', val: paymentLabel[order.paymentMethod] || order.paymentMethod },
                                        { label:'Total Amount', val: `₹${order.totalAmount?.toLocaleString('en-IN')}` },
                                    ].map(r => (
                                        <div key={r.label} style={{ background:'rgba(255,255,255,0.15)', borderRadius:12, padding:'12px 14px', backdropFilter:'blur(8px)', border:'1px solid rgba(255,255,255,0.2)' }}>
                                            <p style={{ margin:'0 0 3px', fontSize:'0.62rem', opacity:0.75, fontWeight:600, textTransform:'uppercase', letterSpacing:'0.05em' }}>{r.label}</p>
                                            <p style={{ margin:0, fontWeight:700, fontSize:'clamp(0.72rem,2vw,0.85rem)' }}>{r.val}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* ── NEW: Cancelled info banner */}
                            {isCancelled && (
                                <div style={{ background: isDark ? '#450a0a' : '#fef2f2', border:`1px solid ${isDark ? '#7f1d1d' : '#fecaca'}`, borderRadius:14, padding:'16px 20px', display:'flex', alignItems:'center', gap:12 }}>
                                    <span style={{ fontSize:'1.4rem' }}>❌</span>
                                    <div>
                                        <p style={{ margin:'0 0 2px', fontWeight:700, fontSize:'0.88rem', color: isDark ? '#f87171' : '#b91c1c' }}>Order Cancelled</p>
                                        <p style={{ margin:0, fontSize:'0.78rem', color: isDark ? '#fca5a5' : '#ef4444', lineHeight:1.5 }}>This order has been cancelled. Refund (if applicable) will be processed within 5–7 business days.</p>
                                    </div>
                                </div>
                            )}

                            {/* ── Tracking (hidden if cancelled) */}
                            {!isCancelled && (
                                <div style={{ background: t.card, borderRadius:16, padding:'24px 26px', border:`1px solid ${t.cardBorder}`, boxShadow: isDark ? 'none' : '0 1px 6px rgba(0,0,0,0.04)', transition:'all 0.3s' }}>
                                    <p style={{ margin:'0 0 24px', fontWeight:700, fontSize:'0.9rem', color: t.text }}>Order Tracking</p>
                                    <div className="ot-track-scroll">
                                        <div className="ot-track-inner" style={{ display:'flex', alignItems:'flex-start' }}>
                                            {statusSteps.map((s, i) => {
                                                const done   = i <= step
                                                const active = i === step
                                                return (
                                                    <React.Fragment key={s.key}>
                                                        <div style={{ display:'flex', flexDirection:'column', alignItems:'center', flex:1 }}>
                                                            <div style={{ width:'clamp(36px,8vw,46px)', height:'clamp(36px,8vw,46px)', borderRadius:'50%', background: active ? 'linear-gradient(135deg,#6366f1,#8b5cf6)' : done ? (isDark ? '#312e81' : '#ede9fe') : t.chipBg, border: active ? '2px solid #6366f1' : done ? `2px solid ${isDark ? '#4f46e5' : '#a5b4fc'}` : `2px solid ${t.cardBorder}`, display:'flex', alignItems:'center', justifyContent:'center', fontSize: active ? 'clamp(0.9rem,3vw,1.2rem)' : 'clamp(0.8rem,2.5vw,1rem)', boxShadow: active ? '0 0 0 7px rgba(99,102,241,0.15)' : 'none', transition:'all 0.3s' }}>
                                                                {s.icon}
                                                            </div>
                                                            <p style={{ margin:'9px 0 2px', fontSize:'clamp(0.6rem,1.8vw,0.73rem)', fontWeight: active ? 700 : done ? 600 : 500, color: active ? '#818cf8' : done ? t.text : t.textMuted, textAlign:'center', whiteSpace:'nowrap' }}>{s.label}</p>
                                                            <p style={{ margin:0, fontSize:'clamp(0.55rem,1.5vw,0.63rem)', color: done ? t.textSub : t.textMuted, textAlign:'center', maxWidth:80, lineHeight:1.4 }}>{s.desc}</p>
                                                            {active && <span style={{ marginTop:6, fontSize:'0.6rem', padding:'2px 9px', background: isDark ? '#312e81' : '#ede9fe', color: isDark ? '#a5b4fc' : '#6366f1', borderRadius:20, fontWeight:700, border:`1px solid ${isDark ? '#4338ca' : '#c4b5fd'}` }}>Current</span>}
                                                        </div>
                                                        {i < statusSteps.length - 1 && (
                                                            <div style={{ flex:0.5, height:3, background: i < step ? 'linear-gradient(90deg,#6366f1,#8b5cf6)' : t.trackLine, marginTop:22, borderRadius:4, transition:'all 0.4s' }}/>
                                                        )}
                                                    </React.Fragment>
                                                )
                                            })}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* ── Items */}
                            <div style={{ background: t.card, borderRadius:16, padding:'clamp(16px,4vw,22px) clamp(16px,4vw,26px)', border:`1px solid ${t.cardBorder}`, boxShadow: isDark ? 'none' : '0 1px 6px rgba(0,0,0,0.04)', transition:'all 0.3s' }}>
                                <p style={{ margin:'0 0 16px', fontWeight:700, fontSize:'0.9rem', color: t.text }}>
                                    Items Ordered <span style={{ fontWeight:500, color: t.textMuted, fontSize:'0.8rem' }}>({order.items?.length})</span>
                                </p>
                                <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                                    {order.items?.map((item, i) => (
                                        <div key={i} style={{ display:'flex', gap:'clamp(8px,3vw,14px)', alignItems:'center', padding:'clamp(10px,3vw,12px) clamp(10px,3vw,14px)', background: t.itemBg, borderRadius:12, border:`1px solid ${t.itemBorder}` }}>
                                            <div style={{ width:'clamp(40px,10vw,52px)', height:'clamp(40px,10vw,52px)', borderRadius:10, background: t.card, border:`1px solid ${t.cardBorder}`, overflow:'hidden', flexShrink:0, display:'flex', alignItems:'center', justifyContent:'center' }}>
                                                {item.productImage ? <img src={item.productImage} alt="" style={{ width:'100%', height:'100%', objectFit:'contain' }}/> : <FaBox color={t.textMuted} size={18}/>}
                                            </div>
                                            <div style={{ flex:1, minWidth:0 }}>
                                                <p style={{ margin:0, fontWeight:600, fontSize:'clamp(0.78rem,2.5vw,0.86rem)', color: t.text, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{item.productName}</p>
                                                <p style={{ margin:'3px 0 0', fontSize:'clamp(0.68rem,2vw,0.73rem)', color: t.textSub, fontWeight:500 }}>Qty: {item.quantity} &times; ₹{item.price?.toLocaleString('en-IN')}</p>
                                            </div>
                                            <p style={{ margin:0, fontWeight:700, fontSize:'clamp(0.8rem,2.5vw,0.9rem)', color: t.text, flexShrink:0 }}>₹{(item.price * item.quantity)?.toLocaleString('en-IN')}</p>
                                        </div>
                                    ))}
                                </div>
                                <div style={{ marginTop:14, paddingTop:14, borderTop:`1px solid ${t.rowBorder}`, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                                    <span style={{ fontWeight:600, fontSize:'0.9rem', color: t.textSub }}>Total Amount</span>
                                    <span style={{ fontWeight:800, fontSize:'clamp(1rem,3vw,1.2rem)', color:'#818cf8' }}>₹{order.totalAmount?.toLocaleString('en-IN')}</span>
                                </div>
                            </div>

                            {/* ── Address + Info */}
                            <div className="ot-addr-grid" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
                                {/* Address */}
                                <div style={{ background: t.card, borderRadius:16, padding:'clamp(14px,4vw,20px) clamp(14px,4vw,22px)', border:`1px solid ${t.cardBorder}`, boxShadow: isDark ? 'none' : '0 1px 6px rgba(0,0,0,0.04)', transition:'all 0.3s' }}>
                                    <p style={{ margin:'0 0 14px', fontWeight:700, fontSize:'0.88rem', color: t.text, display:'flex', alignItems:'center', gap:7 }}>
                                        <span style={{ width:28, height:28, borderRadius:8, background: isDark ? '#422006' : '#fef3c7', display:'inline-flex', alignItems:'center', justifyContent:'center', fontSize:'0.85rem' }}>📍</span>
                                        Delivery Address
                                    </p>
                                    <p style={{ margin:'0 0 3px', fontWeight:700, fontSize:'0.85rem', color: t.text }}>{order.deliveryAddress?.name}</p>
                                    <p style={{ margin:'0 0 2px', fontSize:'0.8rem', color: t.textSub, lineHeight:1.6 }}>{order.deliveryAddress?.address}</p>
                                    <p style={{ margin:'0 0 2px', fontSize:'0.8rem', color: t.textSub }}>{order.deliveryAddress?.city}, {order.deliveryAddress?.state}</p>
                                    <p style={{ margin:'0 0 6px', fontSize:'0.8rem', color: t.textSub }}>PIN: {order.deliveryAddress?.pincode}</p>
                                    <p style={{ margin:0, fontSize:'0.8rem', color:'#818cf8', fontWeight:600 }}>📞 {order.deliveryAddress?.phone}</p>
                                </div>

                                {/* Order Info */}
                                <div style={{ background: t.card, borderRadius:16, padding:'clamp(14px,4vw,20px) clamp(14px,4vw,22px)', border:`1px solid ${t.cardBorder}`, boxShadow: isDark ? 'none' : '0 1px 6px rgba(0,0,0,0.04)', transition:'all 0.3s' }}>
                                    <p style={{ margin:'0 0 14px', fontWeight:700, fontSize:'0.88rem', color: t.text, display:'flex', alignItems:'center', gap:7 }}>
                                        <span style={{ width:28, height:28, borderRadius:8, background: isDark ? '#1e3a5f' : '#dbeafe', display:'inline-flex', alignItems:'center', justifyContent:'center', fontSize:'0.85rem' }}>🧾</span>
                                        Order Info
                                    </p>
                                    <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                                        {[
                                            { label:'Payment Method', val: paymentLabel[order.paymentMethod] || order.paymentMethod },
                                            { label:'Payment Status', val: order.paymentStatus === 'paid' ? '✅ Paid' : '⏳ Pending', color: order.paymentStatus === 'paid' ? (isDark ? '#4ade80' : '#15803d') : (isDark ? '#fbbf24' : '#b45309'), bg: order.paymentStatus === 'paid' ? (isDark ? '#052e16' : '#f0fdf4') : (isDark ? '#431407' : '#fffbeb') },
                                            { label:'Delivery Charge', val:'🚚 FREE', color: isDark ? '#4ade80' : '#15803d' },
                                        ].map(r => (
                                            <div key={r.label} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'8px 10px', background: t.itemBg, borderRadius:8, border:`1px solid ${t.itemBorder}` }}>
                                                <span style={{ fontSize:'0.78rem', color: t.textSub, fontWeight:500 }}>{r.label}</span>
                                                <span style={{ fontSize:'0.78rem', fontWeight:700, color: r.color || t.text, background: r.bg, padding: r.bg ? '2px 8px' : 0, borderRadius: r.bg ? 6 : 0 }}>{r.val}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                        </div>
                    )}
                </div>
            )}

            {/* ── NEW: Cancel Confirm Modal (Flipkart/Amazon style) ── */}
            {showCancelConfirm && (
                <div
                    onClick={(e) => { if (e.target === e.currentTarget) setShowCancelConfirm(false) }}
                    style={{ position:'fixed', inset:0, zIndex:9999, background:'rgba(0,0,0,0.6)', backdropFilter:'blur(6px)', display:'flex', alignItems:'center', justifyContent:'center', padding:'20px' }}>
                    <div style={{ background: t.card, borderRadius:20, padding:'clamp(20px,5vw,32px)', width:'100%', maxWidth:420, boxShadow:'0 24px 60px rgba(0,0,0,0.3)', border:`1px solid ${t.cardBorder}`, animation:'slideUp 0.25s ease' }}>
                        <div style={{ textAlign:'center', marginBottom:20 }}>
                            <div style={{ fontSize:'3rem', marginBottom:10 }}>🚫</div>
                            <h2 style={{ margin:'0 0 8px', fontWeight:800, fontSize:'1.1rem', color: t.text }}>Cancel this order?</h2>
                            <p style={{ margin:0, fontSize:'0.85rem', color: t.textSub, lineHeight:1.6 }}>
                                Order <strong style={{ fontFamily:'monospace', color: t.text }}>#{order?._id.slice(-8).toUpperCase()}</strong> will be cancelled. This cannot be undone.
                            </p>
                        </div>

                        {/* Order summary inside modal */}
                        <div style={{ background: t.itemBg, borderRadius:12, padding:'12px 14px', marginBottom:16, border:`1px solid ${t.itemBorder}` }}>
                            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:6 }}>
                                <span style={{ fontSize:'0.78rem', color: t.textSub }}>Amount</span>
                                <span style={{ fontWeight:700, color: t.text }}>₹{order?.totalAmount?.toLocaleString('en-IN')}</span>
                            </div>
                            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                                <span style={{ fontSize:'0.78rem', color: t.textSub }}>Items</span>
                                <span style={{ fontWeight:600, color: t.text, fontSize:'0.78rem' }}>{order?.items?.length} item{order?.items?.length !== 1 ? 's' : ''}</span>
                            </div>
                        </div>

                        <p style={{ margin:'0 0 20px', fontSize:'0.78rem', color: isDark ? '#fbbf24' : '#b45309', background: isDark ? '#431407' : '#fffbeb', padding:'10px 14px', borderRadius:10, border:`1px solid ${isDark ? '#78350f' : '#fde68a'}`, lineHeight:1.5 }}>
                            💰 Refund (if applicable) will be processed within 5–7 business days to your original payment method.
                        </p>

                        <div style={{ display:'flex', gap:10 }}>
                            <button
                                onClick={() => setShowCancelConfirm(false)}
                                style={{ flex:1, padding:'12px', background:'none', border:`1.5px solid ${t.cardBorder}`, borderRadius:12, color: t.textSub, fontWeight:600, fontSize:'0.88rem', cursor:'pointer', fontFamily:'inherit', transition:'all 0.2s' }}
                                onMouseEnter={e => e.currentTarget.style.borderColor = '#6366f1'}
                                onMouseLeave={e => e.currentTarget.style.borderColor = t.cardBorder}>
                                Keep Order
                            </button>
                            <button
                                onClick={handleCancelOrder}
                                disabled={cancelling}
                                style={{ flex:1, padding:'12px', background: cancelling ? '#9ca3af' : 'linear-gradient(135deg,#ef4444,#b91c1c)', border:'none', borderRadius:12, color:'#fff', fontWeight:700, fontSize:'0.88rem', cursor: cancelling ? 'not-allowed' : 'pointer', fontFamily:'inherit', transition:'all 0.2s', boxShadow: cancelling ? 'none' : '0 4px 14px rgba(239,68,68,0.35)' }}>
                                {cancelling ? '⏳ Cancelling...' : 'Yes, Cancel'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}