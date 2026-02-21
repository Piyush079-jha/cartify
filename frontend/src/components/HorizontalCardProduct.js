import React, { useContext, useEffect, useRef, useState, useCallback } from 'react'
import fetchCategoryWiseProduct from '../helpers/fetchCategoryWiseProduct'
import displayINRCurrency from '../helpers/displayCurrency'
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa6'
import { Link } from 'react-router-dom'
import addToCart from '../helpers/addToCart'
import Context from '../context'

const HorizontalCardProduct = ({ category, heading, isDark = false }) => {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(true)
    const [hoveredId, setHoveredId] = useState(null)
    const loadingList = new Array(6).fill(null)
    const scrollElement = useRef()
    const { fetchUserAddToCart } = useContext(Context)

    const handleAddToCart = async (e, id) => {
        await addToCart(e, id)
        fetchUserAddToCart()
    }

    const fetchData = useCallback(async () => {
        setLoading(true)
        const categoryProduct = await fetchCategoryWiseProduct(category)
        setLoading(false)
        setData(categoryProduct?.data)
    }, [category])

    useEffect(() => { fetchData() }, [fetchData])

    const scrollRight = () => { scrollElement.current.scrollLeft += 300 }
    const scrollLeft = () => { scrollElement.current.scrollLeft -= 300 }

    return (
        <>
            <style>{`
                .hcp-wrapper {
                    max-width: 1280px;
                    margin: 40px auto;
                    padding: 0 24px;
                    position: relative;
                }
                .hcp-card {
                    min-width: 320px;
                    max-width: 320px;
                    height: 200px;
                    display: flex;
                    overflow: hidden;
                    border-radius: 18px;
                    text-decoration: none;
                    flex-shrink: 0;
                    transition: all 0.3s ease;
                }
                .hcp-scroll-btn {
                    position: absolute;
                    top: 50%;
                    transform: translateY(-50%);
                    z-index: 10;
                    border: none;
                    border-radius: 50%;
                    width: 40px;
                    height: 40px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    font-size: 16px;
                    box-shadow: 0 4px 16px rgba(0,0,0,0.12);
                    transition: all 0.3s ease;
                }
                @media (max-width: 768px) {
                    .hcp-wrapper {
                        padding: 0 14px;
                        margin: 28px auto;
                    }
                    .hcp-card {
                        min-width: 260px;
                        max-width: 260px;
                        height: 175px;
                    }
                    .hcp-img {
                        width: 120px !important;
                    }
                    .hcp-scroll-btn {
                        width: 32px;
                        height: 32px;
                        font-size: 13px;
                    }
                    .hcp-heading { font-size: 18px !important; }
                    .hcp-viewall { font-size: 12px !important; padding: 6px 12px !important; }
                    .hcp-price { font-size: 15px !important; }
                    .hcp-name { font-size: 13px !important; }
                    .hcp-btn { font-size: 12px !important; padding: 8px 6px !important; }
                }
                @media (max-width: 480px) {
                    .hcp-wrapper { padding: 0 10px; margin: 20px auto; }
                    .hcp-card { min-width: 220px; max-width: 220px; height: 160px; }
                    .hcp-img { width: 100px !important; }
                }
            `}</style>

            <div className="hcp-wrapper">
                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
                    <div>
                        <h2 className="hcp-heading" style={{ fontSize: '22px', fontWeight: 700, color: isDark ? '#fff' : '#111', margin: '0 0 6px', letterSpacing: '-0.5px' }}>
                            {heading}
                        </h2>
                        <div style={{ width: '44px', height: '3px', background: 'linear-gradient(90deg, #667eea, #764ba2)', borderRadius: '2px' }} />
                    </div>
                    <Link
                        to={`/product-category?category=${category}`}
                        className="hcp-viewall"
                        style={{ fontSize: '13px', fontWeight: 600, color: '#667eea', textDecoration: 'none', padding: '7px 16px', borderRadius: '10px', background: isDark ? 'rgba(102,126,234,0.15)' : 'rgba(102,126,234,0.08)', transition: 'all 0.3s ease' }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'linear-gradient(135deg, #667eea, #764ba2)'; e.currentTarget.style.color = '#fff' }}
                        onMouseLeave={e => { e.currentTarget.style.background = isDark ? 'rgba(102,126,234,0.15)' : 'rgba(102,126,234,0.08)'; e.currentTarget.style.color = '#667eea' }}
                    >
                        View All →
                    </Link>
                </div>

                {/* Scroll Buttons */}
                <button className="hcp-scroll-btn" onClick={scrollLeft}
                    style={{ left: '4px', background: isDark ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.95)', color: isDark ? '#fff' : '#333' }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'linear-gradient(135deg, #667eea, #764ba2)'; e.currentTarget.style.color = '#fff' }}
                    onMouseLeave={e => { e.currentTarget.style.background = isDark ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.95)'; e.currentTarget.style.color = isDark ? '#fff' : '#333' }}>
                    <FaAngleLeft />
                </button>
                <button className="hcp-scroll-btn" onClick={scrollRight}
                    style={{ right: '4px', background: isDark ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.95)', color: isDark ? '#fff' : '#333' }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'linear-gradient(135deg, #667eea, #764ba2)'; e.currentTarget.style.color = '#fff' }}
                    onMouseLeave={e => { e.currentTarget.style.background = isDark ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.95)'; e.currentTarget.style.color = isDark ? '#fff' : '#333' }}>
                    <FaAngleRight />
                </button>

                {/* Cards */}
                <div ref={scrollElement} style={{ display: 'flex', gap: '16px', overflowX: 'auto', scrollbarWidth: 'none', scrollBehavior: 'smooth', paddingBottom: '6px' }}>
                    {loading ? (
                        loadingList.map((_, i) => (
                            <div key={i} className="hcp-card" style={{ background: isDark ? 'rgba(255,255,255,0.05)' : '#fff', border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #f0f0f0', opacity: 0.6 }}>
                                <div className="hcp-img" style={{ width: '140px', background: isDark ? 'rgba(255,255,255,0.08)' : '#f5f5f5', flexShrink: 0 }} />
                                <div style={{ flex: 1, padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                    <div style={{ height: '14px', background: isDark ? 'rgba(255,255,255,0.1)' : '#f0f0f0', borderRadius: '6px' }} />
                                    <div style={{ height: '11px', background: isDark ? 'rgba(255,255,255,0.1)' : '#f0f0f0', borderRadius: '5px', width: '55%' }} />
                                    <div style={{ height: '18px', background: isDark ? 'rgba(255,255,255,0.1)' : '#f0f0f0', borderRadius: '5px', width: '65%' }} />
                                    <div style={{ height: '36px', background: isDark ? 'rgba(255,255,255,0.1)' : '#f0f0f0', borderRadius: '10px', marginTop: 'auto' }} />
                                </div>
                            </div>
                        ))
                    ) : (
                        data.map((product) => {
                            const isHovered = hoveredId === product?._id
                            const discount = product?.price > product?.sellingPrice
                                ? Math.round(((product.price - product.sellingPrice) / product.price) * 100)
                                : null

                            return (
                                <Link
                                    to={"product/" + product?._id}
                                    key={product?._id}
                                    className="hcp-card"
                                    onMouseEnter={() => setHoveredId(product?._id)}
                                    onMouseLeave={() => setHoveredId(null)}
                                    style={{
                                        background: isDark ? 'rgba(255,255,255,0.05)' : '#fff',
                                        border: isHovered ? '1.5px solid #667eea' : isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #efefef',
                                        boxShadow: isHovered ? '0 12px 32px rgba(102,126,234,0.2)' : '0 2px 8px rgba(0,0,0,0.04)',
                                        transform: isHovered ? 'translateY(-4px)' : 'translateY(0)',
                                        position: 'relative'
                                    }}
                                >
                                    {discount && (
                                        <div style={{ position: 'absolute', top: '10px', left: '10px', background: 'linear-gradient(135deg, #f093fb, #f5576c)', color: '#fff', fontSize: '10px', fontWeight: 700, padding: '3px 8px', borderRadius: '7px', zIndex: 2 }}>
                                            {discount}% OFF
                                        </div>
                                    )}

                                    {/* Image */}
                                    <div className="hcp-img" style={{ width: '140px', flexShrink: 0, background: isDark ? 'linear-gradient(135deg, rgba(255,255,255,0.03), rgba(255,255,255,0.06))' : 'linear-gradient(135deg, #fafafa, #f2f2f2)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '14px', overflow: 'hidden' }}>
                                        <img src={product.productImage[0]} alt={product.productName}
                                            style={{ width: '100%', height: '100%', objectFit: 'contain', mixBlendMode: isDark ? 'lighten' : 'multiply', transition: 'transform 0.4s ease', transform: isHovered ? 'scale(1.1)' : 'scale(1)' }} />
                                    </div>

                                    {/* Info */}
                                    <div style={{ flex: 1, padding: '14px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minWidth: 0 }}>
                                        <div>
                                            <h3 className="hcp-name" style={{ fontSize: '13px', fontWeight: 600, color: isDark ? '#fff' : '#111', margin: '0 0 4px', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', lineHeight: '1.4' }}>
                                                {product?.productName}
                                            </h3>
                                            <p style={{ fontSize: '10px', color: '#667eea', fontWeight: 600, margin: 0, textTransform: 'capitalize' }}>{product?.category}</p>
                                        </div>
                                        <div>
                                            <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginBottom: '8px', flexWrap: 'wrap' }}>
                                                <span className="hcp-price" style={{ fontSize: '16px', fontWeight: 800, background: 'linear-gradient(135deg, #667eea, #764ba2)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                                                    {displayINRCurrency(product?.sellingPrice)}
                                                </span>
                                                {product?.price !== product?.sellingPrice && (
                                                    <span style={{ fontSize: '11px', color: isDark ? 'rgba(255,255,255,0.35)' : '#bbb', textDecoration: 'line-through' }}>
                                                        {displayINRCurrency(product?.price)}
                                                    </span>
                                                )}
                                            </div>
                                            <button className="hcp-btn" onClick={(e) => handleAddToCart(e, product?._id)}
                                                style={{ width: '100%', padding: '8px', borderRadius: '10px', border: 'none', background: 'linear-gradient(135deg, #667eea, #764ba2)', color: '#fff', fontSize: '12px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.3s ease', boxShadow: '0 4px 14px rgba(102,126,234,0.28)', fontFamily: 'inherit' }}
                                                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 6px 18px rgba(102,126,234,0.4)' }}
                                                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 14px rgba(102,126,234,0.28)' }}>
                                                Add to Cart
                                            </button>
                                        </div>
                                    </div>
                                </Link>
                            )
                        })
                    )}
                </div>
            </div>
        </>
    )
}

export default HorizontalCardProduct