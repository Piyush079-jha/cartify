import React, { useEffect, useState } from 'react'
import { FaHeart, FaShoppingCart, FaTrash, FaEnvelope, FaLock } from 'react-icons/fa'
import { Link, useOutletContext, useNavigate } from 'react-router-dom'
import SummaryApi from '../common'
import displayINRCurrency from '../helpers/displayCurrency'
import addToCart from '../helpers/addToCart'
import { toast } from 'react-toastify'

const MOODS = [
  { id: 'treat', emoji: '🎉', label: 'Treat Myself', desc: 'Show me what I deserve', gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', color: '#f5576c', sortFn: (a, b) => (b?.productId?.sellingPrice || 0) - (a?.productId?.sellingPrice || 0) },
  { id: 'gift', emoji: '🎁', label: 'Gift Someone', desc: 'Finding something for a loved one', gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', color: '#4facfe', sortFn: (a, b) => { const mid = 1500; return Math.abs((a?.productId?.sellingPrice || 0) - mid) - Math.abs((b?.productId?.sellingPrice || 0) - mid) } },
  { id: 'budget', emoji: '💸', label: 'On a Budget', desc: 'Show me the best deals first', gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', color: '#43e97b', sortFn: (a, b) => (a?.productId?.sellingPrice || 0) - (b?.productId?.sellingPrice || 0) },
  { id: 'browse', emoji: '😌', label: 'Just Browsing', desc: 'No pressure, just vibes', gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: '#667eea', sortFn: () => 0 },
]

const Wishlist = () => {
  const { isDark } = useOutletContext()
  const navigate = useNavigate()
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedMood, setSelectedMood] = useState(null)
  const [moodPicked, setMoodPicked] = useState(false)
  const [letterModal, setLetterModal] = useState(null)
  const [letterText, setLetterText] = useState('')
  const [revealDate, setRevealDate] = useState('')
  const [letterSaving, setLetterSaving] = useState(false)
  const [revealModal, setRevealModal] = useState(null)

  const t = {
    card: isDark ? '#2d2d2d' : '#ffffff', cardBorder: isDark ? '#3d3d3d' : '#f0f0f5',
    text: isDark ? '#f1f1f1' : '#1a1a2e', textSub: isDark ? '#aaaaaa' : '#666666',
    textMuted: isDark ? '#777777' : '#aaaaaa', imgBg: isDark ? '#222222' : '#f8f8f8',
    chipBg: isDark ? 'rgba(102,126,234,0.2)' : 'rgba(102,126,234,0.12)', chipText: '#667eea',
    loadBg: isDark ? '#3d3d3d' : '#f0f0f5', modal: isDark ? '#1e1e1e' : '#ffffff',
    modalBorder: isDark ? '#3d3d3d' : '#e8e8f0',
  }

  const fetchWishlist = async () => {
    setLoading(true)
    try {
      const response = await fetch(SummaryApi.getWishlistProducts.url, { method: SummaryApi.getWishlistProducts.method, credentials: 'include', headers: { 'content-type': 'application/json' } })
      const result = await response.json()
      if (result.success) setData(result.data || [])
    } catch (err) { setData([]) }
    setLoading(false)
  }

  const removeFromWishlist = async (id) => {
    try {
      const response = await fetch(SummaryApi.removeFromWishlist.url, { method: SummaryApi.removeFromWishlist.method, credentials: 'include', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ _id: id }) })
      const result = await response.json()
      if (result.success) fetchWishlist()
    } catch (err) {}
  }

  const handleAddToCart = async (e, productId, wishlistItemId) => {
    await addToCart(e, productId)
    await removeFromWishlist(wishlistItemId)
    toast.success('Added to cart & removed from wishlist!')
  }

  const saveLetter = async () => {
    if (!letterText.trim()) return toast.error('Write something to your future self!')
    if (!revealDate) return toast.error('Pick a reveal date!')
    if (new Date(revealDate) <= new Date()) return toast.error('Reveal date must be in the future!')
    setLetterSaving(true)
    try {
      const res = await fetch(SummaryApi.saveFutureLetter.url, { method: SummaryApi.saveFutureLetter.method, credentials: 'include', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ wishlistItemId: letterModal.item._id, letter: letterText, revealDate }) })
      const result = await res.json()
      if (result.success) { toast.success('💌 Letter saved! Reveals on ' + new Date(revealDate).toLocaleDateString()); setLetterModal(null); setLetterText(''); setRevealDate(''); fetchWishlist() }
    } catch (e) { toast.error('Failed to save letter') }
    setLetterSaving(false)
  }

  const checkLetter = async (item) => {
    try {
      const res = await fetch(`${SummaryApi.getFutureLetter.url}?wishlistItemId=${item._id}`, { method: SummaryApi.getFutureLetter.method, credentials: 'include', headers: { 'content-type': 'application/json' } })
      const result = await res.json()
      if (result.success) {
        const { letter, canReveal, hasLetter, revealDate } = result.data
        if (!hasLetter) { setLetterText(''); setRevealDate(''); setLetterModal({ item }) }
        else if (canReveal) { setRevealModal({ item, letter, revealDate: result.data.revealDate }) }
        else { const days = Math.ceil((new Date(revealDate) - new Date()) / (1000 * 60 * 60 * 24)); toast(`💌 Letter locked for ${days} more day${days > 1 ? 's' : ''}...`, { autoClose: 3000 }) }
      }
    } catch (e) { toast.error('Could not check letter') }
  }

  useEffect(() => { fetchWishlist() }, [])

  const validItems = data.filter(item => item?.productId)
  const sortedItems = selectedMood ? [...validItems].sort(selectedMood.sortFn) : validItems
  const loadingCards = new Array(4).fill(null)
  const activeMoodColor = selectedMood?.color || '#667eea'
  const activeMoodGradient = selectedMood?.gradient || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'

  // MOOD PICKER
  if (!moodPicked) {
    return (
      <div style={{ minHeight: '100vh', background: isDark ? 'linear-gradient(180deg, #1a1a1a 0%, #2d2d2d 100%)' : 'linear-gradient(180deg, #f0f2ff 0%, #ffffff 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px 16px' }}>
        <style>{`
          @keyframes heartbeat { 0%, 100% { transform: scale(1); } 14% { transform: scale(1.1); } 28% { transform: scale(1); } 42% { transform: scale(1.08); } 70% { transform: scale(1); } }
          .mood-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 18px; }
          @media (max-width: 480px) { .mood-grid { grid-template-columns: 1fr 1fr; gap: 10px; } .mood-btn { padding: 16px 12px !important; } .mood-emoji { font-size: 28px !important; } .mood-label { font-size: 13px !important; } .mood-desc { font-size: 11px !important; } }
          @media (max-width: 360px) { .mood-grid { grid-template-columns: 1fr; } }
        `}</style>
        <div style={{ maxWidth: '520px', width: '100%', textAlign: 'center' }}>
          <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'linear-gradient(135deg, #f093fb, #f5576c)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', boxShadow: '0 8px 32px rgba(245,87,108,0.35)', animation: 'heartbeat 1.5s ease-in-out infinite' }}>
            <FaHeart style={{ fontSize: 32, color: '#fff' }} />
          </div>
          <h1 style={{ fontSize: '26px', fontWeight: 900, color: t.text, margin: '0 0 8px' }}>My Wishlist</h1>
          <p style={{ fontSize: '15px', color: t.textSub, margin: '0 0 32px', fontWeight: 500 }}>How are you feeling today?</p>
          <div className="mood-grid">
            {MOODS.map(mood => (
              <button key={mood.id} className="mood-btn"
                onClick={() => { setSelectedMood(mood); setMoodPicked(true) }}
                style={{ padding: '20px 16px', background: isDark ? 'rgba(255,255,255,0.04)' : '#fff', border: `2px solid ${isDark ? '#3d3d3d' : '#ebebf5'}`, borderRadius: '18px', cursor: 'pointer', transition: 'all 0.25s ease', textAlign: 'left' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.borderColor = mood.color; e.currentTarget.style.boxShadow = `0 12px 32px ${mood.color}33`; e.currentTarget.style.background = isDark ? `${mood.color}15` : `${mood.color}08` }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = isDark ? '#3d3d3d' : '#ebebf5'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.background = isDark ? 'rgba(255,255,255,0.04)' : '#fff' }}
              >
                <div className="mood-emoji" style={{ fontSize: '32px', marginBottom: '8px' }}>{mood.emoji}</div>
                <div className="mood-label" style={{ fontSize: '14px', fontWeight: 800, color: t.text, marginBottom: '4px' }}>{mood.label}</div>
                <div className="mood-desc" style={{ fontSize: '11px', color: t.textMuted, lineHeight: 1.4 }}>{mood.desc}</div>
              </button>
            ))}
          </div>
          <button onClick={() => { setSelectedMood(MOODS[3]); setMoodPicked(true) }}
            style={{ padding: '12px 28px', background: isDark ? 'rgba(255,255,255,0.07)' : 'rgba(102,126,234,0.07)', border: `2px solid ${isDark ? '#555566' : '#c8cef5'}`, borderRadius: '14px', color: isDark ? '#aaaacc' : '#555577', fontSize: '13px', fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#667eea'; e.currentTarget.style.color = '#667eea'; e.currentTarget.style.transform = 'translateY(-2px)' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = isDark ? '#555566' : '#c8cef5'; e.currentTarget.style.color = isDark ? '#aaaacc' : '#555577'; e.currentTarget.style.transform = 'translateY(0)' }}
          >⏭️ Skip — Just show my wishlist</button>
        </div>
      </div>
    )
  }

  // MAIN WISHLIST
  return (
    <div style={{ minHeight: '100vh', background: isDark ? 'linear-gradient(180deg, #1a1a1a 0%, #2d2d2d 100%)' : 'linear-gradient(180deg, #ffffff 0%, #f9f9fb 100%)', padding: '24px 16px', transition: 'background 0.3s ease' }}>
      <style>{`
        .wl-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 18px; }
        .wl-modal-inner { background: ${t.modal}; border: 1px solid ${t.modalBorder}; border-radius: 24px; padding: 28px; width: 100%; max-width: 460px; }
        @keyframes letterGlow { 0%, 100% { box-shadow: 0 2px 10px rgba(245,87,108,0.4); } 50% { box-shadow: 0 2px 20px rgba(245,87,108,0.7); } }
        @keyframes bounce { 0% { transform: scale(0.5); opacity: 0; } 70% { transform: scale(1.1); } 100% { transform: scale(1); opacity: 1; } }
        @media (max-width: 600px) {
          .wl-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 12px !important; }
          .wl-page { padding: 16px 12px !important; }
          .wl-header { flex-direction: column !important; align-items: flex-start !important; gap: 10px !important; }
          .wl-header h1 { font-size: 20px !important; }
          .wl-modal-inner { padding: 20px 16px !important; border-radius: 18px !important; }
        }
        @media (max-width: 400px) {
          .wl-grid { grid-template-columns: 1fr 1fr !important; gap: 8px !important; }
        }
      `}</style>

      <div className="wl-page" style={{ maxWidth: '1100px', margin: '0 auto', padding: '24px 16px' }}>
        {/* Header */}
        <div className="wl-header" style={{ marginBottom: '18px', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: 800, color: t.text, margin: '0 0 4px', display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              <FaHeart style={{ color: '#f5576c' }} /> My Wishlist
              {validItems.length > 0 && <span style={{ fontSize: '13px', fontWeight: 600, color: t.chipText, background: t.chipBg, padding: '3px 10px', borderRadius: '20px' }}>{validItems.length} item{validItems.length > 1 ? 's' : ''}</span>}
            </h1>
            <p style={{ color: t.textSub, fontSize: '13px', margin: '4px 0 0', fontWeight: 500 }}>Products you've saved for later</p>
          </div>
          {selectedMood && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <div style={{ padding: '7px 14px', background: isDark ? `${selectedMood.color}20` : `${selectedMood.color}12`, border: `1.5px solid ${selectedMood.color}44`, borderRadius: '20px', fontSize: '12px', fontWeight: 700, color: selectedMood.color, display: 'flex', alignItems: 'center', gap: '5px' }}>
                {selectedMood.emoji} {selectedMood.label}
              </div>
              <button onClick={() => setMoodPicked(false)} style={{ padding: '7px 12px', background: 'none', border: `1.5px solid ${t.cardBorder}`, borderRadius: '20px', color: t.textMuted, fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>
                Change Mood
              </button>
            </div>
          )}
        </div>

        {/* Mood Banner */}
        {selectedMood && validItems.length > 0 && (
          <div style={{ marginBottom: '20px', padding: '12px 16px', background: isDark ? `${selectedMood.color}15` : `${selectedMood.color}08`, border: `1px solid ${selectedMood.color}33`, borderRadius: '14px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '20px' }}>{selectedMood.emoji}</span>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: selectedMood.color }}>{selectedMood.label} mode active</div>
              <div style={{ fontSize: '12px', color: t.textMuted }}>
                {selectedMood.id === 'treat' && 'Showing most premium items first'}
                {selectedMood.id === 'gift' && 'Showing best gift-range items first'}
                {selectedMood.id === 'budget' && 'Showing most affordable items first'}
                {selectedMood.id === 'browse' && 'Showing items in saved order'}
              </div>
            </div>
          </div>
        )}

        {/* Empty */}
        {!loading && validItems.length === 0 && (
          <div style={{ background: t.card, borderRadius: '20px', padding: '48px 24px', textAlign: 'center', border: `1px solid ${t.cardBorder}` }}>
            <div style={{ width: 80, height: 80, borderRadius: '50%', background: isDark ? 'rgba(245,87,108,0.1)' : 'rgba(245,87,108,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <FaHeart style={{ fontSize: '36px', color: '#f5576c', opacity: 0.4 }} />
            </div>
            <p style={{ fontSize: '20px', fontWeight: 800, color: t.text, margin: '0 0 8px' }}>Your wishlist is empty</p>
            <p style={{ fontSize: '13px', color: t.textMuted, margin: '0 0 28px', lineHeight: 1.6 }}>Start exploring and save products you love!</p>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button onClick={() => navigate('/')} style={{ padding: '12px 22px', background: activeMoodGradient, color: '#fff', border: 'none', borderRadius: '12px', fontWeight: 700, fontSize: '13px', cursor: 'pointer' }}>🛍️ Continue Browsing</button>
              <button onClick={() => navigate('/cart')} style={{ padding: '12px 22px', background: 'transparent', color: t.text, border: `2px solid ${t.cardBorder}`, borderRadius: '12px', fontWeight: 600, fontSize: '13px', cursor: 'pointer' }}>🛒 Go to Cart</button>
            </div>
            <div style={{ marginTop: '28px', paddingTop: '20px', borderTop: `1px solid ${t.cardBorder}` }}>
              <p style={{ fontSize: '11px', color: t.textMuted, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '12px' }}>Browse Popular Categories</p>
              <div style={{ display: 'flex', gap: '7px', justifyContent: 'center', flexWrap: 'wrap' }}>
                {[{ label: '📱 Mobiles', path: '/product-category?category=mobiles' }, { label: '📷 Camera', path: '/product-category?category=camera' }, { label: '🎵 Earphones', path: '/product-category?category=earphones' }, { label: '⌚ Watches', path: '/product-category?category=watches' }, { label: '🖱️ Mouse', path: '/product-category?category=mouse' }].map(cat => (
                  <button key={cat.label} onClick={() => navigate(cat.path)} style={{ padding: '6px 12px', background: t.chipBg, color: t.chipText, border: `1px solid ${isDark ? 'rgba(102,126,234,0.3)' : 'rgba(102,126,234,0.2)'}`, borderRadius: '20px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>{cat.label}</button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="wl-grid">
            {loadingCards.map((_, i) => (
              <div key={i} style={{ background: t.card, borderRadius: '18px', overflow: 'hidden', opacity: 0.6, border: `1px solid ${t.cardBorder}` }}>
                <div style={{ height: '180px', background: t.loadBg }} />
                <div style={{ padding: '14px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ height: '12px', background: t.loadBg, borderRadius: '5px' }} />
                  <div style={{ height: '10px', background: t.loadBg, borderRadius: '5px', width: '60%' }} />
                  <div style={{ height: '34px', background: t.loadBg, borderRadius: '8px' }} />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Grid */}
        {!loading && sortedItems.length > 0 && (
          <div className="wl-grid">
            {sortedItems.map((item) => {
              const product = item?.productId
              if (!product) return null
              const discount = product?.price > product?.sellingPrice ? Math.round(((product.price - product.sellingPrice) / product.price) * 100) : null
              const hasLetter = !!item?.letter
              const canReveal = hasLetter && item?.revealDate && new Date() >= new Date(item.revealDate)
              const daysOld = Math.floor((new Date() - new Date(item.createdAt)) / (1000 * 60 * 60 * 24))
              return (
                <div key={item?._id}
                  style={{ background: t.card, borderRadius: '18px', overflow: 'hidden', boxShadow: isDark ? '0 2px 12px rgba(0,0,0,0.3)' : '0 2px 12px rgba(0,0,0,0.06)', border: `1.5px solid ${t.cardBorder}`, transition: 'all 0.25s ease', position: 'relative' }}
                  onMouseEnter={e => { e.currentTarget.style.boxShadow = `0 12px 36px ${activeMoodColor}33`; e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.borderColor = activeMoodColor }}
                  onMouseLeave={e => { e.currentTarget.style.boxShadow = isDark ? '0 2px 12px rgba(0,0,0,0.3)' : '0 2px 12px rgba(0,0,0,0.06)'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = t.cardBorder }}
                >
                  {discount && <div style={{ position: 'absolute', top: '10px', left: '10px', background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', color: '#fff', fontSize: '10px', fontWeight: 700, padding: '3px 8px', borderRadius: '7px', zIndex: 2 }}>{discount}% OFF</div>}
                  <button onClick={() => removeFromWishlist(item?._id)} style={{ position: 'absolute', top: '10px', right: '10px', zIndex: 2, width: '30px', height: '30px', borderRadius: '50%', border: 'none', background: isDark ? 'rgba(245,87,108,0.25)' : 'rgba(245,87,108,0.12)', color: '#f5576c', fontSize: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}
                    onMouseEnter={e => { e.currentTarget.style.background = '#f5576c'; e.currentTarget.style.color = '#fff' }}
                    onMouseLeave={e => { e.currentTarget.style.background = isDark ? 'rgba(245,87,108,0.25)' : 'rgba(245,87,108,0.12)'; e.currentTarget.style.color = '#f5576c' }}
                  ><FaTrash /></button>
                  <button onClick={() => checkLetter(item)} style={{ position: 'absolute', top: '48px', right: '10px', zIndex: 2, width: '30px', height: '30px', borderRadius: '50%', border: 'none', background: canReveal ? 'linear-gradient(135deg, #f093fb, #f5576c)' : hasLetter ? (isDark ? 'rgba(102,126,234,0.3)' : 'rgba(102,126,234,0.15)') : (isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)'), color: canReveal ? '#fff' : hasLetter ? '#667eea' : t.textMuted, fontSize: '11px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s', animation: canReveal ? 'letterGlow 2s ease-in-out infinite' : 'none' }}>
                    {hasLetter ? (canReveal ? '💌' : <FaLock style={{ fontSize: '9px' }} />) : <FaEnvelope />}
                  </button>
                  {daysOld >= 7 && <div style={{ position: 'absolute', bottom: '82px', left: '10px', fontSize: '9px', fontWeight: 700, color: t.textMuted, background: isDark ? 'rgba(0,0,0,0.5)' : 'rgba(255,255,255,0.9)', padding: '2px 7px', borderRadius: '20px', backdropFilter: 'blur(4px)', zIndex: 2 }}>⏳ {daysOld}d ago</div>}
                  <Link to={`/product/${product?._id}`} style={{ textDecoration: 'none' }}>
                    <div style={{ height: '180px', background: t.imgBg, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', overflow: 'hidden' }}>
                      <img src={product?.productImage[0]} alt={product?.productName} style={{ maxHeight: '140px', maxWidth: '100%', objectFit: 'contain', mixBlendMode: isDark ? 'normal' : 'multiply', transition: 'transform 0.3s ease' }}
                        onMouseEnter={e => e.target.style.transform = 'scale(1.08)'}
                        onMouseLeave={e => e.target.style.transform = 'scale(1)'}
                      />
                    </div>
                  </Link>
                  <div style={{ padding: '12px 14px' }}>
                    <Link to={`/product/${product?._id}`} style={{ textDecoration: 'none' }}>
                      <h3 style={{ fontSize: '13px', fontWeight: 600, color: t.text, margin: '0 0 4px', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', lineHeight: 1.45, minHeight: '38px' }}>{product?.productName}</h3>
                    </Link>
                    <p style={{ fontSize: '11px', color: activeMoodColor, fontWeight: 600, margin: '0 0 8px', textTransform: 'capitalize' }}>{product?.category}</p>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '7px', marginBottom: '10px', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '15px', fontWeight: 800, background: activeMoodGradient, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>{displayINRCurrency(product?.sellingPrice)}</span>
                      {product?.price !== product?.sellingPrice && <span style={{ fontSize: '11px', color: t.textMuted, textDecoration: 'line-through' }}>{displayINRCurrency(product?.price)}</span>}
                    </div>
                    <button onClick={(e) => handleAddToCart(e, product?._id, item?._id)}
                      style={{ width: '100%', padding: '9px', borderRadius: '10px', border: 'none', background: activeMoodGradient, color: '#fff', fontSize: '12px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', transition: 'all 0.2s' }}
                      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.opacity = '0.9' }}
                      onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.opacity = '1' }}
                    ><FaShoppingCart style={{ fontSize: '12px' }} /> Add to Cart</button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Letter Modal */}
      {letterModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}
          onClick={(e) => { if (e.target === e.currentTarget) setLetterModal(null) }}>
          <div className="wl-modal-inner" style={{ boxShadow: '0 24px 80px rgba(0,0,0,0.3)' }}>
            <div style={{ textAlign: 'center', marginBottom: '22px' }}>
              <div style={{ fontSize: '40px', marginBottom: '10px' }}>💌</div>
              <h2 style={{ fontSize: '20px', fontWeight: 900, color: t.text, margin: '0 0 6px' }}>Letter to Future You</h2>
              <p style={{ fontSize: '12px', color: t.textMuted, lineHeight: 1.5, margin: 0 }}>Write a note about <strong style={{ color: t.text }}>{letterModal.item?.productId?.productName}</strong>.</p>
            </div>
            <div style={{ marginBottom: '14px' }}>
              <label style={{ fontSize: '11px', fontWeight: 700, color: t.textSub, textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: '6px' }}>Your message</label>
              <textarea value={letterText} onChange={e => setLetterText(e.target.value)} placeholder="Hey future me, I'm saving this because..." maxLength={500} rows={4}
                style={{ width: '100%', padding: '12px 14px', background: isDark ? 'rgba(255,255,255,0.05)' : '#f8f8fb', border: `1.5px solid ${t.modalBorder}`, borderRadius: '12px', color: t.text, fontSize: '13px', lineHeight: 1.6, resize: 'vertical', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}
                onFocus={e => e.target.style.borderColor = '#667eea'}
                onBlur={e => e.target.style.borderColor = t.modalBorder}
              />
              <div style={{ fontSize: '11px', color: t.textMuted, textAlign: 'right', marginTop: '3px' }}>{letterText.length}/500</div>
            </div>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ fontSize: '11px', fontWeight: 700, color: t.textSub, textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: '6px' }}>Reveal on</label>
              <input type="date" value={revealDate} min={new Date(Date.now() + 86400000).toISOString().split('T')[0]} onChange={e => setRevealDate(e.target.value)}
                style={{ width: '100%', padding: '11px 14px', background: isDark ? 'rgba(255,255,255,0.05)' : '#f8f8fb', border: `1.5px solid ${t.modalBorder}`, borderRadius: '12px', color: t.text, fontSize: '13px', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}
                onFocus={e => e.target.style.borderColor = '#667eea'}
                onBlur={e => e.target.style.borderColor = t.modalBorder}
              />
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={() => setLetterModal(null)} style={{ flex: 1, padding: '12px', background: 'none', border: `2px solid ${t.modalBorder}`, borderRadius: '12px', color: t.textMuted, fontWeight: 600, fontSize: '13px', cursor: 'pointer' }}>Cancel</button>
              <button onClick={saveLetter} disabled={letterSaving} style={{ flex: 2, padding: '12px', background: 'linear-gradient(135deg, #667eea, #764ba2)', border: 'none', borderRadius: '12px', color: '#fff', fontWeight: 700, fontSize: '13px', cursor: letterSaving ? 'not-allowed' : 'pointer', opacity: letterSaving ? 0.7 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                {letterSaving ? '💾 Saving...' : '💌 Seal the Letter'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reveal Modal */}
      {revealModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}
          onClick={(e) => { if (e.target === e.currentTarget) setRevealModal(null) }}>
          <div style={{ background: isDark ? 'linear-gradient(135deg, #2d2d2d, #1e1e2e)' : 'linear-gradient(135deg, #fffbf0, #fff5f8)', border: `1px solid ${isDark ? '#4d4d6d' : '#f0d9e8'}`, borderRadius: '24px', padding: '32px', width: '100%', maxWidth: '440px', boxShadow: '0 24px 80px rgba(245,87,108,0.2)', textAlign: 'center' }}>
            <div style={{ fontSize: '48px', marginBottom: '8px', animation: 'bounce 0.6s ease' }}>💌</div>
            <h2 style={{ fontSize: '19px', fontWeight: 900, color: t.text, margin: '0 0 6px' }}>A letter from past you</h2>
            <p style={{ fontSize: '12px', color: t.textMuted, margin: '0 0 20px' }}>Written on {new Date(revealModal.item.createdAt).toLocaleDateString()}</p>
            <div style={{ background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.8)', border: `1px dashed ${isDark ? '#4d4d4d' : '#ddd'}`, borderRadius: '14px', padding: '20px', textAlign: 'left', marginBottom: '20px' }}>
              <p style={{ fontSize: '14px', color: t.text, lineHeight: 1.7, margin: 0, fontStyle: 'italic', whiteSpace: 'pre-wrap' }}>"{revealModal.letter}"</p>
            </div>
            <p style={{ fontSize: '12px', color: t.textMuted, margin: '0 0 16px' }}>About: <strong style={{ color: t.text }}>{revealModal.item?.productId?.productName}</strong></p>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={() => setRevealModal(null)} style={{ flex: 1, padding: '11px', background: 'none', border: `2px solid ${t.modalBorder}`, borderRadius: '12px', color: t.textMuted, fontWeight: 600, fontSize: '13px', cursor: 'pointer' }}>Close</button>
              <button onClick={(e) => { handleAddToCart(e, revealModal.item?.productId?._id, revealModal.item?._id); setRevealModal(null) }} style={{ flex: 2, padding: '11px', background: 'linear-gradient(135deg, #f093fb, #f5576c)', border: 'none', borderRadius: '12px', color: '#fff', fontWeight: 700, fontSize: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                <FaShoppingCart /> Past-me agrees — Buy it!
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Wishlist