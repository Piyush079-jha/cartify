import { useEffect, useRef, useState } from 'react'

const lerp  = (a,b,t) => a+(b-a)*t
const clamp = (v,a,b) => Math.min(Math.max(v,a),b)
const eout4 = t => 1 - Math.pow(1-t,4)
const eout2 = t => 1 - Math.pow(1-t,2)
const eio3  = t => t<.5 ? 4*t*t*t : 1-Math.pow(-2*t+2,3)/2
const eback = t => { const c1=1.70158,c3=c1+1; return 1+c3*Math.pow(t-1,3)+c1*Math.pow(t-1,2) }
const eelastic = t => {
  const c4=(2*Math.PI)/3
  return t===0?0:t===1?1:Math.pow(2,-10*t)*Math.sin((t*10-0.75)*c4)+1
}

// Timeline ms
const TL = {
  orbFall:     [0,    900],
  impact:      [900,  1100],
  splash:      [900,  1600],
  lettersRise: [1100, 3000],
  tagline:     [2900, 3500],
  breathe:     [3200, 4400],
  exit:        [4400, 5000],
}

function p(now, key) {
  const [s,e] = TL[key]
  return clamp((now-s)/(e-s),0,1)
}

const WORD = 'CARTIFYYYY'

// Splash droplets — arc outward on impact then fall
const DROPLETS = Array.from({length:24},(_,i)=>{
  const angle = (i/24)*Math.PI*2
  const speed = 0.6 + Math.random()*0.8
  const arc   = 0.3 + Math.random()*0.5
  return { angle, speed, arc, size: 1+Math.random()*2.5, delay: Math.random()*0.15 }
})

