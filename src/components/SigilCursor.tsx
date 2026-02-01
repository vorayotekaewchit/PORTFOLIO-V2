import { useEffect } from 'react'

export default function SigilCursor() {
  useEffect(() => {
    // Only enable on non-touch devices
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
      document.body.style.cursor = 'auto'
      return
    }

    const cursor = document.createElement('div')
    cursor.id = 'custom-cursor'
    document.body.appendChild(cursor)

    const trail = document.createElement('div')
    trail.id = 'custom-cursor-trail'
    document.body.appendChild(trail)

    let mouseX = 0
    let mouseY = 0
    let trailX = 0
    let trailY = 0

    const updateCursor = (e: MouseEvent) => {
      mouseX = e.clientX
      mouseY = e.clientY
    }

    const animate = () => {
      cursor.style.left = `${mouseX - 10}px`
      cursor.style.top = `${mouseY - 10}px`

      trailX += (mouseX - trailX) * 0.1
      trailY += (mouseY - trailY) * 0.1
      trail.style.left = `${trailX - 4}px`
      trail.style.top = `${trailY - 4}px`

      requestAnimationFrame(animate)
    }

    document.addEventListener('mousemove', updateCursor)
    animate()

    // Hover effects
    const links = document.querySelectorAll('a, button, [role="button"]')
    links.forEach(link => {
      link.addEventListener('mouseenter', () => {
        cursor.style.transform = 'scale(1.5)'
        cursor.style.borderColor = '#ff1493'
      })
      link.addEventListener('mouseleave', () => {
        cursor.style.transform = 'scale(1)'
        cursor.style.borderColor = '#00ff41'
      })
    })

    return () => {
      document.removeEventListener('mousemove', updateCursor)
      cursor.remove()
      trail.remove()
    }
  }, [])

  return null
}
