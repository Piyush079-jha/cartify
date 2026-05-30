import React from 'react'
import { Link } from 'react-router-dom'
import { FaInstagram, FaGithub, FaLinkedin } from 'react-icons/fa'

const Footer = ({ isDark }) => {
  const bg     = isDark ? '#0e0e0e' : '#1a1814'
  const text   = isDark ? '#a09890' : '#9a9088'
  const light  = isDark ? '#e8e4dc' : '#e8e4dc'
  const border = 'rgba(232,228,220,0.1)'
  const gold   = '#c9a84c'

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
    display: 'inline-block', transition: 'color 0.2s ease',
    letterSpacing: '0.04em', lineHeight: 1
  }

  return (
    <>
      <style>{`
        .ftr-grid { display: grid; grid-template-columns: 1.6fr 1fr 1fr 1fr; gap: 48px; }
        .ftr-link:hover { color: ${light} !important; }
        @media (max-width: 900px) { .ftr-grid { grid-template-columns: 1fr 1fr; gap: 32px; } }
        @media (max-width: 540px) {
          .ftr-grid { grid-template-columns: 1fr 1fr; gap: 24px; }
          .ftr-brand { grid-column: 1 / -1; }
          .ftr-inner { padding: 40px 20px 32px !important; }
          .ftr-bottom { padding: 16px 20px !important; }
        }
      `}</style>

      <footer style={{ background: bg, color: text }}>
        <div className="ftr-inner" style={{ maxWidth: '1400px', margin: '0 auto', padding: '64px 32px 48px' }}>
          <div className="ftr-grid">

            {/* Brand */}
            <div className="ftr-brand">
              <div style={{ marginBottom: '20px' }}>
                <div style={{ fontSize: '20px', fontWeight: 300, letterSpacing: '0.25em', textTransform: 'uppercase', color: light }}>Cartify</div>
                <div style={{ width: '24px', height: '0.5px', background: gold, marginTop: '8px' }} />
              </div>
              <p style={{ fontSize: '12px', lineHeight: 1.9, maxWidth: '220px', margin: '0 0 24px', letterSpacing: '0.03em' }}>
                Curated electronics and lifestyle products. Thoughtfully selected, beautifully delivered.
              </p>
              <div style={{ display: 'flex', gap: '12px' }}>
                {socialLinks.map(({ Icon, url, label }) => (
                  <a key={label} href={url} target="_blank" rel="noopener noreferrer" title={label}
                    style={{ width: '32px', height: '32px', border: `0.5px solid ${border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', color: text, textDecoration: 'none', transition: 'all 0.2s ease', borderRadius: '1px' }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = gold; e.currentTarget.style.color = gold }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = border; e.currentTarget.style.color = text }}
                  ><Icon /></a>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 style={{ fontSize: '10px', fontWeight: 500, marginBottom: '20px', letterSpacing: '0.14em', textTransform: 'uppercase', color: light }}>Navigation</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {quickLinks.map(item => (
                  <Link key={item.path} to={item.path} style={linkStyle} className="ftr-link">{item.label}</Link>
                ))}
              </div>
            </div>

            {/* Categories */}
            <div>
              <h4 style={{ fontSize: '10px', fontWeight: 500, marginBottom: '20px', letterSpacing: '0.14em', textTransform: 'uppercase', color: light }}>Categories</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {categoryLinks.map(cat => (
                  <Link key={cat.value} to={`/product-category?category=${cat.value}`} style={linkStyle} className="ftr-link">{cat.label}</Link>
                ))}
              </div>
            </div>

            {/* Contact */}
            <div>
              <h4 style={{ fontSize: '10px', fontWeight: 500, marginBottom: '20px', letterSpacing: '0.14em', textTransform: 'uppercase', color: light }}>Contact</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <a href="mailto:piyushjha1134@gmail.com" style={{ ...linkStyle, lineHeight: 1.5 }} className="ftr-link">piyushjha1134@gmail.com</a>
                <a href="tel:+919631163498" style={linkStyle} className="ftr-link">+91 96311 63498</a>
                <span style={{ fontSize: '12px', letterSpacing: '0.04em' }}>India</span>
              </div>
              <div style={{ marginTop: '24px', borderTop: `0.5px solid ${border}`, paddingTop: '20px' }}>
                {['Secure Payments', 'Fast Delivery', 'Easy Returns'].map(item => (
                  <div key={item} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                    <div style={{ width: '3px', height: '3px', background: gold, borderRadius: '50%', flexShrink: 0 }} />
                    <span style={{ fontSize: '11px', letterSpacing: '0.04em' }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="ftr-bottom" style={{ borderTop: `0.5px solid ${border}`, padding: '16px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
          <p style={{ fontSize: '11px', margin: 0, letterSpacing: '0.04em' }}>
            © {new Date().getFullYear()} Cartify. All rights reserved.
          </p>
          <p style={{ fontSize: '11px', margin: 0, letterSpacing: '0.04em' }}>
            Crafted in India
          </p>
        </div>
      </footer>
    </>
  )
}

export default Footer