// Floating micro-particles (always present, very subtle)
const MOTES = Array.from({length:35},()=>({
  x: Math.random(), y: Math.random(),
  r: 0.4+Math.random()*1.2,
  dx: (Math.random()-.5)*0.00004,
  dy: -0.00005 - Math.random()*0.0001,
  o: 0.04+Math.random()*0.12,
  phase: Math.random()*Math.PI*2,
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

    // Pre-compute letter widths
    const getFontSize = () => clamp(W * 0.072, 38, 82)
    const getTracking = (fs) => fs * 0.28

    function draw(ts) {
      if (!startRef.current) startRef.current = ts
      const now = ts - startRef.current
      ctx.clearRect(0,0,W,H)

      const cx = W/2
      const cy = H/2

      // ─── Motes (floating dust) ─────────────────────────────────────────────
      MOTES.forEach(m => {
        m.x = ((m.x + m.dx + 1) % 1)
        m.y = ((m.y + m.dy + 1) % 1)
        const mx = m.x * W
        const my = m.y * H + Math.sin(ts*0.0008 + m.phase)*8
        ctx.beginPath()
        ctx.arc(mx,my,m.r,0,Math.PI*2)
        ctx.fillStyle = `rgba(190,175,255,${m.o})`
        ctx.fill()
      })

      // ─── Orb falling ──────────────────────────────────────────────────────
      const fallT  = p(now, 'orbFall')
      const impactT = p(now, 'impact')
      const splashT = p(now, 'splash')

      // Floor Y — where orb lands
      const floorY = cy + 8

      // Orb position — accelerates downward (gravity feel)
      const orbStartY = cy - H * 0.42
      const orbY = lerp(orbStartY, floorY, eio3(fallT))

      // Orb shape squishes on impact
      const impactSquish = now >= TL.impact[0]
        ? lerp(1, 0, eout4(impactT))
        : 1
      const orbScaleX = now >= TL.impact[0]
        ? lerp(1, 2.4, eout4(Math.min(impactT*2,1))) *
          lerp(2.4, 1, eout4(Math.max((impactT*2-1),0)))
        : 1
      const orbScaleY = now >= TL.impact[0]
        ? lerp(1, 0.18, eout4(Math.min(impactT*2,1))) *
          lerp(0.18, 0, eout4(Math.max((impactT*2-1),0)))
        : 1

      const orbR = 11
      const orbAlpha = now < TL.splash[1]
        ? clamp(fallT > 0 ? 1 : 0, 0, 1)
        : lerp(1, 0, p(now,'splash'))

      if (orbAlpha > 0 && orbScaleY > 0.01) {
        ctx.save()
        ctx.translate(cx, orbY)
        ctx.scale(orbScaleX, orbScaleY)

        // motion blur trail (only while falling, not on impact)
        if (now < TL.impact[0] && fallT > 0.1) {
          for (let trail=1; trail<=5; trail++) {
            const trailFrac = trail/5
            const trailY = -orbR * 2 * trailFrac * eout2(fallT)
            const trailA = (1-trailFrac) * 0.18 * eout2(fallT)
            ctx.beginPath()
            ctx.ellipse(0, trailY, orbR*(1-trailFrac*0.3), orbR*(1-trailFrac*0.3), 0,0,Math.PI*2)
            ctx.fillStyle = `rgba(220,210,255,${trailA})`
            ctx.fill()
          }
        }

        // orb corona
        const corona = ctx.createRadialGradient(0,0,0,0,0,orbR*3.5)
        corona.addColorStop(0, `rgba(200,185,255,${orbAlpha*0.2})`)
        corona.addColorStop(1, 'rgba(0,0,0,0)')
        ctx.beginPath(); ctx.arc(0,0,orbR*3.5,0,Math.PI*2)
        ctx.fillStyle = corona; ctx.fill()

        // orb core — glassy sphere
        const core = ctx.createRadialGradient(-orbR*0.3,-orbR*0.35,0,0,0,orbR)
        core.addColorStop(0,   `rgba(255,255,255,${orbAlpha})`)
        core.addColorStop(0.35,`rgba(230,220,255,${orbAlpha*0.97})`)
        core.addColorStop(0.75,`rgba(160,130,255,${orbAlpha*0.88})`)
        core.addColorStop(1,   `rgba(100,70,220,${orbAlpha*0.7})`)
        ctx.beginPath(); ctx.arc(0,0,orbR,0,Math.PI*2)
        ctx.fillStyle = core; ctx.fill()

        // specular highlight
        ctx.beginPath()
        ctx.ellipse(-orbR*0.28, -orbR*0.3, orbR*0.22, orbR*0.13, -Math.PI/6, 0, Math.PI*2)
        ctx.fillStyle = `rgba(255,255,255,${orbAlpha*0.75})`
        ctx.fill()

        ctx.restore()
      }

      // ─── Impact ring ──────────────────────────────────────────────────────
      if (now >= TL.impact[0]) {
        const it = eout4(impactT)
        ;[1,2,3].forEach((ri,i) => {
          const delay = i * 0.08
          const rt = clamp((impactT - delay)/(1-delay), 0,1)
          if (rt <= 0) return
          const re = eout4(rt)
          const ringR = re * (80 + i*28)
          const fade  = (1-re) * (0.6 - i*0.15)
          if (fade <= 0) return
          ctx.beginPath()
          ctx.arc(cx, floorY, ringR, 0, Math.PI*2)
          ctx.strokeStyle = `rgba(200,185,255,${fade})`
          ctx.lineWidth   = lerp(2.5-i*0.5, 0.2, re)
          ctx.stroke()
        })

        // floor shimmer
        const shimW = lerp(0, 220, eout4(impactT))
        const shimH = 1.5
        if (shimW > 0) {
          const sg = ctx.createLinearGradient(cx-shimW/2, floorY, cx+shimW/2, floorY)
          sg.addColorStop(0,   'rgba(180,160,255,0)')
          sg.addColorStop(0.35,'rgba(220,205,255,0.55)')
          sg.addColorStop(0.5, 'rgba(255,255,255,0.9)')
          sg.addColorStop(0.65,'rgba(220,205,255,0.55)')
          sg.addColorStop(1,   'rgba(180,160,255,0)')
          ctx.fillStyle = sg
          ctx.fillRect(cx-shimW/2, floorY-shimH/2, shimW, shimH)
        }
      }

      // ─── Splash droplets ──────────────────────────────────────────────────
      if (now >= TL.splash[0]) {
        const st = p(now,'splash')
        DROPLETS.forEach(d => {
          const dt = clamp((st - d.delay)/(1-d.delay), 0,1)
          if (dt <= 0) return
          const de = eout2(dt)
          // arc trajectory
          const dx = Math.cos(d.angle) * d.speed * de * 55
          const dy = Math.sin(d.angle) * d.arc * de * 40
          const gravity = dt * dt * 30
          const dropX = cx + dx
          const dropY = floorY + dy - (1-de)*30 + gravity
          const alpha = (1-dt) * 0.85
          if (alpha <= 0) return
          ctx.beginPath()
          ctx.arc(dropX, dropY, d.size * (1-dt*0.5), 0, Math.PI*2)
          ctx.fillStyle = `rgba(200,185,255,${alpha})`
          ctx.fill()
        })
      }

      // ─── Letters rising ───────────────────────────────────────────────────
      if (now >= TL.lettersRise[0]) {
        const fs  = getFontSize()
        const trk = getTracking(fs)
        const totalEtch = p(now,'lettersRise')

        // measure word
        ctx.font = `200 ${fs}px 'Helvetica Neue', Helvetica, Arial, sans-serif`
        let totalW = 0
        const widths = WORD.split('').map(l => {
          const w = ctx.measureText(l).width
          totalW += w
          return w
        })
        totalW += trk * (WORD.length - 1)
        let xc = cx - totalW/2

        // breathe effect after all letters visible
        const bT    = p(now,'breathe')
        const breatheScale = 1 + Math.sin(ts*0.0018)*0.008*eout4(bT)

        ctx.save()
        ctx.translate(cx, cy+8)
        ctx.scale(breatheScale, breatheScale)
        ctx.translate(-cx, -(cy+8))

        WORD.split('').forEach((letter, i) => {
          const lw = widths[i]
          const lx = xc

          // stagger: each letter has its own progress window
          const window = 0.55
          const start  = (i / WORD.length) * (1 - window)
          const lt     = clamp((totalEtch - start) / window, 0, 1)
          const le     = eelastic(lt)

          if (le > 0) {
            const lyBase = cy + 8
            // rises from below
            const ly = lyBase + lerp(fs*0.8, 0, le)

            ctx.save()
            ctx.globalAlpha = clamp(lt*3, 0, 1)

            // letter glow (soft, not harsh)
            ctx.shadowColor = `rgba(175,155,255,${le * 0.6})`
            ctx.shadowBlur  = 22

            // color: pure white at top, subtle violet tint at stroke
            const lg = ctx.createLinearGradient(0, ly-fs, 0, ly+fs*0.15)
            lg.addColorStop(0,   `rgba(255,255,255,1)`)
            lg.addColorStop(0.6, `rgba(240,235,255,1)`)
            lg.addColorStop(1,   `rgba(195,175,255,0.85)`)

            ctx.font = `200 ${fs}px 'Helvetica Neue', Helvetica, Arial, sans-serif`
            ctx.fillStyle = lg
            ctx.fillText(letter, lx, ly)
            ctx.restore()
          }

          xc += lw + trk
        })

        ctx.restore()

        // underline
        const ulT = clamp((totalEtch-0.85)/0.15,0,1)
        if (ulT > 0) {
          const fs2 = getFontSize()
          const uly = cy + fs2 * 0.22
          const ulW = totalW * eout4(ulT)
          const ug  = ctx.createLinearGradient(cx-totalW/2, uly, cx-totalW/2+ulW, uly)
          ug.addColorStop(0,   'rgba(255,255,255,0.02)')
          ug.addColorStop(0.5, 'rgba(200,185,255,0.4)')
          ug.addColorStop(1,   'rgba(255,255,255,0.7)')
          ctx.fillStyle = ug
          ctx.fillRect(cx-totalW/2, uly, ulW, 0.6)
        }
      }

      // ─── Tagline ──────────────────────────────────────────────────────────
      if (now >= TL.tagline[0]) {
        const tt  = eout4(p(now,'tagline'))
        const bT  = p(now,'breathe')
        const fs  = getFontSize()
        const tfs = clamp(W*0.011, 10, 12.5)
        const tagY = cy + fs*0.55 + lerp(12,0,tt)

        ctx.save()
        ctx.globalAlpha  = tt * 0.55
        ctx.font         = `300 ${tfs}px 'Helvetica Neue', Helvetica, Arial, sans-serif`
        ctx.fillStyle    = 'rgba(200,188,255,1)'
        ctx.textAlign    = 'center'
        ctx.letterSpacing = `${tfs * 0.62}px`
        ctx.fillText('SHOP SMARTER · LIVE BETTER', cx, tagY)
        ctx.restore()
      }

      // ─── Exit ─────────────────────────────────────────────────────────────
      if (now >= TL.exit[0] && !doneRef.current) {
        const et  = p(now,'exit')
        const fee = eio3(et)

        // Full screen fade to black
        ctx.fillStyle = `rgba(5,4,7,${fee})`
        ctx.fillRect(0,0,W,H)

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
      background: '#050407',
    }}>
      {/* Radial vignette */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(ellipse 75% 65% at 50% 50%, transparent 30%, rgba(2,1,6,0.72) 100%)',
      }} />
      <canvas
        ref={canvasRef}
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
      />
    </div>
  )
}