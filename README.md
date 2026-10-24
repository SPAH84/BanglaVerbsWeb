# BanglaVerbsWeb

An interactive, audio-first Bangladeshi Bangla verb conjugation drill app running in the browser. Powered by live cloud text-to-speech, natural studio voices, and IndexedDB caching (zero large pre-recorded audio packs).

**Live App**: [https://spah84.github.io/BanglaVerbsWeb/](https://spah84.github.io/BanglaVerbsWeb/)

---

## 🚀 Quick Start Guide

### 1. What is BanglaVerbs?
BanglaVerbs is designed to build automatic speech reflexes through active listening and recall. Every verb is conjugated across the 4 foundational Bangla pronouns:
* **আমি** (*Ami*) — I
* **তুমি** (*Tumi*) — You (familiar)
* **আপনি** (*Apni*) — You (polite)
* **সে** (*Se*) — He / She (ordinary)

---

### 2. How Drill Mode Works (Hands-Free Audio Cycle)
1. **English Prompt**: Speaks the English infinitive (e.g., *"To do"*).
2. **Recall Pause**: A silent window for you to mentally recall or say the Bangla verb aloud.
3. **Bangla Infinitive**: Speaks the infinitive (`করা`).
4. **4 Conjugated Persons**: Automatically speaks each person in order (`আমি করি`, `তুমি করো`, `আপনি করেন`, `সে করে`) with live on-screen visual highlights.
5. **Next Verb**: Automatically advances to the next verb in the selected level.

---

### 3. Key Controls

| Control | Location | What it does |
|---|---|---|
| **Tense Selector** | Top bar | Switch between **Pr. Simple**, **Pr. Perfect**, **Past Simple**, and **Past Perfect** |
| **Level Selector** | Top bar | Practice **Set 1 (20 basic verbs)**, **Set 2 (40 extended verbs)**, or **All (60 verbs)** |
| **Play / Pause** | Center button | Start or pause the drill at any point |
| **Next / Prev** | Player arrows | Skip ahead or revisit any verb |
| **Voice Selector** | Settings ⚙️ | Toggle between **Female** and **Male** voices |
| **Speed Control** | Settings ⚙️ | Adjust playback speed (**0.8x**, **1.0x**, **1.2x**, **1.4x**) with decoupled pitch preservation |
| **Pause Timing** | Settings ⚙️ | Adjust silence sliders (Recall pause, Repeat pause, Gap between verbs) |

---

### 4. Practice Modes

* **🎧 Drill Mode**: Hands-free audio practice with timed recall pauses.
* **📋 Conjugation Grid**: Complete interactive reference table. Search by English or Bangla. **Tap any card or cell** to instantly hear pronunciation.
* **📝 Quiz Mode**: Multiple-choice testing with 10 randomly selected conjugation challenges and audio feedback.

---

### 5. Learning Tips
1. **Master Set 1 First**: Start with **Set 1 (20 basic verbs)** in **Present Simple** to cement the primary endings (`-ি`, `-ো`, `-েন`, `-ে`).
2. **Say it Aloud**: Always speak your answer during the recall pause before the app speaks.
3. **Vowel Harmony**: Notice high-stem vowel raising (e.g., `কেনা` → `আমি কিনি`, `দেখা` → `আমি দেখি`, `খোলা` → `আমি খুলি`).

---

## 🛠️ Technology Stack
* Pure Vanilla JavaScript (ES Modules)
* Web Speech API + Google Cloud Translate Neural Audio Stream
* IndexedDB Audio Cache
* Responsive CSS Mobile-First Design with Dark / Light Theme
