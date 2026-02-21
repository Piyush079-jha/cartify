import React, { useState, useRef, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import Context from '../context'
import SummaryApi from '../common'

// Sound helpers
const playPop = () => {
    try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)()
        const o = ctx.createOscillator(), g = ctx.createGain()
        o.connect(g); g.connect(ctx.destination)
        o.type = 'sine'
        o.frequency.setValueAtTime(600, ctx.currentTime)
        o.frequency.exponentialRampToValueAtTime(900, ctx.currentTime + 0.08)
        g.gain.setValueAtTime(0.18, ctx.currentTime)
        g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25)
        o.start(ctx.currentTime); o.stop(ctx.currentTime + 0.25)
    } catch {}
}

const playSend = () => {
    try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)()
        const o = ctx.createOscillator(), g = ctx.createGain()
        o.connect(g); g.connect(ctx.destination)
        o.type = 'sine'
        o.frequency.setValueAtTime(400, ctx.currentTime)
        o.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.1)
        g.gain.setValueAtTime(0.12, ctx.currentTime)
        g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2)
        o.start(ctx.currentTime); o.stop(ctx.currentTime + 0.2)
    } catch {}
}

// Parse [label](/product/id) links
const parseMessage = (text) => {
    const regex = /\[([^\]]+)\]\((\/product\/[^)]+)\)/g
    const parts = []; let lastIndex = 0, match
    while ((match = regex.exec(text)) !== null) {
        if (match.index > lastIndex) parts.push({ type: 'text', content: text.slice(lastIndex, match.index) })
        parts.push({ type: 'link', label: match[1], url: match[2] })
        lastIndex = match.index + match[0].length
    }
    if (lastIndex < text.length) parts.push({ type: 'text', content: text.slice(lastIndex) })
    return parts
}

const MessageContent = ({ text, onNavigate }) => {
    const parts = parseMessage(text)
    return (
        <span style={{ lineHeight: 1.6 }}>
            {parts.map((p, i) => p.type === 'text'
                ? <span key={i}>{p.content}</span>
                : (
                    <button key={i} onClick={() => onNavigate(p.url)} style={{
                        display: 'inline-flex', alignItems: 'center', gap: 4,
                        margin: '2px 3px', padding: '4px 12px', borderRadius: 20,
                        background: 'linear-gradient(135deg,#667eea,#a78bfa)',
                        color: '#fff', fontSize: 12, fontWeight: 700,
                        border: 'none', cursor: 'pointer', fontFamily: 'inherit',
                        boxShadow: '0 2px 8px rgba(102,126,234,0.35)',
                        transition: 'all 0.2s', verticalAlign: 'middle'
                    }}
                        onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 4px 14px rgba(102,126,234,0.5)' }}
                        onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(102,126,234,0.35)' }}
                    >🛒 {p.label}</button>
                )
            )}
        </span>
    )
}

const getTime = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

