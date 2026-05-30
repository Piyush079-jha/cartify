import { useEffect, useRef, useState } from 'react'

const lerp   = (a,b,t) => a+(b-a)*t
const clamp  = (v,a,b) => Math.min(Math.max(v,a),b)
const eout4  = t => 1 - Math.pow(1-t,4)
const eout3  = t => 1 - Math.pow(1-t,3)
const eout2  = t => 1 - Math.pow(1-t,2)
const eio3   = t => t<.5 ? 4*t*t*t : 1-Math.pow(-2*t+2,3)/2
const eelastic = t => {
  const c4=(2*Math.PI)/3
  return t===0?0:t===1?1:Math.pow(2,-10*t)*Math.sin((t*10-0.75)*c4)+1
}

// Premium palette — warm platinum + champagne gold
const C = {
  bg:     '#09080C',
  gold:   'rgba(212,185,120,',
  silver: 'rgba(230,226,218,',
  white:  'rgba(255,253,248,',
}

// Timeline ms — deliberate, luxury pacing
const TL = {
  scanLine:   [0,    1200],
  logoReveal: [400,  2600],
  inkBloom:   [300,  1800],
  tagline:    [2500, 3200],
  breathe:    [2800, 4800],
  irisOpen:   [4800, 5600],
}

function p(now, key) {
  const [s,e] = TL[key]
  return clamp((now-s)/(e-s),0,1)
}

const WORD = 'CARTIFY'

// Gold dust motes — ultra-fine, editorial
const MOTES = Array.from({length:55},()=>({
  x: Math.random(), y: Math.random(),
  r: 0.3+Math.random()*0.9,
  dx: (Math.random()-.5)*0.000025,
  dy: -0.00003 - Math.random()*0.00006,
  o: 0.03+Math.random()*0.09,
  gold: Math.random() > 0.6,
  phase: Math.random()*Math.PI*2,
}))

// Ink bloom nodes — appear behind each letter
const BLOOMS = Array.from({length:10},(_,i)=>({
  i,
  r: 18 + Math.random()*12,
  delay: i/10 * 0.4,
}))

