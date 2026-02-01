# V Portfolio

A modern, single-page portfolio website for V, a Paris-based full-stack engineer and electronic music producer. Fusing minimalist shader aesthetics with cyber-sigilism, neo-tribal patterns, and avant-garde typography.

## 🎨 Aesthetic

- **Dark Theme**: Pure black (#000) background with CRT scanlines
- **Neon Glows**: Matrix green (#00ff41) and tribal pink (#ff1493)
- **Typography**: Bitmap fonts (Press Start 2P), monospace (IBM Plex Mono), medieval (Cinzel)
- **Visual Effects**: ASCII art, pixel art, WebGL shaders, cyber-sigil overlays, anime speedlines
- **Interactivity**: Custom pixel cursor, smooth scroll (Lenis), GSAP animations

## 🚀 Tech Stack

- **Vite** - Build tool with HMR
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling with custom cyberpunk theme
- **Three.js** - WebGL shaders and 3D effects
- **GSAP** - Animations and scroll triggers
- **Lenis** - Smooth scrolling
- **Lucide React** - Icons

## 📦 Installation

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview

# Deploy to Vercel
pnpm deploy
```

## 🏗️ Project Structure

```
my-v-portfolio/
├── src/
│   ├── App.tsx              # Root component with Lenis scroll
│   ├── main.tsx             # Entry point
│   ├── index.css            # Global styles + custom effects
│   ├── components/
│   │   ├── Hero.tsx         # Hero section with VSigilEngine
│   │   ├── VSigilEngine.tsx # Main WebGL sigil engine component
│   │   ├── TattooCursor.tsx # Custom tattoo needle cursor
│   │   ├── TerminalBio.tsx  # Terminal-style bio
│   │   ├── ProjectGrid.tsx  # Chronological project grid
│   │   ├── Skills.tsx       # Neo-tribal skill icons
│   │   ├── Contact.tsx      # Cyberpunk form + social links
│   │   └── CRTScanlines.tsx # CRT scanline overlay
│   ├── shaders/
│   │   ├── sigil.vert       # Vertex shader (displacement)
│   │   └── sigil.frag        # Fragment shader (Giger glow)
│   └── data/
│       ├── projects.json    # Project data
│       └── sigils.json      # ASCII/rune character sets
├── index.html
├── vite.config.ts
├── tailwind.config.js
└── package.json
```

## 🎯 Features

- **V Sigil Engine**: Multi-layered WebGL component with:
  - ASCII rain particle system forming "V" sigil
  - Pixel art sprite armor with GSAP animations
  - Giger biomech shaders with displacement mapping
  - Terminal overlay with CRT scanlines and glitch effects
  - Anime particle effects (speedlines + lens flares)
  - Audio-reactive displacement (Web Audio API)
  - Custom tattoo needle cursor with ink bleed trail
- **Single-Page Scroll**: Smooth Lenis scrolling with parallax effects
- **Terminal Bio**: Green monospace terminal interface
- **Project Grid**: Chronological grid with pixel art cards and hover effects
- **Skills**: Neo-tribal icon grid with GSAP animations
- **Contact**: Cyberpunk form with glitch effects + social links
- **CRT Scanlines**: Retro monitor effect overlay
- **PWA Ready**: Service worker and manifest configured

## 🎨 Customization

### Projects

Edit `src/data/projects.json` to add/update projects:

```json
{
  "year": "2026",
  "title": "Project Name",
  "type": "webapp",
  "aesthetic": "neo-tribal-tracker",
  "embed": "iframe",
  "desc": "Description",
  "link": "https://...",
  "tags": ["React", "Node.js"]
}
```

### Colors

Modify `tailwind.config.js` to change the color scheme:

```js
colors: {
  'matrix': '#00ff41',  // Matrix green
  'tribal': '#ff1493',  // Tribal pink
  'cyber': '#00ffff',   // Cyber cyan
}
```

### Fonts

Update `index.html` to change fonts. Current fonts:
- Press Start 2P (bitmap)
- IBM Plex Mono (monospace)
- Cinzel (medieval)

## 📱 Responsive

Fully responsive with mobile breakpoints:
- Mobile: Stacked layout, terminal feed style
- Tablet: 2-column grids
- Desktop: Full 3-column grids

## 🚢 Deployment

### Vercel

1. Install Vercel CLI: `npm i -g vercel`
2. Run `pnpm deploy` or connect via Vercel dashboard
3. Configure build command: `pnpm build`
4. Output directory: `dist`

### Bundle Size

Optimized for <150kb bundle:
- Code splitting for Three.js and GSAP
- Tree-shaking enabled
- Minimal dependencies

## 🎵 Music Integration

To add SoundCloud/Renoise embeds, update the `embed` field in `projects.json` and add embed components in `ProjectGrid.tsx`.

### Audio Reactivity

The V Sigil Engine supports audio-reactive effects. Connect an audio source:

```tsx
const [audioSource, setAudioSource] = useState<MediaElementAudioSourceNode | null>(null)

useEffect(() => {
  const audio = new Audio('/your-track.mp3')
  const context = new AudioContext()
  const source = context.createMediaElementSource(audio)
  setAudioSource(source)
  audio.play()
}, [])

<VSigilEngine audioSource={audioSource} />
```

The sigil will react to bass frequencies, creating displacement and pulse effects synchronized with your music.

## 📝 License

MIT

---

Built with ❤️ in Paris | Breakcore • Jungle • Gabber
