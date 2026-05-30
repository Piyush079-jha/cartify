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

const StarRating = ({ rating, onRate, interactive = false, size = 15 }) => {
  const [hover, setHover] = useState(0)
  return (
    <div style={{ display: 'flex', gap: '2px' }}>
      {[1,2,3,4,5].map((star) => (
        <span key={star}
          style={{
            fontSize: `${size}px`,
            color: star <= (hover || rating) ? '#c9a84c' : 'rgba(201,168,76,0.2)',
            cursor: interactive ? 'pointer' : 'default',
            transition: 'color 0.15s ease',
            userSelect: 'none'
          }}
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

  /* ── Tokens ── */
  const bg       = isDark ? '#0e0e0e'                 : '#faf9f7'
  const surface  = isDark ? '#161616'                 : '#ffffff'
  const surfaceAlt = isDark ? '#1c1c1c'               : '#f7f6f4'
  const text     = isDark ? '#e8e4dc'                 : '#1a1814'
  const muted    = isDark ? 'rgba(160,152,144,0.8)'   : 'rgba(130,125,118,0.9)'
  const border   = isDark ? 'rgba(255,255,255,0.07)'  : 'rgba(26,24,20,0.08)'
  const imgBg    = isDark ? 'rgba(255,255,255,0.02)'  : '#f7f6f4'
  const gold     = '#c9a84c'
  const skelBg   = isDark ? 'rgba(255,255,255,0.04)'  : 'rgba(26,24,20,0.04)'

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
  const discount  = data?.price && data?.sellingPrice ? Math.round(((data.price - data.sellingPrice) / data.price) * 100) : 0

  return (
    <>
      <style>{`
        .pd-page { min-height: 100vh; background: ${bg}; padding-bottom: 80px; }
        .pd-inner { max-width: 1200px; margin: 0 auto; padding: 32px 24px; }

        /* Main product card */
        .pd-card {
          display: flex;
          flex-wrap: wrap;
          background: ${surface};
          border: 0.5px solid ${border};
          margin-bottom: 40px;
          overflow: hidden;
        }

        /* Image panel */
        .pd-img-panel {
          width: 440px;
          min-width: 260px;
          flex: 0 0 440px;
          padding: 40px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 20px;
          background: ${imgBg};
          border-right: 0.5px solid ${border};
          position: relative;
        }
        .pd-main-img-wrap {
          width: 300px;
          height: 300px;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          position: relative;
        }
        .pd-main-img-wrap img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          cursor: crosshair;
          mix-blend-mode: ${isDark ? 'lighten' : 'multiply'};
          transition: transform 0.4s ease;
        }
        .pd-main-img-wrap:hover img { transform: scale(1.04); }

        /* Zoom lens */
        .pd-zoom-lens {
          position: fixed;
          right: 40px;
          top: 100px;
          width: 340px;
          height: 340px;
          z-index: 100;
          border: 0.5px solid ${border};
          box-shadow: 0 20px 60px rgba(0,0,0,0.3);
          pointer-events: none;
          background: ${surface};
        }

        /* Thumbnail strip */
        .pd-thumbs {
          display: flex;
          gap: 6px;
          flex-wrap: wrap;
          justify-content: center;
        }
        .pd-thumb {
          width: 52px;
          height: 52px;
          border: 0.5px solid ${border};
          overflow: hidden;
          cursor: pointer;
          padding: 5px;
          background: ${surface};
          transition: border-color 0.2s ease;
        }
        .pd-thumb.active { border-color: ${gold}; }
        .pd-thumb:hover { border-color: ${gold}; }
        .pd-thumb img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          mix-blend-mode: ${isDark ? 'lighten' : 'multiply'};
        }

        /* Discount tag */
        .pd-discount-tag {
          position: absolute;
          top: 16px;
          left: 16px;
          background: rgba(201,168,76,0.12);
          color: ${gold};
          font-size: 9px;
          font-weight: 500;
          padding: 3px 9px;
          letter-spacing: 0.1em;
          border: 0.5px solid rgba(201,168,76,0.25);
        }

        /* Info panel */
        .pd-info-panel {
          flex: 1;
          padding: 40px;
          display: flex;
          flex-direction: column;
          gap: 22px;
          min-width: 0;
        }

        /* Brand + stock row */
        .pd-meta-row {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
        }
        .pd-brand-badge {
          font-size: 9px;
          font-weight: 500;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: ${gold};
          background: rgba(201,168,76,0.08);
          border: 0.5px solid rgba(201,168,76,0.2);
          padding: 4px 10px;
        }
        .pd-stock-badge {
          font-size: 9px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: rgba(80,180,100,0.9);
          background: rgba(80,180,100,0.08);
          border: 0.5px solid rgba(80,180,100,0.2);
          padding: 4px 10px;
        }

        .pd-title {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: 28px;
          font-weight: 300;
          color: ${text};
          margin: 0;
          line-height: 1.3;
          letter-spacing: -0.01em;
        }

        .pd-category {
          font-size: 11px;
          color: ${muted};
          letter-spacing: 0.06em;
          text-transform: capitalize;
        }
        .pd-category span { color: ${gold}; }

        /* Rating row */
        .pd-rating-row {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
        }
        .pd-rating-score {
          font-size: 14px;
          font-weight: 500;
          color: ${text};
        }
        .pd-rating-count {
          font-size: 11px;
          color: ${muted};
          letter-spacing: 0.04em;
        }

        /* Price block */
        .pd-price-block {
          padding: 18px 20px;
          background: ${surfaceAlt};
          border: 0.5px solid ${border};
          border-left: 1.5px solid ${gold};
        }
        .pd-price-row {
          display: flex;
          align-items: baseline;
          gap: 12px;
          flex-wrap: wrap;
        }
        .pd-selling-price {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: 34px;
          font-weight: 300;
          color: ${text};
          letter-spacing: -0.02em;
        }
        .pd-original-price {
          font-size: 15px;
          color: ${muted};
          text-decoration: line-through;
        }
        .pd-save-badge {
          font-size: 9px;
          color: rgba(80,180,100,0.9);
          background: rgba(80,180,100,0.08);
          border: 0.5px solid rgba(80,180,100,0.2);
          padding: 3px 8px;
          letter-spacing: 0.08em;
        }

        /* Action buttons */
        .pd-actions { display: flex; gap: 10px; flex-wrap: wrap; }
        .pd-btn {
          padding: 12px 26px;
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.25s ease;
          display: flex;
          align-items: center;
          gap: 8px;
          font-family: 'DM Sans', sans-serif;
          border-radius: 1px;
          white-space: nowrap;
        }
        .pd-btn-buy {
          background: transparent;
          border: 0.5px solid ${border};
          color: ${muted};
        }
        .pd-btn-buy:hover {
          border-color: ${gold};
          color: ${gold};
          background: rgba(201,168,76,0.04);
        }
        .pd-btn-cart {
          background: ${gold};
          border: 0.5px solid ${gold};
          color: #0a0a0a;
          box-shadow: 0 0 20px rgba(201,168,76,0.18);
        }
        .pd-btn-cart:hover {
          background: #b8953e;
          border-color: #b8953e;
          transform: translateY(-1px);
          box-shadow: 0 4px 20px rgba(201,168,76,0.28);
        }

        /* Trust badges */
        .pd-trust-row {
          display: flex;
          gap: 20px;
          flex-wrap: wrap;
        }
        .pd-trust-item {
          display: flex;
          align-items: center;
          gap: 7px;
          font-size: 11px;
          color: ${muted};
          letter-spacing: 0.04em;
        }
        .pd-trust-item svg { color: ${gold}; font-size: 12px; }

        /* Description */
        .pd-desc-block {
          padding: 16px 18px;
          background: ${surfaceAlt};
          border: 0.5px solid ${border};
          border-left: 1.5px solid ${border};
        }
        .pd-desc-label {
          font-size: 9px;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: ${muted};
          margin: 0 0 10px;
        }
        .pd-desc-text {
          font-size: 13px;
          color: ${muted};
          line-height: 1.85;
          margin: 0;
          letter-spacing: 0.01em;
        }

        /* Skeleton */
        .pd-skel {
          background: ${skelBg};
          animation: pdPulse 1.8s ease-in-out infinite;
          border-radius: 1px;
        }
        @keyframes pdPulse {
          0%, 100% { opacity: 0.65; }
          50%       { opacity: 0.25; }
        }

        /* Reviews section */
        .pd-reviews {
          background: ${surface};
          border: 0.5px solid ${border};
          overflow: hidden;
          margin-top: 2px;
        }
        .pd-reviews-header {
          padding: 28px 32px;
          border-bottom: 0.5px solid ${border};
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 16px;
          background: ${isDark ? '#111110' : '#111110'};
        }
        .pd-reviews-title {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: 22px;
          font-weight: 300;
          color: #e8e4dc;
          margin: 0 0 8px;
        }
        .pd-review-btn {
          padding: 10px 20px;
          background: transparent;
          border: 0.5px solid rgba(201,168,76,0.4);
          color: #c9a84c;
          font-size: 10px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.22s ease;
          font-family: 'DM Sans', sans-serif;
          white-space: nowrap;
          border-radius: 1px;
        }
        .pd-review-btn:hover {
          background: #c9a84c;
          color: #0a0a0a;
        }

        .pd-reviews-body { padding: 28px 32px; }

        /* Review form */
        .pd-review-form {
          background: ${surfaceAlt};
          border: 0.5px solid ${border};
          padding: 24px;
          margin-bottom: 28px;
        }
        .pd-review-form-title {
          font-size: 14px;
          font-weight: 400;
          color: ${text};
          margin: 0 0 20px;
          letter-spacing: 0.02em;
        }
        .pd-review-label {
          font-size: 9px;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: ${muted};
          display: block;
          margin-bottom: 10px;
        }
        .pd-review-textarea {
          width: 100%;
          padding: 12px 14px;
          background: ${surface};
          border: 0.5px solid ${border};
          color: ${text};
          font-size: 13px;
          font-family: 'DM Sans', sans-serif;
          resize: vertical;
          outline: none;
          box-sizing: border-box;
          transition: border-color 0.2s ease;
          border-radius: 1px;
          letter-spacing: 0.02em;
          line-height: 1.7;
        }
        .pd-review-textarea::placeholder { color: ${muted}; opacity: 0.6; }
        .pd-review-textarea:focus { border-color: ${gold}; }

        .pd-review-submit {
          padding: 11px 28px;
          background: transparent;
          border: 0.5px solid ${gold};
          color: ${gold};
          font-size: 10px;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.22s ease;
          font-family: 'DM Sans', sans-serif;
          border-radius: 1px;
          margin-top: 4px;
        }
        .pd-review-submit:hover:not(:disabled) {
          background: ${gold};
          color: #0a0a0a;
        }
        .pd-review-submit:disabled { opacity: 0.4; cursor: not-allowed; }

        /* Review card */
        .pd-review-card {
          padding: 20px 0;
          border-bottom: 0.5px solid ${border};
        }
        .pd-review-card:last-child { border-bottom: none; }

        .pd-reviewer-name {
          font-size: 13px;
          font-weight: 500;
          color: ${text};
          margin: 0 0 3px;
          text-transform: capitalize;
          letter-spacing: 0.02em;
        }
        .pd-reviewer-date {
          font-size: 10px;
          color: ${muted};
          letter-spacing: 0.06em;
        }
        .pd-review-comment {
          font-size: 13px;
          color: ${muted};
          margin: 12px 0 0;
          line-height: 1.8;
          letter-spacing: 0.01em;
        }
        .pd-review-action-btn {
          padding: 5px 12px;
          background: transparent;
          border: 0.5px solid ${border};
          color: ${muted};
          font-size: 10px;
          letter-spacing: 0.08em;
          cursor: pointer;
          transition: all 0.2s ease;
          font-family: 'DM Sans', sans-serif;
          display: flex;
          align-items: center;
          gap: 5px;
          border-radius: 1px;
        }
        .pd-review-action-btn.edit:hover { border-color: ${gold}; color: ${gold}; }
        .pd-review-action-btn.del:hover  { border-color: rgba(180,60,60,0.5); color: #b44040; }

        /* Empty reviews */
        .pd-reviews-empty {
          text-align: center;
          padding: 60px 20px;
        }
        .pd-reviews-empty-icon {
          font-size: '★';
          font-size: 32px;
          color: rgba(201,168,76,0.2);
          margin-bottom: 16px;
        }

        /* Responsive */
        @media (max-width: 860px) {
          .pd-img-panel { width: 100% !important; flex: none !important; padding: 28px !important; border-right: none !important; border-bottom: 0.5px solid ${border}; }
          .pd-main-img-wrap { width: 240px !important; height: 240px !important; }
          .pd-info-panel { padding: 24px !important; }
          .pd-zoom-lens { display: none !important; }
          .pd-reviews-header { padding: 20px 24px !important; }
          .pd-reviews-body { padding: 20px 24px !important; }
        }
        @media (max-width: 600px) {
          .pd-inner { padding: 16px !important; }
          .pd-img-panel { padding: 20px !important; }
          .pd-main-img-wrap { width: 200px !important; height: 200px !important; }
          .pd-info-panel { padding: 20px !important; gap: 16px !important; }
          .pd-title { font-size: 24px !important; }
          .pd-selling-price { font-size: 28px !important; }
          .pd-actions { flex-direction: column; }
          .pd-btn { width: 100%; justify-content: center; }
          .pd-reviews-header { padding: 16px !important; }
          .pd-reviews-body { padding: 16px !important; }
          .pd-review-form { padding: 16px !important; }
        }
      `}</style>

      <div className="pd-page">
        <div className="pd-inner">

          {/* Product card */}
          <div className="pd-card">

            {/* Image panel */}
            <div className="pd-img-panel">
              {discount > 0 && !loading && (
                <div className="pd-discount-tag">−{discount}%</div>
              )}

              <div className="pd-main-img-wrap">
                {loading
                  ? <div className="pd-skel" style={{ width: '280px', height: '280px' }} />
                  : <>
                      <img
                        src={activeImage}
                        alt={data.productName}
                        onMouseMove={handleZoomImage}
                        onMouseLeave={() => setZoomImage(false)}
                      />
                      {zoomImage && (
                        <div className="pd-zoom-lens" style={{
                          backgroundImage: `url(${activeImage})`,
                          backgroundPosition: `${zoomImageCoordinate.x * 100}% ${zoomImageCoordinate.y * 100}%`,
                          backgroundSize: '250%',
                          backgroundRepeat: 'no-repeat'
                        }} />
                      )}
                    </>
                }
              </div>

              <div className="pd-thumbs">
                {loading
                  ? [1,2,3].map(i => <div key={i} className="pd-skel" style={{ width: '52px', height: '52px' }} />)
                  : data?.productImage?.map((imgURL, index) => (
                      <div
                        key={index}
                        className={`pd-thumb${activeImage === imgURL ? ' active' : ''}`}
                        onClick={() => setActiveImage(imgURL)}
                      >
                        <img src={imgURL} alt="" />
                      </div>
                    ))
                }
              </div>
            </div>

            {/* Info panel */}
            <div className="pd-info-panel">
              {loading ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {[100, 240, 70, 160, 120, 180, 200].map((w, i) => (
                    <div key={i} className="pd-skel" style={{ height: '18px', width: `${w}px`, animationDelay: `${i * 0.08}s` }} />
                  ))}
                </div>
              ) : (
                <>
                  <div className="pd-meta-row">
                    <span className="pd-brand-badge">{data?.brandName}</span>
                    <span className="pd-stock-badge">In Stock</span>
                  </div>

                  <h1 className="pd-title">{data?.productName}</h1>

                  <p className="pd-category">
                    Category: <span>{data?.category}</span>
                  </p>

                  <div className="pd-rating-row">
                    <StarRating rating={Math.round(avgRating)} size={14} />
                    <span className="pd-rating-score">{avgRating}</span>
                    <span className="pd-rating-count">({reviews.length} reviews)</span>
                  </div>

                  <div className="pd-price-block">
                    <div className="pd-price-row">
                      <span className="pd-selling-price">{displayINRCurrency(data.sellingPrice)}</span>
                      <span className="pd-original-price">{displayINRCurrency(data.price)}</span>
                      {discount > 0 && (
                        <span className="pd-save-badge">Save {discount}%</span>
                      )}
                    </div>
                  </div>

                  <div className="pd-actions">
                    <button className="pd-btn pd-btn-buy" onClick={(e) => handleBuyProduct(e, data?._id)}>
                      <FaBolt style={{ fontSize: '10px' }} /> Buy Now
                    </button>
                    <button className="pd-btn pd-btn-cart" onClick={(e) => handleAddToCart(e, data?._id)}>
                      <FaShoppingCart style={{ fontSize: '10px' }} /> Add to Cart
                    </button>
                  </div>

                  <div className="pd-trust-row">
                    {[
                      { icon: <FaTruck />, label: 'Free Delivery' },
                      { icon: <FaShieldAlt />, label: 'Secure Payment' },
                      { icon: <FaUndo />, label: 'Easy Returns' }
                    ].map((b, i) => (
                      <div key={i} className="pd-trust-item">
                        {b.icon} {b.label}
                      </div>
                    ))}
                  </div>

                  <div className="pd-desc-block">
                    <p className="pd-desc-label">Description</p>
                    <p className="pd-desc-text">{data?.description}</p>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Related products */}
          {data?.category && (
            <div style={{ marginBottom: '2px' }}>
              <CategroyWiseProductDisplay category={data?.category} heading={"You may also like"} isDark={isDark} />
            </div>
          )}

          {/* Reviews */}
          <div className="pd-reviews">
            <div className="pd-reviews-header">
              <div>
                <h2 className="pd-reviews-title">Customer Reviews</h2>
                <div className="pd-rating-row">
                  <StarRating rating={Math.round(avgRating)} size={14} />
                  <span style={{ fontWeight: 500, fontSize: '15px', color: '#e8e4dc' }}>{avgRating}</span>
                  <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.04em' }}>
                    {reviews.length} review{reviews.length !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>
              {user?._id && (
                <button className="pd-review-btn" onClick={() => {
                  setShowReviewForm(!showReviewForm)
                  setEditingReview(null)
                  setReviewForm({ rating: 0, comment: '', images: [] })
                  setReviewImages([])
                }}>
                  {showReviewForm ? 'Cancel' : 'Write a Review'}
                </button>
              )}
            </div>

            <div className="pd-reviews-body">

              {/* Review form */}
              {showReviewForm && (
                <div className="pd-review-form">
                  <p className="pd-review-form-title">
                    {editingReview ? 'Edit your review' : 'Write a review'}
                  </p>

                  <div style={{ marginBottom: '18px' }}>
                    <label className="pd-review-label">Your Rating</label>
                    <StarRating
                      rating={reviewForm.rating}
                      onRate={(r) => setReviewForm(prev => ({ ...prev, rating: r }))}
                      interactive size={22}
                    />
                    {reviewForm.rating > 0 && (
                      <p style={{ fontSize: '11px', color: gold, marginTop: '6px', letterSpacing: '0.06em' }}>
                        {['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'][reviewForm.rating]}
                      </p>
                    )}
                  </div>

                  <div style={{ marginBottom: '18px' }}>
                    <label className="pd-review-label">Your Comment</label>
                    <textarea
                      value={reviewForm.comment}
                      onChange={(e) => setReviewForm(prev => ({ ...prev, comment: e.target.value }))}
                      placeholder="Share your experience with this product..."
                      rows={4}
                      className="pd-review-textarea"
                    />
                  </div>

                  <div style={{ marginBottom: '20px' }}>
                    <label className="pd-review-label">Photos (optional)</label>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
                      {reviewImages.map((img, i) => (
                        <div key={i} style={{ position: 'relative' }}>
                          <img src={img} style={{ width: '60px', height: '60px', objectFit: 'cover', border: `0.5px solid ${border}` }} />
                          <button onClick={() => {
                            const n = reviewImages.filter((_, idx) => idx !== i)
                            setReviewImages(n)
                            setReviewForm(prev => ({ ...prev, images: n }))
                          }} style={{ position: 'absolute', top: '-6px', right: '-6px', background: '#111', border: `0.5px solid ${border}`, color: muted, width: '18px', height: '18px', cursor: 'pointer', fontSize: '9px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%' }}>✕</button>
                        </div>
                      ))}
                      <label style={{
                        width: '60px', height: '60px',
                        border: `0.5px dashed rgba(201,168,76,0.3)`,
                        display: 'flex', flexDirection: 'column',
                        alignItems: 'center', justifyContent: 'center',
                        cursor: 'pointer', color: gold,
                        fontSize: '9px', gap: '4px',
                        letterSpacing: '0.06em',
                        transition: 'border-color 0.2s ease'
                      }}>
                        <FaCamera style={{ fontSize: '14px' }} />
                        Add
                        <input type="file" multiple accept="image/*" style={{ display: 'none' }} onChange={handleReviewImageUpload} />
                      </label>
                    </div>
                  </div>

                  <button className="pd-review-submit" onClick={handleSubmitReview} disabled={submitting}>
                    {submitting ? 'Submitting...' : editingReview ? 'Update Review' : 'Submit Review'}
                  </button>
                </div>
              )}

              {/* Review list */}
              {reviewLoading ? (
                <div style={{ padding: '40px 0', textAlign: 'center' }}>
                  <div className="pd-skel" style={{ height: '12px', width: '120px', margin: '0 auto' }} />
                </div>
              ) : reviews.length === 0 ? (
                <div className="pd-reviews-empty">
                  <div className="pd-reviews-empty-icon">★</div>
                  <p style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: '20px', fontWeight: 300, color: text, margin: '0 0 6px' }}>
                    No reviews yet
                  </p>
                  <p style={{ fontSize: '12px', color: muted, letterSpacing: '0.04em' }}>
                    Be the first to share your experience
                  </p>
                </div>
              ) : (
                <div>
                  {reviews.map((review) => (
                    <div key={review._id} className="pd-review-card">
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px' }}>
                        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                          <div style={{
                            width: '38px', height: '38px', borderRadius: '50%',
                            border: `0.5px solid ${border}`,
                            background: isDark ? 'rgba(201,168,76,0.08)' : 'rgba(201,168,76,0.06)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: gold, fontWeight: 500, fontSize: '15px', flexShrink: 0, overflow: 'hidden'
                          }}>
                            {review.userProfilePic
                              ? <img src={review.userProfilePic} style={{ width: '38px', height: '38px', borderRadius: '50%', objectFit: 'cover' }} />
                              : review.userName?.charAt(0).toUpperCase()
                            }
                          </div>
                          <div>
                            <p className="pd-reviewer-name">{review.userName}</p>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                              <StarRating rating={review.rating} size={12} />
                              <span className="pd-reviewer-date">
                                {new Date(review.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div style={{ display: 'flex', gap: '6px' }}>
                          {user?._id && review.userId === user._id && (
                            <button className="pd-review-action-btn edit" onClick={() => handleEditReview(review)}>
                              <FaEdit style={{ fontSize: '10px' }} /> Edit
                            </button>
                          )}
                          {user?._id && (review.userId === user._id || user.role === ROLE.ADMIN) && (
                            <button className="pd-review-action-btn del" onClick={() => handleDeleteReview(review._id)}>
                              <FaTrash style={{ fontSize: '10px' }} /> Delete
                            </button>
                          )}
                        </div>
                      </div>
                      <p className="pd-review-comment">{review.comment}</p>
                      {review.images?.length > 0 && (
                        <div style={{ display: 'flex', gap: '6px', marginTop: '12px', flexWrap: 'wrap' }}>
                          {review.images.map((img, i) => (
                            <img key={i} src={img} style={{ width: '60px', height: '60px', objectFit: 'cover', border: `0.5px solid ${border}`, cursor: 'pointer' }} onClick={() => window.open(img, '_blank')} />
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