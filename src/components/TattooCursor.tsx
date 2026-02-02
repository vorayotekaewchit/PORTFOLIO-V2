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
    let lastTrailAdd = 0
    const trailPoints: Array<{ x: number; y: number; life: number }> = []

    const updateCursor = (e: MouseEvent) => {
      mouseX = e.clientX
      mouseY = e.clientY
      cursor.style.left = `${mouseX}px`
      cursor.style.top = `${mouseY}px`

      // Add trail point (throttled)
      const now = performance.now()
      if (now - lastTrailAdd > 16) { // ~60fps max
        trailPoints.push({ x: mouseX, y: mouseY, life: 1 })
        if (trailPoints.length > 15) { // Reduced from 20
          trailPoints.shift()
        }
        lastTrailAdd = now
      }
    }

    let lastTrailTime = 0
    const trailInterval = 1000 / 30 // 30 FPS for cursor trail
    
    const animate = (currentTime: number) => {
      // Throttle trail drawing to 30 FPS
      if (currentTime - lastTrailTime >= trailInterval) {
        // Fade trail
        ctx.fillStyle = 'rgba(0, 0, 0, 0.15)'
        ctx.fillRect(0, 0, trail.width, trail.height)

        // Draw trail (limit to 15 points max)
        const maxPoints = 15
        const pointsToDraw = trailPoints.slice(-maxPoints)
        
        pointsToDraw.forEach((point, i) => {
          point.life -= 0.05
          if (point.life > 0) {
            const alpha = point.life
            const size = 2 + i * 0.3 // Reduced size
            
            // Simplified ink bleed effect (no gradient for performance)
            ctx.fillStyle = `rgba(255, 20, 147, ${alpha * 0.4})`
            ctx.beginPath()
            ctx.arc(point.x, point.y, size, 0, Math.PI * 2)
            ctx.fill()
          }
        })

        // Remove dead points
        for (let i = trailPoints.length - 1; i >= 0; i--) {
          if (trailPoints[i].life <= 0) {
            trailPoints.splice(i, 1)
          }
        }
        
        lastTrailTime = currentTime
      }

      requestAnimationFrame(animate)
    }

    document.addEventListener('mousemove', updateCursor)
    animate(performance.now())

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
