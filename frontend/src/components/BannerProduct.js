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
    const mobileImages = [image1Mobile, image2Mobile, image3Mobile, image4Mobile, image5Mobile]
    const images = isMobile ? mobileImages : desktopImages

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 640)
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    const nextImage = () => { if (images.length - 1 > currentImage) setCurrentImage(prev => prev + 1) }
    const prevImage = () => { if (currentImage !== 0) setCurrentImage(prev => prev - 1) }

    useEffect(() => {
        if (!isHovering) {
            const interval = setInterval(() => {
                if (images.length - 1 > currentImage) nextImage()
                else setCurrentImage(0)
            }, 5000)
            return () => clearInterval(interval)
        }
    }, [currentImage, isHovering, images.length])

    return (
        <>
            <style>{`
                .banner-wrap { max-width: 1280px; margin: 20px auto; padding: 0 20px; }
                .banner-inner { height: 280px; width: 100%; position: relative; border-radius: 24px; overflow: hidden; }
                .banner-nav-btn { border: none; border-radius: 50%; width: 44px; height: 44px; display: flex; align-items: center; justify-content: center; cursor: pointer; font-size: 18px; transition: all 0.3s ease; }

                @media (max-width: 768px) {
                    .banner-wrap { margin: 14px auto; padding: 0 12px; }
                    .banner-inner { height: 200px !important; border-radius: 18px !important; }
                    .banner-nav-btn { width: 34px !important; height: 34px !important; font-size: 14px !important; }
                }
                @media (max-width: 480px) {
                    .banner-inner { height: 160px !important; border-radius: 14px !important; }
                    .banner-nav-btn { width: 28px !important; height: 28px !important; font-size: 12px !important; }
                    .banner-wrap { padding: 0 8px; margin: 10px auto; }
                }
            `}</style>

            <div className="banner-wrap">
                <div className="banner-inner"
                    style={{ boxShadow: isDark ? '0 20px 60px rgba(0,0,0,0.4)' : '0 20px 60px rgba(0,0,0,0.15)' }}
                    onMouseEnter={() => setIsHovering(true)}
                    onMouseLeave={() => setIsHovering(false)}
                >
                    {/* Nav Buttons */}
                    <div style={{ position: 'absolute', zIndex: 10, height: '100%', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 12px', opacity: isHovering ? 1 : 0, transition: 'opacity 0.3s ease', pointerEvents: isHovering ? 'auto' : 'none' }}>
                        <button className="banner-nav-btn" onClick={prevImage}
                            style={{ background: isDark ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.95)', backdropFilter: 'blur(10px)', color: isDark ? '#fff' : '#333', boxShadow: '0 4px 16px rgba(0,0,0,0.15)', transform: isHovering ? 'translateX(0)' : 'translateX(-20px)' }}
                            onMouseEnter={e => { e.currentTarget.style.background = '#e53935'; e.currentTarget.style.color = '#fff'; e.currentTarget.style.transform = 'scale(1.1)' }}
                            onMouseLeave={e => { e.currentTarget.style.background = isDark ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.95)'; e.currentTarget.style.color = isDark ? '#fff' : '#333'; e.currentTarget.style.transform = 'scale(1)' }}
                        ><FaAngleLeft /></button>
                        <button className="banner-nav-btn" onClick={nextImage}
                            style={{ background: isDark ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.95)', backdropFilter: 'blur(10px)', color: isDark ? '#fff' : '#333', boxShadow: '0 4px 16px rgba(0,0,0,0.15)', transform: isHovering ? 'translateX(0)' : 'translateX(20px)' }}
                            onMouseEnter={e => { e.currentTarget.style.background = '#e53935'; e.currentTarget.style.color = '#fff'; e.currentTarget.style.transform = 'scale(1.1)' }}
                            onMouseLeave={e => { e.currentTarget.style.background = isDark ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.95)'; e.currentTarget.style.color = isDark ? '#fff' : '#333'; e.currentTarget.style.transform = 'scale(1)' }}
                        ><FaAngleRight /></button>
                    </div>

                    {/* Images */}
                    <div style={{ display: 'flex', height: '100%', width: '100%', overflow: 'hidden' }}>
                        {images.map((imageUrl, index) => (
                            <div key={index} style={{ width: '100%', height: '100%', minWidth: '100%', transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)', transform: `translateX(-${currentImage * 100}%)`, position: 'relative' }}>
                                <img src={imageUrl} alt={`Banner ${index + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover', filter: isDark ? 'brightness(0.85)' : 'none' }} />
                                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '40%', background: isDark ? 'linear-gradient(to top, rgba(0,0,0,0.5), transparent)' : 'linear-gradient(to top, rgba(0,0,0,0.3), transparent)', pointerEvents: 'none' }} />
                            </div>
                        ))}
                    </div>

                    {/* Dots */}
                    <div style={{ position: 'absolute', bottom: '14px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '6px', zIndex: 10 }}>
                        {images.map((_, index) => (
                            <button key={index} onClick={() => setCurrentImage(index)}
                                style={{ width: currentImage === index ? '22px' : '7px', height: '7px', borderRadius: '4px', border: 'none', background: currentImage === index ? '#fff' : 'rgba(255,255,255,0.5)', cursor: 'pointer', transition: 'all 0.3s ease', boxShadow: currentImage === index ? '0 2px 8px rgba(0,0,0,0.3)' : 'none', padding: 0 }}
                                onMouseEnter={e => { if (currentImage !== index) e.target.style.background = 'rgba(255,255,255,0.8)' }}
                                onMouseLeave={e => { if (currentImage !== index) e.target.style.background = 'rgba(255,255,255,0.5)' }}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </>
    )
}

export default BannerProduct