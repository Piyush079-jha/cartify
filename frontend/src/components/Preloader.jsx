import { useEffect, useRef, useState } from 'react'

// ─── Easing ───────────────────────────────────────────────────────────────────
const eio  = t => t < .5 ? 4*t*t*t : 1 - Math.pow(-2*t+2,3)/2
const eout = t => 1 - Math.pow(1-t, 4)
const ein  = t => t * t * t
const lerp = (a,b,t) => a+(b-a)*t
const clamp = (v,a,b) => Math.min(Math.max(v,a),b)

// ─── Timeline (ms) ────────────────────────────────────────────────────────────
const T = {
  dotAppear:    [0,    600],
  dotBreathe:   [600,  1800],
  dotCrack:     [1800, 2400],
  letterEtch:   [2400, 3800],
  taglineSlide: [3800, 4400],
  shockwave:    [4400, 5000],
  hold:         [5000, 5400],
  exit:         [5400, 5900],
}

function prog(now, key) {
  const [s,e] = T[key]
  return clamp((now-s)/(e-s), 0, 1)
}

// ─── Letter positions for "CARTIFYYYY" ────────────────────────────────────────
const LETTERS = 'CARTIFYYYY'.split('')

// ─── Crack lines radiating from center dot ───────────────────────────────────
const CRACKS = Array.from({length:8},(_,i)=>({
  angle: (i/8)*Math.PI*2 + 0.2,
  length: 35 + Math.random()*25,
  width: 0.4 + Math.random()*0.6,
  opacity: 0.4 + Math.random()*0.5,
}))

// ─── Ambient dust particles ───────────────────────────────────────────────────
const DUST = Array.from({length:60},(_,i)=>({
  x: Math.random(),
  y: Math.random(),
  r: 0.5 + Math.random()*1.5,
  speed: 0.00008 + Math.random()*0.00015,
  phase: Math.random()*Math.PI*2,
  opacity: 0.08 + Math.random()*0.18,
}))