// Main Component 
const ChatWidget = () => {
    const [isOpen, setIsOpen]     = useState(false)
    const [messages, setMessages] = useState([{
        role: 'model',
        text: "👋 Hi! I'm Cartify's AI assistant. I can help you find products, answer questions about orders, returns, and more. How can I help you today?",
        time: getTime()
    }])
    const [input, setInput]   = useState('')
    const [loading, setLoading] = useState(false)
    const [unread, setUnread]   = useState(0)
    const messagesEndRef = useRef(null)
    const inputRef       = useRef(null)
    const { isDark, user } = useContext(Context)
    const navigate = useNavigate()

    useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])
    useEffect(() => {
        if (isOpen) { setTimeout(() => inputRef.current?.focus(), 100); setUnread(0) }
    }, [isOpen])

    const handleNavigate = (url) => { navigate(url); setIsOpen(false) }

    const handleSend = async () => {
        const trimmed = input.trim()
        if (!trimmed || loading) return
        playSend()
        const userMsg = { role: 'user', text: trimmed, time: getTime() }
        const updated = [...messages, userMsg]
        setMessages(updated)
        setInput('')
        setLoading(true)
        try {
            const history = updated.slice(1, -1).map(m => ({ role: m.role, text: m.text }))
            const res = await fetch(SummaryApi.chat.url, {
                method: SummaryApi.chat.method,
                headers: { 'content-type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ message: trimmed, history })
            })
            const result = await res.json()
            const botMsg = {
                role: 'model',
                text: result.success ? result.message : "Sorry, I'm having trouble right now. Please try again!",
                time: getTime()
            }
            setMessages(prev => [...prev, botMsg])
            playPop()
            if (!isOpen) setUnread(prev => prev + 1)
        } catch {
            setMessages(prev => [...prev, { role: 'model', text: "Oops! Something went wrong. Please try again.", time: getTime() }])
        }
        setLoading(false)
    }

    const handleKeyDown = (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() } }

    const clearChat = () => setMessages([{
        role: 'model',
        text: "👋 Hi! I'm Cartify's AI assistant. How can I help you today?",
        time: getTime()
    }])

    const suggestions = ["Best mobile under ₹20,000?", "Return policy?", "Top airpods?", "Free delivery?"]

    //  Theme 
    const windowBg   = isDark ? '#1f1f2e' : '#ffffff'
    const headerBg   = isDark
        ? 'linear-gradient(135deg,#2d2b55 0%,#1e1b45 100%)'
        : 'linear-gradient(135deg,#667eea 0%,#a78bfa 100%)'
    const border     = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(102,126,234,0.15)'
    const inputBg    = isDark ? '#2a2a3d' : '#f4f4ff'
    const inputBorder= isDark ? 'rgba(255,255,255,0.1)' : 'rgba(102,126,234,0.25)'
    const textMain   = isDark ? '#e8e8f8' : '#1a1a2e'
    const timeTxt    = isDark ? 'rgba(255,255,255,0.28)' : 'rgba(80,80,140,0.45)'
    const botBg      = isDark ? '#2a2a3d' : '#f0f0ff'
    const botTxt     = isDark ? '#e8e8f8' : '#1a1a2e'
    const userBg     = 'linear-gradient(135deg,#667eea 0%,#a78bfa 100%)'

    const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : '?'
    const userHasName = !!user?.name

    return (
        <>
            {/* Floating Button  */}
            <div onClick={() => setIsOpen(p => !p)} style={{
                position: 'fixed', bottom: 28, right: 28, zIndex: 9999,
                width: 62, height: 62, borderRadius: '50%',
                background: 'linear-gradient(135deg,#667eea 0%,#a78bfa 100%)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '0 8px 32px rgba(102,126,234,0.5), 0 2px 8px rgba(0,0,0,0.15)',
                transition: 'all 0.35s cubic-bezier(0.4,0,0.2,1)',
                transform: isOpen ? 'scale(0.88) rotate(90deg)' : 'scale(1)'
            }}
                onMouseEnter={e => { if (!isOpen) e.currentTarget.style.transform = 'scale(1.12)' }}
                onMouseLeave={e => { e.currentTarget.style.transform = isOpen ? 'scale(0.88) rotate(90deg)' : 'scale(1)' }}
            >
                <span style={{ fontSize: 26 }}>{isOpen ? '✕' : '💬'}</span>
                {unread > 0 && !isOpen && (
                    <div style={{
                        position: 'absolute', top: -4, right: -4,
                        background: 'linear-gradient(135deg,#f093fb,#f5576c)',
                        color: '#fff', width: 20, height: 20, borderRadius: '50%',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 11, fontWeight: 700,
                        boxShadow: '0 2px 8px rgba(245,87,108,0.5)'
                    }}>{unread}</div>
                )}
            </div>

            {/*Chat Window  */}
            {isOpen && (
                <div style={{
                    position: 'fixed', bottom: 104, right: 28, zIndex: 9998,
                    width: 370, height: 540,
                    background: windowBg, borderRadius: 28,
                    boxShadow: isDark
                        ? '0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.06)'
                        : '0 32px 80px rgba(102,126,234,0.2), 0 0 0 1px rgba(102,126,234,0.12)',
                    display: 'flex', flexDirection: 'column',
                    overflow: 'hidden', animation: 'chatSlide 0.3s cubic-bezier(0.4,0,0.2,1)'
                }}>

                    {/* Header */}
                    <div style={{
                        padding: '16px 20px', background: headerBg,
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        flexShrink: 0
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            <div style={{
                                width: 46, height: 46, borderRadius: '50%',
                                background: 'rgba(255,255,255,0.22)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: 24, border: '2.5px solid rgba(255,255,255,0.4)',
                                boxShadow: '0 4px 14px rgba(0,0,0,0.15)'
                            }}>🤖</div>
                            <div>
                                <p style={{ color: '#fff', fontWeight: 800, margin: 0, fontSize: 15, letterSpacing: '-0.3px' }}>
                                    Cartify Assistant
                                </p>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 3 }}>
                                    <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#4ade80', boxShadow: '0 0 6px #4ade80' }} />
                                    <span style={{ color: 'rgba(255,255,255,0.85)', fontSize: 11.5, fontWeight: 500 }}>
                                        Always here for you
                                    </span>
                                </div>
                            </div>
                        </div>
                        <button onClick={clearChat} style={{
                            background: 'rgba(255,255,255,0.18)',
                            border: '1px solid rgba(255,255,255,0.3)',
                            color: '#fff', borderRadius: 10, padding: '5px 13px',
                            fontSize: 12, fontWeight: 600, cursor: 'pointer',
                            transition: 'all 0.2s', fontFamily: 'inherit'
                        }}
                            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.3)'}
                            onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.18)'}
                        >Clear</button>
                    </div>

                    {/*  Messages  */}
                    <div style={{
                        flex: 1, overflowY: 'auto', padding: '16px 14px',
                        display: 'flex', flexDirection: 'column', gap: 14,
                        scrollbarWidth: 'none'
                    }}>
                        {messages.map((msg, i) => {
                            const isBot = msg.role === 'model'
                            return (
                                <div key={i} style={{
                                    display: 'flex',
                                    flexDirection: isBot ? 'row' : 'row-reverse',
                                    alignItems: 'flex-end', gap: 8
                                }}>
                                    {/* Avatar */}
                                    <div style={{
                                        width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
                                        background: isBot
                                            ? 'linear-gradient(135deg,#667eea,#a78bfa)'
                                            : 'linear-gradient(135deg,#f093fb,#f5576c)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontSize: isBot ? 15 : 13, fontWeight: 700, color: '#fff',
                                        boxShadow: isBot
                                            ? '0 2px 8px rgba(102,126,234,0.4)'
                                            : '0 2px 8px rgba(245,87,108,0.4)',
                                        border: '2px solid rgba(255,255,255,0.25)'
                                    }}>
                                        {isBot ? '🤖' : (userHasName ? userInitial : '👤')}
                                    </div>

                                    {/* Bubble + timestamp */}
                                    <div style={{
                                        display: 'flex', flexDirection: 'column',
                                        alignItems: isBot ? 'flex-start' : 'flex-end',
                                        maxWidth: '76%', gap: 4
                                    }}>
                                        <div style={{
                                            padding: '11px 15px',
                                            borderRadius: isBot ? '18px 18px 18px 4px' : '18px 18px 4px 18px',
                                            background: isBot ? botBg : userBg,
                                            color: isBot ? botTxt : '#fff',
                                            fontSize: 13.5, lineHeight: 1.58,
                                            boxShadow: isBot
                                                ? (isDark ? '0 2px 10px rgba(0,0,0,0.3)' : '0 2px 12px rgba(102,126,234,0.1)')
                                                : '0 4px 14px rgba(102,126,234,0.3)',
                                            border: isBot
                                                ? (isDark ? '1px solid rgba(255,255,255,0.07)' : '1px solid rgba(102,126,234,0.15)')
                                                : 'none'
                                        }}>
                                            {isBot
                                                ? <MessageContent text={msg.text} onNavigate={handleNavigate} />
                                                : msg.text
                                            }
                                        </div>
                                        <span style={{ fontSize: 10, color: timeTxt, fontWeight: 500, paddingLeft: 4, paddingRight: 4 }}>
                                            {msg.time}
                                        </span>
                                    </div>
                                </div>
                            )
                        })}

                        {/* Typing dots */}
                        {loading && (
                            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8 }}>
                                <div style={{
                                    width: 32, height: 32, borderRadius: '50%',
                                    background: 'linear-gradient(135deg,#667eea,#a78bfa)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: 15, border: '2px solid rgba(255,255,255,0.25)',
                                    boxShadow: '0 2px 8px rgba(102,126,234,0.4)'
                                }}>🤖</div>
                                <div style={{
                                    padding: '12px 16px', borderRadius: '18px 18px 18px 4px',
                                    background: botBg, display: 'flex', gap: 5, alignItems: 'center',
                                    border: isDark ? '1px solid rgba(255,255,255,0.07)' : '1px solid rgba(102,126,234,0.15)',
                                    boxShadow: isDark ? '0 2px 10px rgba(0,0,0,0.3)' : '0 2px 12px rgba(102,126,234,0.1)'
                                }}>
                                    {[0, 1, 2].map(j => (
                                        <div key={j} style={{
                                            width: 8, height: 8, borderRadius: '50%',
                                            background: 'linear-gradient(135deg,#667eea,#a78bfa)',
                                            animation: `bounce 1s infinite ${j * 0.18}s`
                                        }} />
                                    ))}
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Suggestion chips */}
                    {messages.length <= 2 && (
                        <div style={{ padding: '0 14px 10px', display: 'flex', flexWrap: 'wrap', gap: 6, flexShrink: 0 }}>
                            {suggestions.map((s, i) => (
                                <button key={i} onClick={() => { setInput(s); inputRef.current?.focus() }} style={{
                                    padding: '6px 13px', borderRadius: 20, fontSize: 11.5, fontWeight: 600,
                                    cursor: 'pointer', fontFamily: 'inherit',
                                    background: isDark ? 'rgba(102,126,234,0.15)' : 'rgba(102,126,234,0.08)',
                                    color: '#667eea', border: '1.5px solid rgba(102,126,234,0.25)',
                                    transition: 'all 0.2s'
                                }}
                                    onMouseEnter={e => { e.currentTarget.style.background = 'linear-gradient(135deg,#667eea,#a78bfa)'; e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = 'transparent' }}
                                    onMouseLeave={e => { e.currentTarget.style.background = isDark ? 'rgba(102,126,234,0.15)' : 'rgba(102,126,234,0.08)'; e.currentTarget.style.color = '#667eea'; e.currentTarget.style.borderColor = 'rgba(102,126,234,0.25)' }}
                                >{s}</button>
                            ))}
                        </div>
                    )}

                    {/* Input*/}
                    <div style={{
                        padding: '12px 14px 16px',
                        borderTop: `1px solid ${border}`,
                        background: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(102,126,234,0.02)',
                        display: 'flex', gap: 10, alignItems: 'flex-end', flexShrink: 0
                    }}>
                        <textarea
                            ref={inputRef}
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Ask me anything..."
                            rows={1}
                            style={{
                                flex: 1, padding: '11px 15px', borderRadius: 16,
                                border: `1.5px solid ${inputBorder}`,
                                background: inputBg, color: textMain,
                                fontSize: 13.5, fontFamily: 'inherit',
                                resize: 'none', outline: 'none', lineHeight: 1.5,
                                maxHeight: 80, overflowY: 'auto', scrollbarWidth: 'none',
                                transition: 'border 0.2s, box-shadow 0.2s'
                            }}
                            onFocus={e => { e.target.style.border = '1.5px solid #667eea'; e.target.style.boxShadow = '0 0 0 3px rgba(102,126,234,0.12)' }}
                            onBlur={e => { e.target.style.border = `1.5px solid ${inputBorder}`; e.target.style.boxShadow = 'none' }}
                        />
                        <button onClick={handleSend} disabled={!input.trim() || loading} style={{
                            width: 44, height: 44, borderRadius: 14, border: 'none',
                            background: !input.trim() || loading
                                ? (isDark ? 'rgba(255,255,255,0.08)' : '#ebebff')
                                : 'linear-gradient(135deg,#667eea 0%,#a78bfa 100%)',
                            color: !input.trim() || loading ? (isDark ? '#555' : '#aaa') : '#fff',
                            cursor: !input.trim() || loading ? 'not-allowed' : 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: 18, transition: 'all 0.25s', flexShrink: 0,
                            boxShadow: !input.trim() || loading ? 'none' : '0 4px 14px rgba(102,126,234,0.4)'
                        }}
                            onMouseEnter={e => { if (input.trim() && !loading) e.currentTarget.style.transform = 'scale(1.08)' }}
                            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                        >➤</button>
                    </div>
                </div>
            )}

            <style>{`
                @keyframes chatSlide {
                    from { opacity: 0; transform: translateY(24px) scale(0.94); }
                    to   { opacity: 1; transform: translateY(0) scale(1); }
                }
                @keyframes bounce {
                    0%, 60%, 100% { transform: translateY(0); }
                    30%           { transform: translateY(-7px); }
                }
            `}</style>
        </>
    )
}

export default ChatWidget