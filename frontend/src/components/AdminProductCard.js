import React, { useState } from 'react'
import { MdModeEditOutline } from "react-icons/md"
import AdminEditProduct from './AdminEditProduct'
import displayINRCurrency from '../helpers/displayCurrency'

const AdminProductCard = ({ data, fetchdata }) => {
  const [editProduct, setEditProduct] = useState(false)
  const [hovered, setHovered] = useState(false)

  const gold        = '#c9a84c'
  const border      = 'rgba(255,255,255,0.07)'
  const borderHover = 'rgba(201,168,76,0.5)'
  const surface     = '#161616'
  const surfaceHover= '#1c1c1c'
  const text        = '#e8e4dc'
  const muted       = 'rgba(160,152,144,0.75)'

  return (
    <>
      <style>{`
        .apc-wrap {
          width: 180px;
          flex-shrink: 0;
          border: 0.5px solid ${border};
          background: ${surface};
          overflow: hidden;
          transition: border-color 0.22s ease, box-shadow 0.22s ease, background 0.22s ease, transform 0.22s ease;
          position: relative;
          cursor: default;
          border-radius: 1px;
        }
        .apc-wrap:hover {
          border-color: ${borderHover};
          box-shadow: 0 8px 32px rgba(0,0,0,0.35);
          background: ${surfaceHover};
          transform: translateY(-2px);
        }

        /* Gold top bar reveal */
        .apc-wrap::after {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 1.5px;
          background: ${gold};
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          z-index: 3;
        }
        .apc-wrap:hover::after { transform: scaleX(1); }

        /* Image zone */
        .apc-img {
          width: 100%;
          height: 140px;
          background: rgba(255,255,255,0.02);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 18px;
          overflow: hidden;
          border-bottom: 0.5px solid ${border};
          transition: background 0.22s ease;
        }
        .apc-wrap:hover .apc-img {
          background: rgba(201,168,76,0.04);
        }
        .apc-img img {
          max-height: 110px;
          max-width: 90%;
          object-fit: contain;
          mix-blend-mode: lighten;
          transition: transform 0.35s ease;
        }
        .apc-wrap:hover .apc-img img { transform: scale(1.08); }

        /* Info zone */
        .apc-info { padding: 12px 13px 13px; }
        .apc-name {
          font-size: 12px;
          font-weight: 400;
          color: ${text};
          margin: 0 0 11px;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          line-height: 1.55;
          min-height: 37px;
          font-family: 'DM Sans', sans-serif;
          letter-spacing: 0.01em;
        }

        /* Price + edit row */
        .apc-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 6px;
        }
        .apc-price {
          font-size: 13px;
          font-weight: 500;
          color: ${gold};
          margin: 0;
          white-space: nowrap;
          letter-spacing: -0.01em;
          font-family: 'DM Sans', sans-serif;
        }

        /* Edit button */
        .apc-edit-btn {
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 6px 11px;
          background: transparent;
          border: 0.5px solid rgba(201,168,76,0.35);
          color: ${gold};
          font-size: 10px;
          font-weight: 400;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.2s ease;
          font-family: 'DM Sans', sans-serif;
          white-space: nowrap;
          flex-shrink: 0;
          border-radius: 1px;
        }
        .apc-edit-btn:hover {
          background: ${gold};
          color: #0a0a0a;
          border-color: ${gold};
          box-shadow: 0 0 14px rgba(201,168,76,0.2);
        }
      `}</style>

      <div
        className="apc-wrap"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* Image */}
        <div className="apc-img">
          <img src={data?.productImage[0]} alt={data.productName} />
        </div>

        {/* Info */}
        <div className="apc-info">
          <h3 className="apc-name">{data.productName}</h3>
          <div className="apc-footer">
            <p className="apc-price">{displayINRCurrency(data.sellingPrice)}</p>
            <button className="apc-edit-btn" onClick={() => setEditProduct(true)}>
              <MdModeEditOutline style={{ fontSize: '12px' }} />
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