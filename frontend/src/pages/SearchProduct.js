import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import SummaryApi from '../common'
import VerticalCard from '../components/VerticalCard'

const SearchProduct = () => {
    const query = useLocation()
    const [data,setData] = useState([])
    const [loading,setLoading] = useState(false)

    console.log("query",query.search)

    const fetchProduct = async()=>{
        setLoading(true)
        const response = await fetch(SummaryApi.searchProduct.url+query.search)
        const dataResponse = await response.json()
        setLoading(false)
        setData(dataResponse.data)
    }

    useEffect(()=>{
        fetchProduct()
    },[query])

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '16px 12px' }}>
      <style>{`
        @media (min-width: 640px) { .sp-wrap { padding: 16px 24px !important; } }
        @media (min-width: 1024px) { .sp-wrap { padding: 20px 32px !important; } }
      `}</style>

      {loading && (
        <p style={{ fontSize: '18px', textAlign: 'center', padding: '40px 0', color: '#667eea' }}>
          Loading ...
        </p>
      )}

      <p style={{ fontSize: '16px', fontWeight: 600, margin: '12px 0' }}>
        Search Results : {data.length}
      </p>

      {data.length === 0 && !loading && (
        <p style={{ background: '#fff', fontSize: '16px', textAlign: 'center', padding: '24px 16px', borderRadius: '12px' }}>
          No Data Found....
        </p>
      )}

      {data.length !== 0 && !loading && (
        <VerticalCard loading={loading} data={data} />
      )}
    </div>
  )
}

export default SearchProduct