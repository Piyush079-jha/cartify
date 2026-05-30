import React, { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { FaInstagram, FaGithub, FaLinkedin } from 'react-icons/fa'

const Footer = ({ isDark }) => {
  const bg     = isDark ? '#080808' : '#111110'
  const text   = isDark ? '#6a6460' : '#6a6460'
  const light  = isDark ? '#e8e4dc' : '#e8e4dc'
  const border = 'rgba(232,228,220,0.07)'
  const gold   = '#c9a84c'
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let W = canvas.offsetWidth, H = canvas.offsetHeight
    canvas.width = W; canvas.height = H

    const particles = Array.from({ length: 38 }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      r: Math.random() * 1.2 + 0.3,
      vx: (Math.random() - 0.5) * 0.18,
      vy: -(Math.random() * 0.25 + 0.08),
      alpha: Math.random() * 0.4 + 0.1
    }))

    let raf
    const draw = () => {
      ctx.clearRect(0, 0, W, H)
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy
        if (p.y < -2) { p.y = H + 2; p.x = Math.random() * W }
        if (p.x < 0) p.x = W; if (p.x > W) p.x = 0
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(201,168,76,${p.alpha})`
        ctx.fill()
      })
      raf = requestAnimationFrame(draw)
    }
    draw()

    const onResize = () => {
      W = canvas.offsetWidth; H = canvas.offsetHeight
      canvas.width = W; canvas.height = H
    }
    window.addEventListener('resize', onResize)
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', onResize) }
  }, [])

  const socialLinks = [
    { Icon: FaInstagram, url: 'https://www.instagram.com/piyush_jha39/', label: 'Instagram' },
    { Icon: FaLinkedin,  url: 'https://www.linkedin.com/in/piyush-jha1134/', label: 'LinkedIn' },
    { Icon: FaGithub,    url: 'https://github.com/', label: 'GitHub' },
  ]
  const quickLinks = [
    { label: 'Home', path: '/' },
    { label: 'All Products', path: '/product-category' },
    { label: 'Cart', path: '/cart' },
    { label: 'Sign In', path: '/login' },
  ]
  const categoryLinks = [
    { label: 'Mobiles', value: 'mobiles' },
    { label: 'Audio', value: 'earphones' },
    { label: 'Cameras', value: 'camera' },
    { label: 'Speakers', value: 'speakers' },
    { label: 'Watches', value: 'watches' },
    { label: 'Refrigerators', value: 'refrigerator' },
  ]

  const linkStyle = {
    color: text, textDecoration: 'none', fontSize: '12px',
    display: 'inline-block', transition: 'all 0.25s ease',
    letterSpacing: '0.05em', lineHeight: 1,
    fontFamily: "'DM Sans', -apple-system, sans-serif"
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500&display=swap');
        .ftr-grid { display: grid; grid-template-columns: 1.6fr 1fr 1fr 1fr; gap: 48px; }
        .ftr-link:hover { color: ${light} !important; letter-spacing: 0.08em !important; }
        .ftr-social:hover { border-color: ${gold} !important; color: ${gold} !important; transform: translateY(-2px) !important; box-shadow: 0 4px 16px rgba(201,168,76,0.2) !important; }
        @media (max-width: 900px) { .ftr-grid { grid-template-columns: 1fr 1fr; gap: 32px; } }
        @media (max-width: 540px) {
          .ftr-grid { grid-template-columns: 1fr 1fr; gap: 24px; }
          .ftr-brand { grid-column: 1 / -1; }
          .ftr-inner { padding: 40px 20px 32px !important; }
          .ftr-bottom { padding: 16px 20px !important; flex-direction: column !important; gap: 6px !important; }
        }
      `}</style>

      <footer style={{ background: bg, color: text, position: 'relative', overflow: 'hidden', fontFamily: "'DM Sans', -apple-system, sans-serif" }}>

        {/* Floating gold particles */}
        <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', opacity: 0.6 }} />

        {/* Top glow line */}
        <div style={{ height: '0.5px', background: `linear-gradient(90deg, transparent, ${gold}, transparent)`, opacity: 0.4 }} />

        <div className="ftr-inner" style={{ maxWidth: '1400px', margin: '0 auto', padding: '64px 32px 48px', position: 'relative', zIndex: 1 }}>
          <div className="ftr-grid">

            {/* Brand */}
            <div className="ftr-brand">
              <div style={{ marginBottom: '20px' }}>
                <div style={{
                  fontSize: '20px', fontWeight: 300, letterSpacing: '0.3em',
                  textTransform: 'uppercase', color: light,
                  background: `linear-gradient(90deg, ${light}, ${gold}, ${light})`,
                  backgroundSize: '200% auto',
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  animation: 'shimmer 4s linear infinite'
                }}>Cartify</div>
                <div style={{ width: '24px', height: '0.5px', background: gold, marginTop: '8px', boxShadow: '0 0 8px rgba(201,168,76,0.5)' }} />
              </div>
              <p style={{ fontSize: '12px', lineHeight: 2, maxWidth: '220px', margin: '0 0 24px', letterSpacing: '0.04em' }}>
                Curated electronics and lifestyle products. Thoughtfully selected, beautifully delivered.
              </p>
              <div style={{ display: 'flex', gap: '10px' }}>
                {socialLinks.map(({ Icon, url, label }) => (
                  <a key={label} href={url} target="_blank" rel="noopener noreferrer" title={label}
                    className="ftr-social"
                    style={{ width: '32px', height: '32px', border: `0.5px solid ${border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', color: text, textDecoration: 'none', transition: 'all 0.25s ease' }}
                  ><Icon /></a>
                ))}
              </div>
            </div>

            {/* Navigation */}
            <div>
              <h4 style={{ fontSize: '9px', fontWeight: 500, marginBottom: '20px', letterSpacing: '0.18em', textTransform: 'uppercase', color: light }}>Navigation</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {quickLinks.map(item => (
                  <Link key={item.path} to={item.path} style={linkStyle} className="ftr-link">{item.label}</Link>
                ))}
              </div>
            </div>

            {/* Categories */}
            <div>
              <h4 style={{ fontSize: '9px', fontWeight: 500, marginBottom: '20px', letterSpacing: '0.18em', textTransform: 'uppercase', color: light }}>Categories</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {categoryLinks.map(cat => (
                  <Link key={cat.value} to={`/product-category?category=${cat.value}`} style={linkStyle} className="ftr-link">{cat.label}</Link>
                ))}
              </div>
            </div>

            {/* Contact */}
            <div>
              <h4 style={{ fontSize: '9px', fontWeight: 500, marginBottom: '20px', letterSpacing: '0.18em', textTransform: 'uppercase', color: light }}>Contact</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <a href="mailto:piyushjha1134@gmail.com" style={{ ...linkStyle, lineHeight: 1.6 }} className="ftr-link">piyushjha1134@gmail.com</a>
                <a href="tel:+919631163498" style={linkStyle} className="ftr-link">+91 96311 63498</a>
                <span style={{ fontSize: '12px', letterSpacing: '0.05em' }}>India</span>
              </div>
              <div style={{ marginTop: '28px', borderTop: `0.5px solid ${border}`, paddingTop: '20px' }}>
                {['Secure Payments', 'Fast Delivery', 'Easy Returns'].map(item => (
                  <div key={item} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                    <div style={{ width: '3px', height: '3px', background: gold, borderRadius: '50%', flexShrink: 0, boxShadow: '0 0 6px rgba(201,168,76,0.6)' }} />
                    <span style={{ fontSize: '11px', letterSpacing: '0.05em' }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="ftr-bottom" style={{
          borderTop: `0.5px solid ${border}`, padding: '16px 32px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          flexWrap: 'wrap', gap: '8px', position: 'relative', zIndex: 1
        }}>
          <p style={{ fontSize: '11px', margin: 0, letterSpacing: '0.05em' }}>
            © {new Date().getFullYear()} Cartify. All rights reserved.
          </p>
          <p style={{ fontSize: '11px', margin: 0, letterSpacing: '0.05em' }}>
            Crafted in India
          </p>
        </div>
      </footer>
    </>
  )
}

export default Footer