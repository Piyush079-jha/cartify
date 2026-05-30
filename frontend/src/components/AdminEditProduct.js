import React, { useState } from 'react'
import { CgClose } from "react-icons/cg"
import productCategory from '../helpers/productCategory'
import { FaCloudUploadAlt } from "react-icons/fa"
import uploadImage from '../helpers/uploadImage'
import DisplayImage from './DisplayImage'
import { MdDelete } from "react-icons/md"
import SummaryApi from '../common'
import { toast } from 'react-toastify'

const AdminEditProduct = ({ onClose, productData, fetchdata }) => {
  const [data, setData] = useState({
    ...productData,
    productName:   productData?.productName,
    brandName:     productData?.brandName,
    category:      productData?.category,
    productImage:  productData?.productImage || [],
    description:   productData?.description,
    price:         productData?.price,
    sellingPrice:  productData?.sellingPrice
  })
  const [openFullScreenImage, setOpenFullScreenImage] = useState(false)
  const [fullScreenImage, setFullScreenImage]         = useState("")
  const [uploading, setUploading]   = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const gold   = '#c9a84c'
  const border = 'rgba(255,255,255,0.08)'
  const muted  = 'rgba(160,152,144,0.7)'
  const text   = '#e8e4dc'

  const handleOnChange = (e) => {
    const { name, value } = e.target
    setData(prev => ({ ...prev, [name]: value }))
  }

  const handleUploadProduct = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setUploading(true)
    const uploadImageCloudinary = await uploadImage(file)
    setData(prev => ({ ...prev, productImage: [...prev.productImage, uploadImageCloudinary.url] }))
    setUploading(false)
  }

  const handleDeleteProductImage = (index) => {
    const newProductImage = [...data.productImage]
    newProductImage.splice(index, 1)
    setData(prev => ({ ...prev, productImage: [...newProductImage] }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    const response = await fetch(SummaryApi.updateProduct.url, {
      method: SummaryApi.updateProduct.method,
      credentials: 'include',
      headers: { "content-type": "application/json" },
      body: JSON.stringify(data)
    })
    const responseData = await response.json()
    setSubmitting(false)
    if (responseData.success) { toast.success(responseData?.message); onClose(); fetchdata() }
    if (responseData.error)   toast.error(responseData?.message)
  }

  return (
    <>
      <style>{`
        .aep-overlay {
          position: fixed; inset: 0;
          background: rgba(0,0,0,0.82);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          display: flex; align-items: center; justify-content: center;
          z-index: 1000; padding: 20px;
          animation: aepFadeIn 0.2s ease;
        }
        @keyframes aepFadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes aepSlideUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .aep-modal {
          background: #111110;
          border: 0.5px solid ${border};
          width: 100%; max-width: 540px;
          max-height: 90vh;
          display: flex; flex-direction: column;
          box-shadow: 0 40px 80px rgba(0,0,0,0.6);
          animation: aepSlideUp 0.25s ease;
          border-radius: 1px;
        }

        /* Header */
        .aep-header {
          display: flex; justify-content: space-between; align-items: center;
          padding: 20px 24px;
          border-bottom: 0.5px solid ${border};
          flex-shrink: 0;
        }
        .aep-title {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: 22px; font-weight: 300;
          color: ${text}; margin: 0;
          letter-spacing: -0.01em;
        }
        .aep-subtitle {
          font-size: 10px; color: ${muted};
          margin: 3px 0 0; letter-spacing: 0.08em;
          font-family: 'DM Sans', sans-serif;
        }
        .aep-close {
          width: 32px; height: 32px;
          border: 0.5px solid ${border};
          background: transparent;
          color: ${muted}; font-size: 16px;
          cursor: pointer; display: flex;
          align-items: center; justify-content: center;
          transition: all 0.2s ease; border-radius: 1px;
        }
        .aep-close:hover { border-color: rgba(192,120,120,0.5); color: #c07878; }

        /* Form */
        .aep-form {
          overflow-y: auto; padding: 22px 24px;
          display: flex; flex-direction: column; gap: 18px;
          flex: 1; scrollbar-width: none;
        }
        .aep-form::-webkit-scrollbar { display: none; }

        .aep-label {
          font-size: 9px; font-weight: 500;
          color: ${muted}; letter-spacing: 0.18em;
          text-transform: uppercase; display: block;
          margin-bottom: 7px;
          font-family: 'DM Sans', sans-serif;
        }
        .aep-input {
          width: 100%; padding: 11px 14px;
          background: rgba(255,255,255,0.03);
          border: 0.5px solid ${border};
          color: ${text}; font-size: 13px;
          outline: none; box-sizing: border-box;
          transition: border-color 0.2s ease, background 0.2s ease;
          font-family: 'DM Sans', sans-serif;
          letter-spacing: 0.02em; border-radius: 1px;
        }
        .aep-input::placeholder { color: rgba(255,255,255,0.18); }
        .aep-input:focus {
          border-color: ${gold};
          background: rgba(201,168,76,0.03);
        }
        select.aep-input { cursor: pointer; }
        select.aep-input option { background: #111110; color: ${text}; }

        /* Upload zone */
        .aep-upload-zone {
          border: 0.5px dashed rgba(201,168,76,0.3);
          padding: 28px;
          display: flex; flex-direction: column;
          align-items: center; gap: 8px;
          cursor: pointer;
          transition: border-color 0.2s ease, background 0.2s ease;
          background: rgba(201,168,76,0.02);
          border-radius: 1px;
        }
        .aep-upload-zone:hover {
          border-color: rgba(201,168,76,0.6);
          background: rgba(201,168,76,0.05);
        }

        /* Price grid */
        .aep-price-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
        }

        /* Submit */
        .aep-submit {
          width: 100%; padding: 13px;
          background: transparent;
          border: 0.5px solid ${gold};
          color: ${gold}; font-size: 11px;
          font-weight: 500; letter-spacing: 0.16em;
          text-transform: uppercase; cursor: pointer;
          transition: all 0.25s ease;
          font-family: 'DM Sans', sans-serif;
          border-radius: 1px; margin-bottom: 4px;
        }
        .aep-submit:hover:not(:disabled) {
          background: ${gold}; color: #0a0a0a;
          box-shadow: 0 0 24px rgba(201,168,76,0.2);
          letter-spacing: 0.2em;
        }
        .aep-submit:disabled { opacity: 0.4; cursor: not-allowed; }

        @media (max-width: 480px) {
          .aep-modal { max-height: 95vh; }
          .aep-price-grid { grid-template-columns: 1fr; }
          .aep-header { padding: 16px 18px; }
          .aep-form  { padding: 18px; }
        }
      `}</style>

      <div className="aep-overlay" onClick={e => { if (e.target === e.currentTarget) onClose() }}>
        <div className="aep-modal">

          {/* Header */}
          <div className="aep-header">
            <div>
              <h2 className="aep-title">Edit Product</h2>
              <p className="aep-subtitle">Update product details below</p>
            </div>
            <button className="aep-close" onClick={onClose} aria-label="Close">
              <CgClose />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="aep-form">

            {/* Product Name */}
            <div>
              <label className="aep-label">Product Name</label>
              <input
                type="text" name="productName"
                placeholder="Enter product name"
                value={data.productName}
                onChange={handleOnChange}
                className="aep-input" required
              />
            </div>

            {/* Brand */}
            <div>
              <label className="aep-label">Brand Name</label>
              <input
                type="text" name="brandName"
                placeholder="Enter brand name"
                value={data.brandName}
                onChange={handleOnChange}
                className="aep-input" required
              />
            </div>

            {/* Category */}
            <div>
              <label className="aep-label">Category</label>
              <select
                name="category"
                value={data.category}
                onChange={handleOnChange}
                className="aep-input" required
              >
                <option value="">Select Category</option>
                {productCategory.map((el, index) => (
                  <option key={el.value + index} value={el.value}>{el.label}</option>
                ))}
              </select>
            </div>

            {/* Image Upload */}
            <div>
              <label className="aep-label">Product Images</label>
              <label htmlFor="editImageInput" style={{ cursor: uploading ? 'wait' : 'pointer' }}>
                <div className="aep-upload-zone">
                  <FaCloudUploadAlt style={{ fontSize: '28px', color: gold, opacity: 0.8 }} />
                  <p style={{ color: muted, fontSize: '12px', margin: 0, letterSpacing: '0.04em', fontFamily: 'DM Sans, sans-serif' }}>
                    {uploading ? 'Uploading...' : 'Click to upload image'}
                  </p>
                  <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: '10px', margin: 0, letterSpacing: '0.06em', fontFamily: 'DM Sans, sans-serif' }}>
                    PNG, JPG up to 10MB
                  </p>
                  <input type="file" id="editImageInput" onChange={handleUploadProduct} style={{ display: 'none' }} />
                </div>
              </label>

              {/* Image previews */}
              {data.productImage.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '12px' }}>
                  {data.productImage.map((el, index) => (
                    <div
                      key={index}
                      style={{ position: 'relative' }}
                      onMouseEnter={e => e.currentTarget.querySelector('.aep-del').style.opacity = '1'}
                      onMouseLeave={e => e.currentTarget.querySelector('.aep-del').style.opacity  = '0'}
                    >
                      <img
                        src={el}
                        alt={`product-${index}`}
                        style={{
                          width: '72px', height: '72px',
                          objectFit: 'cover',
                          border: `0.5px solid ${border}`,
                          cursor: 'pointer',
                          display: 'block',
                          borderRadius: '1px'
                        }}
                        onClick={() => { setOpenFullScreenImage(true); setFullScreenImage(el) }}
                      />
                      <button
                        type="button"
                        className="aep-del"
                        onClick={() => handleDeleteProductImage(index)}
                        style={{
                          opacity: 0,
                          position: 'absolute', top: '4px', right: '4px',
                          background: 'rgba(192,120,120,0.9)',
                          border: 'none', width: '20px', height: '20px',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          cursor: 'pointer', color: '#fff', fontSize: '11px',
                          transition: 'opacity 0.2s ease', borderRadius: '1px'
                        }}
                      >
                        <MdDelete />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {data.productImage.length === 0 && (
                <p style={{ color: 'rgba(192,120,120,0.7)', fontSize: '10px', marginTop: '6px', letterSpacing: '0.06em', fontFamily: 'DM Sans, sans-serif' }}>
                  Please upload at least one product image
                </p>
              )}
            </div>

            {/* Price row */}
            <div className="aep-price-grid">
              <div>
                <label className="aep-label">Price (₹)</label>
                <input
                  type="number" name="price"
                  placeholder="0" value={data.price}
                  onChange={handleOnChange}
                  className="aep-input" required
                />
              </div>
              <div>
                <label className="aep-label">Selling Price (₹)</label>
                <input
                  type="number" name="sellingPrice"
                  placeholder="0" value={data.sellingPrice}
                  onChange={handleOnChange}
                  className="aep-input" required
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="aep-label">Description</label>
              <textarea
                name="description"
                placeholder="Enter product description..."
                rows={4}
                value={data.description}
                onChange={handleOnChange}
                className="aep-input"
                style={{ resize: 'vertical', lineHeight: 1.7, fontFamily: 'DM Sans, sans-serif' }}
              />
            </div>

            {/* Submit */}
            <button type="submit" className="aep-submit" disabled={submitting}>
              {submitting ? 'Updating...' : 'Update Product'}
            </button>
          </form>
        </div>
      </div>

      {openFullScreenImage && (
        <DisplayImage onClose={() => setOpenFullScreenImage(false)} imgUrl={fullScreenImage} />
      )}
    </>
  )
}

export default AdminEditProduct