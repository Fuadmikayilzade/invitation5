import React, { useState, useRef, useEffect } from 'react'
import './DoorScreen.css'

export default function DoorScreen({ onOpen }) {
  const videoRef = useRef(null)
  const [playing, setPlaying] = useState(false)
  const [hint, setHint] = useState(true)
  const [exiting, setExiting] = useState(false)

  const handleTap = () => {
    if (exiting) return
    if (!playing) {
      videoRef.current?.play()
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
        className="door-video"
        onEnded={handleEnded}
      />
      {hint && (
        <div className="door-hint">
          <span className="door-leaf">✿</span>
          <span>Qapıya Toxunun</span>
          <span className="door-leaf">✿</span>
        </div>
      )}
    </div>
  )
}