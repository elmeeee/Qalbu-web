# Qalbu PWA - Modern Islamic App Specification

## 🎯 Vision
Transform Qalbu into a Gen Z-friendly Islamic app with TikTok/Instagram-style interactions when installed as a PWA.

## 📱 App Architecture

### PWA Detection
```typescript
// Detect if running as installed PWA
const isPWA = window.matchMedia('(display-mode: standalone)').matches
```

### Layout Modes
1. **Website Mode** (Browser) - Current layout with full navigation
2. **App Mode** (PWA) - Bottom tab navigation, mobile-first UI

---

## 🏗️ Technical Architecture

### File Structure
```
src/
├── app/
│   ├── (pwa)/                    # PWA-specific routes
│   │   ├── layout.tsx            # PWA layout with bottom tabs
│   │   ├── home/
│   │   │   └── page.tsx          # Home tab
│   │   ├── quran/
│   │   │   └── page.tsx          # Quran vertical scroll
│   │   ├── qibla/
│   │   │   └── page.tsx          # Qibla finder
│   │   └── ramadan/
│   │       └── page.tsx          # Ramadan schedule
│   └── layout.tsx                # Root layout (detects PWA)
├── components/
│   ├── pwa/
│   │   ├── bottom-nav.tsx        # Bottom tab navigation
│   │   ├── dua-slider.tsx        # Daily dua carousel
│   │   ├── mosque-card.tsx       # Single mosque display
│   │   └── quran-reel.tsx        # TikTok-style Quran
│   └── ...
└── hooks/
    ├── use-pwa-mode.ts           # PWA detection hook
    └── use-swipe-gesture.ts      # Swipe navigation
```

---

## 📑 Tab Navigation Structure

### Bottom Tabs (PWA Mode Only)

#### 1. 🏠 Home Tab
**Route:** `/home`

**Components:**
- **Prayer Times Widget** (existing)
  - Current prayer highlighted
  - Next prayer countdown
  - Compact card design

- **Daily Dua Slider** (NEW)
  - Auto-rotate based on day of week
  - Swipeable carousel
  - Beautiful gradient cards
  - Arabic + Translation + Transliteration
  - Share button

- **Nearby Mosque Card** (NEW)
  - Show 1 closest mosque
  - Distance indicator
  - Direction arrow
  - "Get Directions" button
  - Prayer times for that mosque

**Layout:**
```
┌─────────────────────┐
│   Prayer Times      │
│   ┌─────────────┐   │
│   │ Fajr  5:30  │   │
│   │ Dhuhr 12:15 │ ← │
│   └─────────────┘   │
├─────────────────────┤
│   Daily Dua         │
│   ┌─────────────┐   │
│   │ ← Swipe →   │   │
│   │  Arabic     │   │
│   │ Translation │   │
│   └─────────────┘   │
├─────────────────────┤
│   Nearby Mosque     │
│   ┌─────────────┐   │
│   │ 📍 Masjid   │   │
│   │ 0.5 km →    │   │
│   └─────────────┘   │
└─────────────────────┘
```

---

#### 2. 📖 Quran Tab
**Route:** `/quran`

**Style:** TikTok/Instagram Reels vertical scroll

**Features:**
- Full-screen vertical scrolling
- One ayah per screen
- Swipe up/down to navigate
- Beautiful typography
- Gradient backgrounds
- Auto-play audio (optional)
- Bookmark/favorite
- Share ayah as image

**Interactions:**
- **Swipe Up:** Next ayah
- **Swipe Down:** Previous ayah
- **Tap:** Pause/play audio
- **Double Tap:** Bookmark
- **Long Press:** Share options

**UI Elements:**
```
┌─────────────────────┐
│                     │
│    Surah Name       │
│    Ayah Number      │
│                     │
│   ┌─────────────┐   │
│   │             │   │
│   │   Arabic    │   │
│   │   Text      │   │
│   │             │   │
│   └─────────────┘   │
│                     │
│   Translation       │
│   (tap to show)     │
│                     │
│   [♥] [🔊] [⋮]     │
└─────────────────────┘
```

**Data Structure:**
```typescript
interface QuranReel {
  surahNumber: number
  surahName: string
  ayahNumber: number
  arabicText: string
  translation: string
  transliteration: string
  audioUrl: string
  backgroundColor: string // Gradient color
}
```

---

#### 3. 🧭 Qibla Tab
**Route:** `/qibla`

**Features:**
- Compass with Kaaba direction
- Live rotation based on device orientation
- Distance to Mecca
- Current location
- Beautiful 3D compass design

**Already exists at `/qibla` - just integrate into tab**

---

#### 4. 🌙 Ramadan Tab
**Route:** `/ramadan`

**Features:**
- Ramadan calendar
- Suhoor/Iftar countdown
- Special Ramadan prayers
- Daily tips
- Tarawih times

**Components:**
- Countdown timer (big and prominent)
- Today's schedule
- Ramadan progress bar
- Daily hadith/tip

---

## 🎨 Design System

