import { useRef } from 'react'
import { gsap } from 'gsap'
import VSigilEngine from './VSigilEngine'
import TattooCursor from './TattooCursor'

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLDivElement>(null)

  const handleSigilClick = () => {
    // Scroll to next section
    const nextSection = document.querySelector('section:nth-of-type(2)')
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section
      ref={containerRef}
      className="relative h-screen flex items-center justify-center overflow-hidden bg-black"
    >
      {/* V Sigil Engine */}
      <VSigilEngine onSigilClick={handleSigilClick} />
      
      {/* Tattoo Needle Cursor */}
      <TattooCursor />
      
      {/* Overlay Text */}
      <div ref={textRef} className="relative z-30 text-center pointer-events-none">
        <p className="font-mono text-sm md:text-base text-matrix/60 terminal-prompt mb-4">
          fullstack dev - renoise tracker - paris underground
        </p>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-30 pointer-events-none">
        <div className="w-6 h-10 border-2 border-matrix rounded-full flex items-start justify-center p-2 animate-pulse">
          <div className="w-1 h-3 bg-matrix rounded-full" />
        </div>
      </div>
    </section>
  )
}
