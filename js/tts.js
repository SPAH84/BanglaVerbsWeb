// tts.js - High-Quality Audio Engine for Bangla Verb Drills
// Supports: Natural English Studio Voices + Bengali Cloud Neural Streams + IndexedDB Caching + Cross-Browser Fallbacks

import { audioCache } from "./cache.js?v=32";

class TTSEngine {
    constructor() {
        this.audioPlayer = new Audio();
        this.audioPlayer.preload = "auto";
        this.audioPlayer.referrerPolicy = "no-referrer";
        this.audioCtx = null;
        this.keepAliveNode = null;
        this.isUnlocked = false;
        this.playSpeed = 1.0;
        this.currentUtterance = null; // Guard against Chrome GC bug

        // Preload voices for Web Speech API
        if ('speechSynthesis' in window) {
            window.speechSynthesis.onvoiceschanged = () => {
                this.getVoices();
            };
        }

        // Auto-unlock on first user interaction
        ['click', 'touchstart', 'keydown'].forEach(evt => {
            document.addEventListener(evt, () => this.unlockAudioSession(), { once: true, passive: true });
        });
    }

    getVoices() {
        if (!('speechSynthesis' in window)) return [];
        return window.speechSynthesis.getVoices() || [];
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
            try {
                // Unlock using a standalone throwaway audio element so this.audioPlayer stays clean
                const dummy = new Audio('data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA=');
                dummy.play().catch(() => {});
            } catch (e) {}
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
        if ('speechSynthesis' in window && window.speechSynthesis.speaking) {
            window.speechSynthesis.cancel();
        }
    }

    // Google Translate TTS endpoint for Bengali
    getTTSStreamUrl(text, lang = "bn") {
        const encodedText = encodeURIComponent(text.trim());
        const tl = lang.startsWith("en") ? "en" : "bn";
        return `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodedText}&tl=${tl}&client=tw-ob`;
    }

    // Main speech controller
    async speak(text, lang = "bn-BD", voiceGender = "female") {
        this.stop();
        this.unlockAudioSession();

        if (!text || !text.trim()) return;

        // 1. For English prompts: Use Browser's Natural Studio Voices
        // Provides crystal-clear human speech with true female/male voice switching
        if (lang === "en" || lang.startsWith("en")) {
            return this.speakNative(text, "en", voiceGender);
        }

        // 2. For Bengali: Check local IndexedDB cache first
        try {
            const cachedUrl = await audioCache.getAudio(lang, voiceGender, text);
            if (cachedUrl) {
                const cachedOk = await this.playAudioUrl(cachedUrl);
                if (cachedOk) return;
            }
        } catch (err) {
            console.warn("Cache read error:", err);
        }

        // 3. For Bengali: Stream directly via <audio> element (no CORS fetch)
        const streamUrl = this.getTTSStreamUrl(text, "bn");
        const played = await this.playAudioUrl(streamUrl);

        if (played) {
            // Attempt background caching if permitted
            try {
                fetch(streamUrl, { referrerPolicy: 'no-referrer' })
                    .then(r => r.ok ? r.blob() : null)
                    .then(blob => {
                        if (blob) audioCache.saveAudio(lang, voiceGender, text, blob).catch(() => {});
                    })
                    .catch(() => {});
            } catch (e) {}
            return;
        }

        // 4. Fallback: Browser Web Speech API for Bengali
        return this.speakNative(text, "bn", voiceGender);
    }

    playAudioUrl(url) {
        return new Promise((resolve) => {
            this.audioPlayer.referrerPolicy = "no-referrer";
            this.audioPlayer.src = url;
            this.audioPlayer.playbackRate = this.playSpeed;

            let resolved = false;
            let timeoutId = null;

            const finish = (success) => {
                if (!resolved) {
                    resolved = true;
                    if (timeoutId) clearTimeout(timeoutId);
                    this.audioPlayer.onended = null;
                    this.audioPlayer.onerror = null;
                    resolve(success);
                }
            };

            // Safety timeout (4s) so the loop never hangs if stream stalls
            timeoutId = setTimeout(() => {
                console.warn("Audio stream playback timed out for:", url);
                finish(false);
            }, 4000);

            this.audioPlayer.onended = () => finish(true);
            this.audioPlayer.onerror = (e) => {
                console.warn("Audio stream failed for:", url, e);
                finish(false);
            };

            const p = this.audioPlayer.play();
            if (p !== undefined) {
                p.catch((err) => {
                    console.warn("audioPlayer.play() rejected:", err);
                    finish(false);
                });
            }
        });
    }

    // High-Quality Native Web Speech Engine with Gender Matching & Chrome Bug Fixes
    speakNative(text, lang = "en", voiceGender = "female") {
        return new Promise((resolve) => {
            if (!('speechSynthesis' in window)) {
                resolve();
                return;
            }

            const utterance = new SpeechSynthesisUtterance(text);
            this.currentUtterance = utterance; // Keep reference to prevent GC dropping speech
            utterance.rate = this.playSpeed;

            const isEnglish = lang === "en" || lang.startsWith("en");
            utterance.lang = isEnglish ? "en-US" : "bn-BD";

            // Find best matching high-quality voice
            const voices = this.getVoices();
            if (voices && voices.length > 0) {
                const targetCode = isEnglish ? "en" : "bn";
                const langVoices = voices.filter(v => v.lang && v.lang.toLowerCase().includes(targetCode));

                if (langVoices.length > 0) {
                    let bestVoice = null;

                    if (isEnglish) {
                        // High quality natural voices for Mac/Safari, Edge, and Chrome
                        if (voiceGender === "female") {
                            // Samantha (Mac/iOS), Jenny/Aria (Edge), Google US English / Karen / Victoria / Zira
                            bestVoice = langVoices.find(v => /jenny|aria|samantha|karen|victoria|zira|female/i.test(v.name));
                        } else {
                            // Guy/David (Edge), Daniel/Alex/Oliver (Mac), Google UK English Male / George
                            bestVoice = langVoices.find(v => /guy|daniel|david|alex|oliver|george|male/i.test(v.name));
                        }
                    } else {
                        // Bengali voices (e.g. Google বাংলা in Chrome, Lekha in macOS)
                        bestVoice = langVoices.find(v => /bangla|bengali|lekha/i.test(v.name));
                    }

                    utterance.voice = bestVoice || langVoices[0];
                }
            }

            let done = false;
            let safetyTimer = null;

            const finish = () => {
                if (!done) {
                    done = true;
                    if (safetyTimer) clearTimeout(safetyTimer);
                    this.currentUtterance = null;
                    resolve();
                }
            };

            // Safety timeout (4.5s) so speech synthesis never blocks the drill
            safetyTimer = setTimeout(finish, 4500);

            utterance.onend = finish;
            utterance.onerror = (err) => {
                console.warn("SpeechSynthesis error:", err);
                finish();
            };

            // Resume speech synthesis if suspended by browser
            try {
                if (window.speechSynthesis.paused) {
                    window.speechSynthesis.resume();
                }
            } catch (e) {}

            window.speechSynthesis.speak(utterance);
        });
    }
}

export const tts = new TTSEngine();
