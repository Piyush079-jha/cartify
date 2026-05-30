import React, { useEffect, useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import CategoryList from '../components/CategoryList'
import BannerProduct from '../components/BannerProduct'
import HorizontalCardProduct from '../components/HorizontalCardProduct'
import VerticalCardProduct from '../components/VerticalCardProduct'

const Home = () => {
  const { isDark } = useOutletContext()
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => { setIsVisible(true) }, [])

  const bg     = isDark ? '#0e0e0e' : '#faf9f7'
  const border = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(26,24,20,0.08)'

  return (
    <>
      <style>{`
        /* ── Responsive container used for dividers and headings ── */
        .home-container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 32px;
        }
        @media (max-width: 1024px) { .home-container { padding: 0 24px; } }
        @media (max-width: 768px)  { .home-container { padding: 0 16px; } }
        @media (max-width: 480px)  { .home-container { padding: 0 12px; } }

        @media (max-width: 768px) { .home-wrapper { padding-top: 60px !important; } }
        @media (max-width: 480px) { .home-wrapper { padding-top: 60px !important; } }

        .home-section-label {
          font-size: 10px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: ${isDark ? 'rgba(255,255,255,0.3)' : 'rgba(26,24,20,0.45)'};
          margin: 0 0 4px;
        }
        .home-section-title {
          font-size: 22px;
          font-weight: 300;
          letter-spacing: -0.01em;
          color: ${isDark ? '#e8e4dc' : '#1a1814'};
          font-family: Georgia, "Times New Roman", serif;
          margin: 0;
        }
        .home-divider {
          height: 0.5px;
          background: ${border};
        }
      `}</style>

      <div
        className="home-wrapper"
        style={{
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'translateY(0)' : 'translateY(12px)',
          transition: 'opacity 0.5s ease, transform 0.5s ease',
          paddingTop: '0px',
          minHeight: '100vh',
          background: bg
        }}
      >
        {/* Category strip */}
        <CategoryList isDark={isDark} />

        {/* Hero banner */}
        <BannerProduct isDark={isDark} />

        {/* Divider */}
        <div className="home-container">
          <div className="home-divider" />
        </div>

        {/* Staff Picks heading */}
        <div className="home-container" style={{ paddingTop: '48px' }}>
          <p className="home-section-label">Featured</p>
          <h2 className="home-section-title">Staff Picks</h2>
        </div>

        <HorizontalCardProduct isDark={isDark} category={"airpodes"} heading={"Airpods"} />
        <HorizontalCardProduct isDark={isDark} category={"watches"}  heading={"Watches"} />

        {/* Divider */}
        <div className="home-container" style={{ marginTop: '32px' }}>
          <div className="home-divider" />
        </div>

        {/* Our Collection heading */}
        <div className="home-container" style={{ paddingTop: '48px' }}>
          <p className="home-section-label">Browse All</p>
          <h2 className="home-section-title">Our Collection</h2>
        </div>

        <VerticalCardProduct isDark={isDark} category={"mobiles"}      heading={"Mobiles"} />
        <VerticalCardProduct isDark={isDark} category={"mouse"}        heading={"Mouse"} />
        <VerticalCardProduct isDark={isDark} category={"televisions"}  heading={"Televisions"} />
        <VerticalCardProduct isDark={isDark} category={"camera"}       heading={"Cameras"} />
        <VerticalCardProduct isDark={isDark} category={"earphones"}    heading={"Earphones"} />
        <VerticalCardProduct isDark={isDark} category={"speakers"}     heading={"Speakers"} />
        <VerticalCardProduct isDark={isDark} category={"refrigerator"} heading={"Refrigerators"} />
        <VerticalCardProduct isDark={isDark} category={"trimmers"}     heading={"Trimmers"} />

        {/* Footer breathing room */}
        <div style={{ height: '64px' }} />
      </div>
    </>
  )
}

export default Home