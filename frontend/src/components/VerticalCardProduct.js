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
    const [hoveredId, setHoveredId] = useState(null)
    const loadingList = new Array(6).fill(null)
    const scrollElement = useRef()
    const { fetchUserAddToCart } = useContext(Context)

    const bg      = isDark ? '#0e0e0e' : '#faf9f7'
    const surface = isDark ? '#161616' : '#ffffff'
    const text    = isDark ? '#e8e4dc' : '#1a1814'
    const muted   = isDark ? '#666' : '#aaa'
    const border  = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(26,24,20,0.09)'
    const gold    = '#c9a84c'

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

    const scrollRight = () => { scrollElement.current.scrollLeft += 240 }
    const scrollLeft  = () => { scrollElement.current.scrollLeft -= 240 }

    return (
        <>
            <style>{`
                .vcp-wrap { max-width:1400px; margin:0 auto; padding:40px 32px 0; position:relative; }
                .vcp-card {
                    min-width:210px; max-width:210px;
                    display:flex; flex-direction:column; flex-shrink:0;
                    overflow:hidden; text-decoration:none;
                    border:0.5px solid ${border}; background:${surface};
                    transition:border-color 0.25s ease, box-shadow 0.25s ease;
                    position:relative;
                }
                .vcp-card:hover { border-color:${gold}; box-shadow:0 12px 40px rgba(0,0,0,0.09); }
                .vcp-add-btn {
                    width:100%; padding:10px 0; border:0.5px solid ${border};
                    background:transparent; color:${muted};
                    font-size:10px; letter-spacing:0.12em; text-transform:uppercase;
                    cursor:pointer; transition:all 0.2s ease; font-family:inherit;
                }
                .vcp-add-btn:hover { border-color:${gold}; color:${gold}; background:rgba(201,168,76,0.04); }
                .vcp-scroll-btn {
                    position:absolute; top:50%; transform:translateY(-50%);
                    z-index:10; border:0.5px solid ${border};
                    width:32px; height:32px; display:flex; align-items:center; justify-content:center;
                    cursor:pointer; font-size:12px; transition:all 0.2s ease;
                    background:${surface}; color:${muted};
                }
                .vcp-scroll-btn:hover { border-color:${gold}; color:${gold}; }
                @media (max-width:768px) {
                    .vcp-wrap { padding:28px 20px 0; }
                    .vcp-card { min-width:180px; max-width:180px; }
                }
                @media (max-width:480px) {
                    .vcp-card { min-width:155px; max-width:155px; }
                }
            `}</style>

            <div className="vcp-wrap">
                {/* Header */}
                <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between', marginBottom:'20px' }}>
                    <div style={{ display:'flex', alignItems:'center', gap:'16px' }}>
                        <h2 style={{ fontSize:'18px', fontWeight:300, color:text, margin:0, letterSpacing:'-0.01em', fontFamily:'Georgia,"Times New Roman",serif' }}>
                            {heading}
                        </h2>
                        <div style={{ width:'1px', height:'16px', background:border }} />
                        <span style={{ fontSize:'10px', letterSpacing:'0.12em', textTransform:'uppercase', color:muted }}>
                            {data.length > 0 ? `${data.length} items` : ''}
                        </span>
                    </div>
                    <Link
                        to={`/product-category?category=${category}`}
                        style={{ fontSize:'11px', letterSpacing:'0.1em', textTransform:'uppercase', color:muted, textDecoration:'none', transition:'color 0.2s ease', paddingBottom:'2px', borderBottom:'0.5px solid transparent' }}
                        onMouseEnter={e => { e.currentTarget.style.color=gold; e.currentTarget.style.borderBottomColor=gold }}
                        onMouseLeave={e => { e.currentTarget.style.color=muted; e.currentTarget.style.borderBottomColor='transparent' }}
                    >View All</Link>
                </div>

                {/* Hairline */}
                <div style={{ height:'0.5px', background:border, marginBottom:'16px' }} />

                {/* Scroll buttons */}
                <button className="vcp-scroll-btn" onClick={scrollLeft}  style={{ left:'-16px' }}><FaAngleLeft /></button>
                <button className="vcp-scroll-btn" onClick={scrollRight} style={{ right:'-16px' }}><FaAngleRight /></button>

                {/* Cards */}
                <div ref={scrollElement} style={{ display:'flex', gap:'1px', overflowX:'auto', scrollbarWidth:'none', scrollBehavior:'smooth', paddingBottom:'8px' }}>
                    {loading ? (
                        loadingList.map((_, i) => (
                            <div key={i} className="vcp-card" style={{ opacity:0.4 }}>
                                <div style={{ height:'200px', background:isDark?'rgba(255,255,255,0.03)':'#f5f4f2' }} />
                                <div style={{ padding:'14px 16px', display:'flex', flexDirection:'column', gap:'8px' }}>
                                    <div style={{ height:'11px', background:isDark?'rgba(255,255,255,0.06)':'#eeece8', borderRadius:'1px', width:'80%' }} />
                                    <div style={{ height:'9px',  background:isDark?'rgba(255,255,255,0.06)':'#eeece8', borderRadius:'1px', width:'40%' }} />
                                    <div style={{ height:'14px', background:isDark?'rgba(255,255,255,0.06)':'#eeece8', borderRadius:'1px', width:'55%', marginTop:'8px' }} />
                                    <div style={{ height:'32px', background:isDark?'rgba(255,255,255,0.06)':'#eeece8', borderRadius:'1px', marginTop:'4px' }} />
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
                                    className="vcp-card"
                                    onMouseEnter={() => setHoveredId(product?._id)}
                                    onMouseLeave={() => setHoveredId(null)}
                                >
                                    {/* Wishlist */}
                                    <div style={{ position:'absolute', top:'10px', left:'10px', zIndex:3 }}>
                                        <WishlistButton
                                            productId={product?._id}
                                            isInWishlist={wishlist[product?._id]}
                                            onToggle={toggleWishlist}
                                            isDark={isDark}
                                        />
                                    </div>

                                    {/* Discount badge */}
                                    {discount && (
                                        <div style={{
                                            position:'absolute', top:'10px', right:'10px',
                                            background:isDark?'rgba(201,168,76,0.15)':'rgba(201,168,76,0.12)',
                                            color:gold, fontSize:'9px', fontWeight:500,
                                            padding:'2px 6px', letterSpacing:'0.06em', zIndex:2
                                        }}>−{discount}%</div>
                                    )}

                                    {/* Image */}
                                    <div style={{
                                        height:'200px', flexShrink:0,
                                        background:isDark?'rgba(255,255,255,0.02)':'#f7f6f4',
                                        display:'flex', alignItems:'center', justifyContent:'center',
                                        padding:'24px', overflow:'hidden',
                                        borderBottom:`0.5px solid ${border}`
                                    }}>
                                        <img
                                            src={product.productImage[0]}
                                            alt={product.productName}
                                            style={{
                                                width:'100%', height:'100%', objectFit:'contain',
                                                mixBlendMode:isDark?'lighten':'multiply',
                                                transition:'transform 0.4s ease',
                                                transform:isHovered?'scale(1.07)':'scale(1)'
                                            }}
                                        />
                                    </div>

                                    {/* Info */}
                                    <div style={{ padding:'14px 16px', display:'flex', flexDirection:'column', flex:1 }}>
                                        <p style={{ fontSize:'9px', color:gold, letterSpacing:'0.1em', textTransform:'uppercase', margin:'0 0 5px', fontWeight:400 }}>
                                            {product?.category}
                                        </p>
                                        <h3 style={{
                                            fontSize:'12px', fontWeight:400, color:text, margin:'0 0 auto',
                                            overflow:'hidden', textOverflow:'ellipsis',
                                            display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical',
                                            lineHeight:1.55, letterSpacing:'0.01em', minHeight:'37px'
                                        }}>
                                            {product?.productName}
                                        </h3>

                                        <div style={{ display:'flex', alignItems:'baseline', gap:'8px', margin:'12px 0 10px' }}>
                                            <span style={{ fontSize:'15px', fontWeight:500, color:text, letterSpacing:'-0.01em' }}>
                                                {displayINRCurrency(product?.sellingPrice)}
                                            </span>
                                            {product?.price !== product?.sellingPrice && (
                                                <span style={{ fontSize:'11px', color:muted, textDecoration:'line-through' }}>
                                                    {displayINRCurrency(product?.price)}
                                                </span>
                                            )}
                                        </div>

                                        <button className="vcp-add-btn" onClick={(e) => handleAddToCart(e, product?._id)}>
                                            Add to Cart
                                        </button>
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

export default VerticalCardProduct