import React, { useState, useRef, useEffect } from 'react'
import DoorScreen from './components/DoorScreen'
import InviteScreen from './components/InviteScreen'
import './styles/App.css'

export default function App() {
  const [screen, setScreen] = useState('door')
  const [transitioning, setTransitioning] = useState(false)
  const [musicPlaying, setMusicPlaying] = useState(false)
  const audioRef = useRef(null)

  // Lock body scroll when door is shown, unlock when invite opens
  useEffect(() => {
    if (screen === 'door') {
      document.body.style.overflow = 'hidden'
      document.body.style.position = 'fixed'
      document.body.style.width = '100%'
      document.body.style.top = '0'
    } else {
      document.body.style.overflow = ''
      document.body.style.position = ''
      document.body.style.width = ''
      document.body.style.top = ''
      // Scroll to top when invite opens
      window.scrollTo(0, 0)
    }
    return () => {
      document.body.style.overflow = ''
      document.body.style.position = ''
      document.body.style.width = ''
      document.body.style.top = ''
    }
  }, [screen])

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
      {screen === 'invite' && <InviteScreen />}

      {/* Music button - App level, truly fixed */}
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