import { useEffect } from 'react'
import Lenis from 'lenis'
import Hero from './components/Hero'
import TerminalBio from './components/TerminalBio'
import ProjectGrid from './components/ProjectGrid'
import Skills from './components/Skills'
import Contact from './components/Contact'
import CRTScanlines from './components/CRTScanlines'

function App() {
  useEffect(() => {
    // Smooth scroll with Lenis
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
      infinite: false,
    })

    function raf(time: number) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf)

    return () => {
      lenis.destroy()
    }
  }, [])

  return (
    <div className="relative min-h-screen bg-black text-white overflow-x-hidden">
      <CRTScanlines />
      
      <main className="relative z-10">
        <Hero />
        <TerminalBio />
        <ProjectGrid />
        <Skills />
        <Contact />
      </main>
    </div>
  )
}

export default App
