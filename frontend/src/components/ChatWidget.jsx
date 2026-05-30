import React, { useState, useRef, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import Context from '../context'
import SummaryApi from '../common'

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
  const gold = '#c9a84c'
  const parts = parseMessage(text)
  return (
    <span style={{ lineHeight: 1.6 }}>
      {parts.map((p, i) => p.type === 'text'
        ? <span key={i}>{p.content}</span>
        : (
          <button key={i} onClick={() => onNavigate(p.url)} style={{
            display: 'inline-flex', alignItems: 'center', gap: 4,
            margin: '2px 3px', padding: '3px 10px',
            background: 'transparent',
            color: gold, fontSize: 12, fontWeight: 500,
            border: `0.5px solid rgba(201,168,76,0.4)`,
            cursor: 'pointer', fontFamily: 'inherit',
            transition: 'all 0.2s', verticalAlign: 'middle',
            borderRadius: '1px', letterSpacing: '0.04em'
          }}
            onMouseEnter={e => { e.currentTarget.style.background = gold; e.currentTarget.style.color = '#0a0a0a' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = gold }}
          >
            ↗ {p.label}
          </button>
        )
      )}
    </span>
  )
}

const getTime = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

const ChatWidget = () => {
  const [isOpen, setIsOpen]     = useState(false)
  const [messages, setMessages] = useState([{
    role: 'model',
    text: "Hello. I'm Cartify's assistant — ask me about products, orders, returns, or anything else.",
    time: getTime()
  }])
  const [input, setInput]     = useState('')
  const [loading, setLoading] = useState(false)
  const [unread, setUnread]   = useState(0)
  const messagesEndRef = useRef(null)
  const inputRef       = useRef(null)
  const { isDark, user } = useContext(Context)
  const navigate = useNavigate()

  const gold       = '#c9a84c'
  const goldBorder = 'rgba(201,168,76,0.35)'
  const goldBg     = 'rgba(201,168,76,0.07)'

  const windowBg = isDark ? '#111110' : '#faf9f7'
  const border   = isDark ? 'rgba(255,255,255,0.07)' : 'rgba(26,24,20,0.09)'
  const textMain = isDark ? '#e8e4dc' : '#1a1814'
  const muted    = isDark ? 'rgba(160,152,144,0.7)' : 'rgba(130,125,118,0.8)'
  const botBg    = isDark ? '#1a1a18' : '#f0ede8'
  const inputBg  = isDark ? 'rgba(255,255,255,0.03)' : 'rgba(26,24,20,0.03)'

  const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : '?'
  const userHasName = !!user?.name

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
        text: result.success ? result.message : "Sorry, I'm having trouble right now. Please try again.",
        time: getTime()
      }
      setMessages(prev => [...prev, botMsg])
      playPop()
      if (!isOpen) setUnread(prev => prev + 1)
    } catch {
      setMessages(prev => [...prev, {
        role: 'model',
        text: "Something went wrong. Please try again.",
        time: getTime()
      }])
    }
    setLoading(false)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() }
  }

  const clearChat = () => setMessages([{
    role: 'model',
    text: "Hello. I'm Cartify's assistant — how can I help you today?",
    time: getTime()
  }])

  const suggestions = ["Best mobile under ₹20,000?", "Return policy?", "Top airpods?", "Free delivery?"]

  return (
    <>
      <style>{`
        @keyframes cwSlide {
          from { opacity: 0; transform: translateY(20px) scale(0.96); }
          to   { opacity: 1; transform: translateY(0)   scale(1); }
        }
        @keyframes cwBounce {
          0%, 60%, 100% { transform: translateY(0); }
          30%           { transform: translateY(-5px); }
        }
        @keyframes cwPulse {
          0%, 100% { box-shadow: 0 4px 16px rgba(201,168,76,0.25), 0 0 0 0 rgba(201,168,76,0.3); }
          50%       { box-shadow: 0 4px 16px rgba(201,168,76,0.25), 0 0 0 6px rgba(201,168,76,0); }
        }
        .cw-fab {
          position: fixed; bottom: 28px; right: 28px; z-index: 9999;
          width: 52px; height: 52px;
          border: 1px solid ${gold};
          background: ${isDark ? '#111110' : '#ffffff'};
          display: flex; align-items: center; justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
          border-radius: 1px;
          box-shadow: 0 4px 16px rgba(201,168,76,0.25);
          animation: cwPulse 2.5s ease-in-out infinite;
        }
        .cw-fab:hover {
          border-color: ${gold};
          background: ${goldBg};
          transform: translateY(-2px);
          animation: none;
          box-shadow: 0 8px 24px rgba(201,168,76,0.35);
        }
        .cw-textarea {
          flex: 1; padding: 10px 13px;
          border: 0.5px solid ${border};
          background: ${inputBg};
          color: ${textMain};
          font-size: 13px; font-family: 'DM Sans', sans-serif;
          resize: none; outline: none; line-height: 1.55;
          max-height: 80px; overflow-y: auto; scrollbar-width: none;
          transition: border-color 0.2s ease;
          border-radius: 1px;
          letter-spacing: 0.02em;
        }
        .cw-textarea::placeholder { color: ${muted}; }
        .cw-textarea:focus { border-color: ${gold}; }
        .cw-send-btn {
          width: 38px; height: 38px;
          border: 0.5px solid;
          background: transparent;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; font-size: 14px;
          transition: all 0.22s ease;
          flex-shrink: 0; border-radius: 1px;
        }
        .cw-chip {
          padding: 5px 12px;
          background: transparent;
          border: 0.5px solid ${border};
          color: ${muted};
          font-size: 11px; font-weight: 400;
          cursor: pointer; font-family: 'DM Sans', sans-serif;
          transition: all 0.18s ease;
          border-radius: 1px; letter-spacing: 0.04em;
          white-space: nowrap;
        }
        .cw-chip:hover {
          border-color: ${gold};
          color: ${gold};
          background: ${goldBg};
        }
        .cw-clear-btn {
          background: transparent;
          border: 0.5px solid rgba(255,255,255,0.15);
          color: rgba(255,255,255,0.45);
          padding: 5px 12px; font-size: 10px;
          letter-spacing: 0.1em; text-transform: uppercase;
          cursor: pointer; font-family: 'DM Sans', sans-serif;
          transition: all 0.18s ease; border-radius: 1px;
        }
        .cw-clear-btn:hover {
          border-color: rgba(255,255,255,0.35);
          color: rgba(255,255,255,0.8);
        }
      `}</style>

      {/* FAB */}
      <div className="cw-fab" onClick={() => setIsOpen(p => !p)}>
        {isOpen
          ? <span style={{ fontSize: 14, color: muted, fontFamily: 'DM Sans, sans-serif' }}>✕</span>
          : <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"
                stroke={gold} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        }
        {unread > 0 && !isOpen && (
          <div style={{
            position: 'absolute', top: -5, right: -5,
            background: gold, color: '#0a0a0a',
            width: 18, height: 18, borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 9, fontWeight: 700, fontFamily: 'DM Sans, sans-serif'
          }}>
            {unread}
          </div>
        )}
      </div>

      {/* Chat window */}
      {isOpen && (
        <div style={{
          position: 'fixed', bottom: 92, right: 28, zIndex: 9998,
          width: 360, height: 520,
          background: windowBg,
          border: `0.5px solid ${border}`,
          boxShadow: isDark
            ? '0 32px 80px rgba(0,0,0,0.6), 0 0 0 0.5px rgba(201,168,76,0.1)'
            : '0 20px 60px rgba(0,0,0,0.1), 0 0 0 0.5px rgba(201,168,76,0.15)',
          display: 'flex', flexDirection: 'column',
          overflow: 'hidden',
          animation: 'cwSlide 0.25s ease',
          borderRadius: '1px'
        }}>

          {/* Header */}
          <div style={{
            padding: '14px 18px',
            background: '#111110',
            borderBottom: `0.5px solid rgba(201,168,76,0.15)`,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            flexShrink: 0, position: 'relative', overflow: 'hidden'
          }}>
            <div style={{
              position: 'absolute', left: 0, top: 0, bottom: 0,
              width: '2px', background: gold
            }} />

            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{
                width: 36, height: 36,
                border: `0.5px solid ${goldBorder}`,
                background: goldBg,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0, borderRadius: '1px'
              }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <rect x="3" y="11" width="18" height="10" rx="2"
                    stroke={gold} strokeWidth="1.5" strokeLinecap="round" />
                  <path d="M12 3v4M9 7h6" stroke={gold} strokeWidth="1.5" strokeLinecap="round" />
                  <circle cx="9" cy="16" r="1" fill={gold} />
                  <circle cx="15" cy="16" r="1" fill={gold} />
                </svg>
              </div>
              <div>
                <p style={{
                  color: '#e8e4dc', fontWeight: 400, margin: 0,
                  fontSize: 13, letterSpacing: '0.03em',
                  fontFamily: 'DM Sans, sans-serif'
                }}>
                  Cartify Assistant
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 2 }}>
                  <div style={{
                    width: 5, height: 5, borderRadius: '50%',
                    background: '#a8c080',
                    boxShadow: '0 0 4px rgba(168,192,128,0.6)'
                  }} />
                  <span style={{
                    color: 'rgba(255,255,255,0.35)', fontSize: 10,
                    letterSpacing: '0.08em', fontFamily: 'DM Sans, sans-serif'
                  }}>
                    Online
                  </span>
                </div>
              </div>
            </div>
            <button className="cw-clear-btn" onClick={clearChat}>Clear</button>
          </div>

          {/* Messages */}
          <div style={{
            flex: 1, overflowY: 'auto', padding: '14px 14px',
            display: 'flex', flexDirection: 'column', gap: 12,
            scrollbarWidth: 'none', background: windowBg
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
                    width: 28, height: 28, flexShrink: 0,
                    border: `0.5px solid ${isBot ? goldBorder : border}`,
                    background: isBot ? goldBg : (isDark ? 'rgba(255,255,255,0.04)' : 'rgba(26,24,20,0.04)'),
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 11, fontWeight: 500,
                    color: isBot ? gold : muted,
                    borderRadius: '1px', fontFamily: 'DM Sans, sans-serif'
                  }}>
                    {isBot ? '◈' : (userHasName ? userInitial : '?')}
                  </div>

                  {/* Bubble */}
                  <div style={{
                    display: 'flex', flexDirection: 'column',
                    alignItems: isBot ? 'flex-start' : 'flex-end',
                    maxWidth: '78%', gap: 3
                  }}>
                    <div style={{
                      padding: '10px 13px',
                      background: isBot ? botBg : (isDark ? '#1e1c18' : '#1a1814'),
                      color: isBot ? textMain : (isDark ? '#e8e4dc' : '#f5f2ec'),
                      fontSize: 13, lineHeight: 1.65,
                      border: `0.5px solid ${isBot ? border : (isDark ? 'rgba(201,168,76,0.1)' : 'rgba(26,24,20,0.15)')}`,
                      borderRadius: '1px',
                      fontFamily: 'DM Sans, sans-serif',
                      letterSpacing: '0.01em'
                    }}>
                      {isBot
                        ? <MessageContent text={msg.text} onNavigate={handleNavigate} />
                        : msg.text
                      }
                    </div>
                    <span style={{
                      fontSize: 9, color: muted,
                      letterSpacing: '0.06em',
                      fontFamily: 'DM Sans, sans-serif',
                      paddingLeft: 2, paddingRight: 2
                    }}>
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
                  width: 28, height: 28,
                  border: `0.5px solid ${goldBorder}`,
                  background: goldBg,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 11, color: gold, borderRadius: '1px'
                }}>◈</div>
                <div style={{
                  padding: '10px 14px',
                  background: botBg,
                  border: `0.5px solid ${border}`,
                  display: 'flex', gap: 4, alignItems: 'center',
                  borderRadius: '1px'
                }}>
                  {[0, 1, 2].map(j => (
                    <div key={j} style={{
                      width: 5, height: 5, borderRadius: '50%',
                      background: gold, opacity: 0.6,
                      animation: `cwBounce 1s infinite ${j * 0.18}s`
                    }} />
                  ))}
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggestion chips */}
          {messages.length <= 2 && (
            <div style={{
              padding: '0 14px 10px',
              display: 'flex', flexWrap: 'wrap', gap: 5,
              flexShrink: 0, background: windowBg,
              borderTop: `0.5px solid ${border}`
            }}>
              <div style={{ width: '100%', paddingTop: '10px' }} />
              {suggestions.map((s, i) => (
                <button key={i} className="cw-chip"
                  onClick={() => { setInput(s); inputRef.current?.focus() }}>
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div style={{
            padding: '10px 13px 13px',
            borderTop: `0.5px solid ${border}`,
            background: isDark ? 'rgba(255,255,255,0.01)' : 'rgba(26,24,20,0.01)',
            display: 'flex', gap: 8, alignItems: 'flex-end', flexShrink: 0
          }}>
            <textarea
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask anything..."
              rows={1}
              className="cw-textarea"
            />
            <button
              className="cw-send-btn"
              onClick={handleSend}
              disabled={!input.trim() || loading}
              style={{
                borderColor: input.trim() && !loading ? gold : border,
                color: input.trim() && !loading ? gold : muted,
                background: input.trim() && !loading ? goldBg : 'transparent',
                cursor: !input.trim() || loading ? 'not-allowed' : 'pointer'
              }}
              onMouseEnter={e => { if (input.trim() && !loading) { e.currentTarget.style.background = gold; e.currentTarget.style.color = '#0a0a0a' }}}
              onMouseLeave={e => { if (input.trim() && !loading) { e.currentTarget.style.background = goldBg; e.currentTarget.style.color = gold }}}
            >
              ↑
            </button>
          </div>
        </div>
      )}
    </>
  )
}

export default ChatWidget