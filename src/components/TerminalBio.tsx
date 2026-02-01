import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function TerminalBio() {
  const containerRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!textRef.current) return

    const lines = textRef.current.children
    gsap.fromTo(
      lines,
      { opacity: 0, x: -20 },
      {
        opacity: 1,
        x: 0,
        duration: 0.5,
        stagger: 0.1,
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 80%',
          toggleActions: 'play none none none',
        },
      }
    )
  }, [])

  const bioLines = [
    '> whoami',
    'V — Full-stack engineer & electronic music producer',
    '',
    '> location',
    'Paris, France',
    '',
    '> skills',
    'React • Node.js • TypeScript • Three.js • Renoise',
    '',
    '> music',
    'Breakcore • Jungle • Gabber • Experimental',
    '',
    '> philosophy',
    'Fusing code with sound, creating digital rituals',
    'where minimalism meets maximalist expression.',
    '',
    '> status',
    'Available for collaborations & projects',
  ]

  return (
    <section
      ref={containerRef}
      className="min-h-screen flex items-center justify-center px-4 py-20"
    >
      <div className="max-w-4xl w-full">
        <div className="ascii-border p-8 md:p-12 bg-black/50 backdrop-blur-sm">
          <div className="font-mono text-sm md:text-base">
            <div className="text-matrix mb-4 text-glow-matrix">
              <pre className="whitespace-pre-wrap">
                {`╔════════════════════════════════════════╗
║         TERMINAL BIO v2.0          ║
╚════════════════════════════════════════╝`}
              </pre>
            </div>
            
            <div ref={textRef} className="space-y-2 text-matrix/90">
              {bioLines.map((line, i) => (
                <div
                  key={i}
                  className={line.startsWith('>') ? 'text-matrix text-glow-matrix' : ''}
                >
                  {line || '\u00A0'}
                </div>
              ))}
            </div>
            
            <div className="mt-8 text-matrix/60 animate-pulse">
              <span className="terminal-prompt">_</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
