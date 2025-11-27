# Qalbu - Your Islamic Companion

A modern, elegant, and production-ready Islamic web application built with Next.js 15, featuring prayer times, the complete Holy Quran with audio recitation, Qibla direction finder with AR camera mode, and more.

![Qalbu Banner](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?style=for-the-badge&logo=typescript)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38bdf8?style=for-the-badge&logo=tailwind-css)

---

## Features

### Prayer Times
- **Automatic location detection** using browser geolocation
- **Real-time prayer times** from Aladhan API
- **Next prayer countdown** with time remaining
- **Hijri calendar** integration
- **Beautiful widget** with gradient design
- Auto-refresh every hour

### Holy Quran
- **All 114 Surahs** with Arabic text
- **Audio recitation** by Mishary Rashid Alafasy
- **Ayah-by-ayah playback** with individual audio controls
- **Sticky mini audio player** with progress bar
- **30 Juz navigation** support
- **Search functionality** across all surahs
- **Beautiful Arabic typography** using Scheherazade New font
- **Bookmark support** (coming soon)
- **Tafsir integration** (coming soon)

### Qibla Direction
- **Dual mode support:**
  - **Compass Mode**: Real-time compass with rotating needle
  - **AR Camera Mode**: Live camera overlay with Qibla direction
- **DeviceOrientation API** for accurate compass heading
- **WebRTC camera access** for AR experience
- **Kaaba coordinates** (21.4225°N, 39.8262°E)
- **iOS permission handling** for device orientation
- **Calibration feedback**

### Design & UX
- **Premium Apple-like aesthetic** - clean, minimal, elegant
- **Islamic color palette** - Sand, Gold, and neutral tones
- **Dark/Light mode** with smooth transitions
- **Framer Motion animations** - smooth, delightful interactions
- **Glass morphism effects** for modern UI
- **Fully responsive** - mobile-first design
- **WCAG compliant** accessibility
- **High readability** for Qur'an text

### PWA Support
- **Installable** on mobile and desktop
- **Offline support** with service workers
- **App shortcuts** for quick access
- **Standalone mode** for native app feel
- **Push notifications** (coming soon)

---

## Tech Stack

| Category | Technology |
|----------|-----------|
| **Framework** | Next.js 15+ (App Router) |
| **Language** | TypeScript 5.7 |
| **Styling** | TailwindCSS 3.4 + shadcn/ui |
| **Animations** | Framer Motion 11 |
| **Data Fetching** | TanStack Query (React Query) |
| **State Management** | Zustand |
| **Icons** | Lucide React |
| **Fonts** | Inter (UI), Scheherazade New (Arabic) |
| **Code Quality** | ESLint + Prettier |
| **APIs** | Aladhan (Prayer), AlQuran Cloud (Quran) |

---

## Installation

### Prerequisites
- Node.js 18.0.0 or higher
- npm, yarn, pnpm, or bun

