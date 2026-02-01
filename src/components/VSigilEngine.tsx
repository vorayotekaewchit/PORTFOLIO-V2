import { useEffect, useRef, useState, useCallback } from 'react'
import { gsap } from 'gsap'
import * as THREE from 'three'
import sigilsData from '../data/sigils.json'

// Shader code
const vertexShader = `
uniform float time;
uniform float audioBass;
uniform vec2 mouse;
uniform float displacementStrength;
uniform sampler2D displacementMap;
uniform sampler2D tattooPattern;

varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vNormal;
varying float vDisplacement;

void main() {
  vUv = uv;
  vPosition = position;
  vNormal = normal;

  vec4 tattoo = texture2D(tattooPattern, uv);
  float displacement = tattoo.r * displacementStrength;
  displacement += audioBass * 0.1;
  
  vec3 newPosition = position + normal * displacement;
  
  vec2 mouseInfluence = (mouse - uv) * 0.5;
  float mouseDist = length(mouseInfluence);
  newPosition += normal * (1.0 / (mouseDist + 1.0)) * 0.05;
  
  vDisplacement = displacement;
  
  gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
}
`

const fragmentShader = `
uniform float time;
uniform float audioBass;
uniform vec2 mouse;
uniform sampler2D displacementMap;
uniform sampler2D tattooPattern;
uniform sampler2D gigerTexture;

varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vNormal;
varying float vDisplacement;

float asciiNoise(vec2 uv) {
  return fract(sin(dot(uv, vec2(12.9898, 78.233))) * 43758.5453);
}

vec3 gigerGlow(vec2 uv, float displacement) {
  vec3 color = vec3(0.0);
  float veins = sin(uv.x * 20.0 + time) * sin(uv.y * 20.0 + time * 0.7);
  veins = pow(veins * 0.5 + 0.5, 3.0);
  vec3 baseColor = vec3(0.0, 0.0, 0.0);
  vec3 glowColor = vec3(0.0, 1.0, 0.25);
  float pulse = sin(time * 2.0 + audioBass * 5.0) * 0.5 + 0.5;
  color = mix(baseColor, glowColor * veins, displacement * 0.5 + pulse * 0.3);
  return color;
}

void main() {
  vec2 uv = vUv;
  vec3 color = vec3(0.0, 0.0, 0.0);
  vec3 giger = gigerGlow(uv, vDisplacement);
  color = mix(color, giger, 0.6);
  
  vec4 tattoo = texture2D(tattooPattern, uv * 2.0 + time * 0.1);
  vec3 tattooColor = vec3(1.0, 0.08, 0.58);
  color += tattoo.rgb * tattooColor * 0.2 * vDisplacement;
  
  float ascii = asciiNoise(uv * 50.0 + time);
  color += vec3(ascii * 0.1) * vec3(0.0, 1.0, 0.25);
  
  float edge = smoothstep(0.0, 0.1, vDisplacement) * smoothstep(1.0, 0.9, vDisplacement);
  color += vec3(0.0, 1.0, 0.25) * edge * 0.5;
  
  float mouseDist = length(mouse - uv);
  float mouseGlow = 1.0 / (mouseDist * 5.0 + 1.0);
  color += vec3(0.0, 1.0, 0.25) * mouseGlow * 0.3;
  
  gl_FragColor = vec4(color, 0.9);
}
`

// Procedural texture generators
function createTattooPatternTexture(): THREE.Texture {
  const canvas = document.createElement('canvas')
  canvas.width = 256
  canvas.height = 256
  const ctx = canvas.getContext('2d')!
  
  // Tribal tattoo pattern
  ctx.fillStyle = '#000'
  ctx.fillRect(0, 0, 256, 256)
  
  ctx.strokeStyle = '#fff'
  ctx.lineWidth = 2
  
  // Draw tribal patterns
  for (let i = 0; i < 20; i++) {
    ctx.beginPath()
    const x = Math.random() * 256
    const y = Math.random() * 256
    ctx.moveTo(x, y)
    for (let j = 0; j < 10; j++) {
      ctx.lineTo(
        x + Math.sin(j) * 30,
        y + Math.cos(j) * 30
      )
    }
    ctx.stroke()
  }
  
  const texture = new THREE.CanvasTexture(canvas)
  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.RepeatWrapping
  return texture
}

