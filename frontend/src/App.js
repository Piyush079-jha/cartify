// This is the heart of the frontend. Everything lives inside here:
// routing, global state, dark mode, user session, and layout shell.
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
import Preloader from './components/Preloader';

function App() {
  const dispatch = useDispatch()

  // Track live cart and wishlist counts so the Header badge updates instantly
  // without a full page reload — just context updates from child components.
  const [cartProductCount, setCartProductCount] = useState(0)
  const [wishlistCount, setWishlistCount] = useState(0)

  // Controls whether the preloader is visible.
  // We give it 3.4s — enough for the animation to finish before we unmount it.
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 3400)
    return () => clearTimeout(timer)
  }, [])

  // Dark mode — persisted in localStorage so the user's preference survives
  // refresh. We read it once at mount using a lazy initializer.
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('darkMode')
    return saved === 'true'
  })

  // Flip dark mode and save the new value immediately so it sticks on reload.
  const toggleDarkMode = () => {
    setIsDark(prev => {
      const newValue = !prev
      localStorage.setItem('darkMode', newValue)
      return newValue
    })
  }

  // Sync the body background + text color whenever dark mode changes.
  // Doing it on the body element means every page gets it for free —
  // no need to pass isDark as a prop to every single component.
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

  // Fetch the logged-in user's profile from the backend and store it in Redux.
  // Wrapped in useCallback so it's stable and safe to use in the Context value
  // (child components can call it to refresh user data after updates).
  const fetchUserDetails = useCallback(async () => {
    const dataResponse = await fetch(SummaryApi.current_user.url, {
      method: SummaryApi.current_user.method,
      credentials: 'include' // needed so the auth cookie travels with the request
    })
    const dataApi = await dataResponse.json()
    if (dataApi.success) {
      dispatch(setUserDetails(dataApi.data))
    }
  }, [dispatch])

  // Pull the cart item count so the Header badge shows the right number
  // as soon as the page loads — no waiting for the Cart page to open.
  const fetchUserAddToCart = useCallback(async () => {
    const dataResponse = await fetch(SummaryApi.addToCartProductCount.url, {
      method: SummaryApi.addToCartProductCount.method,
      credentials: 'include'
    })
    const dataApi = await dataResponse.json()
    setCartProductCount(dataApi?.data?.count)
  }, [])

  // Same idea for the wishlist badge. Wrapped in try/catch because a
  // logged-out user won't have a wishlist — we just silently skip it.
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

  // Kick off all three fetches together on first mount.
  // This way the Header is fully populated before the user sees anything.
  useEffect(() => {
    fetchUserDetails()
    fetchUserAddToCart()
    fetchUserWishlist()
  }, [fetchUserDetails, fetchUserAddToCart, fetchUserWishlist])

  return (
    <>
      {/* Show the preloader on every fresh page load/refresh.
          It fades out on its own, then we fully remove it from the DOM. */}
      {loading && <Preloader />}

      {/* Context wraps the whole app so any component can read or trigger
          user/cart/wishlist refreshes without prop drilling. */}
      <Context.Provider value={{
        fetchUserDetails,
        cartProductCount,
        fetchUserAddToCart,
        wishlistCount,
        fetchUserWishlist,
        isDark,
        toggleDarkMode
      }}>
        {/* Toast notifications — respects dark mode automatically. */}
        <ToastContainer
          position='top-center'
          theme={isDark ? 'dark' : 'light'}
        />

        <Header isDark={isDark} toggleDarkMode={toggleDarkMode} />

        {/* pt-16 offsets the fixed Header height so page content
            never hides behind it. min-h ensures the footer stays at bottom. */}
        <main className='min-h-[calc(100vh-120px)] pt-16'>
          <Outlet context={{ isDark }} /> {/* child routes render here */}
        </main>

        <Footer isDark={isDark} />

        {/* Floating chat assistant — mounted globally so it persists
            across page navigations without losing conversation state. */}
        <ChatWidget />
      </Context.Provider>
    </>
  );
}

export default App;