import React, { useEffect, useState } from 'react'
import UploadProduct from '../components/UploadProduct'
import SummaryApi from '../common'
import AdminProductCard from '../components/AdminProductCard'
import { FaPlus, FaBox } from 'react-icons/fa'

const AllProducts = () => {
  const [openUploadProduct, setOpenUploadProduct] = useState(false)
  const [allProduct, setAllProduct] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchAllProduct = async () => {
    setLoading(true)
    const response = await fetch(SummaryApi.allProduct.url)
    const dataResponse = await response.json()
    setAllProduct(dataResponse?.data || [])
    setLoading(false)
  }

  useEffect(() => {
    fetchAllProduct()
  }, [])

  return (
    <div>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '24px'
      }}>
        <div>
          <h2 style={{
            fontSize: '22px',
            fontWeight: 800,
            margin: '0 0 4px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            All Products
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px', margin: 0 }}>
            {allProduct.length} products total
          </p>
        </div>
        <button
          onClick={() => setOpenUploadProduct(true)}
          style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            padding: '12px 24px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: '#fff', border: 'none', borderRadius: '12px',
            fontSize: '14px', fontWeight: 700, cursor: 'pointer',
            boxShadow: '0 4px 16px rgba(102,126,234,0.35)',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={e => {
            e.currentTarget.style.transform = 'translateY(-2px)'
            e.currentTarget.style.boxShadow = '0 8px 24px rgba(102,126,234,0.5)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = 'translateY(0)'
            e.currentTarget.style.boxShadow = '0 4px 16px rgba(102,126,234,0.35)'
          }}
        >
          <FaPlus /> Upload Product
        </button>
      </div>

      {/* Stats Row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
        gap: '16px',
        marginBottom: '28px'
      }}>
        {[
          { label: 'Total Products', value: allProduct.length, color: '#667eea', bg: 'rgba(102,126,234,0.12)' },
          { label: 'Categories', value: [...new Set(allProduct.map(p => p.category))].length, color: '#a78bfa', bg: 'rgba(167,139,250,0.12)' },
          {
            label: 'Avg Price',
            value: allProduct.length
              ? `₹${Math.round(allProduct.reduce((a, b) => a + b.sellingPrice, 0) / allProduct.length).toLocaleString()}`
              : '₹0',
            color: '#f5576c',
            bg: 'rgba(245,87,108,0.12)'
          },
        ].map((stat, i) => (
          <div key={i} style={{
            background: stat.bg,
            borderRadius: '16px',
            padding: '20px',
            border: `1px solid ${stat.color}33`,
            borderLeft: `4px solid ${stat.color}`
          }}>
            <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.45)', margin: '0 0 8px', fontWeight: 600, letterSpacing: '0.5px', textTransform: 'uppercase' }}>
              {stat.label}
            </p>
            <p style={{ fontSize: '26px', fontWeight: 800, color: stat.color, margin: 0 }}>
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Products Grid */}
      <div style={{
        background: 'rgba(255,255,255,0.04)',
        borderRadius: '20px',
        padding: '20px',
        border: '1px solid rgba(255,255,255,0.08)'
      }}>
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '16px',
          maxHeight: 'calc(100vh - 380px)',
          overflowY: 'auto',
          paddingRight: '4px'
        }}>
          {loading ? (
            Array(6).fill(null).map((_, i) => (
              <div key={i} style={{
                width: '180px', height: '220px',
                background: 'rgba(255,255,255,0.06)',
                borderRadius: '16px',
                border: '1px solid rgba(255,255,255,0.08)'
              }} />
            ))
          ) : allProduct.length === 0 ? (
            <div style={{
              width: '100%', padding: '60px',
              textAlign: 'center', color: 'rgba(255,255,255,0.3)'
            }}>
              <FaBox style={{ fontSize: '48px', marginBottom: '16px', opacity: 0.3 }} />
              <p style={{ fontSize: '16px', fontWeight: 600 }}>No products yet</p>
              <p style={{ fontSize: '14px' }}>Click "Upload Product" to add your first product</p>
            </div>
          ) : (
            allProduct.map((product, index) => (
              <AdminProductCard
                data={product}
                key={index + "allProduct"}
                fetchdata={fetchAllProduct}
              />
            ))
          )}
        </div>
      </div>

      {/* Upload Modal */}
      {openUploadProduct && (
        <UploadProduct
          onClose={() => setOpenUploadProduct(false)}
          fetchData={fetchAllProduct}
        />
      )}
    </div>
  )
}

export default AllProducts