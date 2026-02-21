import React, { useEffect, useState } from 'react'
import SummaryApi from '../common'
import { Link } from 'react-router-dom'

const CategoryList = () => {
    const [categoryProduct, setCategoryProduct] = useState([])
    const [loading, setLoading] = useState(false)
    const categoryLoading = new Array(13).fill(null)

    const fetchCategoryProduct = async () => {
        setLoading(true)
        const response = await fetch(SummaryApi.categoryProduct.url)
        const dataResponse = await response.json()
        setLoading(false)
        setCategoryProduct(dataResponse.data)
    }

    useEffect(() => { fetchCategoryProduct() }, [])

    return (
        <div style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', padding: '20px 0', position: 'relative', overflow: 'hidden' }}>
            <style>{`
                .cl-bg1 { position: absolute; top: -50%; right: -10%; width: 300px; height: 300px; background: rgba(255,255,255,0.1); border-radius: 50%; filter: blur(60px); animation: float 8s ease-in-out infinite; }
                .cl-bg2 { position: absolute; bottom: -30%; left: -5%; width: 250px; height: 250px; background: rgba(255,255,255,0.08); border-radius: 50%; filter: blur(50px); animation: float 6s ease-in-out infinite reverse; }
                @keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-20px); } }
                @keyframes shimmer { 0%, 100% { opacity: 0.3; } 50% { opacity: 0.6; } }
                @keyframes slideIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

                .cl-scroll { display: flex; align-items: center; gap: 10px; overflow-x: auto; scrollbar-width: none; padding-bottom: 8px; }
                .cl-scroll::-webkit-scrollbar { display: none; }
                .cl-item { display: flex; flex-direction: column; align-items: center; gap: 8px; flex-shrink: 0; padding: 10px; border-radius: 16px; text-decoration: none; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); cursor: pointer; background: rgba(255,255,255,0.1); backdrop-filter: blur(10px); border: 1px solid rgba(255,255,255,0.2); }
                .cl-img-box { width: 72px; height: 72px; border-radius: 16px; background: #fff; display: flex; align-items: center; justify-content: center; overflow: hidden; padding: 10px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); transition: all 0.3s ease; }
                .cl-label { font-size: 12px; font-weight: 600; color: #fff; text-transform: capitalize; text-align: center; margin: 0; text-shadow: 0 2px 8px rgba(0,0,0,0.2); }

                @media (max-width: 768px) {
                    .cl-item { padding: 8px !important; border-radius: 14px !important; gap: 6px !important; }
                    .cl-img-box { width: 58px !important; height: 58px !important; padding: 8px !important; }
                    .cl-label { font-size: 11px !important; }
                    .cl-title { font-size: 16px !important; margin-bottom: 14px !important; }
                    .cl-inner { padding: 0 14px !important; }
                    .cl-scroll { gap: 8px !important; }
                }
                @media (max-width: 480px) {
                    .cl-img-box { width: 50px !important; height: 50px !important; }
                    .cl-label { font-size: 10px !important; }
                    .cl-item { padding: 6px !important; }
                }
            `}</style>

            <div className="cl-bg1" /><div className="cl-bg2" />

            <div className="cl-inner" style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 20px', position: 'relative', zIndex: 1 }}>
                <h2 className="cl-title" style={{ color: '#fff', fontSize: '18px', fontWeight: 700, marginBottom: '16px', letterSpacing: '-0.3px', textAlign: 'center', textShadow: '0 2px 10px rgba(0,0,0,0.2)' }}>
                    Shop by Category
                </h2>

                <div className="cl-scroll">
                    {loading ? (
                        categoryLoading.map((el, index) => (
                            <div key={"categoryLoading" + index} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                                <div style={{ width: '72px', height: '72px', borderRadius: '16px', background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)', animation: 'shimmer 1.5s infinite', border: '1px solid rgba(255,255,255,0.2)' }} />
                                <div style={{ width: '54px', height: '11px', borderRadius: '6px', background: 'rgba(255,255,255,0.15)' }} />
                            </div>
                        ))
                    ) : (
                        categoryProduct.map((product, index) => (
                            <Link to={"/product-category?category=" + product?.category} key={product?.category}
                                className="cl-item"
                                style={{ opacity: 0, animation: `slideIn 0.4s ease forwards ${index * 0.05}s` }}
                                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.25)'; e.currentTarget.style.transform = 'translateY(-5px) scale(1.05)'; e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.15)' }}
                                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.transform = 'translateY(0) scale(1)'; e.currentTarget.style.boxShadow = 'none' }}
                            >
                                <div className="cl-img-box">
                                    <img src={product?.productImage[0]} alt={product?.category}
                                        style={{ width: '100%', height: '100%', objectFit: 'contain', mixBlendMode: 'multiply', transition: 'transform 0.3s ease' }}
                                        onMouseEnter={e => e.target.style.transform = 'scale(1.2) rotate(5deg)'}
                                        onMouseLeave={e => e.target.style.transform = 'scale(1) rotate(0deg)'}
                                    />
                                </div>
                                <p className="cl-label">{product?.category}</p>
                            </Link>
                        ))
                    )}
                </div>
            </div>
        </div>
    )
}

export default CategoryList