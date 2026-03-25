<div align="center">

<h1>
  <img src="https://readme-typing-svg.demolab.com?font=Orbitron&weight=900&size=42&duration=3000&pause=1000&color=00D9FF&center=true&vCenter=true&width=700&lines=%E2%9C%8A+Rock.+%F0%9F%96%90+Paper.+%E2%9C%82+Scissors.;But+Your+Camera+Is+The+Controller." alt="Typing SVG" />
</h1>

<p align="center">
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" />
  <img src="https://img.shields.io/badge/MediaPipe-FF6F00?style=for-the-badge&logo=google&logoColor=white" />
  <img src="https://img.shields.io/badge/Gemini_API-4285F4?style=for-the-badge&logo=google&logoColor=white" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" />
  <img src="https://img.shields.io/badge/Status-Live-00C853?style=for-the-badge" />
</p>

<p align="center">
  <strong>A real-time hand gesture game using MediaPipe hand tracking + Gemini AI.<br/>No controllers. No clicks. Just your hands.</strong>
</p>

</div>

---

## ✦ What Is This?

> This isn't your grandma's Rock Paper Scissors.

This app uses your **webcam + MediaPipe hand tracking + Gemini AI** to detect your hand gesture in real time and pit it against a computer opponent — no buttons, no keyboards, just raw hand-to-hand (pun intended) combat.

Flash ✊ for Rock. Hold up 🖐 for Paper. Show ✌ for Scissors. The AI sees it instantly.

---

## ✦ Feature Highlights

| Feature | Description |
|---|---|
| 🖐 **MediaPipe Hand Tracking** | Detects and tracks 21 hand landmarks in real time via webcam |
| 🧠 **Gemini AI** | Interprets hand pose and drives intelligent game responses |
| ⚡ **Real-time** | Sub-second response — no lag, no polling |
| 🎮 **Zero-input UX** | No buttons needed — your hand *is* the controller |
| 🎨 **Clean UI** | Built with React + Tailwind CSS for a smooth, responsive experience |

---

## ✦ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React + Tailwind CSS |
| Hand Tracking | MediaPipe Hands |
| AI / Vision | Gemini API |
| Runtime | Node.js |

---

## ✦ Getting Started

### Prerequisites

```
Node.js v18+      →   https://nodejs.org
Gemini API Key    →   https://aistudio.google.com/apikey
A working webcam  →   (hopefully you have one)
```

### 1 · Clone & Install

```bash
git clone <your-repo-url>
cd <your-project-folder>
npm install
```

### 2 · Set Your API Key

Open `.env.local` and add your key:

```env
GEMINI_API_KEY=your_key_here
```

> 🔑 Get a free API key at [Google AI Studio](https://aistudio.google.com/apikey).

### 3 · Launch

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000), allow webcam access, and let the battle begin. 🥊

---

## ✦ How It Works

```
 📷 Webcam Feed
       ↓
 🖐 MediaPipe Hands
    → Detects 21 hand landmarks in real time
       ↓
 🧠 Gemini API
    → Classifies gesture (Rock / Paper / Scissors)
       ↓
 🎮 React Game Logic
    → Determines winner, updates score, renders result
       ↓
 🏆 Result displayed instantly
```

MediaPipe handles the low-level computer vision — tracking your hand's exact joint positions frame by frame. Gemini sits on top as the reasoning layer, turning those landmarks into a game decision.

---

## ✦ Project Structure

```
📁 your-project/
├── 📄 .env.local             ← API key lives here (never commit this)
├── 📄 package.json
├── 📁 src/
│   ├── 📄 App.jsx            ← root component
│   ├── 📁 components/        ← game UI components
│   └── 📁 hooks/             ← webcam & gesture logic
└── 📁 public/
```

---

## ✦ Why I Built This

I wanted to go beyond traditional UI inputs and explore what a purely gesture-driven experience could feel like. Combining MediaPipe's precise hand landmark detection with Gemini's reasoning layer turned out to be a really natural fit — and building it in React made the state management for a real-time game surprisingly clean.

---

## ✦ Challenges & Learnings

- **Frame throttling** — Sending every single webcam frame to an API would tank performance. Finding the right capture interval was key
- **Landmark-to-gesture mapping** — MediaPipe gives you 21 raw joint coordinates. Translating those into Rock / Paper / Scissors reliably took iteration
- **Real-time UX** — Designing clear feedback when there's no traditional input (clicks, taps) forced me to think differently about state and visual cues

---

## ✦ Contributing

Got ideas? Found a bug? PRs are welcome.

1. Fork → Branch → Commit → PR
2. Keep code clean and gestures cleaner 🤌

---

## ✦ License

MIT — use it, remix it, ship it.

---

<div align="center">
<sub>Built with curiosity, caffeine, and a webcam ☕</sub>
</div>