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

    // Clean dark mode — no purple tints, just dark backgrounds and light text
    const wrapperBg   = isDark ? '#1a1a1a' : 'transparent'
    const cardBg      = isDark ? '#2a2a2a' : '#fff'
    const cardBorder  = isDark ? '#3a3a3a' : '#f0f0f5'
    const skeletonBg  = isDark ? '#333333' : '#f0f0f5'
    const textPrimary = isDark ? '#f0f0f0' : '#1a1a2e'
    const textMuted   = isDark ? '#888888' : '#bbb'
    const headingColor = isDark ? '#f0f0f0' : '#111'
    const imageBg     = isDark ? '#222222' : 'linear-gradient(135deg, #fafafa 0%, #f2f2f2 100%)'

    return (
        <div style={{
            background: wrapperBg,
            borderRadius: '20px',
            padding: isDark ? '24px' : '0',
            transition: 'all 0.3s ease'
        }}>
            {/* Header */}
            <div style={{ marginBottom: '20px' }}>
                <h2 style={{
                    fontSize: '22px', fontWeight: 700, color: headingColor,
                    margin: '0 0 8px', letterSpacing: '-0.5px'
                }}>
                    {heading}
                </h2>
                <div style={{
                    width: '50px', height: '3px',
                    background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
                    borderRadius: '2px'
                }} />
            </div>

            {/* Grid */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))',
                gap: '16px'
            }}>
                {loading ? (
                    loadingList.map((_, i) => (
                        <div key={i} style={{
                            background: cardBg, borderRadius: '16px', overflow: 'hidden', opacity: 0.6,
                            border: `1px solid ${cardBorder}`
                        }}>
                            <div style={{ height: '190px', background: skeletonBg }} />
                            <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                <div style={{ height: '14px', background: skeletonBg, borderRadius: '6px' }} />
                                <div style={{ height: '12px', background: skeletonBg, borderRadius: '5px', width: '55%' }} />
                                <div style={{ height: '38px', background: skeletonBg, borderRadius: '10px' }} />
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
                                    background: cardBg, borderRadius: '16px',
                                    overflow: 'hidden', position: 'relative',
                                    border: `1px solid ${cardBorder}`,
                                    transition: 'all 0.25s ease'
                                }}
                                onMouseEnter={e => {
                                    e.currentTarget.style.transform = 'translateY(-4px)'
                                    e.currentTarget.style.boxShadow = isDark
                                        ? '0 12px 32px rgba(0,0,0,0.5)'
                                        : '0 12px 32px rgba(0,0,0,0.12)'
                                    e.currentTarget.style.borderColor = isDark ? '#555' : '#ccc'
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
                                        position: 'absolute', top: '12px', right: '12px', zIndex: 2,
                                        background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                                        color: '#fff', fontSize: '10px', fontWeight: 700,
                                        padding: '4px 9px', borderRadius: '8px',
                                        boxShadow: '0 3px 10px rgba(245,87,108,0.3)'
                                    }}>
                                        {discount}% OFF
                                    </div>
                                )}

                                {/* Image */}
                                <Link to={"/product/" + product?._id} onClick={scrollTop} style={{ textDecoration: 'none' }}>
                                    <div style={{
                                        height: '190px',
                                        background: imageBg,
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        padding: '20px', overflow: 'hidden'
                                    }}>
                                        <img
                                            src={product.productImage[0]}
                                            alt={product.productName}
                                            style={{
                                                maxHeight: '150px', maxWidth: '100%',
                                                objectFit: 'contain',
                                                mixBlendMode: isDark ? 'lighten' : 'multiply',
                                                transition: 'transform 0.3s ease'
                                            }}
                                            onMouseEnter={e => e.target.style.transform = 'scale(1.08)'}
                                            onMouseLeave={e => e.target.style.transform = 'scale(1)'}
                                        />
                                    </div>
                                </Link>

                                {/* Info */}
                                <div style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                    <Link to={"/product/" + product?._id} onClick={scrollTop} style={{ textDecoration: 'none' }}>
                                        <h3 style={{
                                            fontSize: '14px', fontWeight: 600, color: textPrimary,
                                            margin: 0, overflow: 'hidden', textOverflow: 'ellipsis',
                                            display: '-webkit-box', WebkitLineClamp: 2,
                                            WebkitBoxOrient: 'vertical', lineHeight: '1.45', minHeight: '40px'
                                        }}>
                                            {product?.productName}
                                        </h3>
                                    </Link>

                                    <p style={{
                                        fontSize: '11px', color: '#667eea',
                                        fontWeight: 600, margin: 0, textTransform: 'capitalize'
                                    }}>
                                        {product?.category}
                                    </p>

                                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', margin: '4px 0' }}>
                                        <span style={{
                                            fontSize: '17px', fontWeight: 800,
                                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                                            backgroundClip: 'text'
                                        }}>
                                            {displayINRCurrency(product?.sellingPrice)}
                                        </span>
                                        {product?.price !== product?.sellingPrice && (
                                            <span style={{ fontSize: '12px', color: textMuted, textDecoration: 'line-through' }}>
                                                {displayINRCurrency(product?.price)}
                                            </span>
                                        )}
                                    </div>

                                    <button
                                        onClick={(e) => handleAddToCart(e, product?._id)}
                                        style={{
                                            width: '100%', padding: '10px', borderRadius: '12px',
                                            border: 'none',
                                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                            color: '#fff', fontSize: '13px', fontWeight: 600,
                                            cursor: 'pointer',
                                            boxShadow: '0 4px 14px rgba(102,126,234,0.28)',
                                            transition: 'all 0.2s'
                                        }}
                                        onMouseEnter={e => {
                                            e.currentTarget.style.transform = 'translateY(-1px)'
                                            e.currentTarget.style.boxShadow = '0 6px 18px rgba(102,126,234,0.45)'
                                        }}
                                        onMouseLeave={e => {
                                            e.currentTarget.style.transform = 'translateY(0)'
                                            e.currentTarget.style.boxShadow = '0 4px 14px rgba(102,126,234,0.28)'
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