import React, { useContext, useEffect, useState } from 'react'
import fetchCategoryWiseProduct from '../helpers/fetchCategoryWiseProduct'
import displayINRCurrency from '../helpers/displayCurrency'
import { Link } from 'react-router-dom'
import addToCart from '../helpers/addToCart'
import Context from '../context'
import scrollTop from '../helpers/scrollTop'

const CategroyWiseProductDisplay = ({ category, heading, isDark = false }) => {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(true)
    const loadingList = new Array(6).fill(null)
    const { fetchUserAddToCart } = useContext(Context)

    const handleAddToCart = async (e, id) => {
        await addToCart(e, id)
        fetchUserAddToCart()
    }

    const fetchData = async () => {
        setLoading(true)
        const categoryProduct = await fetchCategoryWiseProduct(category)
        setLoading(false)
        setData(categoryProduct?.data)
    }

    useEffect(() => { fetchData() }, [])

    const gold        = '#c9a84c'
    const goldDark    = '#b8953e'
    const wrapperBg   = isDark ? '#0e0e0e' : 'transparent'
    const cardBg      = isDark ? '#161616' : '#ffffff'
    const cardBorder  = isDark ? 'rgba(255,255,255,0.07)' : 'rgba(26,24,20,0.08)'
    const skeletonBg  = isDark ? 'rgba(255,255,255,0.04)' : 'rgba(26,24,20,0.04)'
    const textPrimary = isDark ? '#e8e4dc' : '#1a1814'
    const textMuted   = isDark ? 'rgba(160,152,144,0.8)' : 'rgba(130,125,118,0.9)'
    const imageBg     = isDark ? 'rgba(255,255,255,0.02)' : '#f7f6f4'

    return (
        <div style={{
            background: wrapperBg,
            padding: '32px 0',
            transition: 'all 0.3s ease'
        }}>
            {/* Header */}
            <div style={{ marginBottom: '24px' }}>
                <h2 style={{
                    fontFamily: "'Cormorant Garamond', Georgia, serif",
                    fontSize: '24px', fontWeight: 300,
                    color: textPrimary, margin: '0 0 10px',
                    letterSpacing: '-0.01em'
                }}>
                    {heading}
                </h2>
                <div style={{
                    width: '40px', height: '0.5px',
                    background: `linear-gradient(90deg, ${gold}, transparent)`,
                }} />
            </div>

            {/* Grid */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                gap: '16px'
            }}>
                {loading ? (
                    loadingList.map((_, i) => (
                        <div key={i} style={{
                            background: cardBg, overflow: 'hidden',
                            border: `0.5px solid ${cardBorder}`,
                            animation: 'cwpPulse 1.8s ease-in-out infinite',
                            animationDelay: `${i * 0.08}s`
                        }}>
                            <style>{`
                                @keyframes cwpPulse {
                                    0%, 100% { opacity: 0.65; }
                                    50% { opacity: 0.25; }
                                }
                            `}</style>
                            <div style={{ height: '180px', background: skeletonBg }} />
                            <div style={{ padding: '14px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                <div style={{ height: '12px', background: skeletonBg }} />
                                <div style={{ height: '10px', background: skeletonBg, width: '55%' }} />
                                <div style={{ height: '36px', background: skeletonBg }} />
                            </div>
                        </div>
                    ))
                ) : (
                    data.map((product) => {
                        const discount = product?.price > product?.sellingPrice
                            ? Math.round(((product.price - product.sellingPrice) / product.price) * 100)
                            : null

                        return (
                            <div
                                key={product?._id}
                                style={{
                                    background: cardBg, overflow: 'hidden',
                                    position: 'relative',
                                    border: `0.5px solid ${cardBorder}`,
                                    transition: 'transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease'
                                }}
                                onMouseEnter={e => {
                                    e.currentTarget.style.transform = 'translateY(-4px)'
                                    e.currentTarget.style.boxShadow = isDark
                                        ? '0 12px 40px rgba(0,0,0,0.4)'
                                        : '0 12px 40px rgba(26,24,20,0.1)'
                                    e.currentTarget.style.borderColor = gold
                                }}
                                onMouseLeave={e => {
                                    e.currentTarget.style.transform = 'translateY(0)'
                                    e.currentTarget.style.boxShadow = 'none'
                                    e.currentTarget.style.borderColor = cardBorder
                                }}
                            >
                                {/* Discount Badge */}
                                {discount && (
                                    <div style={{
                                        position: 'absolute', top: '10px', right: '10px', zIndex: 2,
                                        background: 'rgba(201,168,76,0.12)',
                                        color: gold, fontSize: '9px', fontWeight: 500,
                                        padding: '3px 8px', letterSpacing: '0.08em',
                                        border: `0.5px solid rgba(201,168,76,0.25)`
                                    }}>
                                        {discount}% OFF
                                    </div>
                                )}

                                {/* Image */}
                                <Link to={"/product/" + product?._id} onClick={scrollTop} style={{ textDecoration: 'none' }}>
                                    <div style={{
                                        height: '180px', background: imageBg,
                                        display: 'flex', alignItems: 'center',
                                        justifyContent: 'center', padding: '20px', overflow: 'hidden'
                                    }}>
                                        <img
                                            src={product.productImage[0]}
                                            alt={product.productName}
                                            style={{
                                                maxHeight: '140px', maxWidth: '100%',
                                                objectFit: 'contain',
                                                mixBlendMode: isDark ? 'lighten' : 'multiply',
                                                transition: 'transform 0.35s ease'
                                            }}
                                            onMouseEnter={e => e.target.style.transform = 'scale(1.06)'}
                                            onMouseLeave={e => e.target.style.transform = 'scale(1)'}
                                        />
                                    </div>
                                </Link>

                                {/* Info */}
                                <div style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                    <Link to={"/product/" + product?._id} onClick={scrollTop} style={{ textDecoration: 'none' }}>
                                        <h3 style={{
                                            fontSize: '13px', fontWeight: 400, color: textPrimary,
                                            margin: 0, overflow: 'hidden', textOverflow: 'ellipsis',
                                            display: '-webkit-box', WebkitLineClamp: 2,
                                            WebkitBoxOrient: 'vertical', lineHeight: '1.5',
                                            minHeight: '39px', letterSpacing: '0.01em'
                                        }}>
                                            {product?.productName}
                                        </h3>
                                    </Link>

                                    <p style={{
                                        fontSize: '10px', color: gold, fontWeight: 500,
                                        margin: 0, textTransform: 'capitalize',
                                        letterSpacing: '0.08em'
                                    }}>
                                        {product?.category}
                                    </p>

                                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', margin: '4px 0' }}>
                                        <span style={{
                                            fontFamily: "'Cormorant Garamond', Georgia, serif",
                                            fontSize: '20px', fontWeight: 300, color: textPrimary,
                                            letterSpacing: '-0.02em'
                                        }}>
                                            {displayINRCurrency(product?.sellingPrice)}
                                        </span>
                                        {product?.price !== product?.sellingPrice && (
                                            <span style={{ fontSize: '11px', color: textMuted, textDecoration: 'line-through' }}>
                                                {displayINRCurrency(product?.price)}
                                            </span>
                                        )}
                                    </div>

                                    <button
                                        onClick={(e) => handleAddToCart(e, product?._id)}
                                        style={{
                                            width: '100%', padding: '10px',
                                            border: `0.5px solid ${gold}`,
                                            background: gold,
                                            color: '#0a0a0a', fontSize: '10px', fontWeight: 500,
                                            cursor: 'pointer', letterSpacing: '0.12em',
                                            textTransform: 'uppercase',
                                            fontFamily: "'DM Sans', sans-serif",
                                            borderRadius: '1px',
                                            boxShadow: '0 0 20px rgba(201,168,76,0.15)',
                                            transition: 'all 0.22s ease'
                                        }}
                                        onMouseEnter={e => {
                                            e.currentTarget.style.background = goldDark
                                            e.currentTarget.style.borderColor = goldDark
                                            e.currentTarget.style.transform = 'translateY(-1px)'
                                            e.currentTarget.style.boxShadow = '0 4px 20px rgba(201,168,76,0.28)'
                                        }}
                                        onMouseLeave={e => {
                                            e.currentTarget.style.background = gold
                                            e.currentTarget.style.borderColor = gold
                                            e.currentTarget.style.transform = 'translateY(0)'
                                            e.currentTarget.style.boxShadow = '0 0 20px rgba(201,168,76,0.15)'
                                        }}
                                    >
                                        Add to Cart
                                    </button>
                                </div>
                            </div>
                        )
                    })
                )}
            </div>
        </div>
    )
}

export default CategroyWiseProductDisplay