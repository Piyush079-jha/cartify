import React, { useState, useContext } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import SummaryApi from '../common'
import { FaLock, FaArrowLeft, FaShieldAlt, FaCheckCircle } from 'react-icons/fa'
import Context from '../context'

const Payment = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { cartItems = [], totalAmount = 0 } = location.state || {}
  const { isDark } = useContext(Context)

  const [step, setStep]                 = useState(1)
  const [paymentMethod, setPaymentMethod] = useState('card')
  const [loading, setLoading]           = useState(false)
  const [address, setAddress]           = useState({ name: '', phone: '', address: '', city: '', state: '', pincode: '' })
  const [cardDetails, setCardDetails]   = useState({ number: '', expiry: '', cvv: '', name: '' })
  const [upiId, setUpiId]               = useState('')
  const [orderId, setOrderId]           = useState('')
  const [selectedBank, setSelectedBank] = useState('')
  const [showSummary, setShowSummary]   = useState(false)

  const bg      = isDark ? '#0e0e0e'                 : '#faf9f7'
  const surface = isDark ? '#161616'                 : '#ffffff'
  const surfaceAlt = isDark ? '#111110'              : '#f7f6f4'
  const text    = isDark ? '#e8e4dc'                 : '#1a1814'
  const muted   = isDark ? 'rgba(160,152,144,0.75)'  : 'rgba(130,125,118,0.85)'
  const border  = isDark ? 'rgba(255,255,255,0.07)'  : 'rgba(26,24,20,0.09)'
  const gold    = '#c9a84c'
  const goldBg  = isDark ? 'rgba(201,168,76,0.07)'   : 'rgba(201,168,76,0.05)'
  const goldBorder = 'rgba(201,168,76,0.22)'

  const handleAddressChange = (e) => setAddress({ ...address, [e.target.name]: e.target.value })

  const handleAddressSubmit = () => {
    const { name, phone, address: addr, city, state, pincode } = address
    if (!name || !phone || !addr || !city || !state || !pincode) { toast.error('Please fill all fields'); return }
    if (phone.length !== 10) { toast.error('Enter valid 10-digit phone'); return }
    setStep(2)
  }

  const handlePlaceOrder = async () => {
    if (paymentMethod === 'card'       && (!cardDetails.number || !cardDetails.expiry || !cardDetails.cvv || !cardDetails.name)) { toast.error('Please fill card details'); return }
    if (paymentMethod === 'upi'        && !upiId)        { toast.error('Please enter UPI ID'); return }
    if (paymentMethod === 'netbanking' && !selectedBank) { toast.error('Please select a bank'); return }

    setLoading(true)
    try {
      const items = cartItems.map(item => ({
        productId:    item?.productId?._id,
        productName:  item?.productId?.productName,
        productImage: item?.productId?.productImage?.[0],
        quantity:     item?.quantity,
        price:        item?.productId?.sellingPrice
      }))
      const response = await fetch(SummaryApi.createOrder.url, {
        method: SummaryApi.createOrder.method,
        credentials: 'include',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ items, totalAmount, deliveryAddress: address, paymentMethod })
      })
      if (response.status === 401) { toast.error('Please login first'); navigate('/login'); return }
      const data = await response.json()
      if (data.success) { setOrderId(data.orderId); setStep(3) }
      else toast.error(data.message || 'Order failed')
    } catch { toast.error('Cannot connect to server') }
    finally { setLoading(false) }
  }

  const payMethods = [
    { id: 'card',       label: 'Credit / Debit Card', sub: 'Visa, Mastercard, RuPay' },
    { id: 'upi',        label: 'UPI Payment',         sub: 'GPay, PhonePe, Paytm'   },
    { id: 'netbanking', label: 'Net Banking',          sub: 'All major banks'         },
    { id: 'cod',        label: 'Cash on Delivery',     sub: 'Pay when delivered'      },
  ]

  const banks = ['SBI', 'HDFC', 'ICICI', 'Axis', 'Kotak', 'PNB', 'Yes Bank', 'BOB']

  // ── Success screen ──
  if (step === 3) return (
    <>
      <style>{`
        @keyframes payPopIn { 0% { transform:scale(0.85); opacity:0; } 100% { transform:scale(1); opacity:1; } }
        @keyframes payFadeUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
      `}</style>
      <div style={{ minHeight: '100vh', background: isDark ? '#0a0a0a' : '#faf9f7', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
        <div style={{
          background: isDark ? '#111110' : '#ffffff',
          border: `0.5px solid ${border}`,
          padding: '48px 40px', maxWidth: '400px', width: '100%',
          textAlign: 'center',
          boxShadow: isDark ? '0 40px 80px rgba(0,0,0,0.5)' : '0 20px 60px rgba(0,0,0,0.06)',
          animation: 'payFadeUp 0.5s ease'
        }}>
          {/* Check circle */}
          <div style={{
            width: '56px', height: '56px',
            border: `0.5px solid rgba(168,192,128,0.4)`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 24px',
            color: '#a8c080', fontSize: '24px',
            animation: 'payPopIn 0.5s cubic-bezier(0.175,0.885,0.32,1.275)'
          }}>
            <FaCheckCircle />
          </div>

          <h1 style={{
            fontFamily: 'Cormorant Garamond, Georgia, serif',
            fontSize: '30px', fontWeight: 300,
            color: text, margin: '0 0 8px',
            letterSpacing: '-0.01em'
          }}>
            Order Confirmed
          </h1>
          <p style={{ fontSize: '13px', color: muted, margin: '0 0 32px', lineHeight: 1.7, letterSpacing: '0.03em' }}>
            Thank you for your purchase. A confirmation will be sent to you shortly.
          </p>

          {/* Order ID */}
          <div style={{
            border: `0.5px solid ${goldBorder}`,
            background: goldBg,
            padding: '14px 18px', marginBottom: '28px', textAlign: 'left'
          }}>
            <p style={{ fontSize: '9px', letterSpacing: '0.16em', textTransform: 'uppercase', color: muted, margin: '0 0 5px', fontFamily: 'DM Sans, sans-serif' }}>Order ID</p>
            <p style={{ color: gold, fontWeight: 500, fontSize: '12px', fontFamily: 'monospace', letterSpacing: '0.08em', margin: 0, wordBreak: 'break-all' }}>#{orderId}</p>
          </div>

          <button
            onClick={() => navigate('/')}
            style={{
              width: '100%', padding: '13px',
              background: 'transparent',
              border: `0.5px solid ${gold}`,
              color: gold, fontSize: '11px',
              fontWeight: 500, letterSpacing: '0.16em',
              textTransform: 'uppercase', cursor: 'pointer',
              fontFamily: 'DM Sans, sans-serif', transition: 'all 0.25s ease',
              borderRadius: '1px'
            }}
            onMouseEnter={e => { e.currentTarget.style.background = gold; e.currentTarget.style.color = '#0a0a0a' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = gold }}
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </>
  )

  return (
    <>
      <style>{`
        @keyframes payFadeUp { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }

        .pay-page {
          min-height: 100vh;
          background: ${bg};
          color: ${text};
          font-family: 'DM Sans', -apple-system, sans-serif;
          padding-bottom: 80px;
        }

        /* Topbar */
        .pay-topbar {
          background: ${isDark ? 'rgba(14,14,14,0.97)' : 'rgba(250,249,247,0.97)'};
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border-bottom: 0.5px solid ${border};
          height: 57px;
          display: flex; align-items: center;
          padding: 0 28px;
          justify-content: space-between;
          position: sticky; top: 0; z-index: 20;
        }
        .pay-back-btn {
          width: 32px; height: 32px;
          border: 0.5px solid ${border};
          background: transparent; color: ${muted};
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; transition: all 0.2s ease;
          border-radius: 1px;
        }
        .pay-back-btn:hover { border-color: ${gold}; color: ${gold}; }
        .pay-brand {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: 18px; font-weight: 300;
          color: ${text}; letter-spacing: 0.01em;
        }
        .pay-secure {
          display: flex; align-items: center; gap: '6px';
          font-size: 10px; color: ${muted};
          letter-spacing: 0.08em; text-transform: uppercase;
          gap: 6px;
        }

        /* Steps */
        .pay-steps {
          display: flex; align-items: center; gap: 0;
          max-width: 700px; margin: 28px auto 0;
          padding: 0 28px;
        }
        .pay-step-item {
          display: flex; align-items: center; gap: 8px; flex-shrink: 0;
        }
        .pay-step-circle {
          width: 24px; height: 24px;
          border: 0.5px solid;
          display: flex; align-items: center; justify-content: center;
          font-size: 9px; font-weight: 500;
          letter-spacing: 0.04em; transition: all 0.3s ease;
          font-family: 'DM Sans', sans-serif;
        }
        .pay-step-label {
          font-size: 10px; font-weight: 400;
          letter-spacing: 0.08em; text-transform: uppercase;
          transition: color 0.3s ease;
          font-family: 'DM Sans', sans-serif;
        }
        .pay-step-line {
          flex: 1; height: 0.5px; min-width: 20px;
          transition: background 0.4s ease;
        }

        /* Grid */
        .pay-grid {
          max-width: 1000px; margin: 28px auto 0;
          padding: 0 28px;
          display: grid;
          grid-template-columns: 1fr 320px;
          gap: 1px; background: ${border};
          align-items: start;
        }

        /* Panels */
        .pay-panel {
          background: ${surface};
          padding: 28px;
          animation: payFadeUp 0.35s ease;
        }
        .pay-panel-title {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: 20px; font-weight: 300;
          color: ${text}; margin: 0 0 22px;
          letter-spacing: -0.01em;
        }
        .pay-section-label {
          font-size: 9px; letter-spacing: 0.18em;
          text-transform: uppercase; color: ${muted};
          margin: 0 0 12px; display: block;
          font-family: 'DM Sans', sans-serif;
        }

        /* Input */
        .pay-input {
          width: 100%; padding: 11px 14px;
          background: ${surfaceAlt};
          border: 0.5px solid ${border};
          color: ${text}; font-size: 13px;
          outline: none; box-sizing: border-box;
          transition: border-color 0.2s ease, background 0.2s ease;
          font-family: 'DM Sans', sans-serif;
          letter-spacing: 0.02em; border-radius: 1px;
        }
        .pay-input::placeholder { color: rgba(${isDark ? '255,255,255,0.18' : '26,24,20,0.25'}); }
        .pay-input:focus { border-color: ${gold}; background: ${isDark ? 'rgba(201,168,76,0.03)' : 'rgba(201,168,76,0.02)'}; }

        /* Address grid */
        .pay-addr-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }

        /* Payment method */
        .pay-method-item {
          display: flex; align-items: center; gap: 14px;
          padding: 14px 16px;
          border: 0.5px solid ${border};
          background: ${surfaceAlt};
          cursor: pointer;
          transition: border-color 0.2s ease, background 0.2s ease;
          margin-bottom: 1px;
        }
        .pay-method-item:hover { border-color: ${goldBorder}; }
        .pay-method-item.active { border-color: ${gold}; background: ${goldBg}; border-left: 1.5px solid ${gold}; }
        .pay-method-radio {
          width: 14px; height: 14px;
          border: 0.5px solid;
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0; transition: all 0.2s ease;
        }
        .pay-method-radio.active::after {
          content: '';
          width: 6px; height: 6px;
          border-radius: 50%;
          background: ${gold};
          display: block;
        }

        /* Card preview */
        .pay-card-preview {
          background: #111110;
          border: 0.5px solid rgba(201,168,76,0.2);
          padding: 22px 24px; margin-bottom: 20px;
          position: relative; overflow: hidden;
        }
        .pay-card-preview::before {
          content: '';
          position: absolute; top: -30px; right: -30px;
          width: 100px; height: 100px; border-radius: 50%;
          border: 0.5px solid rgba(201,168,76,0.1);
        }
        .pay-card-preview::after {
          content: '';
          position: absolute; bottom: -20px; left: 40px;
          width: 70px; height: 70px; border-radius: 50%;
          border: 0.5px solid rgba(201,168,76,0.07);
        }

        /* Bank grid */
        .pay-bank-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1px; background: ${border};
        }
        .pay-bank-item {
          background: ${surfaceAlt};
          padding: 12px 14px;
          cursor: pointer;
          display: flex; align-items: center; gap: 10px;
          transition: background 0.15s ease;
          border-left: 1.5px solid transparent;
        }
        .pay-bank-item:hover { background: ${goldBg}; }
        .pay-bank-item.active { border-left-color: ${gold}; background: ${goldBg}; }

        /* UPI grid */
        .pay-upi-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1px; background: ${border};
          margin-top: 14px;
        }
        .pay-upi-app {
          background: ${surfaceAlt};
          padding: 12px 8px; text-align: center;
          cursor: pointer; transition: background 0.15s ease;
        }
        .pay-upi-app:hover { background: ${goldBg}; }

        /* Proceed button */
        .pay-proceed-btn {
          width: 100%; padding: 13px;
          background: transparent;
          border: 0.5px solid ${gold};
          color: ${gold}; font-size: 11px;
          font-weight: 500; letter-spacing: 0.16em;
          text-transform: uppercase; cursor: pointer;
          transition: all 0.25s ease;
          font-family: 'DM Sans', sans-serif;
          border-radius: 1px; margin-top: 20px;
        }
        .pay-proceed-btn:hover:not(:disabled) {
          background: ${gold}; color: #0a0a0a;
          letter-spacing: 0.2em;
          box-shadow: 0 0 24px rgba(201,168,76,0.2);
        }
        .pay-proceed-btn:disabled { opacity: 0.4; cursor: not-allowed; }

        /* Summary panel */
        .pay-summary {
          background: ${isDark ? '#111110' : '#111110'};
          padding: 24px;
          position: sticky; top: 72px;
        }
        .pay-summary-title {
          font-size: 9px; letter-spacing: 0.18em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.3);
          margin: 0 0 18px; padding-bottom: 14px;
          border-bottom: 0.5px solid rgba(255,255,255,0.07);
          font-family: 'DM Sans', sans-serif;
        }

        /* Summary item */
        .pay-sum-item {
          display: flex; gap: 12px; align-items: center;
          padding: 10px 0;
          border-bottom: 0.5px solid rgba(255,255,255,0.05);
        }
        .pay-sum-item:last-child { border-bottom: none; }
        .pay-sum-img {
          width: 44px; height: 44px;
          border: 0.5px solid rgba(255,255,255,0.07);
          background: rgba(255,255,255,0.02);
          flex-shrink: 0; overflow: hidden;
          display: flex; align-items: center; justify-content: center;
          padding: 4px;
        }
        .pay-sum-total {
          display: flex; justify-content: space-between;
          align-items: baseline; margin-top: 16px;
          padding-top: 14px;
          border-top: 0.5px solid rgba(255,255,255,0.07);
        }

        /* Mobile toggle */
        .pay-mob-toggle { display: none; }

        @media (max-width: 860px) {
          .pay-grid { grid-template-columns: 1fr; }
          .pay-summary { position: static; }
          .pay-mob-toggle { display: flex; }
          .pay-sum-hidden { display: none; }
          .pay-sum-hidden.open { display: block !important; }
        }
        @media (max-width: 600px) {
          .pay-grid { padding: 0 !important; margin-top: 0 !important; }
          .pay-panel { padding: 20px; }
          .pay-addr-grid { grid-template-columns: 1fr; }
          .pay-bank-grid { grid-template-columns: 1fr; }
          .pay-upi-grid  { grid-template-columns: repeat(2,1fr); }
          .pay-steps { padding: 0 16px; }
          .pay-step-label { display: none; }
          .pay-topbar { padding: 0 16px; }
        }
      `}</style>

      <div className="pay-page">

        {/* Topbar */}
        <div className="pay-topbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <button
              className="pay-back-btn"
              onClick={() => step === 1 ? navigate('/cart') : setStep(1)}
              aria-label="Back"
            >
              <FaArrowLeft style={{ fontSize: '10px' }} />
            </button>
            <span className="pay-brand">Checkout</span>
          </div>
          <div className="pay-secure">
            <FaLock style={{ fontSize: '9px' }} />
            Secure Checkout
          </div>
        </div>

        {/* Steps */}
        <div className="pay-steps">
          {['Delivery', 'Payment', 'Confirm'].map((s, i) => (
            <React.Fragment key={i}>
              <div className="pay-step-item">
                <div
                  className="pay-step-circle"
                  style={{
                    borderColor: step >= i + 1 ? gold : border,
                    background:  step > i + 1 ? goldBg : 'transparent',
                    color:       step >= i + 1 ? gold : muted
                  }}
                >
                  {step > i + 1 ? '✓' : i + 1}
                </div>
                <span
                  className="pay-step-label"
                  style={{ color: step === i + 1 ? gold : step > i + 1 ? text : muted }}
                >
                  {s}
                </span>
              </div>
              {i < 2 && (
                <div
                  className="pay-step-line"
                  style={{ background: step > i + 1 ? gold : border }}
                />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Grid */}
        <div className="pay-grid">

          {/* LEFT */}
          <div className="pay-panel">

            {/* Step 1: Address */}
            {step === 1 && (
              <>
                <h2 className="pay-panel-title">Delivery Address</h2>
                <div className="pay-addr-grid" style={{ marginBottom: '0' }}>
                  {[
                    { name: 'name',     label: 'Full Name',       placeholder: 'Your full name',               span: 1 },
                    { name: 'phone',    label: 'Phone Number',    placeholder: '10-digit mobile number',       span: 1 },
                    { name: 'address',  label: 'Street Address',  placeholder: 'House no., Street, Locality',  span: 2 },
                    { name: 'city',     label: 'City',            placeholder: 'City',                         span: 1 },
                    { name: 'state',    label: 'State',           placeholder: 'State',                        span: 1 },
                    { name: 'pincode',  label: 'Pincode',         placeholder: '6-digit pincode',              span: 1 },
                  ].map(f => (
                    <div key={f.name} style={{ gridColumn: `span ${f.span}` }}>
                      <label className="pay-section-label">{f.label}</label>
                      <input
                        className="pay-input"
                        name={f.name}
                        value={address[f.name]}
                        onChange={handleAddressChange}
                        placeholder={f.placeholder}
                      />
                    </div>
                  ))}
                </div>
                <button className="pay-proceed-btn" onClick={handleAddressSubmit}>
                  Continue to Payment →
                </button>
              </>
            )}

            {/* Step 2: Payment */}
            {step === 2 && (
              <>
                <h2 className="pay-panel-title">Payment Method</h2>

                {/* Method selector */}
                <div style={{ marginBottom: '20px' }}>
                  {payMethods.map(m => (
                    <div
                      key={m.id}
                      className={`pay-method-item${paymentMethod === m.id ? ' active' : ''}`}
                      onClick={() => setPaymentMethod(m.id)}
                    >
                      <div
                        className={`pay-method-radio${paymentMethod === m.id ? ' active' : ''}`}
                        style={{ borderColor: paymentMethod === m.id ? gold : border }}
                      />
                      <div style={{ flex: 1 }}>
                        <p style={{ margin: 0, fontSize: '13px', fontWeight: 400, color: paymentMethod === m.id ? gold : text, letterSpacing: '0.02em' }}>
                          {m.label}
                        </p>
                        <p style={{ margin: '2px 0 0', fontSize: '10px', color: muted, letterSpacing: '0.04em' }}>{m.sub}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Card details */}
                {paymentMethod === 'card' && (
                  <div style={{ marginBottom: '20px' }}>
                    <span className="pay-section-label">Card Details</span>

                    {/* Card preview */}
                    <div className="pay-card-preview">
                      <p style={{ fontSize: '8px', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', margin: '0 0 8px', fontFamily: 'DM Sans, sans-serif' }}>Card Number</p>
                      <p style={{ color: cardDetails.number ? gold : 'rgba(255,255,255,0.2)', fontSize: '14px', letterSpacing: '0.2em', margin: '0 0 16px', fontFamily: 'monospace', position: 'relative' }}>
                        {cardDetails.number || '•••• •••• •••• ••••'}
                      </p>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <div>
                          <p style={{ fontSize: '8px', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', margin: '0 0 3px', fontFamily: 'DM Sans, sans-serif' }}>Card Holder</p>
                          <p style={{ color: cardDetails.name ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.2)', fontSize: '12px', margin: 0, letterSpacing: '0.06em' }}>
                            {cardDetails.name || 'YOUR NAME'}
                          </p>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <p style={{ fontSize: '8px', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', margin: '0 0 3px', fontFamily: 'DM Sans, sans-serif' }}>Expires</p>
                          <p style={{ color: cardDetails.expiry ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.2)', fontSize: '12px', margin: 0, letterSpacing: '0.06em' }}>
                            {cardDetails.expiry || 'MM/YY'}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <div>
                        <label className="pay-section-label">Card Number</label>
                        <input className="pay-input" placeholder="1234 5678 9012 3456"
                          value={cardDetails.number} maxLength={19}
                          onChange={e => setCardDetails({ ...cardDetails, number: e.target.value.replace(/\D/g,'').replace(/(.{4})/g,'$1 ').trim().slice(0,19) })}
                        />
                      </div>
                      <div>
                        <label className="pay-section-label">Name on Card</label>
                        <input className="pay-input" placeholder="As printed on card"
                          value={cardDetails.name}
                          onChange={e => setCardDetails({ ...cardDetails, name: e.target.value })}
                        />
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        <div>
                          <label className="pay-section-label">Expiry</label>
                          <input className="pay-input" placeholder="MM/YY" maxLength={5}
                            value={cardDetails.expiry}
                            onChange={e => { let v = e.target.value.replace(/\D/g,''); if (v.length >= 2) v = v.slice(0,2) + '/' + v.slice(2); setCardDetails({ ...cardDetails, expiry: v }) }}
                          />
                        </div>
                        <div>
                          <label className="pay-section-label">CVV</label>
                          <input className="pay-input" placeholder="•••" maxLength={4} type="password"
                            value={cardDetails.cvv}
                            onChange={e => setCardDetails({ ...cardDetails, cvv: e.target.value.replace(/\D/g,'') })}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* UPI */}
                {paymentMethod === 'upi' && (
                  <div style={{ marginBottom: '20px' }}>
                    <label className="pay-section-label">UPI ID</label>
                    <input className="pay-input" placeholder="yourname@upi"
                      value={upiId} onChange={e => setUpiId(e.target.value)}
                    />
                    <span className="pay-section-label" style={{ marginTop: '16px' }}>Or choose app</span>
                    <div className="pay-upi-grid">
                      {[{ name: 'GPay', sub: 'Google Pay' }, { name: 'PhonePe', sub: 'PhonePe' }, { name: 'Paytm', sub: 'Paytm' }, { name: 'BHIM', sub: 'BHIM UPI' }].map(app => (
                        <div
                          key={app.name}
                          className="pay-upi-app"
                          onClick={() => setUpiId(`yourname@${app.name.toLowerCase()}`)}
                        >
                          <p style={{ margin: '0 0 3px', fontSize: '11px', fontWeight: 500, color: text }}>{app.name}</p>
                          <p style={{ margin: 0, fontSize: '9px', color: muted, letterSpacing: '0.04em' }}>{app.sub}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Net Banking */}
                {paymentMethod === 'netbanking' && (
                  <div style={{ marginBottom: '20px' }}>
                    <span className="pay-section-label">Select Bank</span>
                    <div className="pay-bank-grid">
                      {banks.map(bank => (
                        <div
                          key={bank}
                          className={`pay-bank-item${selectedBank === bank ? ' active' : ''}`}
                          onClick={() => setSelectedBank(bank)}
                        >
                          <span style={{ fontSize: '12px', fontWeight: 400, color: selectedBank === bank ? gold : text, flex: 1, letterSpacing: '0.02em' }}>{bank}</span>
                          {selectedBank === bank && <span style={{ color: gold, fontSize: '10px' }}>✓</span>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* COD */}
                {paymentMethod === 'cod' && (
                  <div style={{
                    padding: '28px 20px', textAlign: 'center',
                    border: `0.5px solid ${border}`, background: surfaceAlt,
                    marginBottom: '20px'
                  }}>
                    <p style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: '20px', fontWeight: 300, color: text, margin: '0 0 8px' }}>Cash on Delivery</p>
                    <p style={{ color: muted, fontSize: '12px', lineHeight: 1.7, margin: '0 auto', maxWidth: '260px', letterSpacing: '0.03em' }}>
                      Pay with cash when your order arrives. No extra charges.
                    </p>
                  </div>
                )}

                <button className="pay-proceed-btn" onClick={handlePlaceOrder} disabled={loading}>
                  {loading ? 'Processing...' : `Place Order · ₹${totalAmount?.toLocaleString('en-IN')}`}
                </button>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginTop: '14px', color: muted, fontSize: '10px', letterSpacing: '0.08em' }}>
                  <FaLock style={{ fontSize: '9px' }} />
                  <span>SSL Secured</span>
                  <span style={{ opacity: 0.3 }}>·</span>
                  <span>256-bit encryption</span>
                </div>
              </>
            )}
          </div>

          {/* RIGHT: Summary */}
          <div>
            {/* Mobile toggle */}
            <button
              className="pay-mob-toggle"
              onClick={() => setShowSummary(p => !p)}
              style={{
                width: '100%', padding: '12px 20px',
                background: surfaceAlt,
                border: `0.5px solid ${border}`, borderBottom: 'none',
                color: muted, fontSize: '10px',
                letterSpacing: '0.1em', textTransform: 'uppercase',
                cursor: 'pointer', fontFamily: 'DM Sans, sans-serif',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center'
              }}
            >
              <span>Order Summary · ₹{totalAmount?.toLocaleString('en-IN')}</span>
              <span>{showSummary ? '▲' : '▼'}</span>
            </button>

            <div className={`pay-sum-hidden${showSummary ? ' open' : ''}`} style={{ display: 'block' }}>
              <div className="pay-summary">
                <p className="pay-summary-title">Order Summary</p>

                {/* Items */}
                <div style={{ marginBottom: '16px' }}>
                  {cartItems.map((item, i) => (
                    <div key={i} className="pay-sum-item">
                      <div className="pay-sum-img">
                        <img src={item?.productId?.productImage?.[0]} alt=""
                          style={{ width: '100%', height: '100%', objectFit: 'contain', mixBlendMode: 'lighten' }} />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ margin: 0, fontSize: '11px', color: 'rgba(255,255,255,0.75)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', letterSpacing: '0.01em' }}>
                          {item?.productId?.productName}
                        </p>
                        <p style={{ margin: '2px 0 0', fontSize: '10px', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.04em' }}>
                          Qty: {item?.quantity}
                        </p>
                      </div>
                      <p style={{ margin: 0, fontSize: '12px', fontWeight: 500, color: 'rgba(255,255,255,0.8)', flexShrink: 0 }}>
                        ₹{(item?.productId?.sellingPrice * item?.quantity)?.toLocaleString('en-IN')}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Price rows */}
                {[
                  { label: 'Subtotal',  val: `₹${totalAmount?.toLocaleString('en-IN')}`,                    col: 'rgba(255,255,255,0.7)' },
                  { label: 'Delivery',  val: 'Free',                                                          col: '#a8c080'               },
                  { label: 'Tax (GST)', val: 'Included',                                                      col: 'rgba(255,255,255,0.3)' },
                ].map((r, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '10px' }}>
                    <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)', letterSpacing: '0.04em' }}>{r.label}</span>
                    <span style={{ fontSize: '12px', fontWeight: 400, color: r.col }}>{r.val}</span>
                  </div>
                ))}

                {/* Total */}
                <div className="pay-sum-total">
                  <span style={{ fontSize: '10px', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', fontFamily: 'DM Sans, sans-serif' }}>Total</span>
                  <span style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: '28px', fontWeight: 300, color: gold, letterSpacing: '-0.01em' }}>
                    ₹{totalAmount?.toLocaleString('en-IN')}
                  </span>
                </div>

                {/* Address preview in step 2 */}
                {step === 2 && address.name && (
                  <div style={{ marginTop: '16px', padding: '14px', border: `0.5px solid ${goldBorder}`, background: goldBg }}>
                    <p style={{ margin: '0 0 3px', fontSize: '11px', fontWeight: 500, color: 'rgba(255,255,255,0.75)', letterSpacing: '0.02em' }}>{address.name}</p>
                    <p style={{ margin: '0 0 2px', fontSize: '10px', color: 'rgba(255,255,255,0.4)', lineHeight: 1.7, letterSpacing: '0.02em' }}>
                      {address.address}, {address.city}
                    </p>
                    <p style={{ margin: '0 0 4px', fontSize: '10px', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.02em' }}>{address.state} — {address.pincode}</p>
                    <p style={{ margin: 0, fontSize: '10px', color: gold, letterSpacing: '0.04em' }}>{address.phone}</p>
                  </div>
                )}

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginTop: '16px', color: 'rgba(255,255,255,0.2)', fontSize: '10px', letterSpacing: '0.08em' }}>
                  <FaShieldAlt style={{ fontSize: '9px' }} />
                  256-bit SSL Encryption
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Payment