function createGigerTexture(): THREE.Texture {
  const canvas = document.createElement('canvas')
  canvas.width = 512
  canvas.height = 512
  const ctx = canvas.getContext('2d')!
  
  // Biomech veins pattern
  const gradient = ctx.createLinearGradient(0, 0, 512, 512)
  gradient.addColorStop(0, '#000')
  gradient.addColorStop(0.5, '#0a0a0a')
  gradient.addColorStop(1, '#000')
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, 512, 512)
  
  ctx.strokeStyle = '#00ff41'
  ctx.lineWidth = 1
  for (let i = 0; i < 100; i++) {
    ctx.beginPath()
    ctx.moveTo(Math.random() * 512, Math.random() * 512)
    ctx.lineTo(Math.random() * 512, Math.random() * 512)
    ctx.stroke()
  }
  
  const texture = new THREE.CanvasTexture(canvas)
  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.RepeatWrapping
  return texture
}

interface VSigilEngineProps {
  onSigilClick?: () => void
  audioSource?: MediaElementAudioSourceNode | null
  audioContext?: AudioContext | null
}

export default function VSigilEngine({ onSigilClick, audioSource, audioContext }: VSigilEngineProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const terminalCanvasRef = useRef<HTMLCanvasElement>(null)
  const particleCanvasRef = useRef<HTMLCanvasElement>(null)
  
  const sceneRef = useRef<THREE.Scene | null>(null)
  const cameraRef = useRef<THREE.OrthographicCamera | null>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const sigilMeshRef = useRef<THREE.Mesh | null>(null)
  const asciiParticlesRef = useRef<THREE.Points | null>(null)
  const animationFrameRef = useRef<number | null>(null)
  
  const [mouse, setMouse] = useState({ x: 0.5, y: 0.5 })
  const [audioBass, setAudioBass] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  const [phase, setPhase] = useState<'loading' | 'assembling' | 'complete'>('loading')

  // Create "V" sigil geometry
  const createVSigilGeometry = useCallback(() => {
    const shape = new THREE.Shape()
    
    // Draw "V" shape
    shape.moveTo(0.2, 0.8)
    shape.lineTo(0.3, 0.2)
    shape.lineTo(0.5, 0.5)
    shape.lineTo(0.7, 0.2)
    shape.lineTo(0.8, 0.8)
    shape.lineTo(0.6, 0.8)
    shape.lineTo(0.5, 0.4)
    shape.lineTo(0.4, 0.8)
    shape.lineTo(0.2, 0.8)
    
    const extrudeSettings = {
      depth: 0.1,
      bevelEnabled: true,
      bevelThickness: 0.02,
      bevelSize: 0.02,
      bevelSegments: 3,
    }
    
    return new THREE.ExtrudeGeometry(shape, extrudeSettings)
  }, [])

  // Pixel Art Sprite System
  const createPixelSprites = useCallback((scene: THREE.Scene) => {
    const spriteCount = 50
    const sprites: THREE.Sprite[] = []
    
    // Create procedural pixel art texture (16x16 knight plate)
    const canvas = document.createElement('canvas')
    canvas.width = 16
    canvas.height = 16
    const ctx = canvas.getContext('2d')!
    
    // Draw pixel art knight plate
    ctx.fillStyle = '#000'
    ctx.fillRect(0, 0, 16, 16)
    ctx.fillStyle = '#00ff41'
    // Simple pixel pattern
    for (let y = 0; y < 16; y++) {
      for (let x = 0; x < 16; x++) {
        if ((x + y) % 3 === 0) {
          ctx.fillRect(x, y, 1, 1)
        }
      }
    }
    
    const texture = new THREE.CanvasTexture(canvas)
    texture.magFilter = THREE.NearestFilter
    texture.minFilter = THREE.NearestFilter
    
    const material = new THREE.SpriteMaterial({
      map: texture,
      transparent: true,
      color: 0x00ff41,
    })
    
    for (let i = 0; i < spriteCount; i++) {
      const sprite = new THREE.Sprite(material)
      sprite.position.set(
        (Math.random() - 0.5) * 4,
        (Math.random() - 0.5) * 4,
        (Math.random() - 0.5) * 2
      )
      sprite.scale.set(0.2, 0.2, 1)
      scene.add(sprite)
      sprites.push(sprite)
    }
    
    // Animate sprites with GSAP
    gsap.to(sprites, {
      scale: 0.3,
      duration: 2,
      stagger: 0.05,
      ease: 'power2.out',
      delay: 1,
    })
    
    return sprites
  }, [])

  // ASCII Rain Particle System
  const createASCIIRain = useCallback((scene: THREE.Scene, sigilGeometry: THREE.ExtrudeGeometry) => {
    const particleCount = 2000
    const positions = new Float32Array(particleCount * 3)
    const colors = new Float32Array(particleCount * 3)
    const sizes = new Float32Array(particleCount)
    
    const asciiChars = sigilsData.asciiChars.concat(sigilsData.runeChars)
    
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3
      positions[i3] = (Math.random() - 0.5) * 4
      positions[i3 + 1] = Math.random() * 4 - 2
      positions[i3 + 2] = (Math.random() - 0.5) * 2
      
      // Matrix green
      colors[i3] = 0
      colors[i3 + 1] = 1
      colors[i3 + 2] = 0.25
      
      sizes[i] = Math.random() * 0.1 + 0.05
    }
    
    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1))
    
    const material = new THREE.PointsMaterial({
      size: 0.1,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
    })
    
    const points = new THREE.Points(geometry, material)
    scene.add(points)
    return points
  }, [])

  // Terminal Overlay
  const initTerminal = useCallback(() => {
    const canvas = terminalCanvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext('2d')!
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    
    let terminalText = '> loading v_portfolio...'
    let cursorVisible = true
    let frame = 0
    
    const draw = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.3)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      
      // CRT scanlines
      ctx.strokeStyle = 'rgba(0, 255, 65, 0.1)'
      ctx.lineWidth = 1
      for (let y = 0; y < canvas.height; y += 4) {
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(canvas.width, y)
        ctx.stroke()
      }
      
      // Terminal text
      ctx.font = '14px "IBM Plex Mono", monospace'
      ctx.fillStyle = '#00ff41'
      ctx.shadowBlur = 10
      ctx.shadowColor = '#00ff41'
      
      const text = terminalText + (cursorVisible ? '_' : '')
      ctx.fillText(text, 20, canvas.height - 40)
      
      // Glitch effect on hover
      if (isHovered) {
        ctx.save()
        ctx.globalAlpha = 0.3
        ctx.fillStyle = '#ff1493'
        ctx.fillText(text, 20 + Math.random() * 2, canvas.height - 40 + Math.random() * 2)
        ctx.restore()
      }
      
      frame++
      if (frame % 30 === 0) cursorVisible = !cursorVisible
      
      requestAnimationFrame(draw)
    }
    
    draw()
    
    // Update terminal text based on phase
    const updateText = () => {
      switch (phase) {
        case 'loading':
          terminalText = '> loading v_portfolio...'
          break
        case 'assembling':
          terminalText = '> assembling sigil layers...'
          break
        case 'complete':
          terminalText = '> v_portfolio ready'
          break
      }
    }
    
    updateText()
    const interval = setInterval(updateText, 1000)
    
    return () => clearInterval(interval)
  }, [phase, isHovered])

  // Anime Particles (Speedlines + Lens Flares)
  const initAnimeParticles = useCallback(() => {
    const canvas = particleCanvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext('2d')!
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    
    interface Particle {
      x: number
      y: number
      vx: number
      vy: number
      life: number
      maxLife: number
    }
    
    const particles: Particle[] = []
    
    const addParticle = (x: number, y: number) => {
      const angle = Math.random() * Math.PI * 2
      const speed = Math.random() * 5 + 2
      particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1,
        maxLife: 1,
      })
    }
    
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      // Speedlines
      if (isHovered) {
        ctx.strokeStyle = 'rgba(0, 255, 65, 0.3)'
        ctx.lineWidth = 1
        for (let i = 0; i < 20; i++) {
          const x = (mouse.x * canvas.width) + (i * 10)
          ctx.beginPath()
          ctx.moveTo(x, 0)
          ctx.lineTo(x, canvas.height)
          ctx.stroke()
        }
      }
      
      // Particles
      particles.forEach((p, i) => {
        p.x += p.vx
        p.y += p.vy
        p.life -= 0.02
        
        if (p.life > 0) {
          ctx.save()
          ctx.globalAlpha = p.life
          ctx.fillStyle = '#00ff41'
          ctx.beginPath()
          ctx.arc(p.x, p.y, 2, 0, Math.PI * 2)
          ctx.fill()
          ctx.restore()
        } else {
          particles.splice(i, 1)
        }
      })
      
      requestAnimationFrame(draw)
    }
    
    draw()
    
    // Add particles on mouse move near sigil
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      const centerX = canvas.width / 2
      const centerY = canvas.height / 2
      const dist = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2)
      
      if (dist < 200 && Math.random() > 0.7) {
        addParticle(x, y)
      }
    }
    
    window.addEventListener('mousemove', handleMouseMove)
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [mouse, isHovered])

  // Audio Analysis
  useEffect(() => {
    if (!audioSource && !audioContext) return
    
    try {
      const context = audioContext || (audioSource?.context as AudioContext)
      if (!context) return
      
      const analyser = context.createAnalyser()
      analyser.fftSize = 256
      
      if (audioSource) {
        audioSource.connect(analyser)
      }
      
      const dataArray = new Uint8Array(analyser.frequencyBinCount)
      
      const analyze = () => {
        analyser.getByteFrequencyData(dataArray)
        const bass = dataArray.slice(0, 10).reduce((a, b) => a + b, 0) / 10 / 255
        setAudioBass(bass * 0.5) // Scale down for subtle effect
        requestAnimationFrame(analyze)
      }
      
      analyze()
    } catch (error) {
      console.warn('Audio analysis not available:', error)
    }
  }, [audioSource, audioContext])

  // Main Three.js Setup
  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return

    const scene = new THREE.Scene()
    const camera = new THREE.OrthographicCamera(-2, 2, 2, -2, 0.1, 1000)
    camera.position.z = 5
    
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      alpha: true,
      antialias: false,
    })
    
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    
    sceneRef.current = scene
    cameraRef.current = camera
    rendererRef.current = renderer

    // Create textures
    const tattooTexture = createTattooPatternTexture()
    const gigerTexture = createGigerTexture()
    
    // Create V sigil
    const sigilGeometry = createVSigilGeometry()
    const tattooPattern = createTattooPatternTexture()
    
    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        time: { value: 0 },
        audioBass: { value: 0 },
        mouse: { value: new THREE.Vector2(0.5, 0.5) },
        displacementStrength: { value: 0.1 },
        displacementMap: { value: gigerTexture },
        tattooPattern: { value: tattooPattern },
        gigerTexture: { value: gigerTexture },
      },
      transparent: true,
      side: THREE.DoubleSide,
    })
    
    const sigilMesh = new THREE.Mesh(sigilGeometry, material)
    sigilMesh.scale.set(1.5, 1.5, 1.5)
    scene.add(sigilMesh)
    sigilMeshRef.current = sigilMesh

    // ASCII Rain
    const asciiParticles = createASCIIRain(scene, sigilGeometry)
    asciiParticlesRef.current = asciiParticles

    // Pixel Art Sprites
    const pixelSprites = createPixelSprites(scene)

    // Initial scale
    sigilMesh.scale.set(0.1, 0.1, 0.1)
    
    // Animation sequence
    gsap.timeline()
      .to({}, { duration: 1, onComplete: () => setPhase('assembling') })
      .to(sigilMesh.scale, { x: 1.5, y: 1.5, z: 1.5, duration: 2, ease: 'power3.out' }, 1)
      .to({}, { duration: 1, onComplete: () => setPhase('complete') }, 2)

    // Animation loop
    let time = 0
    const animate = () => {
      time += 0.016
      
      if (material.uniforms) {
        material.uniforms.time.value = time
        material.uniforms.audioBass.value = audioBass
        material.uniforms.mouse.value.set(mouse.x, mouse.y)
      }
      
      // Rotate sigil
      if (sigilMesh) {
        sigilMesh.rotation.y = time * 0.2
        sigilMesh.rotation.x = Math.sin(time * 0.3) * 0.1
      }
      
      // Animate ASCII particles (coalesce to form V)
      if (asciiParticles) {
        const positions = asciiParticles.geometry.attributes.position.array as Float32Array
        for (let i = 0; i < positions.length; i += 3) {
          const targetX = (i / 3) % 100 < 50 ? -0.5 : 0.5
          const targetY = -0.5 + ((i / 3) % 100) / 100
          positions[i] += (targetX - positions[i]) * 0.01
          positions[i + 1] += (targetY - positions[i + 1]) * 0.01
        }
        asciiParticles.geometry.attributes.position.needsUpdate = true
      }
      
      // Animate pixel sprites
      pixelSprites.forEach((sprite, i) => {
        sprite.rotation.z += 0.01
        sprite.position.y += Math.sin(time + i) * 0.001
      })
      
      renderer.render(scene, camera)
      animationFrameRef.current = requestAnimationFrame(animate)
    }
    
    animate()

    // Handle resize
    const handleResize = () => {
      camera.left = -2 * (window.innerWidth / window.innerHeight)
      camera.right = 2 * (window.innerWidth / window.innerHeight)
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
      
      if (terminalCanvasRef.current) {
        terminalCanvasRef.current.width = window.innerWidth
        terminalCanvasRef.current.height = window.innerHeight
      }
      if (particleCanvasRef.current) {
        particleCanvasRef.current.width = window.innerWidth
        particleCanvasRef.current.height = window.innerHeight
      }
    }
    
    window.addEventListener('resize', handleResize)

    // Mouse tracking
    const handleMouseMove = (e: MouseEvent) => {
      const rect = containerRef.current!.getBoundingClientRect()
      setMouse({
        x: e.clientX / window.innerWidth,
        y: 1 - (e.clientY / window.innerHeight),
      })
    }
    
    window.addEventListener('mousemove', handleMouseMove)

    // Click handler
    const handleClick = () => {
      if (onSigilClick) {
        gsap.to(sigilMesh.scale, {
          x: 2,
          y: 2,
          z: 2,
          duration: 0.5,
          ease: 'power2.out',
          onComplete: onSigilClick,
        })
      }
    }
    
    containerRef.current.addEventListener('click', handleClick)

    // Hover detection
    const handleMouseEnter = () => setIsHovered(true)
    const handleMouseLeave = () => setIsHovered(false)
    containerRef.current.addEventListener('mouseenter', handleMouseEnter)
    containerRef.current.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('mousemove', handleMouseMove)
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
      renderer.dispose()
      material.dispose()
      sigilGeometry.dispose()
      tattooTexture.dispose()
      gigerTexture.dispose()
    }
  }, [createVSigilGeometry, createASCIIRain, createPixelSprites, mouse, audioBass, onSigilClick])

  // Initialize overlays
  useEffect(() => {
    const terminalCleanup = initTerminal()
    const particleCleanup = initAnimeParticles()
    
    return () => {
      if (terminalCleanup) terminalCleanup()
      if (particleCleanup) particleCleanup()
    }
  }, [initTerminal, initAnimeParticles])

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full overflow-hidden"
    >
      {/* Main WebGL Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
      />
      
      {/* Terminal Overlay Canvas */}
      <canvas
        ref={terminalCanvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-10"
      />
      
      {/* Particle Effects Canvas */}
      <canvas
        ref={particleCanvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-20"
      />
    </div>
  )
}