### Steps

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/qalbu.git
cd qalbu
```

2. **Install dependencies**
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. **Run development server**
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

4. **Open in browser**
```
http://localhost:3000
```

---

## Project Structure

```
qalbu/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── layout.tsx          # Root layout with providers
│   │   ├── page.tsx            # Home page
│   │   ├── quran/              # Quran pages
│   │   │   ├── page.tsx        # Surah list
│   │   │   └── [id]/           # Surah detail
│   │   │       └── page.tsx
│   │   └── qibla/              # Qibla page
│   │       └── page.tsx
│   ├── components/             # React components
│   │   ├── ui/                 # shadcn/ui components
│   │   │   ├── button.tsx
│   │   │   └── card.tsx
│   │   ├── prayer/             # Prayer-related components
│   │   │   └── prayer-times-widget.tsx
│   │   └── providers/          # Context providers
│   │       ├── theme-provider.tsx
│   │       └── query-provider.tsx
│   ├── hooks/                  # Custom React hooks
│   │   ├── use-prayer-times.ts
│   │   ├── use-quran.ts
│   │   └── use-qibla.ts
│   ├── lib/                    # Utilities and APIs
│   │   ├── api/                # API services
│   │   │   ├── prayer-times.ts
│   │   │   └── quran.ts
│   │   └── utils.ts            # Helper functions
│   └── globals.css             # Global styles
├── public/                     # Static assets
│   ├── manifest.json           # PWA manifest
│   ├── icon-192.png
│   └── icon-512.png
├── package.json
├── tsconfig.json
├── tailwind.config.js
├── next.config.js
└── README.md
```

---

## Core APIs Used

### Prayer Times - Aladhan API
- **Endpoint**: `https://api.aladhan.com/v1/timings`
- **Features**: Prayer times, Hijri calendar, multiple calculation methods
- **Documentation**: [aladhan.com/prayer-times-api](https://aladhan.com/prayer-times-api)

### Quran - AlQuran Cloud API
- **Endpoint**: `https://api.alquran.cloud/v1`
- **Features**: All 114 surahs, multiple editions, audio recitation
- **Documentation**: [alquran.cloud/api](https://alquran.cloud/api)

### Audio Recitation
- **Source**: Islamic Network CDN
- **Reciter**: Mishary Rashid Alafasy
- **Format**: MP3, 128kbps

---

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run format` | Format code with Prettier |

---

## Deployment

### Vercel (Recommended)

1. **Push to GitHub**
```bash
git add .
git commit -m "Initial commit"
git push origin main
```

2. **Deploy to Vercel**
- Go to [vercel.com](https://vercel.com)
- Import your repository
- Vercel will auto-detect Next.js
- Click "Deploy"

3. **Environment Variables** (if needed)
- No environment variables required for basic functionality
- All APIs are public and free

### Other Platforms
- **Netlify**: Supports Next.js with adapter
- **Railway**: Docker deployment
- **AWS Amplify**: Serverless deployment

---

## Performance

Target Lighthouse scores:

| Metric | Target | Status |
|--------|--------|--------|
| Performance | 95+ | ✅ |
| Accessibility | 95+ | ✅ |
| Best Practices | 95+ | ✅ |
| SEO | 95+ | ✅ |
| PWA | ✓ | ✅ |

Optimizations:
- Image optimization with Next.js Image
- Font optimization with next/font
- Code splitting and lazy loading
- TanStack Query caching
- Service worker caching

---

## Design System

### Colors
- **Sand**: Warm neutral tones (50-900)
- **Gold**: Accent color (#e9a84a)
- **Semantic**: Primary, Secondary, Muted, Destructive

### Typography
- **UI Font**: Inter (Google Fonts)
- **Arabic Font**: Scheherazade New (Google Fonts)
- **Line Height**: 2.0 for Arabic text

### Spacing
- **Border Radius**: 1rem (16px) for cards
- **Shadows**: Soft, layered shadows
- **Animations**: 300ms ease-out transitions

---

## Privacy & Permissions

### Location Access
- Required for prayer times and Qibla direction
- Uses browser's Geolocation API
- Falls back to Mecca coordinates if denied

### Camera Access
- Optional for AR Qibla mode
- Uses WebRTC getUserMedia API
- Only accessed when user activates AR mode

### Device Orientation
- Required for compass functionality
- Uses DeviceOrientation API
- Requires permission on iOS 13+

**No data is stored or transmitted to third parties.**

---

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Aladhan API** for prayer times data
- **AlQuran Cloud** for Quran text and audio
- **Mishary Rashid Alafasy** for beautiful Quran recitation
- **shadcn/ui** for beautiful component system
- **Vercel** for hosting and deployment

---

## 📞 Support

For support, email support@qalbu.app or open an issue on GitHub.

---

## 🌟 Roadmap

- [ ] Tafsir (Quran commentary) integration
- [ ] Bookmark and reading history
- [ ] Multiple reciters support
- [ ] Dua collection
- [ ] Digital Tasbih counter
- [ ] Islamic calendar events
- [ ] Hadith of the day
- [ ] Multi-language support (Arabic, Indonesian)
- [ ] Offline Quran reading
- [ ] Push notifications for prayer times

---

Made with ❤️ for the Muslim community

**Qalbu**
# Qalbu-web
