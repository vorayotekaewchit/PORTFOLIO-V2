import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import projectsData from '../data/projects.json'

gsap.registerPlugin(ScrollTrigger)

interface Project {
  year: string
  title: string
  type: string
  aesthetic: string
  embed: string
  desc: string
  link: string
  tags: string[]
}

export default function ProjectGrid() {
  const containerRef = useRef<HTMLDivElement>(null)
  const projects = projectsData as Project[]

  useEffect(() => {
    if (!containerRef.current) return

    const cards = containerRef.current.querySelectorAll('.project-card')
    gsap.fromTo(
      cards,
      { opacity: 0, y: 50, scale: 0.9 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 70%',
          toggleActions: 'play none none none',
        },
      }
    )
  }, [])

  return (
    <section className="min-h-screen py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <h2 className="font-bitmap text-3xl md:text-4xl text-center mb-4 text-glow-matrix">
          {'>'} ls projects
        </h2>
        <p className="font-mono text-center text-matrix/70 mb-12 text-sm md:text-base">
          Chronological grid of digital rituals
        </p>

        <div
          ref={containerRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {projects.map((project, i) => (
            <div
              key={i}
              className="project-card group relative bg-black/50 border-2 border-matrix/30 hover:border-matrix transition-all duration-300 hover-distort tattoo-bleed speedlines overflow-hidden"
            >
              {/* Pixel art card background */}
              <div className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity">
                <div className="w-full h-full bg-gradient-to-br from-matrix/20 to-tribal/20 pixel-dither" />
              </div>

              <div className="relative p-6 z-10">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono text-xs text-matrix/60">
                    {project.year}
                  </span>
                  <span className="font-mono text-xs text-tribal/60 border border-tribal/30 px-2 py-1">
                    {project.type}
                  </span>
                </div>

                <h3 className="font-bitmap text-xl mb-2 text-glow-matrix group-hover:text-glow-tribal transition-all">
                  {project.title}
                </h3>

                <p className="font-mono text-sm text-matrix/80 mb-4">
                  {project.desc}
                </p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tags.map((tag, j) => (
                    <span
                      key={j}
                      className="font-mono text-xs border border-matrix/30 px-2 py-1 text-matrix/70"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="font-mono text-xs text-matrix/50 mb-2">
                  aesthetic: {project.aesthetic}
                </div>

                <a
                  href={project.link}
                  className="inline-block font-mono text-sm text-matrix hover:text-tribal transition-colors terminal-prompt"
                >
                  view project →
                </a>
              </div>

              {/* Cyber-sigil overlay on hover */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity pointer-events-none">
                <svg className="w-full h-full">
                  <path
                    d="M 20 20 L 80 20 L 60 60 L 40 60 Z"
                    fill="none"
                    stroke="#ff1493"
                    strokeWidth="1"
                    className="animate-pulse"
                  />
                </svg>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
