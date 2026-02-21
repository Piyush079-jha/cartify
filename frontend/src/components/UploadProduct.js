import React, { useState } from 'react'
import { CgClose } from "react-icons/cg";
import productCategory from '../helpers/productCategory';
import { FaCloudUploadAlt } from "react-icons/fa";
import uploadImage from '../helpers/uploadImage';
import DisplayImage from './DisplayImage';
import { MdDelete } from "react-icons/md";
import SummaryApi from '../common';
import { toast } from 'react-toastify'

const UploadProduct = ({ onClose, fetchData }) => {
  const [data, setData] = useState({
    productName: "",
    brandName: "",
    category: "",
    productImage: [],
    description: "",
    price: "",
    sellingPrice: ""
  })
  const [openFullScreenImage, setOpenFullScreenImage] = useState(false)
  const [fullScreenImage, setFullScreenImage] = useState("")
  const [uploading, setUploading] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const handleOnChange = (e) => {
    const { name, value } = e.target
    setData((prev) => ({ ...prev, [name]: value }))
  }

  const handleUploadProduct = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setUploading(true)
    const uploadImageCloudinary = await uploadImage(file)
    setData((prev) => ({
      ...prev,
      productImage: [...prev.productImage, uploadImageCloudinary.url]
    }))
    setUploading(false)
  }

  const handleDeleteProductImage = (index) => {
    const newProductImage = [...data.productImage]
    newProductImage.splice(index, 1)
    setData((prev) => ({ ...prev, productImage: [...newProductImage] }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    const response = await fetch(SummaryApi.uploadProduct.url, {
      method: SummaryApi.uploadProduct.method,
      credentials: 'include',
      headers: { "content-type": "application/json" },
      body: JSON.stringify(data)
    })
    const responseData = await response.json()
    setSubmitting(false)
    if (responseData.success) {
      toast.success(responseData?.message)
      onClose()
      fetchData()
    }
    if (responseData.error) {
      toast.error(responseData?.message)
    }
  }

  const inputStyle = {
    padding: '11px 14px',
    background: 'rgba(255,255,255,0.07)',
    border: '1px solid rgba(255,255,255,0.13)',
    borderRadius: '10px',
    color: '#fff',
    fontSize: '14px',
    outline: 'none',
    transition: 'border 0.2s',
    width: '100%',
    boxSizing: 'border-box'
  }

  const labelStyle = {
    fontSize: '12px',
    fontWeight: 700,
    color: 'rgba(255,255,255,0.55)',
    letterSpacing: '1px',
    textTransform: 'uppercase',
    marginBottom: '6px',
    display: 'block'
  }

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(10,10,30,0.75)',
      backdropFilter: 'blur(6px)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
      padding: '20px'
    }}>
      <div style={{
        background: 'linear-gradient(160deg, #1a1a2e 0%, #16213e 60%, #0f3460 100%)',
        borderRadius: '24px',
        width: '100%',
        maxWidth: '560px',
        maxHeight: '90vh',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 32px 80px rgba(0,0,0,0.5)',
        border: '1px solid rgba(255,255,255,0.1)',
        overflow: 'hidden'
      }}>

        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '24px 28px',
          borderBottom: '1px solid rgba(255,255,255,0.08)'
        }}>
          <div>
            <h2 style={{ color: '#fff', fontWeight: 800, fontSize: '20px', margin: 0 }}>Upload Product</h2>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px', margin: '4px 0 0' }}>Add a new product to your store</p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255,255,255,0.08)',
              border: 'none',
              borderRadius: '10px',
              color: 'rgba(255,255,255,0.7)',
              fontSize: '20px',
              cursor: 'pointer',
              width: '38px',
              height: '38px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s'
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(245,87,108,0.25)'; e.currentTarget.style.color = '#f5576c' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = 'rgba(255,255,255,0.7)' }}
          >
            <CgClose />
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          style={{
            overflowY: 'auto',
            padding: '24px 28px',
            display: 'flex',
            flexDirection: 'column',
            gap: '18px',
            flex: 1
          }}
        >
          {/* Product Name */}
          <div>
            <label style={labelStyle}>Product Name</label>
            <input
              type='text'
              name='productName'
              placeholder='Enter product name'
              value={data.productName}
              onChange={handleOnChange}
              required
              style={inputStyle}
              onFocus={e => e.target.style.border = '1px solid #667eea'}
              onBlur={e => e.target.style.border = '1px solid rgba(255,255,255,0.13)'}
            />
          </div>

          {/* Brand Name */}
          <div>
            <label style={labelStyle}>Brand Name</label>
            <input
              type='text'
              name='brandName'
              placeholder='Enter brand name'
              value={data.brandName}
              onChange={handleOnChange}
              required
              style={inputStyle}
              onFocus={e => e.target.style.border = '1px solid #667eea'}
              onBlur={e => e.target.style.border = '1px solid rgba(255,255,255,0.13)'}
            />
          </div>

          {/* Category */}
          <div>
            <label style={labelStyle}>Category</label>
            <select
              name='category'
              value={data.category}
              onChange={handleOnChange}
              required
              style={{ ...inputStyle, cursor: 'pointer' }}
              onFocus={e => e.target.style.border = '1px solid #667eea'}
              onBlur={e => e.target.style.border = '1px solid rgba(255,255,255,0.13)'}
            >
              <option value="" style={{ background: '#1a1a2e' }}>Select Category</option>
              {productCategory.map((el, index) => (
                <option key={el.value + index} value={el.value} style={{ background: '#1a1a2e' }}>{el.label}</option>
              ))}
            </select>
          </div>

          {/* Image Upload */}
          <div>
            <label style={labelStyle}>Product Images</label>
            <label htmlFor='uploadImageInput' style={{ cursor: uploading ? 'wait' : 'pointer' }}>
              <div style={{
                border: '2px dashed rgba(102,126,234,0.4)',
                borderRadius: '14px',
                padding: '28px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '8px',
                background: 'rgba(102,126,234,0.06)',
                transition: 'all 0.2s',
                cursor: uploading ? 'wait' : 'pointer'
              }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = 'rgba(102,126,234,0.12)'
                  e.currentTarget.style.borderColor = 'rgba(102,126,234,0.7)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'rgba(102,126,234,0.06)'
                  e.currentTarget.style.borderColor = 'rgba(102,126,234,0.4)'
                }}
              >
                <FaCloudUploadAlt style={{ fontSize: '36px', color: '#667eea' }} />
                <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px', margin: 0, fontWeight: 600 }}>
                  {uploading ? 'Uploading...' : 'Click to upload image'}
                </p>
                <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '12px', margin: 0 }}>PNG, JPG up to 10MB</p>
                <input type='file' id='uploadImageInput' className='hidden' onChange={handleUploadProduct} style={{ display: 'none' }} />
              </div>
            </label>

            {/* Image Previews */}
            {data.productImage.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '12px' }}>
                {data.productImage.map((el, index) => (
                  <div key={index} style={{ position: 'relative' }}
                    onMouseEnter={e => e.currentTarget.querySelector('.del-btn').style.display = 'flex'}
                    onMouseLeave={e => e.currentTarget.querySelector('.del-btn').style.display = 'none'}
                  >
                    <img
                      src={el}
                      alt={`product-${index}`}
                      style={{
                        width: '76px',
                        height: '76px',
                        objectFit: 'cover',
                        borderRadius: '10px',
                        border: '2px solid rgba(102,126,234,0.4)',
                        cursor: 'pointer'
                      }}
                      onClick={() => { setOpenFullScreenImage(true); setFullScreenImage(el) }}
                    />
                    <button
                      type='button'
                      className='del-btn'
                      onClick={() => handleDeleteProductImage(index)}
                      style={{
                        display: 'none',
                        position: 'absolute',
                        top: '4px',
                        right: '4px',
                        background: '#f5576c',
                        border: 'none',
                        borderRadius: '50%',
                        width: '22px',
                        height: '22px',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        color: '#fff',
                        fontSize: '13px'
                      }}
                    >
                      <MdDelete />
                    </button>
                  </div>
                ))}
              </div>
            )}
            {data.productImage.length === 0 && (
              <p style={{ color: '#f5576c', fontSize: '12px', marginTop: '6px' }}>* Please upload at least one product image</p>
            )}
          </div>

          {/* Price Row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div>
              <label style={labelStyle}>Price (₹)</label>
              <input
                type='number'
                name='price'
                placeholder='0'
                value={data.price}
                onChange={handleOnChange}
                required
                style={inputStyle}
                onFocus={e => e.target.style.border = '1px solid #667eea'}
                onBlur={e => e.target.style.border = '1px solid rgba(255,255,255,0.13)'}
              />
            </div>
            <div>
              <label style={labelStyle}>Selling Price (₹)</label>
              <input
                type='number'
                name='sellingPrice'
                placeholder='0'
                value={data.sellingPrice}
                onChange={handleOnChange}
                required
                style={inputStyle}
                onFocus={e => e.target.style.border = '1px solid #667eea'}
                onBlur={e => e.target.style.border = '1px solid rgba(255,255,255,0.13)'}
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label style={labelStyle}>Description</label>
            <textarea
              name='description'
              placeholder='Enter product description...'
              rows={4}
              value={data.description}
              onChange={handleOnChange}
              style={{
                ...inputStyle,
                resize: 'none',
                lineHeight: '1.6',
                fontFamily: 'inherit'
              }}
              onFocus={e => e.target.style.border = '1px solid #667eea'}
              onBlur={e => e.target.style.border = '1px solid rgba(255,255,255,0.13)'}
            />
          </div>

          {/* Submit Button */}
          <button
            type='submit'
            disabled={submitting}
            style={{
              padding: '14px',
              background: submitting
                ? 'rgba(102,126,234,0.5)'
                : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: '#fff',
              border: 'none',
              borderRadius: '12px',
              fontSize: '15px',
              fontWeight: 700,
              cursor: submitting ? 'not-allowed' : 'pointer',
              boxShadow: '0 4px 16px rgba(102,126,234,0.35)',
              transition: 'all 0.3s',
              marginBottom: '16px',
              letterSpacing: '0.5px'
            }}
            onMouseEnter={e => {
              if (!submitting) {
                e.currentTarget.style.transform = 'translateY(-2px)'
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(102,126,234,0.45)'
              }
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = '0 4px 16px rgba(102,126,234,0.35)'
            }}
          >
            {submitting ? 'Uploading...' : ' Upload Product'}
          </button>
        </form>
      </div>

      {openFullScreenImage && (
        <DisplayImage onClose={() => setOpenFullScreenImage(false)} imgUrl={fullScreenImage} />
      )}
    </div>
  )
}

export default UploadProduct