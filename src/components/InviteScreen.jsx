import React, { useState, useEffect, useRef } from 'react'
import { mansionDay, mansionNight, couple, dressCode, venue } from '../assets'
import Countdown from './Countdown'
import RSVPCard from './RSVPCard'
import PhotoShare from './PhotoShare'
import VenueSection from './VenueSection'
import './InviteScreen.css'

function useScrollReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.reveal')
    const io = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target) }
      }),
      { threshold: 0.1 }
    )
    els.forEach(el => io.observe(el))
    return () => io.disconnect()
  }, [])
}

export default function InviteScreen() {
  const [dark, setDark] = useState(false)
  const [scratchDone, setScratchDone] = useState(false)
  const [visible, setVisible] = useState(false)
  const canvasRef = useRef(null)
  const drawing = useRef(false)
  const lastPos = useRef(null)
  const totalPx = useRef(0)

  useScrollReveal()

  useEffect(() => { setTimeout(() => setVisible(true), 100) }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight
    totalPx.current = canvas.width * canvas.height
    const g = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
    g.addColorStop(0, '#2d5016')
    g.addColorStop(0.5, '#4a7c2f')
    g.addColorStop(1, '#7ab355')
    ctx.fillStyle = g
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.fillStyle = 'rgba(255,255,255,0.18)'
    ctx.font = 'italic 15px "Cormorant Garamond", serif'
    ctx.textAlign = 'center'
    ctx.fillText('✿  Cızaraq açın  ✿', canvas.width / 2, canvas.height / 2)
  }, [])

  const getPos = (e, canvas) => {
    const r = canvas.getBoundingClientRect()
    const t = e.touches ? e.touches[0] : e
    return { x: (t.clientX - r.left)*(canvas.width/r.width), y: (t.clientY - r.top)*(canvas.height/r.height) }
  }
  const scratch = (e) => {
    e.preventDefault()
    if (!drawing.current) return
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const pos = getPos(e, canvas)
    ctx.globalCompositeOperation = 'destination-out'
    ctx.beginPath()
    if (lastPos.current) ctx.moveTo(lastPos.current.x, lastPos.current.y)
    else ctx.moveTo(pos.x, pos.y)
    ctx.lineTo(pos.x, pos.y)
    ctx.lineWidth = 52; ctx.lineCap = 'round'; ctx.stroke()
    lastPos.current = pos
    const d = ctx.getImageData(0,0,canvas.width,canvas.height).data
    let t = 0
    for (let i = 3; i < d.length; i += 4) if (d[i] < 128) t++
    if (t / totalPx.current > 0.58) setScratchDone(true)
  }
  const startScratch = (e) => { drawing.current = true; lastPos.current = null; scratch(e) }
  const stopScratch = () => { drawing.current = false; lastPos.current = null }

  // Attach touch events with passive:false to allow preventDefault
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const opts = { passive: false }
    canvas.addEventListener('touchstart', startScratch, opts)
    canvas.addEventListener('touchmove', scratch, opts)
    canvas.addEventListener('touchend', stopScratch, opts)
    return () => {
      canvas.removeEventListener('touchstart', startScratch)
      canvas.removeEventListener('touchmove', scratch)
      canvas.removeEventListener('touchend', stopScratch)
    }
  }, [])

  return (
    <div className={`invite ${visible ? 'inv-visible' : ''}`}>

      {/* ── HERO - only image changes with dark/light ── */}
      <section className="hero">
        <div className="hero-img-wrap">
          {/* Images stacked, only opacity changes */}
          <img src={mansionDay}   alt="" className={`hero-img ${!dark ? 'active' : ''}`} />
          <img src={mansionNight} alt="" className={`hero-img night-img ${dark ? 'active' : ''}`} />

          {/* Toggle button - emoji only */}
          <button className="toggle-btn" onClick={() => setDark(d => !d)}>
            {dark ? '☀️' : '🌙'}
          </button>
        </div>

        {/* Hero text - background always light/cream */}
        <div className="hero-text reveal">
          <p className="hero-pre">Toy Dəvətnaməsi</p>
          <h1 className="hero-names">
            <span>Sadiq</span>
            <span className="hero-amp">&amp;</span>
            <span>Ülkər</span>
          </h1>
          <div className="g-divider"><div className="g-diamond" /></div>
          <p className="hero-date">27 May 2026 · Çərşənbə axşamı</p>
          <p className="hero-venue">Ay İşığı Şadlıq Sarayı</p>
        </div>
      </section>

      {/* ── COUNTDOWN ── */}
      <div className="section reveal">
        <Countdown weddingDate="2026-05-27T17:00:00" />
      </div>

      <div className="ornament reveal">✿ ✦ ✿</div>

      {/* ── COUPLE SCRATCH ── */}
      <div className="section reveal">
        <p className="sec-label">Gəlin &amp; Bəy</p>
        <div className="scratch-wrap">
          <img src={couple} alt="Sadiq & Ülkər" className="scratch-bg" />
          <canvas
            ref={canvasRef}
            className={`scratch-canvas ${scratchDone ? 'done' : ''}`}
            onMouseDown={startScratch} onMouseMove={scratch}
            onMouseUp={stopScratch} onMouseLeave={stopScratch}
            
          />
          {scratchDone && <div className="scratch-badge">✿ Xoşbəxt Günlər ✿</div>}
        </div>
      </div>

      <div className="ornament reveal">✿ ✦ ✿</div>

      {/* ── DRESS CODE ── */}
      <div className="section reveal">
        <p className="sec-label">Geyim Kodu</p>
        <div className="dc-card">
          <img src={dressCode} alt="Dress Code" className="dc-img" />
          <div className="dc-info">
            <div className="dc-swatches">
              {['#2d5016','#4a7c2f','#7ab355','#c8e8a8','#d4b06a'].map(c=>(
                <span key={c} className="dc-swatch" style={{background:c}} />
              ))}
            </div>
            <p className="dc-theme">Garden Green Elegance</p>
            <p className="dc-desc">
              Xanımlar: Yaşıl, zeytun, şampan çalarlarında zərif libas<br/>
              Cənablar: Açıq gümüşü-bej kostyum, yaşıl qalstuk
            </p>
            <p className="dc-note">✿ Ağ geyim qəbul edilmir ✿</p>
          </div>
        </div>
      </div>

      <div className="ornament reveal">✿ ✦ ✿</div>

      {/* ── RSVP ── */}
      <div className="reveal">
        <RSVPCard />
      </div>

      <div className="ornament reveal">✿ ✦ ✿</div>

      {/* ── PHOTO SHARE ── */}
      <div className="reveal">
        <PhotoShare />
      </div>

      <div className="ornament reveal">✿ ✦ ✿</div>

      {/* ── VENUE ── */}
      <div className="reveal">
        <VenueSection venueImg={venue} />
      </div>

      {/* ── FOOTER ── */}
      <footer className="footer reveal">
        <div className="g-divider"><div className="g-diamond" /></div>
        <p className="footer-names">Sadiq &amp; Ülkər</p>
        <p className="footer-date">27 · V · MMXXVI</p>
        <p className="footer-sub">Sizinlə bu xoşbəxt günü bölüşmək arzusundayıq</p>
        <div className="footer-deco">✿</div>
      </footer>
    </div>
  )
}