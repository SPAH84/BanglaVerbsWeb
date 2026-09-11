// tts.js - Live Neural Text-to-Speech Engine for Bangla Verb Drills
// Supports dynamic streaming + on-demand IndexedDB caching + native fallback

import { audioCache } from "./cache.js";

class TTSEngine {
    constructor() {
        this.audioPlayer = new Audio();
        this.audioPlayer.preload = "auto";
        this.audioCtx = null;
        this.keepAliveNode = null;
        this.isUnlocked = false;
        this.playSpeed = 1.0;

        // Auto-unlock on first user interaction
        ['click', 'touchstart', 'keydown'].forEach(evt => {
            document.addEventListener(evt, () => this.unlockAudioSession(), { once: true, passive: true });
        });
    }

    setSpeed(speed) {
        this.playSpeed = speed;
        if (this.audioPlayer) {
            this.audioPlayer.playbackRate = speed;
        }
    }

    unlockAudioSession() {
        if (!this.audioCtx) {
            const AudioContextClass = window.AudioContext || window.webkitAudioContext;
            if (AudioContextClass) this.audioCtx = new AudioContextClass();
        }
        if (this.audioCtx && this.audioCtx.state === 'suspended') {
            this.audioCtx.resume();
        }

        if (!this.isUnlocked) {
            const silentWav = 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA=';
            this.audioPlayer.src = silentWav;
            this.audioPlayer.play().catch(() => {});
            this.isUnlocked = true;
        }
    }

    startKeepAlive() {
        try {
            this.unlockAudioSession();
            if (this.audioCtx && !this.keepAliveNode) {
                const osc = this.audioCtx.createOscillator();
                const gain = this.audioCtx.createGain();
                gain.gain.value = 0.00001; // Inaudible keep-alive signal
                osc.connect(gain);
                gain.connect(this.audioCtx.destination);
                osc.start();
                this.keepAliveNode = { osc, gain };
            }
        } catch (e) {
            console.warn("Audio keep-alive notice:", e);
        }
    }

    stopKeepAlive() {
        try {
            if (this.keepAliveNode) {
                this.keepAliveNode.osc.stop();
                this.keepAliveNode.osc.disconnect();
                this.keepAliveNode = null;
            }
        } catch (e) {}
    }

    stop() {
        if (this.audioPlayer) {
            this.audioPlayer.pause();
            this.audioPlayer.onended = null;
            this.audioPlayer.onerror = null;
        }
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
        }
    }

    // Build the high-quality Neural TTS stream URL
    getTTSStreamUrl(text, lang = "bn-BD", voiceGender = "female") {
        // High quality Google/Edge Bengali neural voices
        const encodedText = encodeURIComponent(text.trim());
        if (lang === "en") {
            return `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodedText}&tl=en&client=tw-ob`;
        }
        // Bengali Voice (bn-BD)
        return `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodedText}&tl=bn&client=tw-ob`;
    }

    // Main speech method: checks IndexedDB cache -> fetches live & caches -> native fallback
    async speak(text, lang = "bn-BD", voiceGender = "female") {
        this.stop();
        this.unlockAudioSession();

        if (!text || !text.trim()) return;

        // 1. Check local IndexedDB cache first
        try {
            const cachedUrl = await audioCache.getAudio(lang, voiceGender, text);
            if (cachedUrl) {
                return this.playAudioUrl(cachedUrl);
            }
        } catch (err) {
            console.warn("Cache read error:", err);
        }

        // 2. Fetch live from Cloud Neural TTS & save to cache
        const streamUrl = this.getTTSStreamUrl(text, lang, voiceGender);

        try {
            const response = await fetch(streamUrl);
            if (response.ok) {
                const blob = await response.blob();
                // Save to local cache in background
                audioCache.saveAudio(lang, voiceGender, text, blob).catch(() => {});
                const blobUrl = URL.createObjectURL(blob);
                return this.playAudioUrl(blobUrl);
            }
        } catch (fetchErr) {
            console.warn("Live TTS fetch failed, attempting direct stream or speech fallback:", fetchErr);
        }

        // 3. Fallback: Browser Web Speech API
        return this.speakNative(text, lang);
    }

    playAudioUrl(url) {
        return new Promise((resolve) => {
            this.audioPlayer.src = url;
            this.audioPlayer.playbackRate = this.playSpeed;

            let resolved = false;
            const finish = () => {
                if (!resolved) {
                    resolved = true;
                    this.audioPlayer.onended = null;
                    this.audioPlayer.onerror = null;
                    resolve();
                }
            };

            this.audioPlayer.onended = finish;
            this.audioPlayer.onerror = () => finish();

            const p = this.audioPlayer.play();
            if (p !== undefined) {
                p.catch(() => finish());
            }
        });
    }

    speakNative(text, lang = "bn-BD") {
        return new Promise((resolve) => {
            if (!('speechSynthesis' in window)) {
                resolve();
                return;
            }

            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = lang === "en" ? "en-US" : "bn-BD";
            utterance.rate = this.playSpeed;

            utterance.onend = () => resolve();
            utterance.onerror = () => resolve();

            window.speechSynthesis.speak(utterance);
        });
    }
}

export const tts = new TTSEngine();
