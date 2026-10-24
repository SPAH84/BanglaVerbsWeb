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
            return;
        }

        // Step 3: Fallback — Only if network/stream fails, use device Web Speech API
        if (this.currentSpeechId !== speechId) return; // Strict guard: do NOT speak local if paused!
        console.warn(`Online stream unavailable for "${text}" (${langCode}), falling back to local SpeechSynthesis`);
        return this.speakNative(text, langCode, voiceGender, speechId);
    }

    playAudioUrl(url, voiceGender = "female", speechId) {
        return new Promise((resolve) => {
            if (this.currentSpeechId !== speechId) {
                resolve(false);
                return;
            }

            this.audioPlayer.referrerPolicy = "no-referrer";
            this.audioPlayer.src = url;

            // Decoupled playback speed (0.8x, 1.0x, 1.2x, 1.4x)
            this.audioPlayer.playbackRate = this.playSpeed;

            // Pitch adjustment for Male voice:
            if (voiceGender === "male") {
                this.audioPlayer.preservesPitch = false;
                if ('webkitPreservesPitch' in this.audioPlayer) this.audioPlayer.webkitPreservesPitch = false;
                if ('mozPreservesPitch' in this.audioPlayer) this.audioPlayer.mozPreservesPitch = false;
                this.audioPlayer.playbackRate = this.playSpeed * 0.84;
            } else {
                this.audioPlayer.preservesPitch = true;
                if ('webkitPreservesPitch' in this.audioPlayer) this.audioPlayer.webkitPreservesPitch = true;
                if ('mozPreservesPitch' in this.audioPlayer) this.audioPlayer.mozPreservesPitch = true;
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

    // High-Quality Native Web Speech Engine with Gender Matching & Immediate Abort Guards
    async speakNative(text, lang = "en", voiceGender = "female", speechId) {
        if (!('speechSynthesis' in window)) return false;
        if (this.currentSpeechId !== speechId) return false;

        let voices = this.getVoices();
        if (!voices || voices.length === 0) {
            voices = await this.voicesReady;
        }

        if (this.currentSpeechId !== speechId) return false;

        const isEnglish = lang === "en" || lang.startsWith("en");
        const targetCode = isEnglish ? "en" : "bn";
        const langVoices = (voices || []).filter(v => v.lang && v.lang.toLowerCase().includes(targetCode));

        if (langVoices.length === 0) {
            return false;
        }

        return new Promise((resolve) => {
            if (this.currentSpeechId !== speechId) {
                resolve(false);
                return;
            }

            const utterance = new SpeechSynthesisUtterance(text);
            this.currentUtterance = utterance;
            utterance.rate = this.playSpeed;
            utterance.lang = isEnglish ? "en-US" : "bn-BD";

            let bestVoice = null;
            if (isEnglish) {
                if (voiceGender === "male") {
                    bestVoice = langVoices.find(v => /guy|daniel|david|alex|oliver|george|male|google uk english male/i.test(v.name));
                    utterance.pitch = 0.82;
                } else {
                    bestVoice = langVoices.find(v => /samantha|karen|victoria|zira|jenny|aria|female|google us english/i.test(v.name));
                    utterance.pitch = 1.05;
                }
            } else {
                // Bengali voices
                if (voiceGender === "male") {
                    bestVoice = langVoices.find(v => /bashkar|pradeep|male|পুরুষ/i.test(v.name));
                    utterance.pitch = bestVoice ? 0.92 : 0.68;
                } else {
                    bestVoice = langVoices.find(v => /nabanita|tanishaa|female|lekha|মহিলা/i.test(v.name));
                    utterance.pitch = 1.0;
                }
            }

            utterance.voice = bestVoice || langVoices[0];

            let started = false;
            let finished = false;
            let startTimer = null;
            let safetyTimer = null;

            const finish = (success) => {
                if (!finished) {
                    finished = true;
                    if (startTimer) clearTimeout(startTimer);
                    if (safetyTimer) clearTimeout(safetyTimer);
                    this.currentUtterance = null;
                    resolve(success && this.currentSpeechId === speechId);
                }
            };

            // If speech synthesis doesn't start within 500ms, abort
            startTimer = setTimeout(() => {
                if (!started) {
                    try { window.speechSynthesis.cancel(); } catch (e) {}
                    finish(false);
                }
            }, 500);

            // Safety max duration
            safetyTimer = setTimeout(() => finish(true), 4500);

            utterance.onstart = () => {
                started = true;
                if (startTimer) clearTimeout(startTimer);
                if (this.currentSpeechId !== speechId) {
                    try { window.speechSynthesis.cancel(); } catch (e) {}
                    finish(false);
                }
            };

            utterance.onend = () => finish(true);
            utterance.onerror = () => finish(false);

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
