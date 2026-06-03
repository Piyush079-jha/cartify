// ============================================================
// ProductDetails.jsx
// Full product detail page for Cartify e-commerce app.
// Handles: product data fetching, image zoom, add-to-cart,
// buy-now, and a full reviews system (add / edit / delete).
// ============================================================

import React, { useCallback, useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import SummaryApi from '../common'                          // Centralized API endpoint config
import {
  FaStar, FaEdit, FaTrash, FaCamera,
  FaShoppingCart, FaBolt, FaShieldAlt, FaTruck, FaUndo
} from "react-icons/fa"
import displayINRCurrency from '../helpers/displayCurrency' // Formats numbers as ₹ INR strings
import CategroyWiseProductDisplay from '../components/CategoryWiseProductDisplay' // Related products
import addToCart from '../helpers/addToCart'               // Shared cart helper
import Context from '../context'                           // Global context (cart count, theme)
import { toast } from 'react-toastify'
import ROLE from '../common/role'                          // Role constants (e.g. ADMIN)

// ─────────────────────────────────────────────────────────────
// StarRating — Reusable star rating display / interactive widget
//
// Props:
//   rating      — current rating value (1–5)
//   onRate      — callback fired when user clicks a star (interactive mode)
//   interactive — if true, stars are clickable and hoverable
//   size        — font size in px for each star glyph
// ─────────────────────────────────────────────────────────────
const StarRating = ({ rating, onRate, interactive = false, size = 15 }) => {
  // `hover` tracks which star the cursor is over (0 = none)
  const [hover, setHover] = useState(0)

  return (
    <div style={{ display: 'flex', gap: '2px' }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          style={{
            fontSize: `${size}px`,
            // Gold if filled (hover or actual rating), faint gold otherwise
            color: star <= (hover || rating) ? '#c9a84c' : 'rgba(201,168,76,0.2)',
            cursor: interactive ? 'pointer' : 'default',
            transition: 'color 0.15s ease',
            userSelect: 'none'
          }}
          // onMouseDown fires the rating callback (avoids focus issues vs onClick)
          onMouseDown={(e) => { e.preventDefault(); if (interactive && onRate) onRate(star) }}
          onMouseEnter={() => interactive && setHover(star)}
          onMouseLeave={() => interactive && setHover(0)}
        >
          ★
        </span>
      ))}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// ProductDetails — Main page component
// Route param: `:id` — the product's MongoDB _id
// ─────────────────────────────────────────────────────────────
const ProductDetails = () => {

  // ── Product data state (default shape prevents undefined access) ──
  const [data, setData] = useState({
    productName: "", brandName: "", category: "",
    productImage: [], description: "", price: "", sellingPrice: ""
  })

  const params   = useParams()                            // { id: "<productId>" }
  const [loading, setLoading] = useState(true)            // Controls skeleton loading UI

  // Active image shown in the main viewer; changes on thumbnail click
  const [activeImage, setActiveImage]   = useState("")

  // Zoom lens: stores cursor position as 0–1 fractions for CSS background-position
  const [zoomImageCoordinate, setZoomImageCoordinate] = useState({ x: 0, y: 0 })
  const [zoomImage, setZoomImage]       = useState(false) // Whether zoom overlay is visible

  // Global context values
  const { fetchUserAddToCart, isDark }  = useContext(Context)

  const navigate = useNavigate()

  // Logged-in user from Redux store (null if not logged in)
  const user = useSelector(state => state?.user?.user)

  // ── Review system state ──
  const [reviews, setReviews]           = useState([])    // Array of review objects from API
  const [reviewLoading, setReviewLoading] = useState(false)
  const [showReviewForm, setShowReviewForm] = useState(false) // Toggle review form visibility
  const [reviewForm, setReviewForm]     = useState({ rating: 0, comment: '', images: [] })
  const [editingReview, setEditingReview] = useState(null) // null = new review; object = edit mode
  const [submitting, setSubmitting]     = useState(false)  // Disables submit button during API call
  const [reviewImages, setReviewImages] = useState([])     // Preview URLs for selected images

  // ─────────────────────────────────────────────────────────
  // Design tokens — derived from isDark so the whole page
  // flips between light and dark themes via a single flag.
  // ─────────────────────────────────────────────────────────
  const bg         = isDark ? '#0e0e0e'                : '#faf9f7' // Page background
  const surface    = isDark ? '#161616'                : '#ffffff' // Card / panel background
  const surfaceAlt = isDark ? '#1c1c1c'               : '#f7f6f4' // Slightly offset surface
  const text       = isDark ? '#e8e4dc'                : '#1a1814' // Primary text
  const muted      = isDark ? 'rgba(160,152,144,0.8)'  : 'rgba(130,125,118,0.9)' // Secondary text
  const border     = isDark ? 'rgba(255,255,255,0.07)' : 'rgba(26,24,20,0.08)'   // Hairline borders
  const imgBg      = isDark ? 'rgba(255,255,255,0.02)' : '#f7f6f4' // Image panel background
  const gold       = '#c9a84c'                         // Brand accent color
  const skelBg     = isDark ? 'rgba(255,255,255,0.04)' : 'rgba(26,24,20,0.04)' // Skeleton shimmer base

  // ─────────────────────────────────────────────────────────
  // fetchProductDetails
  // Calls the product details endpoint with the URL param id.
  // Sets `data` and seeds `activeImage` with the first image.
  // ─────────────────────────────────────────────────────────
  const fetchProductDetails = async () => {
    setLoading(true)
    const response = await fetch(SummaryApi.productDetails.url, {
      method : SummaryApi.productDetails.method,
      headers: { "content-type": "application/json" },
      body   : JSON.stringify({ productId: params?.id })
    })
    setLoading(false)
    const dataReponse = await response.json()
    if (dataReponse?.data) {
      setData(dataReponse.data)
      setActiveImage(dataReponse.data?.productImage[0]) // Show first image by default
    }
  }

  // ─────────────────────────────────────────────────────────
  // fetchReviews
  // Fetches all reviews for this product from the backend.
  // ─────────────────────────────────────────────────────────
  const fetchReviews = async () => {
    setReviewLoading(true)
    try {
      const response = await fetch(`${SummaryApi.getReviews.url}/${params?.id}`)
      const result   = await response.json()
      if (result.success) setReviews(result.data)
    } catch (err) {
      console.log('Error fetching reviews:', err)
    }
    setReviewLoading(false)
  }

  // Re-fetch whenever the route param (product id) changes
  useEffect(() => { fetchProductDetails(); fetchReviews() }, [params])

  // ─────────────────────────────────────────────────────────
  // handleZoomImage
  // Tracks mouse position over the main image and converts
  // it to 0–1 fractions used by the CSS background-position
  // of the zoom lens overlay.
  // Wrapped in useCallback to keep the ref stable.
  // ─────────────────────────────────────────────────────────
  const handleZoomImage = useCallback((e) => {
    setZoomImage(true)
    const { left, top, width, height } = e.target.getBoundingClientRect()
    setZoomImageCoordinate({
      x: (e.clientX - left) / width,
      y: (e.clientY - top)  / height
    })
  }, [])

  // ─────────────────────────────────────────────────────────
  // handleAddToCart — adds item and refreshes cart count badge
  // handleBuyProduct — adds item then navigates to /cart
  // ─────────────────────────────────────────────────────────
  const handleAddToCart  = async (e, id) => { await addToCart(e, id); fetchUserAddToCart() }
  const handleBuyProduct = async (e, id) => { await addToCart(e, id); fetchUserAddToCart(); navigate("/cart") }

  // ─────────────────────────────────────────────────────────
  // handleReviewImageUpload
  // Creates local object URLs for selected files so they
  // can be previewed immediately before upload.
  // ─────────────────────────────────────────────────────────
  const handleReviewImageUpload = (e) => {
    const files = Array.from(e.target.files)
    files.forEach(file => {
      const url = URL.createObjectURL(file)          // Temporary browser-side URL
      setReviewImages(prev => [...prev, url])
      setReviewForm(prev => ({ ...prev, images: [...prev.images, url] }))
    })
  }

  // ─────────────────────────────────────────────────────────
  // handleSubmitReview
  // Handles both creating a new review and updating an existing one.
  // Determines the correct endpoint via `editingReview` state.
  // Guards: user must be logged in, rating and comment required.
  // ─────────────────────────────────────────────────────────
  const handleSubmitReview = async () => {
    // Auth guard — redirect to login if not logged in
    if (!user?._id) { toast.error('Please login to leave a review'); navigate('/login'); return }

    // Validation
    if (reviewForm.rating === 0)        { toast.error('Please select a rating'); return }
    if (!reviewForm.comment.trim())     { toast.error('Please write a comment'); return }

    setSubmitting(true)
    try {
      // editingReview set → PATCH/update flow; null → create flow
      const url  = editingReview ? SummaryApi.editReview.url   : SummaryApi.addReview.url
      const body = editingReview
        ? { reviewId: editingReview._id, ...reviewForm }       // Include reviewId for updates
        : { productId: params?.id, ...reviewForm }             // Include productId for new reviews

      const response = await fetch(url, {
        method : 'POST',
        headers: { 'content-type': 'application/json' },
        credentials: 'include',                                // Send session cookie
        body   : JSON.stringify(body)
      })
      const result = await response.json()

      if (result.success) {
        toast.success(editingReview ? 'Review updated!' : 'Review added!')
        // Reset form state
        setShowReviewForm(false); setEditingReview(null)
        setReviewForm({ rating: 0, comment: '', images: [] }); setReviewImages([])
        fetchReviews()                                         // Refresh review list
      } else toast.error(result.message)
    } catch {
      toast.error('Something went wrong')
    }
    setSubmitting(false)
  }

  // ─────────────────────────────────────────────────────────
  // handleDeleteReview
  // Asks for confirmation then deletes a review by its id.
  // Available to the review owner or an ADMIN.
  // ─────────────────────────────────────────────────────────
  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm('Delete this review?')) return
    try {
      const response = await fetch(SummaryApi.deleteReview.url, {
        method : 'POST',
        headers: { 'content-type': 'application/json' },
        credentials: 'include',
        body   : JSON.stringify({ reviewId })
      })
      const result = await response.json()
      if (result.success) { toast.success('Review deleted'); fetchReviews() }
      else toast.error(result.message)
    } catch {
      toast.error('Something went wrong')
    }
  }

  // ─────────────────────────────────────────────────────────
  // handleEditReview
  // Pre-fills the review form with existing data and scrolls
  // to the form so the user can see it immediately.
  // ─────────────────────────────────────────────────────────
  const handleEditReview = (review) => {
    setEditingReview(review)
    setReviewForm({ rating: review.rating, comment: review.comment, images: review.images })
    setReviewImages(review.images)
    setShowReviewForm(true)
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })
  }

  // ── Derived values ──

  // Average rating across all reviews, rounded to 1 decimal place
  const avgRating = reviews.length
    ? (reviews.reduce((a, b) => a + b.rating, 0) / reviews.length).toFixed(1)
    : 0

  // Discount percentage shown on the image badge and price block
  const discount = data?.price && data?.sellingPrice
    ? Math.round(((data.price - data.sellingPrice) / data.price) * 100)
    : 0

  // ─────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────
  return (
    <>
      {/* ── Scoped CSS injected via <style> tag ─────────────
          All class names are prefixed with "pd-" to avoid
          collisions with global styles.
      ─────────────────────────────────────────────────────── */}
      <style>{`
        .pd-page { min-height: 100vh; background: ${bg}; padding-bottom: 80px; }
        .pd-inner { max-width: 1200px; margin: 0 auto; padding: 32px 24px; }

        /* ── Main product card: image panel + info panel side by side ── */
        .pd-card {
          display: flex;
          flex-wrap: wrap;
          background: ${surface};
          border: 0.5px solid ${border};
          margin-bottom: 40px;
          overflow: hidden;
        }

        /* ── Left: image gallery panel ── */
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
        /* Main image container — fixed square so layout stays stable */
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
          cursor: crosshair;  /* crosshair hints zoom is available */
          mix-blend-mode: ${isDark ? 'lighten' : 'multiply'}; /* Removes image bg in theme */
          transition: transform 0.4s ease;
        }
        /* Subtle scale-up on hover for visual polish */
        .pd-main-img-wrap:hover img { transform: scale(1.04); }

        /* ── Zoom lens: fixed overlay to the right of the image ── */
        .pd-zoom-lens {
          position: fixed;
          right: 40px;
          top: 100px;
          width: 340px;
          height: 340px;
          z-index: 100;
          border: 0.5px solid ${border};
          box-shadow: 0 20px 60px rgba(0,0,0,0.3);
          pointer-events: none;   /* Doesn't block mouse events on the image */
          background: ${surface};
        }

        /* ── Thumbnail strip below main image ── */
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
        /* Active and hovered thumbnails get gold border */
        .pd-thumb.active { border-color: ${gold}; }
        .pd-thumb:hover  { border-color: ${gold}; }
        .pd-thumb img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          mix-blend-mode: ${isDark ? 'lighten' : 'multiply'};
        }

        /* ── Discount badge overlaid on the image panel corner ── */
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

        /* ── Right: product information panel ── */
        .pd-info-panel {
          flex: 1;
          padding: 40px;
          display: flex;
          flex-direction: column;
          gap: 22px;
          min-width: 0; /* Prevents flex child from overflowing */
        }

        /* Brand name badge + "In Stock" pill */
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

        /* Product name — editorial serif for premium feel */
        .pd-title {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: 28px;
          font-weight: 300;
          color: ${text};
          margin: 0;
          line-height: 1.3;
          letter-spacing: -0.01em;
        }

        /* Category label */
        .pd-category {
          font-size: 11px;
          color: ${muted};
          letter-spacing: 0.06em;
          text-transform: capitalize;
        }
        .pd-category span { color: ${gold}; }

        /* Star rating + score + count row */
        .pd-rating-row {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
        }
        .pd-rating-score { font-size: 14px; font-weight: 500; color: ${text}; }
        .pd-rating-count { font-size: 11px; color: ${muted}; letter-spacing: 0.04em; }

        /* Bordered price block with left gold accent line */
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
        /* Large selling price in serif font */
        .pd-selling-price {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: 34px;
          font-weight: 300;
          color: ${text};
          letter-spacing: -0.02em;
        }
        /* Struck-through original MRP */
        .pd-original-price {
          font-size: 15px;
          color: ${muted};
          text-decoration: line-through;
        }
        /* Green "Save X%" badge */
        .pd-save-badge {
          font-size: 9px;
          color: rgba(80,180,100,0.9);
          background: rgba(80,180,100,0.08);
          border: 0.5px solid rgba(80,180,100,0.2);
          padding: 3px 8px;
          letter-spacing: 0.08em;
        }

        /* CTA button row */
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
        /* "Buy Now" — ghost / outlined style */
        .pd-btn-buy  { background: transparent; border: 0.5px solid ${border}; color: ${muted}; }
        .pd-btn-buy:hover { border-color: ${gold}; color: ${gold}; background: rgba(201,168,76,0.04); }
        /* "Add to Cart" — solid gold fill */
        .pd-btn-cart { background: ${gold}; border: 0.5px solid ${gold}; color: #0a0a0a; box-shadow: 0 0 20px rgba(201,168,76,0.18); }
        .pd-btn-cart:hover { background: #b8953e; border-color: #b8953e; transform: translateY(-1px); box-shadow: 0 4px 20px rgba(201,168,76,0.28); }

        /* Trust signals row (Free Delivery, Secure Payment, Easy Returns) */
        .pd-trust-row { display: flex; gap: 20px; flex-wrap: wrap; }
        .pd-trust-item { display: flex; align-items: center; gap: 7px; font-size: 11px; color: ${muted}; letter-spacing: 0.04em; }
        .pd-trust-item svg { color: ${gold}; font-size: 12px; }

        /* Product description block */
        .pd-desc-block {
          padding: 16px 18px;
          background: ${surfaceAlt};
          border: 0.5px solid ${border};
          border-left: 1.5px solid ${border};
        }
        .pd-desc-label { font-size: 9px; letter-spacing: 0.16em; text-transform: uppercase; color: ${muted}; margin: 0 0 10px; }
        .pd-desc-text  { font-size: 13px; color: ${muted}; line-height: 1.85; margin: 0; letter-spacing: 0.01em; }

        /* ── Skeleton loading shimmer ── */
        .pd-skel {
          background: ${skelBg};
          animation: pdPulse 1.8s ease-in-out infinite;
          border-radius: 1px;
        }
        @keyframes pdPulse {
          0%, 100% { opacity: 0.65; }
          50%       { opacity: 0.25; }
        }

        /* ── Reviews section ── */
        .pd-reviews { background: ${surface}; border: 0.5px solid ${border}; overflow: hidden; margin-top: 2px; }

        /* Dark header bar regardless of theme — creates contrast with page */
        .pd-reviews-header {
          padding: 28px 32px;
          border-bottom: 0.5px solid ${border};
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 16px;
          background: #111110;
        }
        .pd-reviews-title { font-family: 'Cormorant Garamond', Georgia, serif; font-size: 22px; font-weight: 300; color: #e8e4dc; margin: 0 0 8px; }

        /* "Write a Review" toggle button */
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
        .pd-review-btn:hover { background: #c9a84c; color: #0a0a0a; }

        .pd-reviews-body { padding: 28px 32px; }

        /* ── Review submission form ── */
        .pd-review-form { background: ${surfaceAlt}; border: 0.5px solid ${border}; padding: 24px; margin-bottom: 28px; }
        .pd-review-form-title { font-size: 14px; font-weight: 400; color: ${text}; margin: 0 0 20px; letter-spacing: 0.02em; }
        .pd-review-label { font-size: 9px; letter-spacing: 0.16em; text-transform: uppercase; color: ${muted}; display: block; margin-bottom: 10px; }
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
        .pd-review-textarea:focus { border-color: ${gold}; } /* Gold ring on focus */

        /* Submit / Update button */
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
        .pd-review-submit:hover:not(:disabled) { background: ${gold}; color: #0a0a0a; }
        .pd-review-submit:disabled { opacity: 0.4; cursor: not-allowed; } /* Greyed while submitting */

        /* ── Individual review card ── */
        .pd-review-card { padding: 20px 0; border-bottom: 0.5px solid ${border}; }
        .pd-review-card:last-child { border-bottom: none; } /* No divider after last card */

        .pd-reviewer-name  { font-size: 13px; font-weight: 500; color: ${text}; margin: 0 0 3px; text-transform: capitalize; letter-spacing: 0.02em; }
        .pd-reviewer-date  { font-size: 10px; color: ${muted}; letter-spacing: 0.06em; }
        .pd-review-comment { font-size: 13px; color: ${muted}; margin: 12px 0 0; line-height: 1.8; letter-spacing: 0.01em; }

        /* Edit / Delete action buttons on each review card */
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

        /* Empty state when no reviews exist yet */
        .pd-reviews-empty { text-align: center; padding: 60px 20px; }
        .pd-reviews-empty-icon { font-size: 32px; color: rgba(201,168,76,0.2); margin-bottom: 16px; }

        /* ── Responsive breakpoints ── */
        @media (max-width: 860px) {
          /* Stack image panel above info panel on tablets */
          .pd-img-panel { width: 100% !important; flex: none !important; padding: 28px !important; border-right: none !important; border-bottom: 0.5px solid ${border}; }
          .pd-main-img-wrap { width: 240px !important; height: 240px !important; }
          .pd-info-panel { padding: 24px !important; }
          .pd-zoom-lens { display: none !important; } /* Hide zoom on touch devices */
          .pd-reviews-header { padding: 20px 24px !important; }
          .pd-reviews-body   { padding: 20px 24px !important; }
        }
        @media (max-width: 600px) {
          .pd-inner { padding: 16px !important; }
          .pd-img-panel { padding: 20px !important; }
          .pd-main-img-wrap { width: 200px !important; height: 200px !important; }
          .pd-info-panel { padding: 20px !important; gap: 16px !important; }
          .pd-title { font-size: 24px !important; }
          .pd-selling-price { font-size: 28px !important; }
          /* Stack CTA buttons vertically on mobile */
          .pd-actions { flex-direction: column; }
          .pd-btn { width: 100%; justify-content: center; }
          .pd-reviews-header { padding: 16px !important; }
          .pd-reviews-body   { padding: 16px !important; }
          .pd-review-form    { padding: 16px !important; }
        }
      `}</style>

      <div className="pd-page">
        <div className="pd-inner">

          {/* ══════════════════════════════════════════════
              PRODUCT CARD — image gallery + product info
          ══════════════════════════════════════════════ */}
          <div className="pd-card">

            {/* ── LEFT: Image gallery panel ── */}
            <div className="pd-img-panel">

              {/* Discount badge — only shown when there is a positive discount */}
              {discount > 0 && !loading && (
                <div className="pd-discount-tag">−{discount}%</div>
              )}

              {/* Main image viewer */}
              <div className="pd-main-img-wrap">
                {loading
                  ? <div className="pd-skel" style={{ width: '280px', height: '280px' }} /> // Skeleton placeholder
                  : <>
                      <img
                        src={activeImage}
                        alt={data.productName}
                        onMouseMove={handleZoomImage}          // Update zoom position
                        onMouseLeave={() => setZoomImage(false)} // Hide zoom overlay
                      />
                      {/* Zoom lens overlay — renders outside the card via position:fixed */}
                      {zoomImage && (
                        <div className="pd-zoom-lens" style={{
                          backgroundImage   : `url(${activeImage})`,
                          backgroundPosition: `${zoomImageCoordinate.x * 100}% ${zoomImageCoordinate.y * 100}%`,
                          backgroundSize    : '250%',          // Magnification factor
                          backgroundRepeat  : 'no-repeat'
                        }} />
                      )}
                    </>
                }
              </div>

              {/* Thumbnail strip */}
              <div className="pd-thumbs">
                {loading
                  ? [1, 2, 3].map(i => <div key={i} className="pd-skel" style={{ width: '52px', height: '52px' }} />)
                  : data?.productImage?.map((imgURL, index) => (
                      <div
                        key={index}
                        className={`pd-thumb${activeImage === imgURL ? ' active' : ''}`} // Highlight active thumb
                        onClick={() => setActiveImage(imgURL)}  // Swap main image on click
                      >
                        <img src={imgURL} alt="" />
                      </div>
                    ))
                }
              </div>
            </div>

            {/* ── RIGHT: Product information panel ── */}
            <div className="pd-info-panel">
              {loading
                /* Skeleton rows while data loads */
                ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    {[100, 240, 70, 160, 120, 180, 200].map((w, i) => (
                      <div key={i} className="pd-skel" style={{ height: '18px', width: `${w}px`, animationDelay: `${i * 0.08}s` }} />
                    ))}
                  </div>
                )
                /* Actual product data */
                : (
                  <>
                    {/* Brand + stock status */}
                    <div className="pd-meta-row">
                      <span className="pd-brand-badge">{data?.brandName}</span>
                      <span className="pd-stock-badge">In Stock</span>
                    </div>

                    {/* Product title */}
                    <h1 className="pd-title">{data?.productName}</h1>

                    {/* Category breadcrumb */}
                    <p className="pd-category">
                      Category: <span>{data?.category}</span>
                    </p>

                    {/* Aggregate star rating from reviews */}
                    <div className="pd-rating-row">
                      <StarRating rating={Math.round(avgRating)} size={14} />
                      <span className="pd-rating-score">{avgRating}</span>
                      <span className="pd-rating-count">({reviews.length} reviews)</span>
                    </div>

                    {/* Price block: selling price, original MRP, and save badge */}
                    <div className="pd-price-block">
                      <div className="pd-price-row">
                        <span className="pd-selling-price">{displayINRCurrency(data.sellingPrice)}</span>
                        <span className="pd-original-price">{displayINRCurrency(data.price)}</span>
                        {discount > 0 && (
                          <span className="pd-save-badge">Save {discount}%</span>
                        )}
                      </div>
                    </div>

                    {/* CTA buttons */}
                    <div className="pd-actions">
                      <button className="pd-btn pd-btn-buy" onClick={(e) => handleBuyProduct(e, data?._id)}>
                        <FaBolt style={{ fontSize: '10px' }} /> Buy Now
                      </button>
                      <button className="pd-btn pd-btn-cart" onClick={(e) => handleAddToCart(e, data?._id)}>
                        <FaShoppingCart style={{ fontSize: '10px' }} /> Add to Cart
                      </button>
                    </div>

                    {/* Trust badges */}
                    <div className="pd-trust-row">
                      {[
                        { icon: <FaTruck />,    label: 'Free Delivery'  },
                        { icon: <FaShieldAlt />, label: 'Secure Payment' },
                        { icon: <FaUndo />,     label: 'Easy Returns'   }
                      ].map((b, i) => (
                        <div key={i} className="pd-trust-item">
                          {b.icon} {b.label}
                        </div>
                      ))}
                    </div>

                    {/* Product description */}
                    <div className="pd-desc-block">
                      <p className="pd-desc-label">Description</p>
                      <p className="pd-desc-text">{data?.description}</p>
                    </div>
                  </>
                )
              }
            </div>
          </div>

          {/* ══════════════════════════════════════════════
              RELATED PRODUCTS
              Only rendered after product category is known.
              Uses the existing CategoryWiseProductDisplay component.
          ══════════════════════════════════════════════ */}
          {data?.category && (
            <div style={{ marginBottom: '2px' }}>
              <CategroyWiseProductDisplay
                category={data?.category}
                heading={"You may also like"}
                isDark={isDark}
              />
            </div>
          )}

          {/* ══════════════════════════════════════════════
              REVIEWS SECTION
          ══════════════════════════════════════════════ */}
          <div className="pd-reviews">

            {/* Header: title + aggregate rating + toggle button */}
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

              {/* Only logged-in users can write reviews */}
              {user?._id && (
                <button className="pd-review-btn" onClick={() => {
                  setShowReviewForm(!showReviewForm)
                  setEditingReview(null)                       // Reset to "new review" mode
                  setReviewForm({ rating: 0, comment: '', images: [] })
                  setReviewImages([])
                }}>
                  {showReviewForm ? 'Cancel' : 'Write a Review'}
                </button>
              )}
            </div>

            <div className="pd-reviews-body">

              {/* ── Review submission / edit form ── */}
              {showReviewForm && (
                <div className="pd-review-form">
                  <p className="pd-review-form-title">
                    {editingReview ? 'Edit your review' : 'Write a review'}
                  </p>

                  {/* Star rating picker */}
                  <div style={{ marginBottom: '18px' }}>
                    <label className="pd-review-label">Your Rating</label>
                    <StarRating
                      rating={reviewForm.rating}
                      onRate={(r) => setReviewForm(prev => ({ ...prev, rating: r }))}
                      interactive
                      size={22}
                    />
                    {/* Human-readable label for chosen rating (e.g. "Excellent") */}
                    {reviewForm.rating > 0 && (
                      <p style={{ fontSize: '11px', color: gold, marginTop: '6px', letterSpacing: '0.06em' }}>
                        {['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'][reviewForm.rating]}
                      </p>
                    )}
                  </div>

                  {/* Comment textarea */}
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

                  {/* Optional photo upload */}
                  <div style={{ marginBottom: '20px' }}>
                    <label className="pd-review-label">Photos (optional)</label>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>

                      {/* Preview thumbnails with remove button */}
                      {reviewImages.map((img, i) => (
                        <div key={i} style={{ position: 'relative' }}>
                          <img src={img} style={{ width: '60px', height: '60px', objectFit: 'cover', border: `0.5px solid ${border}` }} />
                          <button
                            onClick={() => {
                              // Remove this image from both preview and form state
                              const n = reviewImages.filter((_, idx) => idx !== i)
                              setReviewImages(n)
                              setReviewForm(prev => ({ ...prev, images: n }))
                            }}
                            style={{ position: 'absolute', top: '-6px', right: '-6px', background: '#111', border: `0.5px solid ${border}`, color: muted, width: '18px', height: '18px', cursor: 'pointer', fontSize: '9px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%' }}
                          >
                            ✕
                          </button>
                        </div>
                      ))}

                      {/* Hidden file input triggered by styled label */}
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

              {/* ── Review list ── */}
              {reviewLoading ? (
                /* Loading skeleton for review list */
                <div style={{ padding: '40px 0', textAlign: 'center' }}>
                  <div className="pd-skel" style={{ height: '12px', width: '120px', margin: '0 auto' }} />
                </div>

              ) : reviews.length === 0 ? (
                /* Empty state — no reviews yet */
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
                /* Render each review as a card */
                <div>
                  {reviews.map((review) => (
                    <div key={review._id} className="pd-review-card">

                      {/* Review header: avatar, name, stars, date, action buttons */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px' }}>
                        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>

                          {/* Avatar: profile pic if available, else initial letter */}
                          <div style={{
                            width: '38px', height: '38px', borderRadius: '50%',
                            border: `0.5px solid ${border}`,
                            background: isDark ? 'rgba(201,168,76,0.08)' : 'rgba(201,168,76,0.06)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: gold, fontWeight: 500, fontSize: '15px', flexShrink: 0, overflow: 'hidden'
                          }}>
                            {review.userProfilePic
                              ? <img src={review.userProfilePic} style={{ width: '38px', height: '38px', borderRadius: '50%', objectFit: 'cover' }} />
                              : review.userName?.charAt(0).toUpperCase()    // Fallback initial
                            }
                          </div>

                          <div>
                            <p className="pd-reviewer-name">{review.userName}</p>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                              <StarRating rating={review.rating} size={12} />
                              <span className="pd-reviewer-date">
                                {/* Format date as "15 Jan 2024" for Indian locale */}
                                {new Date(review.createdAt).toLocaleDateString('en-IN', {
                                  day: 'numeric', month: 'short', year: 'numeric'
                                })}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Edit / Delete — conditionally shown based on ownership & role */}
                        <div style={{ display: 'flex', gap: '6px' }}>
                          {/* Only the review author can edit */}
                          {user?._id && review.userId === user._id && (
                            <button className="pd-review-action-btn edit" onClick={() => handleEditReview(review)}>
                              <FaEdit style={{ fontSize: '10px' }} /> Edit
                            </button>
                          )}
                          {/* Review author OR admin can delete */}
                          {user?._id && (review.userId === user._id || user.role === ROLE.ADMIN) && (
                            <button className="pd-review-action-btn del" onClick={() => handleDeleteReview(review._id)}>
                              <FaTrash style={{ fontSize: '10px' }} /> Delete
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Review text body */}
                      <p className="pd-review-comment">{review.comment}</p>

                      {/* Review photo attachments — clicking opens full size in new tab */}
                      {review.images?.length > 0 && (
                        <div style={{ display: 'flex', gap: '6px', marginTop: '12px', flexWrap: 'wrap' }}>
                          {review.images.map((img, i) => (
                            <img
                              key={i}
                              src={img}
                              style={{ width: '60px', height: '60px', objectFit: 'cover', border: `0.5px solid ${border}`, cursor: 'pointer' }}
                              onClick={() => window.open(img, '_blank')}
                            />
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