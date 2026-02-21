import React, { useState } from 'react'
import { FaHeart, FaRegHeart } from 'react-icons/fa'
import SummaryApi from '../common'
import { toast } from 'react-toastify'

const WishlistButton = ({ productId, isInWishlist, onToggle, isDark = false }) => {
  const [isAnimating, setIsAnimating] = useState(false)
  const [hearts, setHearts] = useState([])

  const handleClick = async (e) => {
    e.preventDefault()
    e.stopPropagation()

    setIsAnimating(true)

    // Floating hearts animation when adding
    if (!isInWishlist) {
      const newHearts = Array.from({ length: 5 }, (_, i) => ({
        id: Date.now() + i,
        x: (Math.random() - 0.5) * 60,
        y: -30 - Math.random() * 20,
        delay: i * 0.1
      }))
      setHearts(newHearts)
      setTimeout(() => setHearts([]), 1000)
    }

    setTimeout(() => setIsAnimating(false), 300)

    try {
      // Call backend API to toggle wishlist
      const response = await fetch(SummaryApi.addToWishlist.url, {
        method: SummaryApi.addToWishlist.method,
        credentials: 'include',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ productId })
      })

      const result = await response.json()

      if (result.success) {
        toast.success(result.message)
        // Update local state in parent
        if (onToggle) onToggle(productId)
      } else {
        toast.error(result.message || 'Something went wrong')
      }
    } catch (err) {
      toast.error('Failed to update wishlist')
    }
  }

  return (
    <button
      onClick={handleClick}
      style={{
        position: 'relative',
        width: '36px',
        height: '36px',
        borderRadius: '50%',
        border: 'none',
        background: isInWishlist
          ? 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
          : isDark
            ? 'rgba(255,255,255,0.1)'
            : 'rgba(0,0,0,0.05)',
        backdropFilter: 'blur(10px)',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '16px',
        color: isInWishlist ? '#fff' : isDark ? '#fff' : '#333',
        transition: 'all 0.3s ease',
        transform: isAnimating ? 'scale(1.2)' : 'scale(1)',
        boxShadow: isInWishlist
          ? '0 4px 12px rgba(245, 87, 108, 0.4)'
          : 'none',
        zIndex: 2
      }}
      onMouseEnter={e => {
        if (!isAnimating) {
          e.currentTarget.style.transform = 'scale(1.15)'
          if (isInWishlist) e.currentTarget.style.boxShadow = '0 6px 20px rgba(245, 87, 108, 0.5)'
        }
      }}
      onMouseLeave={e => {
        if (!isAnimating) {
          e.currentTarget.style.transform = 'scale(1)'
          if (isInWishlist) e.currentTarget.style.boxShadow = '0 4px 12px rgba(245, 87, 108, 0.4)'
        }
      }}
    >
      {isInWishlist ? <FaHeart /> : <FaRegHeart />}

      {/* Floating Hearts */}
      {hearts.map((heart) => (
        <div
          key={heart.id}
          style={{
            position: 'absolute',
            fontSize: '12px',
            color: '#f5576c',
            pointerEvents: 'none',
            animation: `floatHeart 1s ease-out forwards`,
            animationDelay: `${heart.delay}s`,
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            '--heart-x': `${heart.x}px`,
            '--heart-y': `${heart.y}px`
          }}
        >
          ❤️
        </div>
      ))}

      <style>{`
        @keyframes floatHeart {
          0% { opacity: 1; transform: translate(-50%, -50%) scale(0); }
          50% { opacity: 1; transform: translate(calc(-50% + var(--heart-x)), calc(-50% + var(--heart-y))) scale(1.2); }
          100% { opacity: 0; transform: translate(calc(-50% + var(--heart-x)), calc(-50% + var(--heart-y) - 20px)) scale(0.8); }
        }
      `}</style>
    </button>
  )
}

export default WishlistButton