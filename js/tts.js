// tts.js v40 — High-Quality Cross-Browser Audio Engine for Bangla Verb Drills
// Features: True Female & Male Voice Selection + Decoupled Pitch & Speed (up to 1.4x) + Instant Pause Cancellation

import { audioCache } from "./cache.js?v=38";

class TTSEngine {
    constructor() {
        this.audioPlayer = new Audio();
        this.audioPlayer.preload = "auto";
        this.audioPlayer.referrerPolicy = "no-referrer";
        this.audioCtx = null;
        this.audioSourceNode = null;
        this.filterNode = null;
        this.keepAliveNode = null;
        this.isUnlocked = false;
        this.playSpeed = 1.0;
        this.currentSpeechId = 0;
        this.currentUtterance = null;

        // Preload voices with promise to resolve async loading in Chrome & Edge
        this.voicesReady = this._initVoices();

        // Auto-unlock on first user interaction
        ['click', 'touchstart', 'keydown'].forEach(evt => {
            document.addEventListener(evt, () => this.unlockAudioSession(), { once: true, passive: true });
        });
    }

    _initVoices() {
        return new Promise(resolve => {
            if (!('speechSynthesis' in window)) { resolve([]); return; }
            const immediate = window.speechSynthesis.getVoices();
            if (immediate && immediate.length > 0) { resolve(immediate); return; }

            const onChanged = () => {
                const v = window.speechSynthesis.getVoices() || [];
                if (v.length > 0) {
                    window.speechSynthesis.removeEventListener('voiceschanged', onChanged);
                    resolve(v);
                }
            };
            window.speechSynthesis.addEventListener('voiceschanged', onChanged);

            setTimeout(() => {
                window.speechSynthesis.removeEventListener('voiceschanged', onChanged);
                resolve(window.speechSynthesis.getVoices() || []);
            }, 1500);
        });
    }

    getVoices() {
        if (!('speechSynthesis' in window)) return [];
        return window.speechSynthesis.getVoices() || [];
    }

    hasBengaliVoice() {
        const voices = this.getVoices();
        return voices.some(v => v.lang && v.lang.toLowerCase().includes("bn"));
    }

    setSpeed(speed) {
        this.playSpeed = speed;
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

    // Immediately aborts any ongoing or pending speech
    stop() {
        this.currentSpeechId++; // Invalidate any running speak() promises immediately
        if (this.audioPlayer) {
            this.audioPlayer.pause();
            this.audioPlayer.removeAttribute("src");
            this.audioPlayer.load();
            this.audioPlayer.onended = null;
            this.audioPlayer.onerror = null;
        }
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
        }
        this.currentUtterance = null;
    }

    getTTSStreamUrl(text, lang = "bn") {
        const encodedText = encodeURIComponent(text.trim());
        const tl = (lang === "en" || lang.startsWith("en")) ? "en" : "bn";
        return `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodedText}&tl=${tl}&client=tw-ob`;
    }

    // Main speech controller — Strongly prefers Online Neural Stream & IndexedDB Audio Cache
    async speak(text, lang = "bn-BD", voiceGender = "female") {
        this.stop();
        this.unlockAudioSession();

        const speechId = this.currentSpeechId;

        if (!text || !text.trim()) return;

        const isEnglish = lang === "en" || lang.startsWith("en");
        const langCode = isEnglish ? "en" : "bn";

        // Step 1: Check local IndexedDB cache (instant playback of previously streamed audio)
        try {
            const cachedUrl = await audioCache.getAudio(langCode, voiceGender, text);
            if (this.currentSpeechId !== speechId) return; // Aborted by user pause

            if (cachedUrl) {
                const cachedOk = await this.playAudioUrl(cachedUrl, voiceGender, speechId);
                if (cachedOk || this.currentSpeechId !== speechId) return;
            }
        } catch (err) {
            console.warn("Audio cache read error:", err);
        }

        if (this.currentSpeechId !== speechId) return;

        // Step 2: Primary — Stream high-fidelity online neural audio
        const streamUrl = this.getTTSStreamUrl(text, langCode);
        const streamPlayed = await this.playAudioUrl(streamUrl, voiceGender, speechId);

        if (this.currentSpeechId !== speechId) return; // Aborted by user pause

        if (streamPlayed) {
            // Save successful audio stream to cache in background for instant offline repeat
            try {
                fetch(streamUrl, { referrerPolicy: 'no-referrer' })
                    .then(r => r.ok ? r.blob() : null)
                    .then(blob => {
                        if (blob) audioCache.saveAudio(langCode, voiceGender, text, blob).catch(() => {});
                    })
                    .catch(() => {});
            } catch (e) {}
            return true;
        }

        // Local browser SpeechSynthesis has been completely scrapped as requested.
        // It produced robotic, metallic computer sounds on macOS/Chrome.
        console.warn(`Online audio stream could not play for "${text}" (${langCode}).`);
        return false;
    }

    playAudioUrl(url, voiceGender = "female", speechId) {
        return new Promise((resolve) => {
            if (this.currentSpeechId !== speechId) {
                resolve(false);
                return;
            }

            this.audioPlayer.referrerPolicy = "no-referrer";
            this.audioPlayer.src = url;

            // Decoupled playback speed & pitch adjustment:
            if (voiceGender === "male") {
                // Lower pitch into masculine register while scaling cleanly with chosen speed:
                this.audioPlayer.preservesPitch = false;
                if ('webkitPreservesPitch' in this.audioPlayer) this.audioPlayer.webkitPreservesPitch = false;
                if ('mozPreservesPitch' in this.audioPlayer) this.audioPlayer.mozPreservesPitch = false;
                // Ratio lowers base female voice to masculine register while maintaining tempo scale
                this.audioPlayer.playbackRate = this.playSpeed * 0.82;
            } else {
                this.audioPlayer.preservesPitch = true;
                if ('webkitPreservesPitch' in this.audioPlayer) this.audioPlayer.webkitPreservesPitch = true;
                if ('mozPreservesPitch' in this.audioPlayer) this.audioPlayer.mozPreservesPitch = true;
                this.audioPlayer.playbackRate = this.playSpeed;
            }

            let resolved = false;
            let timeoutId = null;

            const finish = (success) => {
                if (!resolved) {
                    resolved = true;
                    if (timeoutId) clearTimeout(timeoutId);
                    this.audioPlayer.onended = null;
                    this.audioPlayer.onerror = null;
                    resolve(success && this.currentSpeechId === speechId);
                }
            };

            // Safety timeout (4s) so drill loop never hangs
            timeoutId = setTimeout(() => {
                finish(false);
            }, 4000);

            this.audioPlayer.onended = () => finish(true);
            this.audioPlayer.onerror = () => finish(false);

            const p = this.audioPlayer.play();
            if (p !== undefined) {
                p.catch(() => finish(false));
            }
        });
    }
}

export const tts = new TTSEngine();
