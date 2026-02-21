import React, { useContext, useEffect, useRef, useState, useCallback } from 'react'
import fetchCategoryWiseProduct from '../helpers/fetchCategoryWiseProduct'
import displayINRCurrency from '../helpers/displayCurrency'
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa6'
import { Link } from 'react-router-dom'
import addToCart from '../helpers/addToCart'
import Context from '../context'
import WishlistButton from './WishlistButton'

const VerticalCardProduct = ({ category, heading, isDark = false }) => {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(true)
    const [wishlist, setWishlist] = useState({})
    const loadingList = new Array(6).fill(null)
    const scrollElement = useRef()
    const { fetchUserAddToCart } = useContext(Context)

    const handleAddToCart = async (e, id) => {
        await addToCart(e, id)
        fetchUserAddToCart()
    }

    const toggleWishlist = (productId) => {
        setWishlist(prev => ({ ...prev, [productId]: !prev[productId] }))
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

    const cardStyle = {
        minWidth: '210px',
        maxWidth: '210px',
        background: isDark ? 'rgba(255,255,255,0.05)' : '#fff',
        borderRadius: '20px',
        overflow: 'hidden',
        border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #efefef',
        flexShrink: 0,
        textDecoration: 'none',
        transition: 'all 0.3s ease',
        display: 'block',
        position: 'relative',
    }

    return (
        <div style={{
            maxWidth: '1280px',
            margin: '40px auto',
            padding: '0 24px',
            position: 'relative'
        }}>
            {/* Section Header */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '20px'
            }}>
                <div>
                    <h2 style={{
                        fontSize: '24px',
                        fontWeight: 700,
                        color: isDark ? '#fff' : '#111',
                        margin: '0 0 6px 0',
                        letterSpacing: '-0.5px'
                    }}>
                        {heading}
                    </h2>
                    <div style={{
                        width: '50px',
                        height: '3px',
                        background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
                        borderRadius: '2px'
                    }} />
                </div>
                <Link
                    to={`/product-category?category=${category}`}
                    style={{
                        fontSize: '13px',
                        fontWeight: 600,
                        color: '#667eea',
                        textDecoration: 'none',
                        padding: '8px 18px',
                        borderRadius: '10px',
                        background: isDark ? 'rgba(102,126,234,0.15)' : 'rgba(102,126,234,0.08)',
                        transition: 'all 0.3s ease',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '5px'
                    }}
                    onMouseEnter={e => {
                        e.currentTarget.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                        e.currentTarget.style.color = '#fff'
                    }}
                    onMouseLeave={e => {
                        e.currentTarget.style.background = isDark ? 'rgba(102,126,234,0.15)' : 'rgba(102,126,234,0.08)'
                        e.currentTarget.style.color = '#667eea'
                    }}
                >
                    View All →
                </Link>
            </div>

            {/* Scroll Buttons */}
            {['left', 'right'].map(dir => (
                <button
                    key={dir}
                    onClick={dir === 'left' ? scrollLeft : scrollRight}
                    style={{
                        position: 'absolute',
                        [dir]: '4px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        zIndex: 10,
                        background: isDark ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.95)',
                        backdropFilter: 'blur(10px)',
                        border: 'none',
                        borderRadius: '50%',
                        width: '44px',
                        height: '44px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        fontSize: '18px',
                        color: isDark ? '#fff' : '#333',
                        boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
                        transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={e => {
                        e.currentTarget.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                        e.currentTarget.style.color = '#fff'
                    }}
                    onMouseLeave={e => {
                        e.currentTarget.style.background = isDark ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.95)'
                        e.currentTarget.style.color = isDark ? '#fff' : '#333'
                    }}
                >
                    {dir === 'left' ? <FaAngleLeft /> : <FaAngleRight />}
                </button>
            ))}

            {/* Cards Container */}
            <div
                ref={scrollElement}
                style={{
                    display: 'flex',
                    gap: '16px',
                    overflowX: 'auto',
                    scrollbarWidth: 'none',
                    scrollBehavior: 'smooth',
                    paddingBottom: '8px',
                    paddingLeft: '2px',
                    paddingRight: '2px'
                }}
            >
                {loading ? (
                    loadingList.map((_, index) => (
                        <div key={index} style={{ ...cardStyle, opacity: 0.6 }}>
                            <div style={{ height: '180px', background: isDark ? 'rgba(255,255,255,0.08)' : '#f5f5f5' }} />
                            <div style={{ padding: '14px', display: 'grid', gap: '10px' }}>
                                <div style={{ height: '14px', background: isDark ? 'rgba(255,255,255,0.1)' : '#f0f0f0', borderRadius: '6px' }} />
                                <div style={{ height: '11px', background: isDark ? 'rgba(255,255,255,0.1)' : '#f0f0f0', borderRadius: '5px', width: '60%' }} />
                                <div style={{ height: '36px', background: isDark ? 'rgba(255,255,255,0.1)' : '#f0f0f0', borderRadius: '10px' }} />
                            </div>
                        </div>
                    ))
                ) : (
                    data.map((product, index) => (
                        <Link
                            to={"product/" + product?._id}
                            key={product?._id}
                            style={cardStyle}
                            onMouseEnter={e => {
                                e.currentTarget.style.boxShadow = '0 16px 36px rgba(102,126,234,0.22)'
                                e.currentTarget.style.transform = 'translateY(-6px)'
                                e.currentTarget.style.borderColor = 'rgba(102,126,234,0.35)'
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.boxShadow = 'none'
                                e.currentTarget.style.transform = 'translateY(0)'
                                e.currentTarget.style.borderColor = isDark ? 'rgba(255,255,255,0.1)' : '#efefef'
                            }}
                        >
                            {/* Wishlist */}
                            <div style={{ position: 'absolute', top: '10px', left: '10px', zIndex: 3 }}>
                                <WishlistButton
                                    productId={product?._id}
                                    isInWishlist={wishlist[product?._id]}
                                    onToggle={toggleWishlist}
                                    isDark={isDark}
                                />
                            </div>

                            {/* Discount Badge */}
                            {product?.price !== product?.sellingPrice && (
                                <div style={{
                                    position: 'absolute',
                                    top: '10px',
                                    right: '10px',
                                    background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                                    color: '#fff',
                                    fontSize: '10px',
                                    fontWeight: 700,
                                    padding: '4px 8px',
                                    borderRadius: '8px',
                                    zIndex: 2,
                                    boxShadow: '0 3px 10px rgba(245,87,108,0.35)'
                                }}>
                                    {Math.round((product?.price - product?.sellingPrice) / product?.price * 100)}% OFF
                                </div>
                            )}

                            {/* Image */}
                            <div style={{
                                height: '180px',
                                background: isDark
                                    ? 'linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.05) 100%)'
                                    : 'linear-gradient(135deg, #fafafa 0%, #f2f2f2 100%)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                padding: '20px',
                                overflow: 'hidden',
                                position: 'relative'
                            }}>
                                <div style={{
                                    position: 'absolute',
                                    width: '100px',
                                    height: '100px',
                                    background: 'rgba(102,126,234,0.08)',
                                    borderRadius: '50%',
                                    filter: 'blur(25px)',
                                    top: '50%', left: '50%',
                                    transform: 'translate(-50%,-50%)',
                                    pointerEvents: 'none'
                                }} />
                                <img
                                    src={product.productImage[0]}
                                    alt={product.productName}
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'contain',
                                        mixBlendMode: isDark ? 'lighten' : 'multiply',
                                        transition: 'transform 0.4s ease',
                                        position: 'relative',
                                        zIndex: 1
                                    }}
                                    onMouseEnter={e => e.target.style.transform = 'scale(1.12)'}
                                    onMouseLeave={e => e.target.style.transform = 'scale(1)'}
                                />
                            </div>

                            {/* Info */}
                            <div style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                <h3 style={{
                                    fontSize: '14px',
                                    fontWeight: 600,
                                    color: isDark ? '#fff' : '#111',
                                    margin: 0,
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    display: '-webkit-box',
                                    WebkitLineClamp: 2,
                                    WebkitBoxOrient: 'vertical',
                                    lineHeight: '1.45',
                                    minHeight: '40px'
                                }}>
                                    {product?.productName}
                                </h3>

                                <p style={{
                                    fontSize: '11px',
                                    color: isDark ? 'rgba(255,255,255,0.5)' : '#999',
                                    margin: 0,
                                    textTransform: 'capitalize',
                                    fontWeight: 500
                                }}>
                                    {product?.category}
                                </p>

                                {/* Price */}
                                <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginTop: '2px' }}>
                                    <span style={{
                                        fontSize: '17px',
                                        fontWeight: 700,
                                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent',
                                        backgroundClip: 'text'
                                    }}>
                                        {displayINRCurrency(product?.sellingPrice)}
                                    </span>
                                    {product?.price !== product?.sellingPrice && (
                                        <span style={{
                                            fontSize: '12px',
                                            color: isDark ? 'rgba(255,255,255,0.35)' : '#bbb',
                                            textDecoration: 'line-through'
                                        }}>
                                            {displayINRCurrency(product?.price)}
                                        </span>
                                    )}
                                </div>

                                {/* Add to Cart */}
                                <button
                                    onClick={(e) => handleAddToCart(e, product?._id)}
                                    style={{
                                        marginTop: '6px',
                                        padding: '10px',
                                        borderRadius: '12px',
                                        border: 'none',
                                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                        color: '#fff',
                                        fontSize: '13px',
                                        fontWeight: 600,
                                        cursor: 'pointer',
                                        transition: 'all 0.3s ease',
                                        width: '100%',
                                        boxShadow: '0 4px 14px rgba(102,126,234,0.28)'
                                    }}
                                    onMouseEnter={e => {
                                        e.currentTarget.style.transform = 'translateY(-2px)'
                                        e.currentTarget.style.boxShadow = '0 8px 20px rgba(102,126,234,0.4)'
                                    }}
                                    onMouseLeave={e => {
                                        e.currentTarget.style.transform = 'translateY(0)'
                                        e.currentTarget.style.boxShadow = '0 4px 14px rgba(102,126,234,0.28)'
                                    }}
                                >
                                    Add to Cart
                                </button>
                            </div>
                        </Link>
                    ))
                )}
            </div>
        </div>
    )
}

export default VerticalCardProduct