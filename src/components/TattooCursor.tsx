import { useEffect } from 'react'

export default function TattooCursor() {
  useEffect(() => {
    // Only enable on non-touch devices
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
      return
    }

    const cursor = document.createElement('div')
    cursor.id = 'tattoo-cursor'
    cursor.style.cssText = `
      position: fixed;
      width: 4px;
      height: 20px;
      background: linear-gradient(to bottom, #00ff41, #ff1493);
      border-radius: 2px;
      pointer-events: none;
      z-index: 99999;
      transform: translate(-50%, -50%);
      box-shadow: 0 0 10px #00ff41, 0 0 20px #ff1493;
      mix-blend-mode: difference;
    `
    document.body.appendChild(cursor)

    const trail = document.createElement('canvas')
    trail.id = 'tattoo-trail'
    trail.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      pointer-events: none;
      z-index: 99998;
      mix-blend-mode: screen;
    `
    document.body.appendChild(trail)

    const ctx = trail.getContext('2d')!
    trail.width = window.innerWidth
    trail.height = window.innerHeight

    let mouseX = 0
    let mouseY = 0
    const trailPoints: Array<{ x: number; y: number; life: number }> = []

    const updateCursor = (e: MouseEvent) => {
      mouseX = e.clientX
      mouseY = e.clientY
      cursor.style.left = `${mouseX}px`
      cursor.style.top = `${mouseY}px`

      // Add trail point
      trailPoints.push({ x: mouseX, y: mouseY, life: 1 })
      if (trailPoints.length > 20) {
        trailPoints.shift()
      }
    }

    const animate = () => {
      // Fade trail
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)'
      ctx.fillRect(0, 0, trail.width, trail.height)

      // Draw trail
      trailPoints.forEach((point, i) => {
        point.life -= 0.05
        if (point.life > 0) {
          const alpha = point.life
          const size = 3 + i * 0.5
          
          // Ink bleed effect
          const gradient = ctx.createRadialGradient(
            point.x, point.y, 0,
            point.x, point.y, size * 2
          )
          gradient.addColorStop(0, `rgba(255, 20, 147, ${alpha * 0.5})`)
          gradient.addColorStop(0.5, `rgba(0, 255, 65, ${alpha * 0.3})`)
          gradient.addColorStop(1, 'rgba(0, 0, 0, 0)')
          
          ctx.fillStyle = gradient
          ctx.beginPath()
          ctx.arc(point.x, point.y, size * 2, 0, Math.PI * 2)
          ctx.fill()
        }
      })

      // Remove dead points
      for (let i = trailPoints.length - 1; i >= 0; i--) {
        if (trailPoints[i].life <= 0) {
          trailPoints.splice(i, 1)
        }
      }

      requestAnimationFrame(animate)
    }

    document.addEventListener('mousemove', updateCursor)
    animate()

    // Hover effects
    const links = document.querySelectorAll('a, button, [role="button"]')
    links.forEach(link => {
      link.addEventListener('mouseenter', () => {
        cursor.style.transform = 'translate(-50%, -50%) scale(1.5) rotate(45deg)'
        cursor.style.boxShadow = '0 0 20px #ff1493, 0 0 40px #ff1493'
      })
      link.addEventListener('mouseleave', () => {
        cursor.style.transform = 'translate(-50%, -50%) scale(1) rotate(0deg)'
        cursor.style.boxShadow = '0 0 10px #00ff41, 0 0 20px #ff1493'
      })
    })

    // Handle resize
    const handleResize = () => {
      trail.width = window.innerWidth
      trail.height = window.innerHeight
    }
    window.addEventListener('resize', handleResize)

    return () => {
      document.removeEventListener('mousemove', updateCursor)
      window.removeEventListener('resize', handleResize)
      cursor.remove()
      trail.remove()
    }
  }, [])

  return null
}
