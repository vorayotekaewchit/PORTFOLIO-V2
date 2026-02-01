import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Github, Music, MessageCircle } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

export default function Contact() {
  const containerRef = useRef<HTMLDivElement>(null)
  const formRef = useRef<HTMLFormElement>(null)
  const [formData, setFormData] = useState({ name: '', email: '', message: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (!containerRef.current) return

    const elements = containerRef.current.querySelectorAll('.contact-item')
    gsap.fromTo(
      elements,
      { opacity: 0, x: -30 },
      {
        opacity: 1,
        x: 0,
        duration: 0.6,
        stagger: 0.1,
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 70%',
          toggleActions: 'play none none none',
        },
      }
    )
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false)
      setFormData({ name: '', email: '', message: '' })
      alert('Message sent! (This is a demo)')
    }, 1000)
  }

  const links = [
    { icon: Github, label: 'GitHub', url: 'https://github.com', color: 'text-matrix' },
    { icon: Music, label: 'SoundCloud', url: 'https://soundcloud.com', color: 'text-tribal' },
    { icon: MessageCircle, label: 'Discord', url: '#', color: 'text-cyber' },
  ]

  return (
    <section
      ref={containerRef}
      className="min-h-screen flex items-center justify-center py-20 px-4"
    >
      <div className="max-w-4xl w-full">
        <h2 className="font-bitmap text-3xl md:text-4xl text-center mb-4 text-glow-matrix">
          {'>'} contact --init
        </h2>
        <p className="font-mono text-center text-matrix/70 mb-12 text-sm md:text-base">
          Let's create something together
        </p>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Contact Form */}
          <form
            ref={formRef}
            onSubmit={handleSubmit}
            className="contact-item ascii-border p-8 bg-black/50 backdrop-blur-sm space-y-6"
          >
            <div>
              <label className="font-mono text-sm text-matrix mb-2 block terminal-prompt">
                name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-black/50 border border-matrix/30 px-4 py-2 font-mono text-sm text-matrix focus:border-matrix focus:outline-none focus:ring-2 focus:ring-matrix/50 transition-all"
                required
              />
            </div>

            <div>
              <label className="font-mono text-sm text-matrix mb-2 block terminal-prompt">
                email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-black/50 border border-matrix/30 px-4 py-2 font-mono text-sm text-matrix focus:border-matrix focus:outline-none focus:ring-2 focus:ring-matrix/50 transition-all"
                required
              />
            </div>

            <div>
              <label className="font-mono text-sm text-matrix mb-2 block terminal-prompt">
                message
              </label>
              <textarea
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                rows={5}
                className="w-full bg-black/50 border border-matrix/30 px-4 py-2 font-mono text-sm text-matrix focus:border-matrix focus:outline-none focus:ring-2 focus:ring-matrix/50 transition-all resize-none"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full border-2 border-matrix px-6 py-3 font-bitmap text-sm text-matrix hover:bg-matrix hover:text-black transition-all duration-300 hover-distort disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'sending...' : 'submit →'}
            </button>
          </form>

          {/* Social Links */}
          <div className="contact-item space-y-6">
            <div className="ascii-border p-8 bg-black/50 backdrop-blur-sm">
              <h3 className="font-bitmap text-xl mb-6 text-glow-matrix">
                {'>'} social --links
              </h3>
              <div className="space-y-4">
                {links.map((link, i) => {
                  const Icon = link.icon
                  return (
                    <a
                      key={i}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`group flex items-center gap-4 p-4 border border-matrix/30 hover:border-matrix transition-all duration-300 hover-distort ${link.color}`}
                    >
                      <Icon className="w-6 h-6 group-hover:scale-125 transition-transform" />
                      <span className="font-mono text-sm">{link.label}</span>
                      <span className="ml-auto font-mono text-xs opacity-50 group-hover:opacity-100">
                        →
                      </span>
                    </a>
                  )
                })}
              </div>
            </div>

            {/* ASCII art decoration */}
            <div className="text-center">
              <pre className="font-mono text-xs text-matrix/30">
                {`    ╔═══════════════╗
    ║  PARIS 2024  ║
    ╚═══════════════╝`}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
