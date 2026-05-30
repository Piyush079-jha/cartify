import React, { useEffect, useState } from 'react'
import image1 from '../assest/banner/img1.webp'
import image2 from '../assest/banner/img2.webp'
import image3 from '../assest/banner/img3.jpg'
import image4 from '../assest/banner/img4.jpg'
import image5 from '../assest/banner/img5.webp'
import image1Mobile from '../assest/banner/img1_mobile.jpg'
import image2Mobile from '../assest/banner/img2_mobile.webp'
import image3Mobile from '../assest/banner/img3_mobile.jpg'
import image4Mobile from '../assest/banner/img4_mobile.jpg'
import image5Mobile from '../assest/banner/img5_mobile.png'
import { FaAngleRight, FaAngleLeft } from "react-icons/fa6"

const BannerProduct = ({ isDark = false }) => {
  const [currentImage, setCurrentImage] = useState(0)
  const [isHovering, setIsHovering] = useState(false)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640)

  const desktopImages = [image1, image2, image3, image4, image5]
  const mobileImages  = [image1Mobile, image2Mobile, image3Mobile, image4Mobile, image5Mobile]
  const images = isMobile ? mobileImages : desktopImages

  const border = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(26,24,20,0.1)'
  const gold   = '#c9a84c'

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 640)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const nextImage = () => setCurrentImage(p => p < images.length - 1 ? p + 1 : 0)
  const prevImage = () => setCurrentImage(p => p > 0 ? p - 1 : images.length - 1)

  useEffect(() => {
    if (!isHovering) {
      const interval = setInterval(nextImage, 5000)
      return () => clearInterval(interval)
    }
  }, [currentImage, isHovering, images.length])

  return (
    <>
      <style>{`
        .bnr-nav { opacity: 0; transition: opacity 0.3s ease; }
        .bnr-wrap:hover .bnr-nav { opacity: 1; }
        .bnr-btn {
          width: 36px; height: 36px; border: 0.5px solid rgba(255,255,255,0.4);
          background: rgba(255,255,255,0.1); backdrop-filter: blur(8px);
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; color: #fff; font-size: 13px;
          transition: all 0.2s ease; border-radius: 1px;
        }
        .bnr-btn:hover { background: rgba(255,255,255,0.25); border-color: rgba(255,255,255,0.7); }

        /* Responsive containers */
        .bnr-heading {
          max-width: 1400px;
          margin: 0 auto;
          padding: 48px 32px 20px;
        }
        .bnr-outer {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 32px 40px;
        }

        @media (max-width: 1024px) {
          .bnr-heading { padding: 40px 24px 16px; }
          .bnr-outer   { padding: 0 24px 32px; }
        }
        @media (max-width: 768px) {
          .bnr-heading { padding: 28px 16px 12px; }
          .bnr-outer   { padding: 0 16px 24px; }
          .bnr-inner   { height: 220px !important; }
        }
        @media (max-width: 480px) {
          .bnr-heading { padding: 20px 12px 10px; }
          .bnr-outer   { padding: 0 !important; }
          .bnr-inner   { height: 180px !important; }
        }
      `}</style>

      {/* Editorial headline above banner */}
      <div className="bnr-heading">
        <p style={{
          fontSize: isMobile ? '28px' : '42px',
          fontWeight: 300, letterSpacing: '-0.02em',
          color: isDark ? '#e8e4dc' : '#1a1814',
          fontFamily: 'Georgia, "Times New Roman", serif',
          lineHeight: 1.2, margin: 0, maxWidth: '480px'
        }}>
          Discover what's<br />
          <em style={{ fontStyle: 'italic', color: '#c9a84c', fontWeight: 300 }}>new this season</em>
        </p>
      </div>

      <div className="bnr-outer">
        <div
          className="bnr-wrap"
          style={{ position: 'relative' }}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          {/* Main image area */}
          <div className="bnr-inner" style={{
            height: '420px', width: '100%', overflow: 'hidden',
            border: `0.5px solid ${border}`, position: 'relative'
          }}>
            <div style={{ display: 'flex', height: '100%', width: '100%', overflow: 'hidden' }}>
              {images.map((imageUrl, index) => (
                <div key={index} style={{
                  width: '100%', height: '100%', minWidth: '100%',
                  transition: 'transform 0.7s cubic-bezier(0.4, 0, 0.2, 1)',
                  transform: `translateX(-${currentImage * 100}%)`
                }}>
                  <img src={imageUrl} alt={`Banner ${index + 1}`}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block',
                      filter: isDark ? 'brightness(0.8)' : 'none' }} />
                </div>
              ))}
            </div>

            {/* Subtle bottom gradient */}
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '35%',
              background: 'linear-gradient(to top, rgba(0,0,0,0.35), transparent)', pointerEvents: 'none' }} />

            {/* Nav buttons */}
            <div className="bnr-nav" style={{
              position: 'absolute', zIndex: 10, height: '100%', width: '100%',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '0 16px', top: 0, pointerEvents: 'none'
            }}>
              <button className="bnr-btn" onClick={prevImage} style={{ pointerEvents: 'auto' }}><FaAngleLeft /></button>
              <button className="bnr-btn" onClick={nextImage} style={{ pointerEvents: 'auto' }}><FaAngleRight /></button>
            </div>
          </div>

          {/* Bottom bar — dots + counter */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '12px 0 0'
          }}>
            <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
              {images.map((_, index) => (
                <button key={index} onClick={() => setCurrentImage(index)}
                  style={{
                    width: currentImage === index ? '20px' : '5px',
                    height: '1px', border: 'none', padding: 0, cursor: 'pointer',
                    background: currentImage === index ? gold : (isDark ? 'rgba(255,255,255,0.25)' : 'rgba(26,24,20,0.2)'),
                    transition: 'all 0.3s ease'
                  }} />
              ))}
            </div>
            <span style={{
              fontSize: '11px', letterSpacing: '0.1em',
              color: isDark ? 'rgba(255,255,255,0.3)' : 'rgba(26,24,20,0.3)'
            }}>
              {String(currentImage + 1).padStart(2,'0')} / {String(images.length).padStart(2,'0')}
            </span>
          </div>
        </div>
      </div>
    </>
  )
}

export default BannerProduct