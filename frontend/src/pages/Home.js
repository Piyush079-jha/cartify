import React, { useEffect, useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import CategoryList from '../components/CategoryList'
import BannerProduct from '../components/BannerProduct'
import HorizontalCardProduct from '../components/HorizontalCardProduct'
import VerticalCardProduct from '../components/VerticalCardProduct'

const Home = () => {
  const { isDark } = useOutletContext()
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <>
      <style>{`
        @media (max-width: 768px) {
          .home-wrapper {
            padding-top: 64px !important;
          }
        }
        @media (max-width: 480px) {
          .home-wrapper {
            padding-top: 60px !important;
          }
        }
      `}</style>
      <div
        className="home-wrapper"
        style={{
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
          transition: 'opacity 0.6s ease, transform 0.6s ease',
          paddingTop: '68px',
          minHeight: '100vh',
          background: isDark
            ? 'linear-gradient(180deg, #1a1a1a 0%, #2d2d2d 100%)'
            : 'linear-gradient(180deg, #ffffff 0%, #f9f9fb 100%)'
        }}>
        <CategoryList isDark={isDark} />
        <BannerProduct isDark={isDark} />

        <HorizontalCardProduct isDark={isDark} category={"airpodes"} heading={"Top's Airpodes"} />
        <HorizontalCardProduct isDark={isDark} category={"watches"} heading={"Popular's Watches"} />

        <VerticalCardProduct isDark={isDark} category={"mobiles"} heading={"Mobiles"} />
        <VerticalCardProduct isDark={isDark} category={"mouse"} heading={"Mouse"} />
        <VerticalCardProduct isDark={isDark} category={"televisions"} heading={"Televisions"} />
        <VerticalCardProduct isDark={isDark} category={"camera"} heading={"Camera & Photography"} />
        <VerticalCardProduct isDark={isDark} category={"earphones"} heading={"Wired Earphones"} />
        <VerticalCardProduct isDark={isDark} category={"speakers"} heading={"Bluetooth Speakers"} />
        <VerticalCardProduct isDark={isDark} category={"refrigerator"} heading={"Refrigerator"} />
        <VerticalCardProduct isDark={isDark} category={"trimmers"} heading={"Trimmers"} />
      </div>
    </>
  )
}

export default Home