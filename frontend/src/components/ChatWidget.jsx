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
  const parts = parseMessage(text)
  return (
    <span style={{ lineHeight: 1.65 }}>
      {parts.map((p, i) =>
        p.type === 'text'
          ? <span key={i}>{p.content}</span>
          : (
            <button
              key={i}
              onClick={() => onNavigate(p.url)}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 4,
                margin: '3px 3px', padding: '4px 11px',
                background: 'rgba(201,168,76,0.1)',
                color: '#c9a84c',
                fontSize: 12, fontWeight: 500,
                border: '0.5px solid rgba(201,168,76,0.35)',
                borderRadius: '20px',
                cursor: 'pointer', fontFamily: 'inherit',
                transition: 'all 0.18s ease',
                verticalAlign: 'middle',
                letterSpacing: '0.02em'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = '#c9a84c'
                e.currentTarget.style.color = '#1a1200'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'rgba(201,168,76,0.1)'
                e.currentTarget.style.color = '#c9a84c'
              }}
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
    text: "Hello! I'm Cartify's assistant. Ask me about products, orders, returns, or anything else 👋",
    time: getTime()
  }])
  const [input, setInput]     = useState('')
  const [loading, setLoading] = useState(false)
  const [unread, setUnread]   = useState(0)
  const messagesEndRef = useRef(null)
  const inputRef       = useRef(null)
  const { isDark, user } = useContext(Context)
  const navigate = useNavigate()

  const gold      = '#c9a84c'
  const goldLight = 'rgba(201,168,76,0.12)'
  const goldBorder= 'rgba(201,168,76,0.35)'

  /* ── Theme tokens ── */
  const bg        = isDark ? '#111110'                   : '#ffffff'
  const surface   = isDark ? '#1a1a18'                   : '#f5f4f1'
  const border    = isDark ? 'rgba(255,255,255,0.08)'    : 'rgba(26,24,20,0.1)'
  const textMain  = isDark ? '#e8e4dc'                   : '#1a1814'
  const muted     = isDark ? 'rgba(160,152,144,0.75)'    : 'rgba(100,96,90,0.8)'
  const userBubbleBg   = gold
  const userBubbleText = '#1a1200'
  const botBubbleBg    = isDark ? '#222220' : '#f0ede8'
  const inputBorder    = isDark ? 'rgba(255,255,255,0.12)' : 'rgba(26,24,20,0.15)'

  const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : '?'

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 120)
      setUnread(0)
    }
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
        text: 'Something went wrong. Please try again.',
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
    text: "Hello! I'm Cartify's assistant. How can I help you today? 👋",
    time: getTime()
  }])

  const suggestions = ['Best mobile under ₹20,000?', 'Return policy?', 'Top airpods?', 'Free delivery?']

  return (
    <>
      <style>{`
        @keyframes cwSlide {
          from { opacity: 0; transform: translateY(16px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0)   scale(1); }
        }
        @keyframes cwBounce {
          0%, 60%, 100% { opacity: 0.35; transform: translateY(0); }
          30%           { opacity: 1;    transform: translateY(-4px); }
        }
        @keyframes cwFabPulse {
          0%, 100% { box-shadow: 0 4px 20px rgba(201,168,76,0.35), 0 0 0 0   rgba(201,168,76,0.25); }
          50%       { box-shadow: 0 4px 20px rgba(201,168,76,0.35), 0 0 0 8px rgba(201,168,76,0); }
        }

        /* ── FAB ── */
        .cw-fab {
          position: fixed; bottom: 28px; right: 28px; z-index: 9999;
          width: 56px; height: 56px; border-radius: 50%;
          background: ${gold}; border: none;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer;
          animation: cwFabPulse 2.8s ease-in-out infinite;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .cw-fab:hover {
          transform: scale(1.06);
          animation: none;
          box-shadow: 0 8px 28px rgba(201,168,76,0.5);
        }
        .cw-fab svg { color: #1a1200; }

        /* ── Unread badge ── */
        .cw-badge {
          position: absolute; top: -3px; right: -3px;
          background: #e24b4a; color: #fff;
          width: 20px; height: 20px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-size: 10px; font-weight: 700;
          border: 2px solid ${isDark ? '#111110' : '#fff'};
          font-family: 'DM Sans', sans-serif;
        }

        /* ── Chat window ── */
        .cw-window {
          position: fixed; bottom: 96px; right: 28px; z-index: 9998;
          width: 375px; height: 560px;
          background: ${bg};
          border: 0.5px solid ${border};
          border-radius: 20px;
          box-shadow: ${isDark
            ? '0 24px 64px rgba(0,0,0,0.65), 0 0 0 0.5px rgba(201,168,76,0.08)'
            : '0 16px 48px rgba(0,0,0,0.13), 0 0 0 0.5px rgba(201,168,76,0.12)'};
          display: flex; flex-direction: column;
          overflow: hidden;
          animation: cwSlide 0.22s ease;
        }

        /* ── Header ── */
        .cw-header {
          padding: 14px 16px;
          background: ${isDark ? '#0e0e0d' : '#ffffff'};
          border-bottom: 0.5px solid ${border};
          display: flex; align-items: center; gap: 11px;
          flex-shrink: 0;
        }
        .cw-header-avatar {
          width: 40px; height: 40px; border-radius: 50%;
          background: ${goldLight};
          border: 1.5px solid ${goldBorder};
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        .cw-header-name {
          font-size: 14px; font-weight: 500;
          color: ${textMain}; margin: 0;
          font-family: 'DM Sans', sans-serif; letter-spacing: 0.01em;
        }
        .cw-header-sub {
          display: flex; align-items: center; gap: 5px; margin-top: 2px;
        }
        .cw-status-dot {
          width: 7px; height: 7px; border-radius: 50%;
          background: #4caf7d;
          box-shadow: 0 0 5px rgba(76,175,125,0.5);
        }
        .cw-status-text {
          font-size: 11px; color: ${muted};
          font-family: 'DM Sans', sans-serif; letter-spacing: 0.02em;
        }
        .cw-clear-btn {
          margin-left: auto;
          background: transparent;
          border: 0.5px solid ${border};
          color: ${muted};
          padding: 5px 12px; font-size: 11px;
          letter-spacing: 0.08em; text-transform: uppercase;
          cursor: pointer; font-family: 'DM Sans', sans-serif;
          border-radius: 20px;
          transition: all 0.18s ease;
        }
        .cw-clear-btn:hover { border-color: ${gold}; color: ${gold}; }

        /* ── Messages ── */
        .cw-messages {
          flex: 1; overflow-y: auto; padding: 16px 14px;
          display: flex; flex-direction: column; gap: 14px;
          scrollbar-width: none; background: ${bg};
        }
        .cw-msg-row {
          display: flex; align-items: flex-end; gap: 8px;
        }
        .cw-msg-row.user { flex-direction: row-reverse; }

        /* Avatar */
        .cw-msg-avatar {
          width: 28px; height: 28px; border-radius: 50%;
          background: ${surface}; border: 0.5px solid ${border};
          display: flex; align-items: center; justify-content: center;
          font-size: 11px; font-weight: 500;
          color: ${muted}; flex-shrink: 0;
          font-family: 'DM Sans', sans-serif;
        }
        .cw-msg-avatar.bot {
          background: ${goldLight}; border-color: ${goldBorder}; color: ${gold};
        }

        /* Bubble wrapper */
        .cw-msg-content {
          max-width: 74%; display: flex; flex-direction: column; gap: 3px;
        }
        .cw-msg-row.user .cw-msg-content { align-items: flex-end; }

        /* Bubble */
        .cw-bubble {
          padding: 10px 14px;
          font-size: 13.5px; line-height: 1.65;
          font-family: 'DM Sans', sans-serif;
          word-break: break-word;
        }
        .cw-bubble.bot {
          background: ${botBubbleBg};
          color: ${textMain};
          border-radius: 4px 18px 18px 18px;
          border: 0.5px solid ${border};
        }
        .cw-bubble.user {
          background: ${userBubbleBg};
          color: ${userBubbleText};
          border-radius: 18px 4px 18px 18px;
          font-weight: 500;
        }

        /* Timestamp */
        .cw-time {
          font-size: 10px; color: ${muted};
          padding: 0 4px; letter-spacing: 0.04em;
          font-family: 'DM Sans', sans-serif;
        }

        /* Typing dots */
        .cw-typing {
          display: flex; align-items: center; gap: 5px;
          padding: 13px 16px;
          background: ${botBubbleBg};
          border: 0.5px solid ${border};
          border-radius: 4px 18px 18px 18px;
          width: fit-content;
        }
        .cw-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: ${muted};
          animation: cwBounce 1.1s infinite;
        }
        .cw-dot:nth-child(2) { animation-delay: 0.18s; }
        .cw-dot:nth-child(3) { animation-delay: 0.36s; }

        /* ── Suggestions ── */
        .cw-chips {
          padding: 10px 14px;
          display: flex; flex-wrap: wrap; gap: 7px;
          border-top: 0.5px solid ${border};
          background: ${bg}; flex-shrink: 0;
        }
        .cw-chip {
          padding: 6px 13px;
          background: transparent;
          border: 0.5px solid ${border};
          color: ${muted};
          font-size: 12px; cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          border-radius: 20px;
          transition: all 0.18s ease;
          letter-spacing: 0.02em; white-space: nowrap;
        }
        .cw-chip:hover { border-color: ${gold}; color: ${gold}; background: ${goldLight}; }

        /* ── Input row ── */
        .cw-input-row {
          padding: 10px 12px 14px;
          border-top: 0.5px solid ${border};
          background: ${isDark ? 'rgba(255,255,255,0.01)' : 'rgba(26,24,20,0.01)'};
          display: flex; gap: 9px; align-items: flex-end; flex-shrink: 0;
        }
        .cw-textarea {
          flex: 1; padding: 10px 15px;
          border: 0.5px solid ${inputBorder};
          background: ${surface};
          color: ${textMain};
          font-size: 13.5px; font-family: 'DM Sans', sans-serif;
          resize: none; outline: none; line-height: 1.5;
          max-height: 80px; overflow-y: auto; scrollbar-width: none;
          transition: border-color 0.2s ease;
          border-radius: 22px;
          letter-spacing: 0.01em;
        }
        .cw-textarea::placeholder { color: ${muted}; }
        .cw-textarea:focus { border-color: ${gold}; }

        /* Send button */
        .cw-send-btn {
          width: 38px; height: 38px; border-radius: 50%;
          border: none; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0; font-size: 16px;
          transition: all 0.2s ease;
        }
        .cw-send-btn.active {
          background: ${gold}; color: #1a1200;
        }
        .cw-send-btn.active:hover {
          transform: scale(1.08);
          box-shadow: 0 4px 14px rgba(201,168,76,0.4);
        }
        .cw-send-btn.inactive {
          background: ${surface}; color: ${muted};
          cursor: not-allowed;
          border: 0.5px solid ${border};
        }

        @media (max-width: 480px) {
          .cw-window { width: calc(100vw - 24px); right: 12px; bottom: 88px; }
          .cw-fab    { bottom: 20px; right: 16px; }
        }
      `}</style>

      {/* ── FAB ── */}
      <div className="cw-fab" onClick={() => setIsOpen(p => !p)} role="button" aria-label="Open chat">
        {isOpen
          ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          ) : (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
            </svg>
          )
        }
        {unread > 0 && !isOpen && (
          <div className="cw-badge">{unread}</div>
        )}
      </div>

      {/* ── Chat window ── */}
      {isOpen && (
        <div className="cw-window">

          {/* Header */}
          <div className="cw-header">
            <div className="cw-header-avatar">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={gold} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="10" rx="2" />
                <path d="M12 3v4M9 7h6" />
                <circle cx="9" cy="16" r="1" fill={gold} stroke="none" />
                <circle cx="15" cy="16" r="1" fill={gold} stroke="none" />
              </svg>
            </div>
            <div style={{ flex: 1 }}>
              <p className="cw-header-name">Cartify Assistant</p>
              <div className="cw-header-sub">
                <div className="cw-status-dot" />
                <span className="cw-status-text">Online · replies instantly</span>
              </div>
            </div>
            <button className="cw-clear-btn" onClick={clearChat}>Clear</button>
          </div>

          {/* Messages */}
          <div className="cw-messages">
            {messages.map((msg, i) => {
              const isBot = msg.role === 'model'
              return (
                <div key={i} className={`cw-msg-row${isBot ? '' : ' user'}`}>
                  <div className={`cw-msg-avatar${isBot ? ' bot' : ''}`}>
                    {isBot ? '◈' : userInitial}
                  </div>
                  <div className="cw-msg-content">
                    <div className={`cw-bubble ${isBot ? 'bot' : 'user'}`}>
                      {isBot
                        ? <MessageContent text={msg.text} onNavigate={handleNavigate} />
                        : msg.text
                      }
                    </div>
                    <span className="cw-time">{msg.time}</span>
                  </div>
                </div>
              )
            })}

            {/* Typing indicator */}
            {loading && (
              <div className="cw-msg-row">
                <div className="cw-msg-avatar bot">◈</div>
                <div className="cw-typing">
                  <div className="cw-dot" />
                  <div className="cw-dot" />
                  <div className="cw-dot" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggestion chips — show only at the start */}
          {messages.length <= 2 && (
            <div className="cw-chips">
              {suggestions.map((s, i) => (
                <button
                  key={i}
                  className="cw-chip"
                  onClick={() => { setInput(s); inputRef.current?.focus() }}
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="cw-input-row">
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
              className={`cw-send-btn ${input.trim() && !loading ? 'active' : 'inactive'}`}
              onClick={handleSend}
              disabled={!input.trim() || loading}
              aria-label="Send message"
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