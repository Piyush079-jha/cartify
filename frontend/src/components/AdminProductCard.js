import React, { useState } from 'react'
import { MdModeEditOutline } from "react-icons/md";
import AdminEditProduct from './AdminEditProduct';
import displayINRCurrency from '../helpers/displayCurrency';

const AdminProductCard = ({ data, fetchdata }) => {
  const [editProduct, setEditProduct] = useState(false)
  const [hovered, setHovered] = useState(false)

  return (
    <>
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          background: hovered
            ? 'rgba(102,126,234,0.12)'
            : 'rgba(255,255,255,0.05)',
          borderRadius: '16px',
          width: '100%',
          overflow: 'hidden',
          boxShadow: hovered
            ? '0 12px 36px rgba(102,126,234,0.25)'
            : '0 2px 10px rgba(0,0,0,0.2)',
          border: `1.5px solid ${hovered ? 'rgba(102,126,234,0.5)' : 'rgba(255,255,255,0.08)'}`,
          transition: 'all 0.25s ease',
          cursor: 'default',
          flexShrink: 0
        }}
      >
        {/* Image Section */}
        <div style={{
          width: '100%',
          height: '140px',
          background: hovered
            ? 'rgba(102,126,234,0.15)'
            : 'rgba(255,255,255,0.04)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          transition: 'background 0.25s ease'
        }}>
          <img
            src={data?.productImage[0]}
            alt={data.productName}
            style={{
              maxHeight: '120px',
              maxWidth: '90%',
              objectFit: 'contain',
              transition: 'transform 0.3s ease',
              transform: hovered ? 'scale(1.08)' : 'scale(1)',
              mixBlendMode: 'lighten'
            }}
          />
        </div>

        {/* Info Section */}
        <div style={{ padding: '12px' }}>
          <h3 style={{
            fontSize: '13px',
            fontWeight: 600,
            color: '#fff',
            margin: '0 0 10px',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            lineHeight: '1.45',
            minHeight: '38px'
          }}>
            {data.productName}
          </h3>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '6px'
          }}>
            <p style={{
              fontWeight: 800,
              fontSize: '13px',
              color: '#667eea',
              margin: 0,
              whiteSpace: 'nowrap'
            }}>
              {displayINRCurrency(data.sellingPrice)}
            </p>

            <button
              onClick={() => setEditProduct(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                padding: '6px 11px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                border: 'none',
                borderRadius: '8px',
                color: '#fff',
                fontSize: '12px',
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 3px 10px rgba(102,126,234,0.35)',
                transition: 'all 0.2s ease',
                whiteSpace: 'nowrap',
                flexShrink: 0
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-1px)'
                e.currentTarget.style.boxShadow = '0 6px 16px rgba(102,126,234,0.5)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = '0 3px 10px rgba(102,126,234,0.35)'
              }}
            >
              <MdModeEditOutline style={{ fontSize: '13px' }} />
              Edit
            </button>
          </div>
        </div>
      </div>

      {editProduct && (
        <AdminEditProduct
          productData={data}
          onClose={() => setEditProduct(false)}
          fetchdata={fetchdata}
        />
      )}
    </>
  )
}

export default AdminProductCard