### Color Palette (PWA Mode)
```css
/* Primary */
--emerald-600: #059669
--teal-600: #0d9488

/* Gradients */
--gradient-prayer: linear-gradient(135deg, #667eea 0%, #764ba2 100%)
--gradient-quran: linear-gradient(135deg, #f093fb 0%, #f5576c 100%)
--gradient-qibla: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)
--gradient-ramadan: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)

/* Dark Mode */
--bg-dark: #0f172a
--card-dark: #1e293b
```

### Typography
```css
/* Arabic Text */
font-family: 'Amiri', 'Traditional Arabic', serif;

/* UI Text */
font-family: 'Inter', -apple-system, sans-serif;
```

### Spacing (Mobile-First)
```css
--spacing-xs: 0.5rem   /* 8px */
--spacing-sm: 0.75rem  /* 12px */
--spacing-md: 1rem     /* 16px */
--spacing-lg: 1.5rem   /* 24px */
--spacing-xl: 2rem     /* 32px */
```

---

## 🔧 Technical Implementation

### 1. PWA Detection Hook
```typescript
// hooks/use-pwa-mode.ts
export function usePWAMode() {
  const [isPWA, setIsPWA] = useState(false)
  
  useEffect(() => {
    const checkPWA = () => {
      const standalone = window.matchMedia('(display-mode: standalone)').matches
      const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent)
      const isIOSPWA = iOS && (window.navigator as any).standalone
      
      setIsPWA(standalone || isIOSPWA)
    }
    
    checkPWA()
  }, [])
  
  return isPWA
}
```

### 2. Bottom Navigation Component
```typescript
// components/pwa/bottom-nav.tsx
const tabs = [
  { id: 'home', icon: Home, label: 'Home', href: '/home' },
  { id: 'quran', icon: BookOpen, label: 'Quran', href: '/quran' },
  { id: 'qibla', icon: Compass, label: 'Qibla', href: '/qibla' },
  { id: 'ramadan', icon: Moon, label: 'Ramadan', href: '/ramadan' },
]
```

### 3. Swipe Gesture Hook
```typescript
// hooks/use-swipe-gesture.ts
export function useSwipeGesture(onSwipeUp, onSwipeDown) {
  // Implement touch event handlers
  // Detect swipe direction and velocity
  // Trigger callbacks
}
```

### 4. Daily Dua Slider Logic
```typescript
// Get dua based on day of week
const getDailyDua = () => {
  const dayOfWeek = new Date().getDay() // 0-6
  const duaIndex = dayOfWeek % totalDuas
  return duas[duaIndex]
}
```

---

## 📊 Data Requirements

### APIs Needed
1. **Prayer Times** - ✅ Already implemented
2. **Quran Data** - ✅ Already implemented
3. **Dua Collection** - ✅ Already implemented (equran.id)
4. **Nearby Mosques** - ✅ Already implemented
5. **Ramadan Calendar** - Need to implement

### New API Endpoints
```typescript
// Ramadan-specific data
interface RamadanDay {
  date: string
  day: number
  suhoorTime: string
  iftarTime: string
  tarawihTime: string
  tip: string
}
```

---

## 🚀 Implementation Phases

### Phase 1: Foundation (Week 1)
- [x] PWA detection hook
- [ ] Bottom tab navigation component
- [ ] PWA layout wrapper
- [ ] Route structure setup

### Phase 2: Home Tab (Week 2)
- [ ] Daily dua slider component
- [ ] Single mosque card component
- [ ] Integrate prayer times widget
- [ ] Home tab layout

### Phase 3: Quran Reels (Week 3)
- [ ] Vertical scroll container
- [ ] Quran reel card component
- [ ] Swipe gesture implementation
- [ ] Audio player integration
- [ ] Bookmark functionality

### Phase 4: Qibla & Ramadan (Week 4)
- [ ] Integrate existing Qibla page
- [ ] Ramadan calendar component
- [ ] Countdown timer
- [ ] Ramadan schedule

### Phase 5: Polish & Testing (Week 5)
- [ ] Animations and transitions
- [ ] Performance optimization
- [ ] PWA manifest updates
- [ ] Testing on various devices
- [ ] User feedback integration

---

## 🎯 Success Metrics

1. **Engagement**
   - Daily active users in PWA mode
   - Average session duration
   - Quran reels viewed per session

2. **Performance**
   - App load time < 2s
   - Smooth 60fps scrolling
   - Offline functionality

3. **User Experience**
   - App install rate
   - User retention (7-day, 30-day)
   - Feature usage analytics

---

## 🔐 Technical Considerations

### Performance
- Lazy load Quran ayahs (virtualized scrolling)
- Cache prayer times and duas
- Optimize images and fonts
- Service worker for offline support

### Accessibility
- Screen reader support
- High contrast mode
- Adjustable font sizes
- Keyboard navigation

### Browser Support
- iOS Safari 14+
- Android Chrome 90+
- Desktop browsers (fallback to website mode)

---

## 📝 Next Steps

1. ✅ Create this specification document
2. ⏳ Build PWA detection and bottom nav
3. ⏳ Create prototype demo
4. ⏳ Implement each tab iteratively
5. ⏳ Test and refine

---

**Created:** December 1, 2025
**Status:** In Progress
**Target Launch:** Q1 2026
