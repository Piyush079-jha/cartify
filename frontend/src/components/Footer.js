import React from 'react'
import { Link } from 'react-router-dom'
import { FaShoppingBag, FaHeart, FaInstagram, FaGithub, FaLinkedin } from 'react-icons/fa'

const Footer = ({ isDark }) => {
  const socialLinks = [
    { Icon: FaInstagram, url: 'https://www.instagram.com/piyush_jha39/', label: 'Instagram' },
    { Icon: FaLinkedin, url: 'https://www.linkedin.com/in/piyush-jha1134/', label: 'LinkedIn' },
    { Icon: FaGithub, url: 'https://github.com/', label: 'GitHub' },
  ]
  const quickLinks = [
    { label: 'Home', path: '/' }, { label: 'All Products', path: '/product-category' },
    { label: 'Cart', path: '/cart' }, { label: 'Login', path: '/login' },
  ]
  const categoryLinks = [
    { label: 'Airpods', value: 'airpodes' }, { label: 'Mobiles', value: 'mobiles' },
    { label: 'Earphones', value: 'earphones' }, { label: 'Camera', value: 'camera' },
    { label: 'Speakers', value: 'speakers' }, { label: 'Refrigerator', value: 'refrigerator' },
  ]
  const linkStyle = { color: 'rgba(255,255,255,0.75)', textDecoration: 'none', fontSize: '13px', display: 'inline-block', transition: 'all 0.2s ease', padding: '2px 0' }

  return (
    <>
      <style>{`
        .footer-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 32px; }
        @media (max-width: 900px) { .footer-grid { grid-template-columns: repeat(2, 1fr); gap: 28px; } }
        @media (max-width: 540px) {
          .footer-grid { grid-template-columns: 1fr 1fr; gap: 20px; }
          .footer-brand { grid-column: 1 / -1; }
          .footer-inner { padding: 32px 16px 24px !important; }
          .footer-bottom { padding: 14px 16px !important; }
        }
        @media (max-width: 380px) {
          .footer-grid { grid-template-columns: 1fr; }
          .footer-brand { grid-column: auto; }
        }
      `}</style>

      <footer style={{ background: isDark ? 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: '#fff', marginTop: 'auto' }}>
        <div className="footer-inner" style={{ maxWidth: '1280px', margin: '0 auto', padding: '48px 24px 32px' }}>
          <div className="footer-grid">

            {/* Brand */}
            <div className="footer-brand">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                <div style={{ width: '38px', height: '38px', background: 'rgba(255,255,255,0.2)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>
                  <FaShoppingBag />
                </div>
                <div>
                  <div style={{ fontSize: '18px', fontWeight: 800, letterSpacing: '1px' }}>Cartify</div>
                  <div style={{ fontSize: '10px', opacity: 0.7, letterSpacing: '3px', textTransform: 'uppercase' }}>shop here</div>
                </div>
              </div>
              <p style={{ fontSize: '13px', opacity: 0.75, lineHeight: 1.7, maxWidth: '220px', margin: '0 0 16px' }}>
                Your one-stop destination for the best electronics, gadgets, and more at unbeatable prices.
              </p>
              <div style={{ display: 'flex', gap: '10px' }}>
                {socialLinks.map(({ Icon, url, label }) => (
                  <a key={label} href={url} target="_blank" rel="noopener noreferrer" title={label}
                    style={{ width: '34px', height: '34px', background: 'rgba(255,255,255,0.15)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '15px', color: '#fff', textDecoration: 'none', transition: 'all 0.3s ease' }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.3)'; e.currentTarget.style.transform = 'translateY(-3px)' }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.15)'; e.currentTarget.style.transform = 'translateY(0)' }}
                  ><Icon /></a>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '14px', opacity: 0.9 }}>Quick Links</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '9px' }}>
                {quickLinks.map(item => (
                  <Link key={item.path} to={item.path} style={linkStyle}
                    onMouseEnter={e => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.transform = 'translateX(4px)' }}
                    onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.75)'; e.currentTarget.style.transform = 'translateX(0)' }}
                  >→ {item.label}</Link>
                ))}
              </div>
            </div>

            {/* Categories */}
            <div>
              <h4 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '14px', opacity: 0.9 }}>Categories</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '9px' }}>
                {categoryLinks.map(cat => (
                  <Link key={cat.value} to={`/product-category?category=${cat.value}`} style={linkStyle}
                    onMouseEnter={e => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.transform = 'translateX(4px)' }}
                    onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.75)'; e.currentTarget.style.transform = 'translateX(0)' }}
                  >→ {cat.label}</Link>
                ))}
              </div>
            </div>

            {/* Contact */}
            <div>
              <h4 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '14px', opacity: 0.9 }}>Contact</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '9px', fontSize: '13px', opacity: 0.75 }}>
                <a href="mailto:piyushjha1134@gmail.com" style={{ color: 'inherit', textDecoration: 'none' }}>📧 piyushjha1134@gmail.com</a>
                <a href="tel:+919631163498" style={{ color: 'inherit', textDecoration: 'none' }}>📞 +91 9631163498</a>
                <p style={{ margin: 0 }}>📍 India</p>
              </div>
              <div style={{ marginTop: '16px', background: 'rgba(255,255,255,0.1)', borderRadius: '10px', padding: '12px', fontSize: '12px', opacity: 0.85, lineHeight: 2 }}>
                🛡️ 100% Secure Payments<br />
                🚚 Fast Delivery Across India<br />
                🔄 Easy Returns & Refunds
              </div>
            </div>
          </div>
        </div>

        <div className="footer-bottom" style={{ borderTop: '1px solid rgba(255,255,255,0.15)', padding: '14px 24px', textAlign: 'center' }}>
          <p style={{ fontSize: '13px', opacity: 0.75, margin: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', flexWrap: 'wrap' }}>
            © {new Date().getFullYear()}
            <strong style={{ color: '#fff' }}>Piyush Shop</strong>
            — Crafted with <FaHeart style={{ color: '#f5576c', fontSize: '12px' }} /> in India. All rights reserved.
          </p>
        </div>
      </footer>
    </>
  )
}

export default Footer