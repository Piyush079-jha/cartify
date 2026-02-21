import React, { useContext, useEffect, useState } from 'react'
import SummaryApi from '../common'
import Context from '../context'
import displayINRCurrency from '../helpers/displayCurrency'
import { MdDelete } from "react-icons/md"
import { FaShoppingCart, FaHeart, FaTimes } from "react-icons/fa"
import { toast } from 'react-toastify'
import { useNavigate, useOutletContext } from 'react-router-dom'

const Cart = () => {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)
    const [wishlistDialog, setWishlistDialog] = useState(null)
    const context = useContext(Context)
    const navigate = useNavigate()
    const { isDark } = useOutletContext()
    const loadingCart = new Array(4).fill(null)

    const t = {
        bg:         isDark ? '#1a1a1a' : '#f4f6fb',
        card:       isDark ? '#2d2d2d' : '#ffffff',
        cardBorder: isDark ? '#3d3d3d' : '#f0f0f5',
        text:       isDark ? '#f1f1f1' : '#1a1a2e',
        textSub:    isDark ? '#aaaaaa' : '#667eea',
        textMuted:  isDark ? '#777777' : '#aaaaaa',
        imgBg:      isDark ? '#222222' : '#f8f8f8',
        chipBg:     isDark ? 'rgba(102,126,234,0.2)' : 'rgba(102,126,234,0.12)',
        chipText:   '#667eea',
        loadBg:     isDark ? '#3d3d3d' : '#e8eaf0',
        qtyBorder:  '#667eea',
        qtyText:    isDark ? '#a5b4fc' : '#667eea',
    }

    const totalQty = data.reduce((prev, curr) => prev + curr.quantity, 0)
    const totalPrice = data.reduce((prev, curr) => prev + (curr.quantity * curr?.productId?.sellingPrice), 0)

    const fetchData = async () => {
        const response = await fetch(SummaryApi.addToCartProductView.url, {
            method: SummaryApi.addToCartProductView.method,
            credentials: 'include',
            headers: { "content-type": 'application/json' },
        })
        const responseData = await response.json()
        if (responseData.success) setData(responseData.data)
    }

    useEffect(() => {
        setLoading(true)
        fetchData().finally(() => setLoading(false))
    }, [])

    const increaseQty = async (id, qty) => {
        const response = await fetch(SummaryApi.updateCartProduct.url, {
            method: SummaryApi.updateCartProduct.method,
            credentials: 'include',
            headers: { "content-type": 'application/json' },
            body: JSON.stringify({ _id: id, quantity: qty + 1 })
        })
        const responseData = await response.json()
        if (responseData.success) fetchData()
    }

    const decreaseQty = async (id, qty) => {
        if (qty >= 2) {
            const response = await fetch(SummaryApi.updateCartProduct.url, {
                method: SummaryApi.updateCartProduct.method,
                credentials: 'include',
                headers: { "content-type": 'application/json' },
                body: JSON.stringify({ _id: id, quantity: qty - 1 })
            })
            const responseData = await response.json()
            if (responseData.success) fetchData()
        }
    }

    const handleDeleteClick = (product) => {
        setWishlistDialog({
            show: true,
            cartItemId: product?._id,
            productId: product?.productId?._id,
            productName: product?.productId?.productName,
            productImage: product?.productId?.productImage[0]
        })
    }

    const handleMoveToWishlist = async () => {
        try {
            await fetch(SummaryApi.addToWishlist.url, {
                method: SummaryApi.addToWishlist.method,
                credentials: 'include',
                headers: { "content-type": 'application/json' },
                body: JSON.stringify({ productId: wishlistDialog.productId })
            })
            await deleteFromCart(wishlistDialog.cartItemId)
            toast.success('Moved to wishlist!')
        } catch (err) { toast.error('Something went wrong') }
        setWishlistDialog(null)
    }

    const handleJustDelete = async () => {
        await deleteFromCart(wishlistDialog.cartItemId)
        setWishlistDialog(null)
    }

    const deleteFromCart = async (id) => {
        const response = await fetch(SummaryApi.deleteCartProduct.url, {
            method: SummaryApi.deleteCartProduct.method,
            credentials: 'include',
            headers: { "content-type": 'application/json' },
            body: JSON.stringify({ _id: id })
        })
        const responseData = await response.json()
        if (responseData.success) { fetchData(); context.fetchUserAddToCart() }
    }

    const handleProceedToPayment = () => {
        if (data.length === 0) { toast.error('Your cart is empty!'); return }
        navigate('/payment', { state: { cartItems: data, totalAmount: totalPrice } })
    }

    return (
        <>
            <style>{`
                .cart-page {
                    min-height: 100vh;
                    padding: 32px 24px;
                    transition: background 0.3s ease;
                }
                .cart-inner { max-width: 1100px; margin: 0 auto; }
                .cart-title {
                    font-size: 26px; font-weight: 800;
                    margin-bottom: 24px;
                    display: flex; align-items: center; gap: 12px; flex-wrap: wrap;
                }
                .cart-layout {
                    display: flex; gap: 24px; align-items: flex-start;
                }
                .cart-items {
                    flex: 1; min-width: 0;
                    display: flex; flex-direction: column; gap: 14px;
                }
                .cart-summary {
                    width: 300px; flex-shrink: 0;
                    background: linear-gradient(160deg, #1a1a2e 0%, #16213e 60%, #0f3460 100%);
                    border-radius: 20px; padding: 24px;
                    box-shadow: 0 8px 32px rgba(0,0,0,0.2);
                    border: 1px solid rgba(255,255,255,0.08);
                    position: sticky; top: 84px;
                }
                .cart-card {
                    border-radius: 18px; display: flex;
                    align-items: center; overflow: hidden;
                    transition: all 0.2s ease;
                }
                .cart-img-box { width: 110px; height: 110px; flex-shrink: 0; padding: 12px; }
                .cart-info { flex: 1; padding: 14px 16px; display: flex; flex-direction: column; gap: 6px; min-width: 0; }
                .cart-row { display: flex; align-items: center; justify-content: space-between; margin-top: 4px; }
                .cart-qty { display: flex; align-items: center; gap: 10px; }
                .cart-qty-btn { width: 30px; height: 30px; border-radius: 8px; font-size: 16px; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.2s; }
                .cart-del-btn { width: 34px; height: 34px; border-radius: 10px; display: flex; align-items: center; justify-content: center; cursor: pointer; font-size: 17px; flex-shrink: 0; transition: all 0.2s; border: none; }
                .cart-name { font-size: 15px; font-weight: 600; margin: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
                .cart-proceed-btn { width: 100%; padding: 14px; border-radius: 12px; font-size: 15px; font-weight: 700; cursor: pointer; transition: all 0.3s; letter-spacing: 0.5px; border: none; }

                /* Tablet */
                @media (max-width: 860px) {
                    .cart-layout { flex-direction: column; }
                    .cart-summary { width: 100% !important; position: static !important; top: auto !important; }
                }

                /* Mobile */
                @media (max-width: 600px) {
                    .cart-page { padding: 20px 12px !important; }
                    .cart-title { font-size: 20px !important; }
                    .cart-img-box { width: 80px !important; height: 80px !important; padding: 8px !important; }
                    .cart-info { padding: 10px 12px !important; }
                    .cart-name { font-size: 13px !important; }
                    .cart-qty-btn { width: 26px !important; height: 26px !important; font-size: 14px !important; }
                    .cart-del-btn { width: 28px !important; height: 28px !important; font-size: 14px !important; }
                    .cart-price { font-size: 14px !important; }
                    .cart-summary { padding: 18px !important; }
                    .cart-proceed-btn { font-size: 14px !important; padding: 13px !important; }
                    .cart-row { flex-wrap: wrap; gap: 8px; }
                }

                /* Small phone */
                @media (max-width: 400px) {
                    .cart-img-box { width: 68px !important; height: 68px !important; }
                    .cart-name { white-space: normal !important; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; }
                }
            `}</style>

            <div className="cart-page" style={{
                background: isDark
                    ? 'linear-gradient(180deg, #1a1a1a 0%, #2d2d2d 100%)'
                    : 'linear-gradient(180deg, #ffffff 0%, #f9f9fb 100%)'
            }}>
                <div className="cart-inner">

                    {/* Title */}
                    <h1 className="cart-title" style={{ color: t.text, transition: 'color 0.3s' }}>
                        <FaShoppingCart style={{ color: '#667eea' }} />
                        Your Cart
                        {data.length > 0 && (
                            <span style={{ fontSize: '14px', fontWeight: 600, color: t.chipText, background: t.chipBg, padding: '3px 12px', borderRadius: '20px' }}>
                                {data.length} item{data.length > 1 ? 's' : ''}
                            </span>
                        )}
                    </h1>

                    {/* Empty State */}
                    {data.length === 0 && !loading && (
                        <div style={{ background: t.card, borderRadius: '20px', padding: '48px 24px', textAlign: 'center', border: `1px solid ${t.cardBorder}` }}>
                            <FaShoppingCart style={{ fontSize: '48px', color: isDark ? '#444' : '#ddd', marginBottom: '16px' }} />
                            <p style={{ fontSize: '18px', fontWeight: 600, color: t.textMuted }}>Your cart is empty</p>
                            <p style={{ fontSize: '14px', color: t.textMuted, marginTop: '6px' }}>Add some products to get started!</p>
                        </div>
                    )}

                    <div className="cart-layout">

                        {/* Items */}
                        <div className="cart-items">
                            {loading ? (
                                loadingCart.map((_, i) => (
                                    <div key={i} style={{ height: '110px', background: t.loadBg, borderRadius: '16px' }} />
                                ))
                            ) : (
                                data.map((product) => (
                                    <div key={product?._id} className="cart-card"
                                        style={{ background: t.card, boxShadow: isDark ? '0 2px 12px rgba(0,0,0,0.3)' : '0 2px 12px rgba(0,0,0,0.06)', border: `1.5px solid ${t.cardBorder}` }}
                                        onMouseEnter={e => e.currentTarget.style.boxShadow = '0 8px 28px rgba(102,126,234,0.2)'}
                                        onMouseLeave={e => e.currentTarget.style.boxShadow = isDark ? '0 2px 12px rgba(0,0,0,0.3)' : '0 2px 12px rgba(0,0,0,0.06)'}
                                    >
                                        {/* Image */}
                                        <div className="cart-img-box" style={{ width: '110px', height: '110px', background: t.imgBg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <img src={product?.productId?.productImage[0]} alt={product?.productId?.productName}
                                                style={{ width: '100%', height: '100%', objectFit: 'contain', mixBlendMode: isDark ? 'normal' : 'multiply' }} />
                                        </div>

                                        {/* Info */}
                                        <div className="cart-info">
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
                                                <div style={{ flex: 1, minWidth: 0 }}>
                                                    <h3 className="cart-name" style={{ color: t.text }}>{product?.productId?.productName}</h3>
                                                    <p style={{ fontSize: '12px', color: t.textSub, fontWeight: 500, margin: '3px 0 0', textTransform: 'capitalize' }}>
                                                        {product?.productId?.category}
                                                    </p>
                                                </div>
                                                <button className="cart-del-btn"
                                                    onClick={() => handleDeleteClick(product)}
                                                    style={{ background: isDark ? 'rgba(245,87,108,0.2)' : 'rgba(245,87,108,0.1)', color: '#f5576c' }}
                                                    onMouseEnter={e => { e.currentTarget.style.background = '#f5576c'; e.currentTarget.style.color = '#fff' }}
                                                    onMouseLeave={e => { e.currentTarget.style.background = isDark ? 'rgba(245,87,108,0.2)' : 'rgba(245,87,108,0.1)'; e.currentTarget.style.color = '#f5576c' }}
                                                ><MdDelete /></button>
                                            </div>

                                            <div className="cart-row">
                                                <div className="cart-qty">
                                                    {['−', '+'].map((sym) => (
                                                        <button key={sym} className="cart-qty-btn"
                                                            onClick={() => sym === '−' ? decreaseQty(product?._id, product?.quantity) : increaseQty(product?._id, product?.quantity)}
                                                            style={{ border: `1.5px solid ${t.qtyBorder}`, background: 'transparent', color: t.qtyText }}
                                                            onMouseEnter={e => { e.currentTarget.style.background = '#667eea'; e.currentTarget.style.color = '#fff' }}
                                                            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = t.qtyText }}
                                                        >{sym}</button>
                                                    ))}
                                                    <span style={{ fontSize: '15px', fontWeight: 700, color: t.text, minWidth: '20px', textAlign: 'center' }}>
                                                        {product?.quantity}
                                                    </span>
                                                </div>
                                                <div style={{ textAlign: 'right' }}>
                                                    <p className="cart-price" style={{ fontSize: '16px', fontWeight: 800, margin: 0, background: 'linear-gradient(135deg, #667eea, #764ba2)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                                                        {displayINRCurrency(product?.productId?.sellingPrice * product?.quantity)}
                                                    </p>
                                                    <p style={{ fontSize: '11px', color: t.textMuted, margin: '2px 0 0' }}>
                                                        {displayINRCurrency(product?.productId?.sellingPrice)} × {product?.quantity}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Summary */}
                        {!loading && data.length > 0 && (
                            <div className="cart-summary">
                                <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#fff', margin: '0 0 20px', paddingBottom: '16px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                                    Order Summary
                                </h2>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '24px' }}>
                                    {[
                                        { label: 'Total Items', value: totalQty },
                                        { label: 'Subtotal', value: displayINRCurrency(totalPrice) },
                                    ].map(({ label, value }) => (
                                        <div key={label} style={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px' }}>{label}</span>
                                            <span style={{ color: '#fff', fontWeight: 700, fontSize: '15px' }}>{value}</span>
                                        </div>
                                    ))}
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px' }}>Delivery</span>
                                        <span style={{ color: '#4ade80', fontWeight: 700, fontSize: '14px' }}>FREE</span>
                                    </div>
                                    <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span style={{ color: '#fff', fontSize: '16px', fontWeight: 700 }}>Total</span>
                                        <span style={{ fontSize: '20px', fontWeight: 800, background: 'linear-gradient(135deg, #667eea, #a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                                            {displayINRCurrency(totalPrice)}
                                        </span>
                                    </div>
                                </div>
                                <button className="cart-proceed-btn"
                                    onClick={handleProceedToPayment}
                                    style={{ background: 'linear-gradient(135deg, #667eea, #764ba2)', color: '#fff', boxShadow: '0 4px 16px rgba(102,126,234,0.4)' }}
                                    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(102,126,234,0.55)' }}
                                    onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(102,126,234,0.4)' }}
                                >Proceed to Payment →</button>
                                <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.35)', fontSize: '12px', marginTop: '14px' }}>
                                    🛡️ Secure & Encrypted Checkout
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Wishlist Dialog */}
                {wishlistDialog?.show && (
                    <div style={{ position: 'fixed', inset: 0, background: 'rgba(10,10,30,0.75)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
                        <div style={{ background: 'linear-gradient(160deg, #1a1a2e 0%, #16213e 60%, #0f3460 100%)', borderRadius: '24px', padding: '28px', maxWidth: '360px', width: '100%', boxShadow: '0 32px 80px rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)', textAlign: 'center' }}>
                            <div style={{ width: '72px', height: '72px', borderRadius: '14px', background: 'rgba(255,255,255,0.08)', margin: '0 auto 14px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', padding: '8px' }}>
                                <img src={wishlistDialog.productImage} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                            </div>
                            <FaHeart style={{ fontSize: '28px', color: '#f5576c', marginBottom: '10px' }} />
                            <h3 style={{ color: '#fff', fontSize: '17px', fontWeight: 800, margin: '0 0 8px' }}>Save to Wishlist?</h3>
                            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '13px', margin: '0 0 22px', lineHeight: 1.6 }}>
                                Save <strong style={{ color: '#fff' }}>{wishlistDialog.productName}</strong> before removing?
                            </p>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <button onClick={handleJustDelete}
                                    style={{ flex: 1, padding: '11px', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '12px', color: 'rgba(255,255,255,0.7)', fontSize: '13px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', transition: 'all 0.2s' }}
                                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(245,87,108,0.2)'; e.currentTarget.style.color = '#f5576c' }}
                                    onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = 'rgba(255,255,255,0.7)' }}
                                ><FaTimes /> Remove</button>
                                <button onClick={handleMoveToWishlist}
                                    style={{ flex: 1, padding: '11px', background: 'linear-gradient(135deg, #f093fb, #f5576c)', border: 'none', borderRadius: '12px', color: '#fff', fontSize: '13px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', boxShadow: '0 4px 14px rgba(245,87,108,0.35)', transition: 'all 0.2s' }}
                                    onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-1px)'}
                                    onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                                ><FaHeart /> Save it!</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    )
}

export default Cart