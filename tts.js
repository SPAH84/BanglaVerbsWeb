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
            try {
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
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
        }
    }

    // Build the Google Translate TTS stream URL
    getTTSStreamUrl(text, lang = "bn-BD") {
        const encodedText = encodeURIComponent(text.trim());
        const tl = lang === "en" ? "en" : "bn";
        return `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodedText}&tl=${tl}&client=tw-ob`;
    }

    // Main speech method: checks IndexedDB cache -> plays live via direct src -> native fallback
    async speak(text, lang = "bn-BD", voiceGender = "female") {
        this.stop();
        this.unlockAudioSession();

        if (!text || !text.trim()) return;

        // 1. Check local IndexedDB cache first
        try {
            const cachedUrl = await audioCache.getAudio(lang, voiceGender, text);
            if (cachedUrl) {
                const cachedOk = await this.playAudioUrl(cachedUrl);
                if (cachedOk) return;
            }
        } catch (err) {
            console.warn("Cache read error:", err);
        }

        // 2. Play live audio stream (no Referer header sent)
        const streamUrl = this.getTTSStreamUrl(text, lang);
        const played = await this.playAudioUrl(streamUrl);

        if (played) {
            // Attempt background caching if permitted by browser
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

        // 3. Fallback: Browser Web Speech API
        console.warn("Cloud TTS stream unavailable, falling back to Web Speech API for:", text);
        return this.speakNative(text, lang, voiceGender);
    }

    playAudioUrl(url) {
        return new Promise((resolve) => {
            this.audioPlayer.referrerPolicy = "no-referrer";
            this.audioPlayer.src = url;
            this.audioPlayer.playbackRate = this.playSpeed;

            let resolved = false;
            const finish = (success) => {
                if (!resolved) {
                    resolved = true;
                    this.audioPlayer.onended = null;
                    this.audioPlayer.onerror = null;
                    resolve(success);
                }
            };

            this.audioPlayer.onended = () => finish(true);
            this.audioPlayer.onerror = (e) => {
                console.warn("Cloud TTS stream failed for:", url, e);
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

    speakNative(text, lang = "bn-BD", voiceGender = "female") {
        return new Promise((resolve) => {
            if (!('speechSynthesis' in window)) {
                resolve();
                return;
            }

            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.rate = this.playSpeed;
            utterance.lang = lang === "en" ? "en-US" : "bn-BD";

            // Attempt to match gender/language voice if installed
            try {
                const voices = window.speechSynthesis.getVoices();
                if (voices && voices.length > 0) {
                    const targetLang = lang === "en" ? "en" : "bn";
                    const matching = voices.filter(v => v.lang && v.lang.toLowerCase().includes(targetLang));
                    if (matching.length > 0) {
                        const genderMatch = matching.find(v => {
                            const name = v.name.toLowerCase();
                            if (voiceGender === "female") {
                                return name.includes("female") || name.includes("samantha") || name.includes("karen") || name.includes("zira");
                            } else {
                                return name.includes("male") || name.includes("david") || name.includes("daniel") || name.includes("alex");
                            }
                        });
                        utterance.voice = genderMatch || matching[0];
                    }
                }
            } catch (e) {}

            let done = false;
            const finish = () => {
                if (!done) {
                    done = true;
                    resolve();
                }
            };

            utterance.onend = finish;
            utterance.onerror = finish;

            // Safety timeout so loop never hangs indefinitely
            setTimeout(finish, 4000);

            if (window.speechSynthesis.paused) {
                window.speechSynthesis.resume();
            }

            window.speechSynthesis.speak(utterance);
        });
    }
}

export const tts = new TTSEngine();