export default function Preloader({ onDone }) {
  const canvasRef = useRef(null)
  const rafRef    = useRef(null)
  const startRef  = useRef(null)
  const doneRef   = useRef(false)
  const [gone, setGone] = useState(false)

  useEffect(()=>{
    const cvs = canvasRef.current
    const ctx = cvs.getContext('2d')
    let W = cvs.width  = window.innerWidth
    let H = cvs.height = window.innerHeight

    const onResize = () => {
      W = cvs.width  = window.innerWidth
      H = cvs.height = window.innerHeight
    }
    window.addEventListener('resize', onResize)

    // Seed static grain texture once
    const grain = document.getElementById('preloader-grain')
    if (grain) {
      grain.width  = 256
      grain.height = 256
      const gc = grain.getContext('2d')
      const id = gc.createImageData(256,256)
      for (let k=0;k<id.data.length;k+=4){
        const v = Math.random()*255|0
        id.data[k]=id.data[k+1]=id.data[k+2]=v
        id.data[k+3]=255
      }
      gc.putImageData(id,0,0)
      grain.style.backgroundImage = `url(${grain.toDataURL()})`
      grain.style.backgroundSize  = '256px 256px'
      grain.width=grain.height=0
    }

    function draw(ts) {
      if (!startRef.current) startRef.current = ts
      const now = ts - startRef.current
      ctx.clearRect(0,0,W,H)

      // Deep background
      ctx.fillStyle = C.bg
      ctx.fillRect(0,0,W,H)

      const cx = W/2
      const cy = H/2

      // ─── Gold dust motes ────────────────────────────────────────────────────
      MOTES.forEach(m => {
        m.x = ((m.x + m.dx + 1) % 1)
        m.y = ((m.y + m.dy + 1) % 1)
        const mx = m.x * W
        const my = m.y * H + Math.sin(ts*0.0006 + m.phase)*6
        ctx.beginPath()
        ctx.arc(mx,my,m.r,0,Math.PI*2)
        const col = m.gold ? C.gold : C.silver
        ctx.fillStyle = col + m.o + ')'
        ctx.fill()
      })

      // ─── Scan line — cinematic horizontal sweep ──────────────────────────
      const slT = p(now,'scanLine')
      if (slT > 0 && slT < 1) {
        const se = eio3(slT)
        const sx = -W*0.1 + se * W * 1.2
        const sg = ctx.createLinearGradient(sx-120,0,sx+120,0)
        sg.addColorStop(0,   C.gold+'0)')
        sg.addColorStop(0.3, C.gold+'0.12)')
        sg.addColorStop(0.5, C.white+'0.9)')
        sg.addColorStop(0.7, C.gold+'0.12)')
        sg.addColorStop(1,   C.gold+'0)')
        ctx.fillStyle = sg
        ctx.fillRect(sx-120, 0, 240, H)
        // thin bright line
        ctx.fillStyle = C.white+'0.8)'
        ctx.fillRect(sx-0.5, 0, 1, H)
      }

      // ─── Logo reveal — ink diffusion per letter ──────────────────────────
      const fs    = clamp(W * 0.072, 38, 82)
      const trk   = fs * 0.26
      const lrT   = p(now,'logoReveal')

      ctx.font = `100 ${fs}px 'Helvetica Neue', Helvetica, Arial, sans-serif`
      let totalW = 0
      const widths = WORD.split('').map(l => {
        const w = ctx.measureText(l).width
        totalW += w
        return w
      })
      totalW += trk * (WORD.length - 1)
      let xc = cx - totalW/2

      // breathe
      const bT = p(now,'breathe')
      const breatheScale = 1 + Math.sin(ts*0.0014)*0.006*eout4(bT)

      ctx.save()
      ctx.translate(cx, cy)
      ctx.scale(breatheScale, breatheScale)
      ctx.translate(-cx, -cy)

      WORD.split('').forEach((letter, i) => {
        const lw    = widths[i]
        const lx    = xc
        const win   = 0.52
        const start = (i / WORD.length) * (1 - win)
        const lt    = clamp((lrT - start) / win, 0, 1)
        const le    = eout3(lt)

        if (le > 0) {
          const ly = cy + fs * 0.36

          // ink bloom glow behind letter
          const bloomR = BLOOMS[i % BLOOMS.length].r
          const bloomA = Math.sin(lt * Math.PI) * 0.18
          if (bloomA > 0) {
            const bg2 = ctx.createRadialGradient(
              lx+lw/2, ly-fs*0.3, 0,
              lx+lw/2, ly-fs*0.3, bloomR*2.5
            )
            bg2.addColorStop(0, C.gold + bloomA + ')')
            bg2.addColorStop(1, C.gold + '0)')
            ctx.fillStyle = bg2
            ctx.beginPath()
            ctx.arc(lx+lw/2, ly-fs*0.3, bloomR*2.5, 0, Math.PI*2)
            ctx.fill()
          }

          ctx.save()
          const driftY = lerp(fs*0.35, 0, le)
          ctx.translate(0, driftY)
          ctx.globalAlpha = clamp(lt*2.5, 0, 1)

          // warm top → cool base gradient
          const lg = ctx.createLinearGradient(0, ly-fs*0.9, 0, ly+fs*0.1)
          lg.addColorStop(0,   C.white +'1)')
          lg.addColorStop(0.5, C.silver+'1)')
          lg.addColorStop(1,   C.gold  +'0.65)')

          ctx.font      = `100 ${fs}px 'Helvetica Neue', Helvetica, Arial, sans-serif`
          ctx.fillStyle = lg
          ctx.fillText(letter, lx, ly)
          ctx.restore()
        }

        xc += lw + trk
      })

      // hairline gold underbar
      const ulT = clamp((lrT-0.9)/0.1, 0, 1)
      if (ulT > 0) {
        const uly = cy + fs * 0.52
        const ulW = totalW * eout4(ulT)
        const ulg = ctx.createLinearGradient(cx-totalW/2, uly, cx-totalW/2+ulW, uly)
        ulg.addColorStop(0,    C.gold +'0)')
        ulg.addColorStop(0.4,  C.gold +'0.6)')
        ulg.addColorStop(0.75, C.gold +'1)')
        ulg.addColorStop(1,    C.white+'0.9)')
        ctx.fillStyle = ulg
        ctx.fillRect(cx-totalW/2, uly, ulW, 0.75)
      }

      ctx.restore()

      // ─── Tagline — spaced platinum caps ─────────────────────────────────
      if (now >= TL.tagline[0]) {
        const tt  = eout4(p(now,'tagline'))
        const tfs = clamp(W*0.0095, 9, 11)
        const tagY = cy + fs*0.85 + lerp(10,0,tt)

        ctx.save()
        ctx.globalAlpha   = tt * 0.45
        ctx.font          = `300 ${tfs}px 'Helvetica Neue', Helvetica, Arial, sans-serif`
        ctx.fillStyle     = C.silver+'1)'
        ctx.textAlign     = 'center'
        ctx.letterSpacing = `${tfs * 0.85}px`
        ctx.fillText('SHOP SMARTER  ·  LIVE BETTER', cx, tagY)
        ctx.restore()
      }

      // ─── Iris wipe exit ──────────────────────────────────────────────────
      if (now >= TL.irisOpen[0]) {
        const et  = p(now,'irisOpen')
        const fee = eio3(et)

        const irisR = lerp(Math.max(W,H)*0.85, 0, fee)
        if (irisR > 0) {
          ctx.save()
          ctx.fillStyle = C.bg
          ctx.beginPath()
          ctx.rect(0,0,W,H)
          ctx.arc(cx, cy, irisR, 0, Math.PI*2, true)
          ctx.fill('evenodd')

          // gold ring at iris edge
          ctx.beginPath()
          ctx.arc(cx, cy, irisR, 0, Math.PI*2)
          ctx.strokeStyle = C.gold + clamp(1-fee*2, 0, 0.7) + ')'
          ctx.lineWidth   = 1
          ctx.stroke()
          ctx.restore()
        } else {
          ctx.fillStyle = C.bg
          ctx.fillRect(0,0,W,H)
        }

        if (et >= 1) {
          doneRef.current = true
          setGone(true)
          onDone?.()
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

  if (gone) return null

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      pointerEvents: 'all',
      background: C.bg,
    }}>
      {/* Deep vignette */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(ellipse 60% 55% at 50% 50%, transparent 20%, rgba(9,8,12,0.85) 100%)',
      }} />
      {/* Film grain overlay */}
      <canvas id="preloader-grain" style={{
        position: 'absolute', inset: 0, width: '100%', height: '100%',
        opacity: 0.055, pointerEvents: 'none', imageRendering: 'pixelated',
      }} />
      <canvas
        ref={canvasRef}
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
      />
    </div>
  )
}