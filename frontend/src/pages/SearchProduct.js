import React, { useEffect, useState } from 'react'
import { useLocation, useOutletContext } from 'react-router-dom'
import SummaryApi from '../common'
import VerticalCard from '../components/VerticalCard'

const SearchProduct = () => {
    const query = useLocation()
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)

    const { isDark = false } = useOutletContext() || {}

    const text   = isDark ? '#e8e4dc' : '#1a1814'
    const muted  = isDark ? '#555'    : '#aaa'
    const border = isDark ? 'rgba(255,255,255,0.07)' : 'rgba(26,24,20,0.09)'
    const gold   = '#c9a84c'

    console.log("query", query.search)

    const fetchProduct = async () => {
        setLoading(true)
        const response = await fetch(SummaryApi.searchProduct.url + query.search)
        const dataResponse = await response.json()
        setLoading(false)
        setData(dataResponse.data)
    }

    useEffect(() => { fetchProduct() }, [query])

    return (
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '32px 28px', minHeight: '60vh' }}>
            <style>{`
                @media (max-width: 768px) { .sp-wrap { padding: 20px 16px !important; } }
                @keyframes fadeIn { from { opacity:0; transform:translateY(6px); } to { opacity:1; transform:translateY(0); } }
            `}</style>

            {/* Header row */}
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '16px', marginBottom: '20px' }}>
                <h1 style={{ fontSize: '18px', fontWeight: 300, color: text, margin: 0, letterSpacing: '0.01em', fontFamily: 'Georgia, "Times New Roman", serif' }}>
                    Search Results
                </h1>
                <div style={{ width: '1px', height: '16px', background: border }} />
                {!loading && (
                    <span style={{ fontSize: '10px', letterSpacing: '0.12em', textTransform: 'uppercase', color: muted, fontFamily: 'DM Sans, -apple-system, sans-serif' }}>
                        {data.length} items
                    </span>
                )}
            </div>
            <div style={{ height: '0.5px', background: border, marginBottom: '28px' }} />

            {/* Loading */}
            {loading && (
                <p style={{ fontSize: '11px', letterSpacing: '0.14em', textTransform: 'uppercase', color: muted, fontFamily: 'DM Sans, sans-serif', textAlign: 'center', padding: '60px 0' }}>
                    Searching...
                </p>
            )}

            {/* Empty state */}
            {data.length === 0 && !loading && (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '40vh', gap: '16px', animation: 'fadeIn 0.3s ease' }}>
                    <div style={{ fontSize: '11px', letterSpacing: '0.14em', textTransform: 'uppercase', color: muted, fontFamily: 'DM Sans, sans-serif' }}>No results found</div>
                    <div style={{ width: '32px', height: '0.5px', background: border }} />
                    <div style={{ fontSize: '11px', color: muted, fontFamily: 'DM Sans, sans-serif' }}>Try a different search term</div>
                </div>
            )}

            {/* Results */}
            {data.length !== 0 && !loading && (
                <div style={{ animation: 'fadeIn 0.3s ease' }}>
                    <VerticalCard loading={loading} data={data} isDark={isDark} />
                </div>
            )}
        </div>
    )
}

export default SearchProduct