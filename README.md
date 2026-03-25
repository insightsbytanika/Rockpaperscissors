<div align="center">

<h1>
  <img src="https://readme-typing-svg.demolab.com?font=Orbitron&weight=900&size=42&duration=3000&pause=1000&color=00D9FF&center=true&vCenter=true&width=700&lines=%E2%9C%8A+Rock.+%F0%9F%96%90+Paper.+%E2%9C%82+Scissors.;But+Your+Camera+Is+The+Controller." alt="Typing SVG" />
</h1>

<p align="center">
  <img src="https://img.shields.io/badge/Vision-Computer_Vision-FF6F00?style=for-the-badge&logo=opencv&logoColor=white" />
  <img src="https://img.shields.io/badge/Stack-Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" />
  <img src="https://img.shields.io/badge/AI-Multimodal-4285F4?style=for-the-badge&logo=google&logoColor=white" />
  <img src="https://img.shields.io/badge/Status-Live-00C853?style=for-the-badge" />
</p>

<p align="center">
  <strong>A real-time hand gesture game powered by multimodal AI vision.<br/>No controllers. No clicks. Just your hands.</strong>
</p>

</div>

---

## ✦ What Is This?

> This isn't your grandma's Rock Paper Scissors.

This app uses your **webcam + a multimodal vision model** to detect your hand gesture in real time and pit it against a computer opponent — no buttons, no keyboards, just raw hand-to-hand (pun intended) combat.

Flash ✊ for Rock. Hold up 🖐 for Paper. Show ✌ for Scissors. The AI sees it instantly.

---

## ✦ Feature Highlights

| Feature | Description |
|---|---|
| 🤖 **AI Vision** | Detects your hand gesture live via webcam |
| ⚡ **Real-time** | Sub-second response — no lag, no polling |
| 🧠 **Smart Detection** | Handles lighting variance and hand orientations |
| 🎮 **Zero-input UX** | No buttons needed — your hand *is* the controller |
| 🌐 **Web-native** | Runs entirely in the browser via Node.js dev server |

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

Open `.env.local` and drop in your key:

```env
GEMINI_API_KEY=your_key_here
```

> 🔑 Don't have a key? Grab one free at [Google AI Studio](https://aistudio.google.com/apikey).

### 3 · Launch

```bash
npm run dev
```

Then open [http://localhost:3000](http://localhost.3000) and let the battle begin. 🥊

---

## ✦ How It Works

```
 📷 Webcam Frame
       ↓
 🧠 Vision AI Model
       ↓
 🔍 Gesture Classification  (Rock / Paper / Scissors / Unknown)
       ↓
 🎮 Game Logic Engine
       ↓
 🏆 Winner Determined & Displayed
```

Each captured frame is processed and classified by the vision model. The result feeds directly into the game loop — elegant, fast, and requires zero custom ML model training.

---

## ✦ Project Structure

```
📁 your-project/
├── 📄 .env.local          ← your API key lives here
├── 📄 package.json
├── 📁 app/
│   ├── 📄 page.tsx        ← main game UI
│   └── 📄 api/            ← vision model integration
└── 📁 public/             ← static assets
```

---

## ✦ Built With

<p>
  <img src="https://img.shields.io/badge/Next.js-000000?style=flat-square&logo=nextdotjs&logoColor=white" />
  <img src="https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=nodedotjs&logoColor=white" />
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/WebRTC-333333?style=flat-square&logo=webrtc&logoColor=white" />
  <img src="https://img.shields.io/badge/Gemini_API-4285F4?style=flat-square&logo=google&logoColor=white" />
</p>

---

## ✦ Why I Built This

I wanted to explore how far modern vision models could go beyond text — specifically, whether they could power a real-time interactive experience with zero latency. Turns out, they can. This project was my way of pushing that boundary while building something actually fun to play with.

---

## ✦ Challenges & Learnings

- **Latency** — Streaming frames to an API and getting back results fast enough to feel real-time required careful frame throttling
- **Gesture ambiguity** — Edge cases like partially closed hands needed prompt engineering to handle gracefully
- **UX without input** — Designing a UI that gives clear feedback when the only input is a hand gesture was a fun constraint to work within

---

## ✦ Contributing

Found a bug? Got a wild idea (like multiplayer over WebSockets)? PRs are welcome.

1. Fork → Branch → Commit → PR
2. Please keep code clean and gestures clean 🤌

---

## ✦ License

MIT — use it, remix it, ship it.

---

<div align="center">
<sub>Built with curiosity, caffeine, and a webcam ☕</sub>
</div>