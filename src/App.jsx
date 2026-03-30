import React, { useState, useRef, useEffect } from 'react'
import DoorScreen from './components/DoorScreen'
import InviteScreen from './components/InviteScreen'
import './styles/App.css'

export default function App() {
  const [screen, setScreen] = useState('door')
  const [transitioning, setTransitioning] = useState(false)
  const [musicPlaying, setMusicPlaying] = useState(false)
  const audioRef = useRef(null)

  useEffect(() => {
    audioRef.current = new Audio('/music.mp3')
    audioRef.current.loop = true
    audioRef.current.volume = 0.45
    return () => audioRef.current?.pause()
  }, [])

  const toggleMusic = () => {
    if (musicPlaying) { audioRef.current.pause() }
    else { audioRef.current.play().catch(() => {}) }
    setMusicPlaying(p => !p)
  }

  const handleOpen = () => {
    if (transitioning) return
    setTransitioning(true)
    audioRef.current.play().catch(() => {})
    setMusicPlaying(true)
    setTimeout(() => {
      setScreen('invite')
      setTransitioning(false)
    }, 900)
  }

  return (
    <div className={`app-root ${transitioning ? 'fading' : ''}`}>
      {screen === 'door' && <DoorScreen onOpen={handleOpen} />}
      {screen === 'invite' && (
        <InviteScreen />
      )}

      {/* Music button - at App level, always fixed, never affected by transforms */}
      {screen === 'invite' && (
        <button
          className="app-music-btn"
          onClick={toggleMusic}
          aria-label="Musiqi"
        >
          <span>{musicPlaying ? '♪' : '♩'}</span>
        </button>
      )}
    </div>
  )
}