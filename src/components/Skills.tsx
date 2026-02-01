import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const skills = [
  { name: 'React', icon: '🔗', color: 'text-cyber' },
  { name: 'Node.js', icon: '⚡', color: 'text-matrix' },
  { name: 'Renoise', icon: '🎹', color: 'text-tribal' },
  { name: 'Obsidian', icon: '📜', color: 'text-matrix' },
  { name: 'Three.js', icon: '🌀', color: 'text-cyber' },
  { name: 'TypeScript', icon: '⚙️', color: 'text-matrix' },
  { name: 'WebGL', icon: '✨', color: 'text-tribal' },
  { name: 'GSAP', icon: '🎬', color: 'text-cyber' },
]

export default function Skills() {
  const containerRef = useRef<HTMLDivElement>(null)
  const iconsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!iconsRef.current) return

    const icons = iconsRef.current.children
    gsap.fromTo(
      icons,
      {
        opacity: 0,
        scale: 0,
        rotation: -180,
      },
      {
        opacity: 1,
        scale: 1,
        rotation: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: 'back.out(1.7)',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 70%',
          toggleActions: 'play none none none',
        },
      }
    )
  }, [])

  return (
    <section
      ref={containerRef}
      className="min-h-screen flex items-center justify-center py-20 px-4"
    >
      <div className="max-w-6xl w-full">
        <h2 className="font-bitmap text-3xl md:text-4xl text-center mb-4 text-glow-matrix">
          {'>'} skills --list
        </h2>
        <p className="font-mono text-center text-matrix/70 mb-12 text-sm md:text-base">
          Neo-tribal tech stack
        </p>

        <div
          ref={iconsRef}
          className="grid grid-cols-2 md:grid-cols-4 gap-8"
        >
          {skills.map((skill, i) => (
            <div
              key={i}
              className="group flex flex-col items-center justify-center p-6 border-2 border-matrix/30 hover:border-matrix transition-all duration-300 hover-distort bg-black/50"
            >
              <div
                className={`text-5xl mb-4 transform group-hover:scale-125 group-hover:rotate-12 transition-all duration-300 ${skill.color}`}
                style={{
                  filter: 'drop-shadow(0 0 10px currentColor)',
                }}
              >
                {skill.icon}
              </div>
              <div className="font-bitmap text-sm text-center text-matrix group-hover:text-tribal transition-colors">
                {skill.name}
              </div>
            </div>
          ))}
        </div>

        {/* Neo-tribal pattern decoration */}
        <div className="mt-16 text-center">
          <pre className="font-mono text-xs text-matrix/30">
            {`╔═══╗ ╔═══╗ ╔═══╗ ╔═══╗
║ ═ ║ ║ ═ ║ ║ ═ ║ ║ ═ ║
╚═══╝ ╚═══╝ ╚═══╝ ╚═══╝`}
          </pre>
        </div>
      </div>
    </section>
  )
}
