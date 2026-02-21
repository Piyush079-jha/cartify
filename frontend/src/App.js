import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Outlet } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useEffect, useState, useCallback } from 'react';
import SummaryApi from './common';
import Context from './context';
import { useDispatch } from 'react-redux';
import { setUserDetails } from './store/userSlice';
import ChatWidget from './components/ChatWidget';
import Payment from './pages/Payment';
import OrderTracking from './pages/OrderTracking';
// import CancelledOrders from './pages/CancelledOrders';
function App() {
  const dispatch = useDispatch()
  const [cartProductCount, setCartProductCount] = useState(0)
  const [wishlistCount, setWishlistCount] = useState(0)

  // Dark Mode State with localStorage persistence
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('darkMode')
    return saved === 'true'
  })

  // Toggle Dark Mode
  const toggleDarkMode = () => {
    setIsDark(prev => {
      const newValue = !prev
      localStorage.setItem('darkMode', newValue)
      return newValue
    })
  }

  // Apply dark mode to body
  useEffect(() => {
    if (isDark) {
      document.body.style.background = 'linear-gradient(180deg, #1a1a1a 0%, #2d2d2d 100%)'
      document.body.style.color = '#fff'
      document.body.style.transition = 'all 0.3s ease'
    } else {
      document.body.style.background = 'linear-gradient(180deg, #ffffff 0%, #f9f9fb 100%)'
      document.body.style.color = '#111'
      document.body.style.transition = 'all 0.3s ease'
    }
  }, [isDark])

  const fetchUserDetails = useCallback(async () => {
    const dataResponse = await fetch(SummaryApi.current_user.url, {
      method: SummaryApi.current_user.method,
      credentials: 'include'
    })
    const dataApi = await dataResponse.json()
    if (dataApi.success) {
      dispatch(setUserDetails(dataApi.data))
    }
  }, [dispatch])

  const fetchUserAddToCart = useCallback(async () => {
    const dataResponse = await fetch(SummaryApi.addToCartProductCount.url, {
      method: SummaryApi.addToCartProductCount.method,
      credentials: 'include'
    })
    const dataApi = await dataResponse.json()
    setCartProductCount(dataApi?.data?.count)
  }, [])

  const fetchUserWishlist = useCallback(async () => {
    try {
      const dataResponse = await fetch(SummaryApi.wishlistProductCount.url, {
        method: SummaryApi.wishlistProductCount.method,
        credentials: 'include'
      })
      const dataApi = await dataResponse.json()
      if (dataApi.success) {
        setWishlistCount(dataApi?.data?.count || 0)
      }
    } catch (error) {
      console.log("Wishlist count fetch error:", error)
    }
  }, [])

  useEffect(() => {
    fetchUserDetails()
    fetchUserAddToCart()
    fetchUserWishlist()
  }, [fetchUserDetails, fetchUserAddToCart, fetchUserWishlist])

  return (
    <>
      <Context.Provider value={{
        fetchUserDetails,
        cartProductCount,
        fetchUserAddToCart,
        wishlistCount,
        fetchUserWishlist,
        isDark,
        toggleDarkMode
      }}>
        <ToastContainer
          position='top-center'
          theme={isDark ? 'dark' : 'light'}
        />

        <Header isDark={isDark} toggleDarkMode={toggleDarkMode} />
        <main className='min-h-[calc(100vh-120px)] pt-16'>
          <Outlet context={{ isDark }} />
        </main>
        <Footer isDark={isDark} />
        <ChatWidget />
      </Context.Provider>
    </>
  );
}
export default App;