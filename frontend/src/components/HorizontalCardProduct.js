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

    const surface = isDark ? '#161616' : '#ffffff'
    const text     = isDark ? '#e8e4dc' : '#1a1814'
    const muted    = isDark ? '#666' : '#aaa'
    const border   = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(26,24,20,0.09)'
    const gold     = '#c9a84c'

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

    const scrollRight = () => { scrollElement.current.scrollLeft += 320 }
    const scrollLeft  = () => { scrollElement.current.scrollLeft -= 320 }

    return (
        <>
            <style>{`
                .hcp-wrap { max-width:1400px; margin:0 auto; padding:32px 32px 0; position:relative; }
                .hcp-card {
                    min-width:300px; max-width:300px; height:160px;
                    display:flex; overflow:hidden; flex-shrink:0;
                    text-decoration:none; transition:border-color 0.2s ease, box-shadow 0.2s ease;
                    border:0.5px solid ${border}; background:${surface};
                }
                .hcp-card:hover { border-color:${gold}; box-shadow:0 8px 32px rgba(0,0,0,0.08); }
                .hcp-add-btn {
                    width:100%; padding:8px 0; border:0.5px solid ${border};
                    background:transparent; color:${muted};
                    font-size:11px; letter-spacing:0.1em; text-transform:uppercase;
                    cursor:pointer; transition:all 0.2s ease; font-family:inherit;
                }
                .hcp-add-btn:hover { border-color:${gold}; color:${gold}; background:rgba(201,168,76,0.04); }
                .hcp-scroll-btn {
                    position:absolute; top:50%; transform:translateY(-50%);
                    z-index:10; border:0.5px solid ${border};
                    width:32px; height:32px; display:flex; align-items:center; justify-content:center;
                    cursor:pointer; font-size:12px; transition:all 0.2s ease;
                    background:${surface}; color:${muted};
                }
                .hcp-scroll-btn:hover { border-color:${gold}; color:${gold}; }
                @media (max-width:768px) {
                    .hcp-wrap { padding:24px 20px 0; }
                    .hcp-card { min-width:260px; max-width:260px; height:145px; }
                    .hcp-img-box { width:110px !important; }
                }
                @media (max-width:480px) {
                    .hcp-card { min-width:230px; max-width:230px; height:135px; }
                    .hcp-img-box { width:95px !important; }
                }
            `}</style>

            <div className="hcp-wrap">
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
                    <Link to={`/product-category?category=${category}`}
                        style={{ fontSize:'11px', letterSpacing:'0.1em', textTransform:'uppercase', color:muted, textDecoration:'none', transition:'color 0.2s ease', paddingBottom:'2px', borderBottom:'0.5px solid transparent' }}
                        onMouseEnter={e => { e.currentTarget.style.color=gold; e.currentTarget.style.borderBottomColor=gold }}
                        onMouseLeave={e => { e.currentTarget.style.color=muted; e.currentTarget.style.borderBottomColor='transparent' }}
                    >View All</Link>
                </div>

                {/* Hairline */}
                <div style={{ height:'0.5px', background:border, marginBottom:'16px' }} />

                {/* Scroll buttons */}
                <button className="hcp-scroll-btn" onClick={scrollLeft}  style={{ left:'-16px' }}><FaAngleLeft /></button>
                <button className="hcp-scroll-btn" onClick={scrollRight} style={{ right:'-16px' }}><FaAngleRight /></button>

                {/* Cards */}
                <div ref={scrollElement} style={{ display:'flex', gap:'1px', overflowX:'auto', scrollbarWidth:'none', scrollBehavior:'smooth' }}>
                    {loading ? (
                        loadingList.map((_, i) => (
                            <div key={i} className="hcp-card" style={{ opacity:0.4 }}>
                                <div className="hcp-img-box" style={{ width:'130px', background:isDark?'rgba(255,255,255,0.03)':'#f5f4f2', flexShrink:0 }} />
                                <div style={{ flex:1, padding:'16px', display:'flex', flexDirection:'column', gap:'8px' }}>
                                    <div style={{ height:'11px', background:isDark?'rgba(255,255,255,0.06)':'#eeece8', borderRadius:'1px', width:'80%' }} />
                                    <div style={{ height:'9px',  background:isDark?'rgba(255,255,255,0.06)':'#eeece8', borderRadius:'1px', width:'45%' }} />
                                    <div style={{ height:'13px', background:isDark?'rgba(255,255,255,0.06)':'#eeece8', borderRadius:'1px', width:'55%', marginTop:'auto' }} />
                                    <div style={{ height:'28px', background:isDark?'rgba(255,255,255,0.06)':'#eeece8', borderRadius:'1px' }} />
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
                                <Link to={"product/" + product?._id} key={product?._id}
                                    className="hcp-card"
                                    onMouseEnter={() => setHoveredId(product?._id)}
                                    onMouseLeave={() => setHoveredId(null)}
                                >
                                    {/* Image */}
                                    <div className="hcp-img-box" style={{
                                        width:'130px', flexShrink:0,
                                        background:isDark?'rgba(255,255,255,0.02)':'#f7f6f4',
                                        display:'flex', alignItems:'center', justifyContent:'center',
                                        padding:'16px', overflow:'hidden', position:'relative',
                                        borderRight:`0.5px solid ${border}`
                                    }}>
                                        {discount && (
                                            <div style={{
                                                position:'absolute', top:'8px', left:'8px',
                                                background:isDark?'rgba(201,168,76,0.15)':'rgba(201,168,76,0.12)',
                                                color:gold, fontSize:'9px', fontWeight:500,
                                                padding:'2px 6px', letterSpacing:'0.06em'
                                            }}>−{discount}%</div>
                                        )}
                                        <img src={product.productImage[0]} alt={product.productName}
                                            style={{ width:'100%', height:'100%', objectFit:'contain',
                                                mixBlendMode:isDark?'lighten':'multiply',
                                                transition:'transform 0.35s ease',
                                                transform:isHovered?'scale(1.07)':'scale(1)' }} />
                                    </div>

                                    {/* Info */}
                                    <div style={{ flex:1, padding:'14px 16px', display:'flex', flexDirection:'column', justifyContent:'space-between', minWidth:0 }}>
                                        <div>
                                            <p style={{ fontSize:'9px', color:gold, letterSpacing:'0.1em', textTransform:'uppercase', margin:'0 0 5px', fontWeight:400 }}>
                                                {product?.category}
                                            </p>
                                            <h3 style={{ fontSize:'12px', fontWeight:400, color:text, margin:0, overflow:'hidden', textOverflow:'ellipsis', display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', lineHeight:1.5, letterSpacing:'0.01em' }}>
                                                {product?.productName}
                                            </h3>
                                        </div>
                                        <div>
                                            <div style={{ display:'flex', alignItems:'baseline', gap:'8px', marginBottom:'10px' }}>
                                                <span style={{ fontSize:'15px', fontWeight:500, color:text, letterSpacing:'-0.01em' }}>
                                                    {displayINRCurrency(product?.sellingPrice)}
                                                </span>
                                                {product?.price !== product?.sellingPrice && (
                                                    <span style={{ fontSize:'11px', color:muted, textDecoration:'line-through' }}>
                                                        {displayINRCurrency(product?.price)}
                                                    </span>
                                                )}
                                            </div>
                                            <button className="hcp-add-btn" onClick={(e) => handleAddToCart(e, product?._id)}>
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