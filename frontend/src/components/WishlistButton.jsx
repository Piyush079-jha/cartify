import React, { useState } from 'react'
import { FaHeart, FaRegHeart } from 'react-icons/fa'
import SummaryApi from '../common'
import { toast } from 'react-toastify'

const WishlistButton = ({ productId, isInWishlist, onToggle, isDark = false }) => {
  const [isAnimating, setIsAnimating] = useState(false)

  const gold        = '#c9a84c'
  const border      = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(26,24,20,0.1)'
  const heartActive = 'rgba(201,168,76,0.15)'

  const handleClick = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsAnimating(true)
    setTimeout(() => setIsAnimating(false), 320)

    try {
      const response = await fetch(SummaryApi.addToWishlist.url, {
        method: SummaryApi.addToWishlist.method,
        credentials: 'include',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ productId })
      })
      const result = await response.json()
      if (result.success) {
        toast.success(result.message)
        if (onToggle) onToggle(productId)
      } else {
        toast.error(result.message || 'Something went wrong')
      }
    } catch {
      toast.error('Failed to update wishlist')
    }
  }

  return (
    <>
      <style>{`
        @keyframes wbPulse {
          0%   { transform: scale(1);    }
          40%  { transform: scale(1.35); }
          70%  { transform: scale(0.9);  }
          100% { transform: scale(1);    }
        }
        .wb-btn {
          width: 32px; height: 32px;
          border: 0.5px solid;
          background: transparent;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer;
          transition: border-color 0.22s ease, background 0.22s ease;
          border-radius: 1px;
          flex-shrink: 0;
          z-index: 2;
          position: relative;
        }
        .wb-btn:hover { border-color: ${gold} !important; }
      `}</style>

      <button
        className="wb-btn"
        onClick={handleClick}
        aria-label={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
        style={{
          borderColor: isInWishlist ? gold : border,
          background:  isInWishlist ? heartActive : 'transparent',
          animation:   isAnimating ? 'wbPulse 0.32s ease' : 'none',
        }}
      >
        {isInWishlist
          ? <FaHeart    style={{ fontSize: '13px', color: gold }} />
          : <FaRegHeart style={{ fontSize: '13px', color: isDark ? 'rgba(255,255,255,0.4)' : 'rgba(26,24,20,0.35)' }} />
        }
      </button>
    </>
  )
}

export default WishlistButton