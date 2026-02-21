import React, { useCallback, useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import SummaryApi from '../common'
import { FaStar, FaEdit, FaTrash, FaCamera, FaShoppingCart, FaBolt, FaShieldAlt, FaTruck, FaUndo } from "react-icons/fa"
import displayINRCurrency from '../helpers/displayCurrency'
import CategroyWiseProductDisplay from '../components/CategoryWiseProductDisplay'
import addToCart from '../helpers/addToCart'
import Context from '../context'
import { toast } from 'react-toastify'
import ROLE from '../common/role'

const StarRating = ({ rating, onRate, interactive = false, size = 16 }) => {
  const [hover, setHover] = useState(0)
  return (
    <div style={{ display: 'flex', gap: '2px' }}>
      {[1,2,3,4,5].map((star) => (
        <span key={star}
          style={{ fontSize: `${size}px`, color: star <= (hover || rating) ? '#f59e0b' : '#d1d5db', cursor: interactive ? 'pointer' : 'default', transition: 'color 0.15s ease', userSelect: 'none' }}
          onMouseDown={(e) => { e.preventDefault(); if (interactive && onRate) onRate(star) }}
          onMouseEnter={() => interactive && setHover(star)}
          onMouseLeave={() => interactive && setHover(0)}
        >★</span>
      ))}
    </div>
  )
}

const ProductDetails = () => {
  const [data, setData] = useState({ productName: "", brandName: "", category: "", productImage: [], description: "", price: "", sellingPrice: "" })
  const params = useParams()
  const [loading, setLoading] = useState(true)
  const [activeImage, setActiveImage] = useState("")
  const [zoomImageCoordinate, setZoomImageCoordinate] = useState({ x: 0, y: 0 })
  const [zoomImage, setZoomImage] = useState(false)
  const { fetchUserAddToCart, isDark } = useContext(Context)
  const navigate = useNavigate()
  const user = useSelector(state => state?.user?.user)

  const [reviews, setReviews] = useState([])
  const [reviewLoading, setReviewLoading] = useState(false)
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [reviewForm, setReviewForm] = useState({ rating: 0, comment: '', images: [] })
  const [editingReview, setEditingReview] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [reviewImages, setReviewImages] = useState([])

  const fetchProductDetails = async () => {
    setLoading(true)
    const response = await fetch(SummaryApi.productDetails.url, {
      method: SummaryApi.productDetails.method,
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ productId: params?.id })
    })
    setLoading(false)
    const dataReponse = await response.json()
    if (dataReponse?.data) {
      setData(dataReponse.data)
      setActiveImage(dataReponse.data?.productImage[0])
    }
  }

  const fetchReviews = async () => {
    setReviewLoading(true)
    try {
      const response = await fetch(`${SummaryApi.getReviews.url}/${params?.id}`)
      const result = await response.json()
      if (result.success) setReviews(result.data)
    } catch (err) { console.log('Error fetching reviews:', err) }
    setReviewLoading(false)
  }

  useEffect(() => { fetchProductDetails(); fetchReviews() }, [params])

  const handleZoomImage = useCallback((e) => {
    setZoomImage(true)
    const { left, top, width, height } = e.target.getBoundingClientRect()
    setZoomImageCoordinate({ x: (e.clientX - left) / width, y: (e.clientY - top) / height })
  }, [])

  const handleAddToCart = async (e, id) => { await addToCart(e, id); fetchUserAddToCart() }
  const handleBuyProduct = async (e, id) => { await addToCart(e, id); fetchUserAddToCart(); navigate("/cart") }

  const handleReviewImageUpload = (e) => {
    const files = Array.from(e.target.files)
    files.forEach(file => {
      const url = URL.createObjectURL(file)
      setReviewImages(prev => [...prev, url])
      setReviewForm(prev => ({ ...prev, images: [...prev.images, url] }))
    })
  }

  const handleSubmitReview = async () => {
    if (!user?._id) { toast.error('Please login to leave a review'); navigate('/login'); return }
    if (reviewForm.rating === 0) { toast.error('Please select a rating'); return }
    if (!reviewForm.comment.trim()) { toast.error('Please write a comment'); return }
    setSubmitting(true)
    try {
      const url = editingReview ? SummaryApi.editReview.url : SummaryApi.addReview.url
      const body = editingReview ? { reviewId: editingReview._id, ...reviewForm } : { productId: params?.id, ...reviewForm }
      const response = await fetch(url, { method: 'POST', headers: { 'content-type': 'application/json' }, credentials: 'include', body: JSON.stringify(body) })
      const result = await response.json()
      if (result.success) {
        toast.success(editingReview ? 'Review updated!' : 'Review added!')
        setShowReviewForm(false); setEditingReview(null)
        setReviewForm({ rating: 0, comment: '', images: [] }); setReviewImages([])
        fetchReviews()
      } else toast.error(result.message)
    } catch { toast.error('Something went wrong') }
    setSubmitting(false)
  }

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm('Delete this review?')) return
    try {
      const response = await fetch(SummaryApi.deleteReview.url, { method: 'POST', headers: { 'content-type': 'application/json' }, credentials: 'include', body: JSON.stringify({ reviewId }) })
      const result = await response.json()
      if (result.success) { toast.success('Review deleted'); fetchReviews() }
      else toast.error(result.message)
    } catch { toast.error('Something went wrong') }
  }

  const handleEditReview = (review) => {
    setEditingReview(review)
    setReviewForm({ rating: review.rating, comment: review.comment, images: review.images })
    setReviewImages(review.images)
    setShowReviewForm(true)
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })
  }

  const avgRating = reviews.length ? (reviews.reduce((a, b) => a + b.rating, 0) / reviews.length).toFixed(1) : 0
  const discount = data?.price && data?.sellingPrice ? Math.round(((data.price - data.sellingPrice) / data.price) * 100) : 0

  const bg            = isDark ? '#111111' : '#f4f6fb'
  const cardBg        = isDark ? '#1e1e1e' : '#fff'
  const cardBorder    = isDark ? '#2e2e2e' : '#eee'
  const imagePanelBg  = 'transparent' 
  const thumbBg       = isDark ? '#242424' : '#fff'
  const textPrimary   = isDark ? '#f0f0f0' : '#111'
  const textSecondary = isDark ? '#888888' : '#666'
  const sectionBg     = isDark ? '#242424' : '#f9f9fb'
  const priceBg       = isDark ? '#242424' : 'linear-gradient(135deg, #f8f9ff, #f0f2ff)'
  const priceBorder   = isDark ? '#333333' : 'rgba(102,126,234,0.15)'
  const skeletonBg    = isDark ? '#2a2a2a' : '#f0f0f0'
  const reviewCardBg     = isDark ? '#16213e' : '#fff'
  const reviewCardBorder = isDark ? 'rgba(255,255,255,0.08)' : '#eee'
  const reviewSectionBg  = isDark ? 'rgba(255,255,255,0.05)' : '#f9f9fb'
  const reviewTextPri    = isDark ? '#fff' : '#111'
  const reviewTextSec    = isDark ? 'rgba(255,255,255,0.6)' : '#666'
  const reviewInputBg    = isDark ? '#0f3460' : '#fff'

  return (
    <>
      <style>{`
        .pd-page { min-height: 100vh; padding-bottom: 60px; transition: all 0.3s ease; }
        .pd-inner { max-width: 1200px; margin: 0 auto; padding: 32px 20px; }
        .pd-card { border-radius: 24px; overflow: hidden; margin-bottom: 32px; transition: all 0.3s ease; }
        .pd-card-body { display: flex; flex-wrap: wrap; }

        .pd-img-panel {
          width: 480px; min-width: 280px; flex: 0 0 480px;
          padding: 40px; display: flex; flex-direction: column;
          align-items: center; gap: 20px; position: relative;
        }
        .pd-main-img { width: 320px; height: 320px; display: flex; align-items: center; justify-content: center; overflow: hidden; border-radius: 16px; }

        .pd-info-panel { flex: 1; padding: 40px; display: flex; flex-direction: column; gap: 20px; min-width: 0; }

        .pd-actions { display: flex; gap: 12px; flex-wrap: wrap; }
        .pd-btn { padding: 14px 28px; border-radius: 14px; font-weight: 700; font-size: 15px; cursor: pointer; transition: all 0.3s ease; display: flex; align-items: center; gap: 8px; white-space: nowrap; font-family: inherit; }

        .pd-zoom { position: fixed; right: 40px; top: 100px; width: 360px; height: 360px; z-index: 100; border-radius: 20px; box-shadow: 0 16px 48px rgba(0,0,0,0.5); }

        .pd-review-header { padding: 32px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px; }
        .pd-review-body { padding: 32px; }
        .pd-review-form { border-radius: 20px; padding: 28px; margin-bottom: 28px; }
        .pd-review-card { border-radius: 20px; padding: 24px; transition: box-shadow 0.2s; }

        @media (max-width: 860px) {
          .pd-img-panel { width: 100% !important; flex: none !important; padding: 28px 20px !important; }
          .pd-main-img { width: 260px !important; height: 260px !important; }
          .pd-info-panel { padding: 24px 20px !important; gap: 16px !important; }
          .pd-zoom { display: none !important; }
        }

        @media (max-width: 600px) {
          .pd-inner { padding: 16px 12px !important; }
          .pd-img-panel { padding: 20px 16px !important; }
          .pd-main-img { width: 210px !important; height: 210px !important; }
          .pd-info-panel { padding: 16px !important; gap: 14px !important; }
          .pd-btn { padding: 11px 18px !important; font-size: 13px !important; }
          .pd-title { font-size: 20px !important; }
          .pd-selling-price { font-size: 26px !important; }
          .pd-review-header { padding: 20px 16px !important; }
          .pd-review-body { padding: 16px !important; }
          .pd-review-form { padding: 18px !important; }
          .pd-review-card { padding: 16px !important; }
          .pd-review-write-btn { padding: 9px 16px !important; font-size: 12px !important; }
          .pd-badges { gap: 12px !important; flex-wrap: wrap; }
        }

        @media (max-width: 420px) {
          .pd-actions { flex-direction: column; }
          .pd-btn { width: 100%; justify-content: center; }
          .pd-main-img { width: 180px !important; height: 180px !important; }
          .pd-review-header h2 { font-size: 17px !important; }
        }
      `}</style>

      <div className="pd-page" style={{ background: bg }}>
        <div className="pd-inner">

          <div className="pd-card" style={{ background: cardBg, boxShadow: isDark ? '0 8px 40px rgba(0,0,0,0.6)' : '0 8px 40px rgba(0,0,0,0.08)', border: `1px solid ${cardBorder}` }}>
            <div className="pd-card-body">

              {/* Left: Images */}
              <div className="pd-img-panel" style={{ background: imagePanelBg }}>
                {discount > 0 && (
                  <div style={{ position: 'absolute', top: '16px', left: '16px', background: 'linear-gradient(135deg, #667eea, #764ba2)', color: '#fff', fontWeight: 800, fontSize: '13px', padding: '5px 14px', borderRadius: '20px', boxShadow: '0 4px 16px rgba(102,126,234,0.4)' }}>
                    {discount}% OFF
                  </div>
                )}
                <div className="pd-main-img">
                  {loading
                    ? <div style={{ width: '100%', height: '100%', background: skeletonBg, borderRadius: '20px' }} />
                    : <img src={activeImage} style={{ width: '100%', height: '100%', objectFit: 'cover', cursor: 'crosshair', borderRadius: '16px' }}
                        onMouseMove={handleZoomImage} onMouseLeave={() => setZoomImage(false)} />
                  }
                  {zoomImage && (
                    <div className="pd-zoom" style={{ background: `url(${activeImage}) ${zoomImageCoordinate.x * 100}% ${zoomImageCoordinate.y * 100}% / 250% no-repeat`, border: `2px solid ${cardBorder}` }} />
                  )}
                </div>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
                  {loading ? [1,2,3].map(i => (
                    <div key={i} style={{ width: '56px', height: '56px', background: skeletonBg, borderRadius: '10px' }} />
                  )) : data?.productImage?.map((imgURL, index) => (
                    <div key={index} onClick={() => setActiveImage(imgURL)}
                      style={{ width: '56px', height: '56px', borderRadius: '10px', border: activeImage === imgURL ? '2.5px solid #667eea' : `2px solid ${cardBorder}`, overflow: 'hidden', cursor: 'pointer', padding: '4px', background: thumbBg, boxShadow: activeImage === imgURL ? '0 4px 12px rgba(102,126,234,0.3)' : 'none', transition: 'all 0.2s ease' }}>
                      <img src={imgURL} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                  ))}
                </div>
              </div>

              {/* Right: Info */}
              <div className="pd-info-panel">
                {loading ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    {[120, 260, 80, 150, 180, 100].map((w, i) => (
                      <div key={i} style={{ height: '22px', width: `${w}px`, background: skeletonBg, borderRadius: '8px' }} />
                    ))}
                  </div>
                ) : (
                  <>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                      <span style={{ background: isDark ? '#2a2a2a' : 'rgba(102,126,234,0.1)', color: '#667eea', fontWeight: 700, fontSize: '12px', padding: '5px 14px', borderRadius: '20px' }}>{data?.brandName}</span>
                      <span style={{ background: isDark ? '#1a2e1a' : 'rgba(34,197,94,0.15)', color: '#16a34a', fontWeight: 600, fontSize: '11px', padding: '4px 12px', borderRadius: '20px' }}>In Stock ✓</span>
                    </div>

                    <h1 className="pd-title" style={{ fontSize: '26px', fontWeight: 800, color: textPrimary, margin: 0, lineHeight: 1.3 }}>{data?.productName}</h1>

                    <p style={{ color: textSecondary, textTransform: 'capitalize', margin: 0, fontSize: '13px' }}>
                      Category: <strong style={{ color: '#667eea' }}>{data?.category}</strong>
                    </p>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', background: sectionBg, borderRadius: '10px', width: 'fit-content', border: `1px solid ${cardBorder}`, flexWrap: 'wrap' }}>
                      <StarRating rating={Math.round(avgRating)} size={16} />
                      <span style={{ fontWeight: 800, color: textPrimary, fontSize: '15px' }}>{avgRating}</span>
                      <span style={{ color: textSecondary, fontSize: '12px' }}>({reviews.length} reviews)</span>
                    </div>

                    <div style={{ padding: '16px', background: priceBg, borderRadius: '14px', border: `1px solid ${priceBorder}` }}>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', flexWrap: 'wrap' }}>
                        <span className="pd-selling-price" style={{ fontSize: '32px', fontWeight: 900, color: '#667eea' }}>
                          {displayINRCurrency(data.sellingPrice)}
                        </span>
                        <span style={{ fontSize: '16px', color: textSecondary, textDecoration: 'line-through' }}>
                          {displayINRCurrency(data.price)}
                        </span>
                        {discount > 0 && (
                          <span style={{ background: isDark ? '#1a2e1a' : 'rgba(34,197,94,0.15)', color: '#16a34a', fontWeight: 700, fontSize: '12px', padding: '3px 10px', borderRadius: '8px' }}>
                            Save {discount}% 🎉
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="pd-actions">
                      <button className="pd-btn"
                        onClick={(e) => handleBuyProduct(e, data?._id)}
                        style={{ border: '2.5px solid #667eea', background: 'transparent', color: '#667eea' }}
                        onMouseEnter={e => { e.currentTarget.style.background = '#667eea'; e.currentTarget.style.color = '#fff' }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#667eea' }}
                      ><FaBolt /> Buy Now</button>
                      <button className="pd-btn"
                        onClick={(e) => handleAddToCart(e, data?._id)}
                        style={{ background: 'linear-gradient(135deg, #667eea, #764ba2)', border: 'none', color: '#fff', boxShadow: '0 6px 20px rgba(102,126,234,0.4)' }}
                        onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 10px 28px rgba(102,126,234,0.5)' }}
                        onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(102,126,234,0.4)' }}
                      ><FaShoppingCart /> Add To Cart</button>
                    </div>

                    <div className="pd-badges" style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                      {[{ icon: <FaTruck />, text: 'Free Delivery' }, { icon: <FaShieldAlt />, text: 'Secure Payment' }, { icon: <FaUndo />, text: 'Easy Returns' }].map((b, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: textSecondary, fontWeight: 600 }}>
                          <span style={{ color: '#667eea' }}>{b.icon}</span>{b.text}
                        </div>
                      ))}
                    </div>

                    <div style={{ padding: '14px 18px', background: sectionBg, borderRadius: '12px', border: `1px solid ${cardBorder}`, borderLeft: '4px solid #667eea' }}>
                      <p style={{ fontWeight: 700, color: textPrimary, margin: '0 0 6px', fontSize: '13px' }}>📦 Description</p>
                      <p style={{ color: textSecondary, margin: 0, lineHeight: 1.8, fontSize: '13px' }}>{data?.description}</p>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {data?.category && (
            <div style={{ marginBottom: '32px' }}>
              <CategroyWiseProductDisplay category={data?.category} heading={"Recommended Products"} isDark={isDark} />
            </div>
          )}

          {/* Reviews */}
          <div style={{ background: reviewCardBg, borderRadius: '28px', boxShadow: isDark ? '0 8px 40px rgba(0,0,0,0.4)' : '0 8px 40px rgba(0,0,0,0.08)', overflow: 'hidden', border: `1px solid ${reviewCardBorder}` }}>
            <div className="pd-review-header">
              <div>
                <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#fff', margin: '0 0 8px' }}>⭐ Customer Reviews</h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                  <StarRating rating={Math.round(avgRating)} size={16} />
                  <span style={{ fontWeight: 800, fontSize: '18px', color: '#fff' }}>{avgRating}</span>
                  <span style={{ color: 'rgba(255,255,255,0.75)', fontSize: '13px' }}>out of 5 · {reviews.length} reviews</span>
                </div>
              </div>
              {user?._id && (
                <button className="pd-review-write-btn"
                  onClick={() => { setShowReviewForm(!showReviewForm); setEditingReview(null); setReviewForm({ rating: 0, comment: '', images: [] }); setReviewImages([]) }}
                  style={{ padding: '12px 22px', borderRadius: '12px', background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(10px)', color: '#fff', border: '2px solid rgba(255,255,255,0.4)', fontWeight: 700, fontSize: '14px', cursor: 'pointer', transition: 'all 0.3s ease', whiteSpace: 'nowrap' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.3)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
                >{showReviewForm ? '✕ Cancel' : '+ Write a Review'}</button>
              )}
            </div>

            <div className="pd-review-body">
              {showReviewForm && (
                <div className="pd-review-form" style={{ background: reviewSectionBg, border: `1.5px solid ${isDark ? 'rgba(102,126,234,0.3)' : 'rgba(102,126,234,0.2)'}` }}>
                  <h3 style={{ margin: '0 0 20px', fontWeight: 800, color: reviewTextPri, fontSize: '18px' }}>
                    {editingReview ? '✏️ Edit Your Review' : '✍️ Write a Review'}
                  </h3>
                  <div style={{ marginBottom: '20px' }}>
                    <p style={{ fontWeight: 700, color: reviewTextPri, margin: '0 0 10px', fontSize: '14px' }}>Your Rating *</p>
                    <StarRating rating={reviewForm.rating} onRate={(r) => setReviewForm(prev => ({ ...prev, rating: r }))} interactive size={28} />
                    <p style={{ color: reviewTextSec, fontSize: '12px', margin: '5px 0 0' }}>
                      {reviewForm.rating > 0 ? ['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'][reviewForm.rating] : 'Click to rate'}
                    </p>
                  </div>
                  <div style={{ marginBottom: '20px' }}>
                    <p style={{ fontWeight: 700, color: reviewTextPri, margin: '0 0 10px', fontSize: '14px' }}>Your Comment *</p>
                    <textarea value={reviewForm.comment} onChange={(e) => setReviewForm(prev => ({ ...prev, comment: e.target.value }))}
                      placeholder="Share your experience..." rows={4}
                      style={{ width: '100%', padding: '12px 14px', borderRadius: '12px', border: `1.5px solid ${isDark ? 'rgba(255,255,255,0.1)' : '#e0e0e0'}`, fontSize: '14px', fontFamily: 'inherit', resize: 'vertical', outline: 'none', boxSizing: 'border-box', background: reviewInputBg, color: reviewTextPri, transition: 'border 0.2s' }}
                      onFocus={e => e.target.style.border = '1.5px solid #667eea'}
                      onBlur={e => e.target.style.border = `1.5px solid ${isDark ? 'rgba(255,255,255,0.1)' : '#e0e0e0'}`}
                    />
                  </div>
                  <div style={{ marginBottom: '22px' }}>
                    <p style={{ fontWeight: 700, color: reviewTextPri, margin: '0 0 10px', fontSize: '14px' }}>Add Photos (optional)</p>
                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
                      {reviewImages.map((img, i) => (
                        <div key={i} style={{ position: 'relative' }}>
                          <img src={img} style={{ width: '72px', height: '72px', borderRadius: '10px', objectFit: 'cover', border: `2px solid ${reviewCardBorder}` }} />
                          <button onClick={() => { const n = reviewImages.filter((_, idx) => idx !== i); setReviewImages(n); setReviewForm(prev => ({ ...prev, images: n })) }}
                            style={{ position: 'absolute', top: '-7px', right: '-7px', background: '#f5576c', color: '#fff', border: 'none', borderRadius: '50%', width: '20px', height: '20px', cursor: 'pointer', fontSize: '10px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
                        </div>
                      ))}
                      <label style={{ width: '72px', height: '72px', borderRadius: '10px', border: '2px dashed #667eea', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#667eea', fontSize: '10px', fontWeight: 700, gap: '4px', background: isDark ? 'rgba(102,126,234,0.1)' : 'rgba(102,126,234,0.05)' }}>
                        <FaCamera style={{ fontSize: '18px' }} /> Add Photo
                        <input type="file" multiple accept="image/*" style={{ display: 'none' }} onChange={handleReviewImageUpload} />
                      </label>
                    </div>
                  </div>
                  <button onClick={handleSubmitReview} disabled={submitting}
                    style={{ padding: '13px 32px', borderRadius: '12px', background: submitting ? '#ccc' : 'linear-gradient(135deg, #667eea, #764ba2)', color: '#fff', border: 'none', fontWeight: 700, fontSize: '14px', cursor: submitting ? 'not-allowed' : 'pointer', boxShadow: '0 6px 20px rgba(102,126,234,0.35)', transition: 'all 0.3s ease' }}>
                    {submitting ? '⏳ Submitting...' : editingReview ? '✅ Update Review' : '🚀 Submit Review'}
                  </button>
                </div>
              )}

              {reviewLoading ? (
                <div style={{ textAlign: 'center', padding: '40px', color: reviewTextSec }}>Loading reviews...</div>
              ) : reviews.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '48px 20px' }}>
                  <div style={{ fontSize: '56px', marginBottom: '14px' }}>⭐</div>
                  <p style={{ color: reviewTextPri, fontSize: '17px', fontWeight: 700, margin: '0 0 6px' }}>No reviews yet</p>
                  <p style={{ color: reviewTextSec, fontSize: '13px', margin: 0 }}>Be the first to review this product!</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {reviews.map((review) => (
                    <div key={review._id} className="pd-review-card"
                      style={{ background: reviewSectionBg, border: `1px solid ${reviewCardBorder}` }}
                      onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 20px rgba(102,126,234,0.15)'}
                      onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px' }}>
                        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                          <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'linear-gradient(135deg, #667eea, #764ba2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: '18px', flexShrink: 0 }}>
                            {review.userProfilePic
                              ? <img src={review.userProfilePic} style={{ width: '44px', height: '44px', borderRadius: '50%', objectFit: 'cover' }} />
                              : review.userName?.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p style={{ fontWeight: 700, color: reviewTextPri, margin: '0 0 3px', textTransform: 'capitalize', fontSize: '14px' }}>{review.userName}</p>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                              <StarRating rating={review.rating} size={13} />
                              <span style={{ fontSize: '11px', color: reviewTextSec }}>
                                {new Date(review.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                          {user?._id && review.userId === user._id && (
                            <button onClick={() => handleEditReview(review)}
                              style={{ padding: '6px 12px', borderRadius: '8px', background: 'rgba(102,126,234,0.15)', color: '#667eea', border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <FaEdit /> Edit
                            </button>
                          )}
                          {user?._id && (review.userId === user._id || user.role === ROLE.ADMIN) && (
                            <button onClick={() => handleDeleteReview(review._id)}
                              style={{ padding: '6px 12px', borderRadius: '8px', background: 'rgba(245,87,108,0.15)', color: '#f5576c', border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <FaTrash /> Delete
                            </button>
                          )}
                        </div>
                      </div>
                      <p style={{ color: reviewTextSec, margin: '14px 0 0', lineHeight: 1.8, fontSize: '13px' }}>{review.comment}</p>
                      {review.images?.length > 0 && (
                        <div style={{ display: 'flex', gap: '8px', marginTop: '12px', flexWrap: 'wrap' }}>
                          {review.images.map((img, i) => (
                            <img key={i} src={img} style={{ width: '68px', height: '68px', borderRadius: '10px', objectFit: 'cover', cursor: 'pointer', border: `2px solid ${reviewCardBorder}` }} onClick={() => window.open(img, '_blank')} />
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default ProductDetails