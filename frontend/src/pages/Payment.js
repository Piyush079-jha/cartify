import React, { useState, useContext } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import SummaryApi from '../common'
import { FaLock, FaCheckCircle, FaArrowLeft, FaShieldAlt } from 'react-icons/fa'
import { MdLocalOffer } from 'react-icons/md'
import Context from '../context'

const Payment = () => {
    const location = useLocation()
    const navigate = useNavigate()
    const { cartItems = [], totalAmount = 0 } = location.state || {}
    const { isDark } = useContext(Context)

    const [step, setStep] = useState(1)
    const [paymentMethod, setPaymentMethod] = useState('card')
    const [loading, setLoading] = useState(false)
    const [address, setAddress] = useState({ name: '', phone: '', address: '', city: '', state: '', pincode: '' })
    const [cardDetails, setCardDetails] = useState({ number: '', expiry: '', cvv: '', name: '' })
    const [upiId, setUpiId] = useState('')
    const [orderId, setOrderId] = useState('')
    const [selectedBank, setSelectedBank] = useState('')
    const [showSummary, setShowSummary] = useState(false)

    const handleAddressChange = (e) => setAddress({ ...address, [e.target.name]: e.target.value })

    const handleAddressSubmit = () => {
        const { name, phone, address: addr, city, state, pincode } = address
        if (!name || !phone || !addr || !city || !state || !pincode) { toast.error('Please fill all fields'); return }
        if (phone.length !== 10) { toast.error('Enter valid 10-digit phone'); return }
        setStep(2)
    }

    const handlePlaceOrder = async () => {
        if (paymentMethod === 'card' && (!cardDetails.number || !cardDetails.expiry || !cardDetails.cvv || !cardDetails.name)) { toast.error('Please fill card details'); return }
        if (paymentMethod === 'upi' && !upiId) { toast.error('Please enter UPI ID'); return }
        if (paymentMethod === 'netbanking' && !selectedBank) { toast.error('Please select a bank'); return }

        setLoading(true)
        try {
            const items = cartItems.map(item => ({
                productId: item?.productId?._id,
                productName: item?.productId?.productName,
                productImage: item?.productId?.productImage?.[0],
                quantity: item?.quantity,
                price: item?.productId?.sellingPrice
            }))

            console.log('Sending order:', { items, totalAmount, deliveryAddress: address, paymentMethod })

            const response = await fetch(SummaryApi.createOrder.url, {
                method: SummaryApi.createOrder.method,
                credentials: 'include',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify({ items, totalAmount, deliveryAddress: address, paymentMethod })
            })

            console.log('Response status:', response.status)

            if (response.status === 401) {
                toast.error('Please login first!')
                navigate('/login')
                return
            }

            const data = await response.json()
            console.log('Response data:', data)

            if (data.success) { setOrderId(data.orderId); setStep(3) }
            else toast.error(data.message || 'Order failed')
        } catch (err) {
            console.error('Order error:', err)
            toast.error('Cannot connect to server. Is backend running?')
        } finally {
            setLoading(false)
        }
    }

    const payMethods = [
        { id: 'card',       icon: '💳', label: 'Credit / Debit Card' },
        { id: 'upi',        icon: '📱', label: 'UPI Payment' },
        { id: 'netbanking', icon: '🏦', label: 'Net Banking' },
        { id: 'cod',        icon: '🚚', label: 'Cash on Delivery' }
    ]

    const banks = ['SBI', 'HDFC', 'ICICI', 'Axis', 'Kotak', 'PNB', 'Yes Bank', 'BOB']

    const bg          = isDark ? '#111111' : '#f8f9fc'
    const cardBg      = isDark ? '#1e1e1e' : '#fff'
    const cardBorder  = isDark ? '#2e2e2e' : '#e8eaf0'
    const textPri     = isDark ? '#f0f0f0' : '#1a1a2e'
    const textSec     = isDark ? '#888888' : '#6b7280'
    const inputBg     = isDark ? '#2a2a2a' : '#f8f9fc'
    const inputBorder = isDark ? '#3a3a3a' : '#e8eaf0'
    const methodBg    = isDark ? '#2a2a2a' : '#f8f9fc'
    const methodSelBg = isDark ? '#2a2050' : '#f5f3ff'
    const itemBg      = isDark ? '#2a2a2a' : '#f8f9fc'
    const totalBg     = isDark ? '#2a2a2a' : '#f8f9fc'

    const inputStyle = {
        width: '100%', background: inputBg, border: `1.5px solid ${inputBorder}`,
        borderRadius: '10px', padding: '12px 14px', color: textPri,
        fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box',
        fontFamily: 'inherit', transition: 'all 0.2s'
    }

    const labelStyle = {
        display: 'block', fontSize: '0.72rem', fontWeight: 700,
        color: textSec, marginBottom: '6px', letterSpacing: '0.05em',
        textTransform: 'uppercase'
    }

    // ── Success ──
    if (step === 3) return (
        <div style={{ minHeight: '100vh', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', fontFamily: "'Inter', sans-serif" }}>
            <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet"/>
            <style>{`@keyframes popIn{0%{transform:scale(0.8);opacity:0}100%{transform:scale(1);opacity:1}} @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}`}</style>
            <div style={{ background: cardBg, borderRadius: '20px', padding: 'clamp(28px,6vw,52px) clamp(20px,6vw,44px)', maxWidth: '440px', width: '100%', textAlign: 'center', boxShadow: '0 4px 40px rgba(0,0,0,0.08)', animation: 'fadeUp 0.5s ease' }}>
                <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'linear-gradient(135deg, #10b981, #059669)', margin: '0 auto 24px', display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'popIn 0.5s cubic-bezier(0.175,0.885,0.32,1.275)', boxShadow: '0 8px 24px rgba(16,185,129,0.3)' }}>
                    <FaCheckCircle size={36} color="#fff"/>
                </div>
                <h1 style={{ color: textPri, fontSize: 'clamp(1.4rem,5vw,1.8rem)', fontWeight: 800, margin: '0 0 8px' }}>Order Confirmed!</h1>
                <p style={{ color: textSec, fontSize: '0.95rem', margin: '0 0 28px', lineHeight: 1.6 }}>
                    Thank you for your purchase. We'll send you a confirmation shortly.
                </p>
                <div style={{ background: isDark ? '#1a2e1a' : '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '12px', padding: '14px 18px', marginBottom: '28px', textAlign: 'left' }}>
                    <p style={{ color: textSec, fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>Order ID</p>
                    <p style={{ color: '#059669', fontWeight: 700, fontSize: '0.88rem', wordBreak: 'break-all', margin: 0 }}>#{orderId}</p>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button onClick={() => navigate('/')}
                        style={{ flex: 1, padding: '13px', background: '#1a1a2e', border: 'none', borderRadius: '10px', color: '#fff', fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer', fontFamily: 'inherit' }}>
                        Continue Shopping
                    </button>
                </div>
            </div>
        </div>
    )

    return (
        <div style={{ minHeight: '100vh', background: bg, fontFamily: "'Inter', sans-serif", color: textPri, paddingBottom: '60px' }}>
            <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet"/>
            <style>{`
                @keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
                @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
                .inp:focus{border-color:#667eea!important;background:${isDark ? '#2e2e4e' : '#fff'}!important;box-shadow:0 0 0 3px rgba(102,126,234,0.1)!important}
                .pay-method:hover{border-color:#667eea!important;background:${methodSelBg}!important}
                .bank-item:hover{border-color:#667eea!important;background:${methodSelBg}!important}
                .upi-app:hover{border-color:#667eea!important;background:${methodSelBg}!important}
                .proceed-btn:hover:not(:disabled){background:#4f46e5!important;box-shadow:0 6px 20px rgba(102,126,234,0.35)!important;transform:translateY(-1px)}
                .back-btn:hover{background:${isDark ? '#2a2a2a' : '#f1f2f6'}!important}
                .sec-btn:hover{background:${isDark ? '#2a2a2a' : '#f1f2f6'}!important}

                .pay-grid { display:grid; grid-template-columns:1fr 360px; gap:24px; align-items:start; }
                .pay-summary-toggle { display:none; }
                .mobile-summary { display:block; }
                .addr-grid { display:grid; grid-template-columns:1fr 1fr; gap:16px; }
                .card-grid { display:grid; grid-template-columns:1fr 1fr; gap:14px; }
                .bank-grid { display:grid; grid-template-columns:1fr 1fr; gap:10px; }
                .upi-grid  { display:grid; grid-template-columns:repeat(4,1fr); gap:10px; }
                .trust-grid { display:grid; grid-template-columns:1fr 1fr; gap:8px; }
                .steps-row { display:flex; align-items:center; gap:8px; margin-bottom:28px; }
                .step-label { font-size:0.78rem; white-space:nowrap; }

                @media(max-width:768px){
                    .pay-grid { grid-template-columns:1fr!important; }
                    .pay-right { order:-1; }
                    .pay-summary-toggle { display:flex!important; align-items:center; justify-content:space-between; padding:12px 16px; background:#f5f3ff; border:1.5px solid #e0d9ff; border-radius:12px; margin-bottom:16px; cursor:pointer; font-size:0.88rem; font-weight:700; color:#667eea; width:100%; font-family:inherit; }
                    .mobile-summary { display:none; }
                    .mobile-summary.open { display:block!important; }
                    .addr-grid { grid-template-columns:1fr!important; }
                    .step-label { display:none; }
                    .steps-row { gap:4px; }
                    .pay-sticky { position:static!important; }
                }
                @media(max-width:480px){
                    .card-grid { grid-template-columns:1fr!important; }
                    .upi-grid  { grid-template-columns:repeat(2,1fr)!important; }
                }
            `}</style>

            {/* Top Nav Bar */}
            <div style={{ background: cardBg, borderBottom: `1px solid ${cardBorder}`, padding: '16px 0' }}>
                <div style={{ maxWidth: '1050px', margin: '0 auto', padding: '0 clamp(12px,4vw,20px)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <button className="back-btn" onClick={() => step === 1 ? navigate('/cart') : setStep(1)}
                            style={{ width: 36, height: 36, borderRadius: '8px', background: inputBg, border: `1px solid ${cardBorder}`, color: textPri, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}>
                            <FaArrowLeft size={12}/>
                        </button>
                        <span style={{ fontWeight: 700, fontSize: 'clamp(0.88rem,3vw,1.05rem)', color: textPri }}>Cartify Checkout</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#10b981', fontSize: '0.78rem', fontWeight: 600 }}>
                        <FaLock size={11}/> Secure Checkout
                    </div>
                </div>
            </div>

            <div style={{ maxWidth: '1050px', margin: '0 auto', padding: 'clamp(16px,4vw,32px) clamp(12px,4vw,20px)' }}>

                {/* Steps */}
                <div className="steps-row">
                    {['Delivery Address', 'Payment', 'Confirmation'].map((s, i) => (
                        <React.Fragment key={i}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
                                <div style={{ width: 26, height: 26, borderRadius: '50%', background: step > i ? '#667eea' : step === i + 1 ? '#667eea' : isDark ? '#2e2e2e' : '#e8eaf0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem', fontWeight: 700, color: step >= i + 1 ? '#fff' : isDark ? '#555' : '#9ca3af', transition: 'all 0.3s' }}>
                                    {step > i + 1 ? '✓' : i + 1}
                                </div>
                                <span className="step-label" style={{ fontWeight: step === i + 1 ? 700 : 500, color: step === i + 1 ? '#667eea' : step > i + 1 ? textPri : textSec }}>{s}</span>
                            </div>
                            {i < 2 && <div style={{ flex: 1, height: 1, background: step > i + 1 ? '#667eea' : isDark ? '#2e2e2e' : '#e8eaf0', transition: 'all 0.3s', minWidth: 8 }}/>}
                        </React.Fragment>
                    ))}
                </div>

                {/* Grid */}
                <div className="pay-grid">

                    {/* LEFT */}
                    <div style={{ animation: 'fadeUp 0.4s ease' }}>

                        {/* STEP 1: Address */}
                        {step === 1 && (
                            <div style={{ background: cardBg, borderRadius: '16px', padding: 'clamp(16px,4vw,28px)', border: `1px solid ${cardBorder}`, boxShadow: isDark ? '0 2px 12px rgba(0,0,0,0.4)' : '0 2px 12px rgba(0,0,0,0.04)' }}>
                                <h2 style={{ margin: '0 0 22px', fontSize: 'clamp(0.9rem,3vw,1.05rem)', fontWeight: 700, color: textPri, display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    📦 Delivery Address
                                </h2>
                                <div className="addr-grid">
                                    {[
                                        { name: 'name', label: 'Full Name', placeholder: 'Your full name', span: 1 },
                                        { name: 'phone', label: 'Phone Number', placeholder: '10-digit mobile number', span: 1 },
                                        { name: 'address', label: 'Street Address', placeholder: 'House no, Street, Locality, Area', span: 2 },
                                        { name: 'city', label: 'City', placeholder: 'City', span: 1 },
                                        { name: 'state', label: 'State', placeholder: 'State', span: 1 },
                                        { name: 'pincode', label: 'Pincode', placeholder: '6-digit pincode', span: 1 },
                                    ].map(f => (
                                        <div key={f.name} style={{ gridColumn: `span ${f.span}` }}>
                                            <label style={labelStyle}>{f.label}</label>
                                            <input className="inp" name={f.name} value={address[f.name]} onChange={handleAddressChange} placeholder={f.placeholder} style={inputStyle}/>
                                        </div>
                                    ))}
                                </div>
                                <button className="proceed-btn" onClick={handleAddressSubmit}
                                    style={{ width: '100%', marginTop: '22px', padding: '14px', background: '#667eea', border: 'none', borderRadius: '10px', color: '#fff', fontWeight: 600, fontSize: '0.95rem', cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s', boxShadow: '0 4px 14px rgba(102,126,234,0.3)' }}>
                                    Continue to Payment →
                                </button>
                            </div>
                        )}

                        {/* STEP 2: Payment */}
                        {step === 2 && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

                                {/* Method Selector */}
                                <div style={{ background: cardBg, borderRadius: '16px', padding: 'clamp(16px,4vw,24px)', border: `1px solid ${cardBorder}`, boxShadow: isDark ? '0 2px 12px rgba(0,0,0,0.4)' : '0 2px 12px rgba(0,0,0,0.04)' }}>
                                    <h2 style={{ margin: '0 0 18px', fontSize: 'clamp(0.9rem,3vw,1.05rem)', fontWeight: 700, color: textPri }}>Payment Method</h2>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                        {payMethods.map(m => (
                                            <div key={m.id} className="pay-method" onClick={() => setPaymentMethod(m.id)}
                                                style={{ padding: '14px 18px', background: paymentMethod === m.id ? methodSelBg : methodBg, border: paymentMethod === m.id ? '1.5px solid #667eea' : `1.5px solid ${cardBorder}`, borderRadius: '10px', cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '14px' }}>
                                                <span style={{ fontSize: '1.3rem' }}>{m.icon}</span>
                                                <span style={{ fontWeight: 600, fontSize: 'clamp(0.82rem,2.5vw,0.9rem)', color: paymentMethod === m.id ? '#667eea' : textPri, flex: 1 }}>{m.label}</span>
                                                <div style={{ width: 18, height: 18, borderRadius: '50%', border: paymentMethod === m.id ? '5px solid #667eea' : `2px solid ${isDark ? '#555' : '#d1d5db'}`, transition: 'all 0.2s', flexShrink: 0 }}/>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Card Details */}
                                {paymentMethod === 'card' && (
                                    <div style={{ background: cardBg, borderRadius: '16px', padding: 'clamp(16px,4vw,24px)', border: `1px solid ${cardBorder}`, boxShadow: isDark ? '0 2px 12px rgba(0,0,0,0.4)' : '0 2px 12px rgba(0,0,0,0.04)' }}>
                                        <h2 style={{ margin: '0 0 18px', fontSize: 'clamp(0.9rem,3vw,1.05rem)', fontWeight: 700, color: textPri }}>Card Details</h2>
                                        {/* Card Preview */}
                                        <div style={{ background: 'linear-gradient(135deg, #667eea, #764ba2)', borderRadius: '14px', padding: 'clamp(14px,4vw,22px) clamp(14px,4vw,24px)', marginBottom: '22px', position: 'relative', overflow: 'hidden' }}>
                                            <div style={{ position: 'absolute', top: -30, right: -30, width: 120, height: 120, borderRadius: '50%', background: 'rgba(255,255,255,0.08)' }}/>
                                            <div style={{ position: 'absolute', bottom: -20, left: 60, width: 80, height: 80, borderRadius: '50%', background: 'rgba(255,255,255,0.06)' }}/>
                                            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', margin: '0 0 10px' }}>Card Number</p>
                                            <p style={{ color: '#fff', fontWeight: 700, fontSize: 'clamp(0.82rem,3vw,1rem)', letterSpacing: '0.18em', margin: '0 0 18px', position: 'relative' }}>{cardDetails.number || '•••• •••• •••• ••••'}</p>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative' }}>
                                                <div>
                                                    <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.6rem', fontWeight: 600, textTransform: 'uppercase', margin: '0 0 2px' }}>Card Holder</p>
                                                    <p style={{ color: '#fff', fontWeight: 700, fontSize: 'clamp(0.75rem,2.5vw,0.85rem)', margin: 0 }}>{cardDetails.name || 'YOUR NAME'}</p>
                                                </div>
                                                <div style={{ textAlign: 'right' }}>
                                                    <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.6rem', fontWeight: 600, textTransform: 'uppercase', margin: '0 0 2px' }}>Expires</p>
                                                    <p style={{ color: '#fff', fontWeight: 700, fontSize: 'clamp(0.75rem,2.5vw,0.85rem)', margin: 0 }}>{cardDetails.expiry || 'MM/YY'}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                                            <div>
                                                <label style={labelStyle}>Card Number</label>
                                                <input className="inp" placeholder="1234 5678 9012 3456" value={cardDetails.number} maxLength={19}
                                                    onChange={e => setCardDetails({...cardDetails, number: e.target.value.replace(/\D/g,'').replace(/(.{4})/g,'$1 ').trim().slice(0,19)})}
                                                    style={inputStyle}/>
                                            </div>
                                            <div>
                                                <label style={labelStyle}>Name on Card</label>
                                                <input className="inp" placeholder="As printed on your card" value={cardDetails.name}
                                                    onChange={e => setCardDetails({...cardDetails, name: e.target.value})} style={inputStyle}/>
                                            </div>
                                            <div className="card-grid">
                                                <div>
                                                    <label style={labelStyle}>Expiry Date</label>
                                                    <input className="inp" placeholder="MM/YY" maxLength={5} value={cardDetails.expiry}
                                                        onChange={e => { let v=e.target.value.replace(/\D/g,''); if(v.length>=2) v=v.slice(0,2)+'/'+v.slice(2); setCardDetails({...cardDetails,expiry:v}) }}
                                                        style={inputStyle}/>
                                                </div>
                                                <div>
                                                    <label style={labelStyle}>CVV</label>
                                                    <input className="inp" placeholder="•••" maxLength={4} type="password" value={cardDetails.cvv}
                                                        onChange={e => setCardDetails({...cardDetails, cvv: e.target.value.replace(/\D/g,'')})} style={inputStyle}/>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* UPI */}
                                {paymentMethod === 'upi' && (
                                    <div style={{ background: cardBg, borderRadius: '16px', padding: 'clamp(16px,4vw,24px)', border: `1px solid ${cardBorder}`, boxShadow: isDark ? '0 2px 12px rgba(0,0,0,0.4)' : '0 2px 12px rgba(0,0,0,0.04)' }}>
                                        <h2 style={{ margin: '0 0 16px', fontSize: 'clamp(0.9rem,3vw,1.05rem)', fontWeight: 700, color: textPri }}>UPI Payment</h2>
                                        <label style={labelStyle}>Enter UPI ID</label>
                                        <input className="inp" placeholder="yourname@upi" value={upiId} onChange={e => setUpiId(e.target.value)} style={inputStyle}/>
                                        <p style={{ margin: '18px 0 12px', fontSize: '0.75rem', fontWeight: 700, color: textSec, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Or pay with</p>
                                        <div className="upi-grid">
                                            {[{name:'GPay',e:'🟢'},{name:'PhonePe',e:'🟣'},{name:'Paytm',e:'🔵'},{name:'BHIM',e:'🟠'}].map(app => (
                                                <div key={app.name} className="upi-app" onClick={() => setUpiId(`yourname@${app.name.toLowerCase()}`)}
                                                    style={{ padding: '12px 8px', background: methodBg, border: `1.5px solid ${cardBorder}`, borderRadius: '10px', textAlign: 'center', cursor: 'pointer', transition: 'all 0.2s' }}>
                                                    <div style={{ fontSize: '1.4rem', marginBottom: '5px' }}>{app.e}</div>
                                                    <p style={{ margin: 0, fontSize: '0.68rem', fontWeight: 600, color: textSec }}>{app.name}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Net Banking */}
                                {paymentMethod === 'netbanking' && (
                                    <div style={{ background: cardBg, borderRadius: '16px', padding: 'clamp(16px,4vw,24px)', border: `1px solid ${cardBorder}`, boxShadow: isDark ? '0 2px 12px rgba(0,0,0,0.4)' : '0 2px 12px rgba(0,0,0,0.04)' }}>
                                        <h2 style={{ margin: '0 0 16px', fontSize: 'clamp(0.9rem,3vw,1.05rem)', fontWeight: 700, color: textPri }}>Select Your Bank</h2>
                                        <div className="bank-grid">
                                            {banks.map(bank => (
                                                <div key={bank} className="bank-item" onClick={() => setSelectedBank(bank)}
                                                    style={{ padding: '13px 16px', background: selectedBank===bank ? methodSelBg : methodBg, border: selectedBank===bank ? '1.5px solid #667eea' : `1.5px solid ${cardBorder}`, borderRadius: '10px', cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                    <span style={{ fontSize: '1.1rem' }}>🏦</span>
                                                    <span style={{ fontWeight: 600, fontSize: '0.85rem', color: selectedBank===bank ? '#667eea' : textPri, flex: 1 }}>{bank}</span>
                                                    {selectedBank===bank && <span style={{ color: '#667eea', fontSize: '0.8rem', fontWeight: 700 }}>✓</span>}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* COD */}
                                {paymentMethod === 'cod' && (
                                    <div style={{ background: cardBg, borderRadius: '16px', padding: 'clamp(20px,5vw,32px) clamp(16px,4vw,24px)', border: `1px solid ${cardBorder}`, boxShadow: isDark ? '0 2px 12px rgba(0,0,0,0.4)' : '0 2px 12px rgba(0,0,0,0.04)', textAlign: 'center' }}>
                                        <div style={{ fontSize: '3rem', marginBottom: '14px', display: 'inline-block', animation: 'float 3s ease-in-out infinite' }}>🚚</div>
                                        <h3 style={{ margin: '0 0 8px', fontSize: '1.1rem', fontWeight: 700, color: textPri }}>Cash on Delivery</h3>
                                        <p style={{ color: textSec, fontSize: '0.88rem', lineHeight: 1.7, margin: '0 auto 18px', maxWidth: '280px' }}>Pay with cash when your order arrives at your doorstep. No extra charges!</p>
                                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap' }}>
                                            {['✅ No extra fee', '📦 Pay on delivery', '🔄 Easy returns'].map(tag => (
                                                <span key={tag} style={{ padding: '5px 12px', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '20px', fontSize: '0.75rem', color: '#059669', fontWeight: 500 }}>{tag}</span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Place Order */}
                                <button className="proceed-btn" onClick={handlePlaceOrder} disabled={loading}
                                    style={{ width: '100%', padding: '15px', background: loading ? '#d1d5db' : '#667eea', border: 'none', borderRadius: '10px', color: '#fff', fontWeight: 700, fontSize: '1rem', cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'inherit', boxShadow: loading ? 'none' : '0 4px 14px rgba(102,126,234,0.3)', transition: 'all 0.2s' }}>
                                    {loading ? '⏳ Processing...' : `Place Order · ₹${totalAmount?.toLocaleString('en-IN')}`}
                                </button>

                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', color: '#9ca3af', fontSize: '0.73rem', flexWrap: 'wrap' }}>
                                    <span style={{ display:'flex', alignItems:'center', gap:'4px' }}><FaLock size={10}/> SSL Secured</span>
                                    <span>•</span>
                                    <span>256-bit encryption</span>
                                    <span>•</span>
                                    <span>100% Safe</span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* RIGHT: Order Summary */}
                    <div className="pay-right" style={{ position: 'sticky', top: '24px' }}>

                        {/* Mobile toggle button */}
                        <button className="pay-summary-toggle" onClick={() => setShowSummary(!showSummary)}>
                            <span>🛒 Order Summary · ₹{totalAmount?.toLocaleString('en-IN')}</span>
                            <span>{showSummary ? '▲' : '▼'}</span>
                        </button>

                        <div className={`mobile-summary${showSummary ? ' open' : ''}`}>
                            <div style={{ background: cardBg, borderRadius: '16px', padding: 'clamp(16px,4vw,24px)', border: `1px solid ${cardBorder}`, boxShadow: isDark ? '0 2px 12px rgba(0,0,0,0.4)' : '0 2px 12px rgba(0,0,0,0.04)' }}>
                                <h2 style={{ margin: '0 0 18px', fontSize: '1rem', fontWeight: 700, color: textPri }}>Order Summary</h2>

                                {/* Items */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '18px', maxHeight: '220px', overflowY: 'auto' }}>
                                    {cartItems.map((item, i) => (
                                        <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                            <div style={{ width: 52, height: 52, borderRadius: '10px', background: itemBg, flexShrink: 0, overflow: 'hidden', border: `1px solid ${cardBorder}`, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4px' }}>
                                                <img src={item?.productId?.productImage?.[0]} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain' }}/>
                                            </div>
                                            <div style={{ flex: 1, minWidth: 0 }}>
                                                <p style={{ margin: 0, fontSize: '0.82rem', fontWeight: 600, color: textPri, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item?.productId?.productName}</p>
                                                <p style={{ margin: '2px 0 0', fontSize: '0.72rem', color: textSec }}>Qty: {item?.quantity}</p>
                                            </div>
                                            <p style={{ margin: 0, fontSize: '0.85rem', fontWeight: 700, color: textPri, flexShrink: 0 }}>₹{(item?.productId?.sellingPrice * item?.quantity)?.toLocaleString('en-IN')}</p>
                                        </div>
                                    ))}
                                </div>

                                {/* Free delivery badge */}
                                <div style={{ padding: '9px 12px', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '7px' }}>
                                    <MdLocalOffer style={{ color: '#059669', flexShrink: 0, fontSize: '0.95rem' }}/>
                                    <p style={{ margin: 0, fontSize: '0.75rem', color: '#059669', fontWeight: 600 }}>Free delivery applied on this order</p>
                                </div>

                                {/* Price rows */}
                                <div style={{ borderTop: `1px solid ${cardBorder}`, paddingTop: '14px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                    {[
                                        { label: 'Subtotal', val: `₹${totalAmount?.toLocaleString('en-IN')}` },
                                        { label: 'Delivery', val: 'FREE', color: '#059669' },
                                        { label: 'Tax (GST)', val: 'Included', color: '#9ca3af' }
                                    ].map(r => (
                                        <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <span style={{ color: textSec, fontSize: '0.85rem' }}>{r.label}</span>
                                            <span style={{ fontWeight: 600, fontSize: '0.88rem', color: r.color || textPri }}>{r.val}</span>
                                        </div>
                                    ))}
                                </div>

                                {/* Total */}
                                <div style={{ marginTop: '14px', padding: '14px', background: totalBg, borderRadius: '10px', border: `1px solid ${cardBorder}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ fontWeight: 700, fontSize: '0.95rem', color: textPri }}>Total</span>
                                    <span style={{ fontWeight: 800, fontSize: 'clamp(1.1rem,3vw,1.3rem)', color: '#667eea' }}>₹{totalAmount?.toLocaleString('en-IN')}</span>
                                </div>

                                {/* Address preview in step 2 */}
                                {step === 2 && address.name && (
                                    <div style={{ marginTop: '14px', padding: '12px 14px', background: '#f5f3ff', border: '1px solid #e0d9ff', borderRadius: '10px', fontSize: '0.78rem', lineHeight: 1.7, color: '#6b7280' }}>
                                        <p style={{ margin: '0 0 3px', fontWeight: 700, color: '#1a1a2e', fontSize: '0.82rem' }}>📍 {address.name}</p>
                                        <p style={{ margin: 0 }}>{address.address}, {address.city}</p>
                                        <p style={{ margin: 0 }}>{address.state} — {address.pincode}</p>
                                        <p style={{ margin: 0, color: '#667eea', fontWeight: 500 }}>📞 {address.phone}</p>
                                    </div>
                                )}

                                <div style={{ marginTop: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', color: '#9ca3af', fontSize: '0.7rem' }}>
                                    <FaShieldAlt size={10}/> 256-bit SSL Encryption
                                </div>
                            </div>

                            {/* Trust Badges */}
                            <div className="trust-grid" style={{ marginTop: '12px' }}>
                                {[{icon:'🔒',text:'Secure Payment'},{icon:'🔄',text:'Easy Returns'},{icon:'🚚',text:'Free Delivery'},{icon:'💬',text:'24/7 Support'}].map(b => (
                                    <div key={b.text} style={{ padding: '10px 12px', background: cardBg, border: `1px solid ${cardBorder}`, borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <span style={{ fontSize: '0.9rem' }}>{b.icon}</span>
                                        <span style={{ fontSize: '0.68rem', fontWeight: 600, color: textSec }}>{b.text}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Payment