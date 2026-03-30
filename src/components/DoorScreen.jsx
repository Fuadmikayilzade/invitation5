import React, { useState, useRef, useEffect } from 'react'
import './DoorScreen.css'

export default function DoorScreen({ onOpen }) {
  const videoRef = useRef(null)
  const [playing, setPlaying] = useState(false)
  const [hint, setHint] = useState(true)
  const [exiting, setExiting] = useState(false)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    // Force preload on iOS
    video.load()
    const onReady = () => setLoaded(true)
    video.addEventListener('canplaythrough', onReady)
    video.addEventListener('loadeddata', onReady)
    return () => {
      video.removeEventListener('canplaythrough', onReady)
      video.removeEventListener('loadeddata', onReady)
    }
  }, [])

  const handleTap = () => {
    if (exiting) return
    if (!playing) {
      const video = videoRef.current
      if (!video) return
      // iOS requires direct user gesture to play
      const playPromise = video.play()
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // retry once
          video.play().catch(() => {})
        })
      }
      setPlaying(true)
      setHint(false)
    }
  }

  const handleEnded = () => {
    setExiting(true)
    setTimeout(() => onOpen(), 800)
  }

  return (
    <div className={`door-screen ${exiting ? 'exit' : ''}`} onClick={handleTap}>
      <video
        ref={videoRef}
        src="/video.mp4"
        playsInline
        muted
        preload="auto"
        webkit-playsinline="true"
        x-webkit-airplay="allow"
        className="door-video"
        onEnded={handleEnded}
      />
      {/* Loading indicator */}
      {!loaded && (
        <div className="door-loading">
          <div className="door-spinner" />
        </div>
      )}
      {hint && loaded && (
        <div className="door-hint">
          <span className="door-leaf">✿</span>
          <span>Qapıya Toxunun</span>
          <span className="door-leaf">✿</span>
        </div>
      )}
      {hint && !loaded && (
        <div className="door-hint door-hint-loading">
          <span className="door-leaf">✿</span>
          <span>Yüklənir...</span>
          <span className="door-leaf">✿</span>
        </div>
      )}
    </div>
  )
}