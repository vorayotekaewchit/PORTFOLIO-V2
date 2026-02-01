# V Sigil Engine Documentation

## Overview

The V Sigil Engine is a standalone React/WebGL component that creates a multi-layered visual experience combining ASCII art, pixel art, medieval motifs, terminal UI, cyber-sigilism, cyberpunk aesthetics, neo-tribal patterns, HR Giger biomechanics, anime effects, and tattoo-style graphics.

## Component Structure

```
VSigilEngine.tsx
├── Three.js Scene (WebGL)
│   ├── ASCII Rain Particles (Points)
│   ├── V Sigil Mesh (Extruded Geometry + Custom Shader)
│   └── Pixel Art Sprites (Knight Plates)
├── Terminal Overlay (Canvas2D)
│   ├── CRT Scanlines
│   └── Terminal Text with Glitch Effects
└── Anime Particles (Canvas2D)
    ├── Speedlines
    └── Lens Flares
```

## Visual Layers

### 1. ASCII Rain Base
- **Type**: Three.js Points system
- **Effect**: Medieval runes/blocks falling Matrix-style
- **Density**: Forms "V" sigil silhouette over time
- **Characters**: Uses `sigils.json` data (ASCII chars, runes, matrix chars)

### 2. Pixel Art Armor
- **Type**: Three.js Sprites
- **Effect**: 16x16 bitmap knight plates with tribal tattoos
- **Animation**: GSAP staggered reveal
- **Texture**: Procedurally generated pixel art

### 3. Giger Biomech
- **Type**: Fragment Shader
- **Effect**: Glossy black tubes/ribs pulsing behind sigil
- **Displacement**: Mapped with tattoo patterns
- **Glow**: Matrix green (#00ff41) with audio-reactive pulse

### 4. Terminal Overlay
- **Type**: Canvas2D
- **Effect**: Green monospace CLI with CRT scanlines
- **Text**: `> loading v_portfolio...` → `> assembling sigil layers...` → `> v_portfolio ready`
- **Glitch**: Pink overlay on hover

### 5. Anime Effects
- **Type**: Canvas2D Particles
- **Effect**: Speedlines + lens flares when mouse moves near sigil
- **Trigger**: Distance-based particle emission

### 6. Tattoo Details
- **Type**: SVG Filters + Shader Displacement
- **Effect**: Needle drips + ink bleeds on hover
- **Implementation**: Custom cursor with trail canvas

## Technical Specs

### Three.js Setup
- **Camera**: Orthographic (for consistent scaling)
- **Renderer**: WebGL with alpha channel
- **Sigil**: Extruded "V" shape with beveled edges
- **Rotation**: Continuous Y-axis rotation with subtle X-axis oscillation

### Custom Shaders

#### Vertex Shader (`sigil.vert`)
- Displacement mapping from tattoo pattern
- Audio-reactive displacement (bass frequencies)
- Mouse interaction distortion
- Normal-based extrusion

#### Fragment Shader (`sigil.frag`)
- Giger biomech glow (veins pattern)
- Tattoo pattern overlay (tribal pink)
- ASCII noise overlay
- Edge glow (matrix green)
- Mouse interaction glow

### Audio Reactivity
- **Input**: `audioSource` or `audioContext` prop
- **Analysis**: Web Audio API AnalyserNode
- **Frequency**: Bass range (0-10 bins)
- **Effect**: Displacement strength + pulse intensity

### Interaction Flow

1. **Load**: 
   - ASCII rain coalesces
   - Pixel armor assembles (GSAP stagger)
   - Giger ribs emerge
   - Terminal boots
   - "V" sigil rotates in

2. **Hover**:
   - Tattoos drip ink (cursor trail)
   - Speedlines streak
   - Terminal glitches (pink overlay)

3. **Click**:
   - Sigil extrudes to 3D (scale 2x)
   - Triggers `onSigilClick` callback
   - Scrolls to next section

4. **Scroll Out**:
   - Dissolves back to ASCII rain (future enhancement)

## Usage

```tsx
import VSigilEngine from './components/VSigilEngine'

function Hero() {
  const handleSigilClick = () => {
    // Scroll to next section
    const nextSection = document.querySelector('section:nth-of-type(2)')
    nextSection?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section className="h-screen">
      <VSigilEngine onSigilClick={handleSigilClick} />
    </section>
  )
}
```

### Props

- `onSigilClick?: () => void` - Callback when sigil is clicked
- `audioSource?: MediaElementAudioSourceNode | null` - Audio source for reactivity
- `audioContext?: AudioContext | null` - Alternative audio context

### Audio Integration Example

```tsx
const [audioSource, setAudioSource] = useState<MediaElementAudioSourceNode | null>(null)

useEffect(() => {
  const audio = new Audio('/track.mp3')
  const context = new AudioContext()
  const source = context.createMediaElementSource(audio)
  setAudioSource(source)
  audio.play()
}, [])

<VSigilEngine audioSource={audioSource} />
```

## Performance

- **Target**: 60fps
- **Bundle**: <200kb (with code splitting)
- **Optimizations**:
  - Procedural textures (no external assets)
  - Particle count limits
  - Efficient shader uniforms
  - Canvas2D for overlays (lighter than WebGL)

## Customization

### Colors
Edit shader uniforms or CSS:
- Matrix Green: `#00ff41`
- Tribal Pink: `#ff1493`
- Cyber Cyan: `#00ffff`

### ASCII Characters
Edit `src/data/sigils.json`:
```json
{
  "asciiChars": ["█", "▓", "▒", ...],
  "runeChars": ["ᚠ", "ᚡ", ...],
  "matrixChars": ["0", "1", "V", ...]
}
```

### Sigil Shape
Modify `createVSigilGeometry()` in `VSigilEngine.tsx` to change the "V" shape.

## Browser Compatibility

- Chrome/Edge: Full support
- Firefox: Full support
- Safari: Full support (Web Audio API may require user interaction)
- Mobile: Degrades gracefully (cursor disabled, reduced particles)

## Future Enhancements

- [ ] Scroll-triggered dissolve effect
- [ ] More complex pixel art sprite sheets
- [ ] Additional shader effects (chromatic aberration, bloom)
- [ ] SoundCloud/Renoise embed integration
- [ ] VR/AR support (WebXR)

---

Built for breakcore/gabber energy — glitchy, ritualistic, cyber-tribal.