export default function Preloader({ onDone }) {
  const canvasRef     = useRef(null)
  const rafRef        = useRef(null)
  const startRef      = useRef(null)
  const doneRef       = useRef(false)
  const stateRef      = useRef({
    logoVisible: false,
    tagVisible: false,
    exiting: false,
    gone: false,
  })
  const [render, setRender] = useState(true)
  const [overlayOpacity, setOverlayOpacity] = useState(1)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let W = canvas.width  = window.innerWidth
    let H = canvas.height = window.innerHeight

    const onResize = () => {
      W = canvas.width  = window.innerWidth
      H = canvas.height = window.innerHeight
    }
    window.addEventListener('resize', onResize)

    // pre-measure letters at target size
    const FONT_SIZE = Math.min(W * 0.085, 88)
    ctx.font = `100 ${FONT_SIZE}px 'Helvetica Neue', Helvetica, Arial, sans-serif`
    ctx.letterSpacing = `${FONT_SIZE * 0.22}px`

    function draw(ts) {
      if (!startRef.current) startRef.current = ts
      const now = ts - startRef.current
      ctx.clearRect(0,0,W,H)

      const cx = W/2, cy = H/2

      // ── 1. Ambient dust (always) ───────────────────────────────────────────
      DUST.forEach(d => {
        const px = (d.x + Math.sin(ts*d.speed + d.phase)*0.04) * W
        const py = (d.y + Math.cos(ts*d.speed*0.7 + d.phase)*0.03) * H
        ctx.beginPath()
        ctx.arc(px, py, d.r, 0, Math.PI*2)
        ctx.fillStyle = `rgba(160,140,255,${d.opacity})`
        ctx.fill()
      })

      // ── 2. Dot appear ─────────────────────────────────────────────────────
      const dotAppearT = prog(now, 'dotAppear')
      const dotBreatheT = prog(now, 'dotBreathe')
      const dotCrackT   = prog(now, 'dotCrack')

      const breathePulse = Math.sin(ts * 0.0025) * 0.12 + 1
      const baseRadius   = now < T.dotBreathe[0]
        ? lerp(0, 10, eout(dotAppearT))
        : now < T.dotCrack[0]
          ? 10 * breathePulse
          : lerp(10 * breathePulse, 0, eio(dotCrackT))

      const dotAlpha = now < T.dotCrack[0]
        ? eout(dotAppearT)
        : lerp(1, 0, eio(dotCrackT))

      if (baseRadius > 0 && dotAlpha > 0) {
        // outer corona
        for (let ring = 4; ring >= 1; ring--) {
          const rr = baseRadius * (1 + ring * 0.8)
          const g = ctx.createRadialGradient(cx,cy,0,cx,cy,rr)
          g.addColorStop(0, `rgba(180,160,255,${dotAlpha*0.06/ring})`)
          g.addColorStop(1, 'rgba(0,0,0,0)')
          ctx.beginPath(); ctx.arc(cx,cy,rr,0,Math.PI*2)
          ctx.fillStyle = g; ctx.fill()
        }
        // core dot — liquid mercury look
        const g2 = ctx.createRadialGradient(cx-baseRadius*0.3, cy-baseRadius*0.3, 0, cx, cy, baseRadius)
        g2.addColorStop(0,   `rgba(255,255,255,${dotAlpha})`)
        g2.addColorStop(0.4, `rgba(220,210,255,${dotAlpha*0.95})`)
        g2.addColorStop(1,   `rgba(140,100,255,${dotAlpha*0.7})`)
        ctx.beginPath(); ctx.arc(cx,cy,baseRadius,0,Math.PI*2)
        ctx.fillStyle = g2; ctx.fill()
      }

      // ── 3. Crack lines ────────────────────────────────────────────────────
      if (now >= T.dotCrack[0]) {
        const ct = eout(dotCrackT)
        CRACKS.forEach(c => {
          const len = c.length * ct
          ctx.beginPath()
          ctx.moveTo(cx, cy)
          ctx.lineTo(
            cx + Math.cos(c.angle) * len,
            cy + Math.sin(c.angle) * len
          )
          // crack tapers to nothing
          const grad = ctx.createLinearGradient(
            cx, cy,
            cx + Math.cos(c.angle)*len,
            cy + Math.sin(c.angle)*len
          )
          grad.addColorStop(0, `rgba(255,255,255,${c.opacity * ct})`)
          grad.addColorStop(1, 'rgba(255,255,255,0)')
          ctx.strokeStyle = grad
          ctx.lineWidth = c.width
          ctx.stroke()
        })

        // flash at crack moment
        const flashT = clamp(dotCrackT * 5, 0, 1)
        if (flashT < 1) {
          ctx.fillStyle = `rgba(255,255,255,${(1-flashT)*0.12})`
          ctx.fillRect(0,0,W,H)
        }
      }

      // ── 4. Letter etching ─────────────────────────────────────────────────
      if (now >= T.letterEtch[0]) {
        const totalEtch = prog(now, 'letterEtch')
        const fontSize  = Math.min(W * 0.085, 88)
        const tracking  = fontSize * 0.22

        // measure total word width
        ctx.font = `100 ${fontSize}px 'Helvetica Neue', Helvetica, Arial, sans-serif`
        const totalW = LETTERS.reduce((acc, l, i) => {
          ctx.font = `100 ${fontSize}px 'Helvetica Neue', Helvetica, Arial, sans-serif`
          return acc + ctx.measureText(l).width + (i < LETTERS.length-1 ? tracking : 0)
        }, 0)

        let xCursor = cx - totalW/2

        LETTERS.forEach((letter, i) => {
          ctx.font = `100 ${fontSize}px 'Helvetica Neue', Helvetica, Arial, sans-serif`
          const lw = ctx.measureText(letter).width

          // staggered reveal per letter
          const letterStart = i / LETTERS.length
          const letterEnd   = (i+1) / LETTERS.length
          const lt = clamp((totalEtch - letterStart) / (letterEnd - letterStart + 0.3), 0, 1)
          const le = eout(lt)

          // scan line effect: letter reveals top→bottom
          const letterX = xCursor
          const letterY = cy - fontSize * 0.1

          if (le > 0) {
            ctx.save()

            // clip to revealed portion
            const clipH = fontSize * 1.4 * le
            ctx.beginPath()
            ctx.rect(letterX - 4, letterY - fontSize, lw + 8, clipH)
            ctx.clip()

            // letter glow
            ctx.shadowColor = `rgba(180,160,255,${le * 0.8})`
            ctx.shadowBlur  = 18 * le

            // letter gradient — bright at scan line edge
            const lg = ctx.createLinearGradient(0, letterY-fontSize, 0, letterY+fontSize*0.4)
            const scanEdge = lerp(0, 1.4, le) - 0.15
           
const s0 = clamp(scanEdge - 0.05, 0, 1)
const s1 = clamp(scanEdge,         0, 1)
const s2 = clamp(scanEdge + 0.05,  0, 1)

if (s0 > 0)       lg.addColorStop(s0, `rgba(255,255,255,${le})`)
                  lg.addColorStop(s1, `rgba(200,190,255,${le})`)
if (s2 < 1 && s2 > s1) lg.addColorStop(s2, `rgba(160,140,255,${le*0.9})`)
                  lg.addColorStop(1,  `rgba(130,110,230,${le*0.85})`)
            ctx.fillStyle = lg
            ctx.fillText(letter, letterX, letterY)
            ctx.restore()

            // scan line spark at reveal edge
            if (le < 0.98) {
              const sparkY = letterY - fontSize + fontSize*1.4*le
              const sparkG = ctx.createLinearGradient(letterX, sparkY, letterX+lw, sparkY)
              sparkG.addColorStop(0, 'rgba(255,255,255,0)')
              sparkG.addColorStop(0.5, `rgba(220,200,255,${(1-le)*0.9})`)
              sparkG.addColorStop(1, 'rgba(255,255,255,0)')
              ctx.fillStyle = sparkG
              ctx.fillRect(letterX, sparkY-1, lw, 2)
            }
          }

          xCursor += lw + tracking
        })

        // underline that draws itself
        const underT  = clamp((totalEtch - 0.6) / 0.4, 0, 1)
        const underW  = totalW * eout(underT)
        if (underW > 0) {
          const ug = ctx.createLinearGradient(cx-totalW/2, 0, cx-totalW/2+underW, 0)
          ug.addColorStop(0, 'rgba(255,255,255,0.05)')
          ug.addColorStop(0.7, 'rgba(180,160,255,0.5)')
          ug.addColorStop(1, 'rgba(255,255,255,0.9)')
          ctx.fillStyle = ug
          ctx.fillRect(cx - totalW/2, cy + fontSize*0.55, underW, 0.5)
        }
      }

      // ── 5. Tagline ────────────────────────────────────────────────────────
      if (now >= T.taglineSlide[0]) {
        const tt     = eout(prog(now, 'taglineSlide'))
        const fontSize = Math.min(W * 0.085, 88)
        const tagSize  = Math.min(W * 0.013, 13)
        const tagY     = cy + fontSize * 0.95 + lerp(16, 0, tt)

        ctx.save()
        ctx.globalAlpha = tt
        ctx.font = `300 ${tagSize}px 'Helvetica Neue', Helvetica, Arial, sans-serif`
        ctx.fillStyle = 'rgba(180,165,255,0.65)'
        ctx.textAlign = 'center'
        ctx.letterSpacing = `${tagSize * 0.55}px`
        ctx.fillText('SHOP SMARTER. LIVE BETTER.', cx, tagY)
        ctx.restore()
      }

      // ── 6. Shockwave ──────────────────────────────────────────────────────
      if (now >= T.shockwave[0]) {
        const st  = prog(now, 'shockwave')
        const se  = eout(st)
        const maxR = Math.max(W, H) * 0.85

        // 3 rings at staggered delays
        ;[0, 0.12, 0.24].forEach((delay, ri) => {
          const rt = clamp((st - delay) / (1 - delay), 0, 1)
          if (rt <= 0) return
          const re   = eout(rt)
          const r    = re * maxR
          const fade = 1 - re
          const sw   = lerp(2.5, 0.2, re)

          ctx.beginPath()
          ctx.arc(cx, cy, r, 0, Math.PI*2)
          ctx.strokeStyle = `rgba(180,160,255,${fade * (0.7 - ri*0.2)})`
          ctx.lineWidth = sw
          ctx.stroke()
        })
      }

      // ── 7. Exit ───────────────────────────────────────────────────────────
      if (now >= T.exit[0] && !doneRef.current) {
        const et = prog(now, 'exit')
        // scale-up exit — whole canvas content zooms into camera
        ctx.save()
        const sc = lerp(1, 1.06, eio(et))
        ctx.translate(cx*(1-sc), cy*(1-sc))
        ctx.scale(sc, sc)
        ctx.restore()

        const newOp = lerp(1, 0, eio(et))
        setOverlayOpacity(newOp)

        if (et >= 1) {
          doneRef.current = true
          setTimeout(() => { setRender(false); onDone?.() }, 80)
          return
        }
      }

      rafRef.current = requestAnimationFrame(draw)
    }

    rafRef.current = requestAnimationFrame(draw)
    return () => {
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener('resize', onResize)
    }
  }, [])

  if (!render) return null

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      opacity: overlayOpacity,
      transition: overlayOpacity < 0.5 ? 'opacity 0.5s ease' : 'none',
      pointerEvents: overlayOpacity < 0.05 ? 'none' : 'all',
    }}>
      {/* Pure black base */}
      <div style={{ position:'absolute', inset:0, background:'#050407' }} />

      {/* Subtle vignette — corners darker */}
      <div style={{
        position:'absolute', inset:0, pointerEvents:'none',
        background:'radial-gradient(ellipse 80% 70% at 50% 50%, transparent 40%, rgba(0,0,0,0.65) 100%)',
      }} />

      {/* Canvas */}
      <canvas ref={canvasRef} style={{ position:'absolute', inset:0, width:'100%', height:'100%' }} />
    </div>
  )
}