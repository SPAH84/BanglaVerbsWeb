// tts.js v33 — High-Quality Cross-Browser Audio Engine for Bangla Verb Drills
// Features: Natural English Studio Voices (Female/Male) + Bengali Cloud Neural Streams + IndexedDB Caching + Cross-Browser Fallbacks

import { audioCache } from "./cache.js?v=33";

class TTSEngine {
    constructor() {
        this.audioPlayer = new Audio();
        this.audioPlayer.preload = "auto";
        this.audioPlayer.referrerPolicy = "no-referrer";
        this.audioCtx = null;
        this.keepAliveNode = null;
        this.isUnlocked = false;
        this.playSpeed = 1.0;
        this.currentUtterance = null; // Guard against Chrome garbage collection bug

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

            // In Chrome/Edge, voices load asynchronously via voiceschanged
            const onChanged = () => {
                const v = window.speechSynthesis.getVoices() || [];
                if (v.length > 0) {
                    window.speechSynthesis.removeEventListener('voiceschanged', onChanged);
                    resolve(v);
                }
            };
            window.speechSynthesis.addEventListener('voiceschanged', onChanged);

            // Safety fallback if event doesn't fire
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
                // Standalone throwaway audio element keeps this.audioPlayer clean
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

    getTTSStreamUrl(text, lang = "bn") {
        const encodedText = encodeURIComponent(text.trim());
        const tl = (lang === "en" || lang.startsWith("en")) ? "en" : "bn";
        return `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodedText}&tl=${tl}&client=tw-ob`;
    }

    // Main speech controller
    async speak(text, lang = "bn-BD", voiceGender = "female") {
        this.stop();
        this.unlockAudioSession();

        if (!text || !text.trim()) return;

        const isEnglish = lang === "en" || lang.startsWith("en");

        // 1. English prompts: Use Natural Studio Voice with Gender Matching
        if (isEnglish) {
            const played = await this.speakNative(text, "en", voiceGender);
            if (played) return;

            // Fast fallback: If speech synthesis fails to start, stream Google audio
            console.warn("SpeechSynthesis did not start for English, falling back to audio stream");
            const streamUrl = this.getTTSStreamUrl(text, "en");
            return this.playAudioUrl(streamUrl);
        }

        // 2. Bengali: Check local IndexedDB cache first
        try {
            const cachedUrl = await audioCache.getAudio(lang, voiceGender, text);
            if (cachedUrl) {
                const cachedOk = await this.playAudioUrl(cachedUrl);
                if (cachedOk) return;
            }
        } catch (err) {
            console.warn("Cache read error:", err);
        }

        // 3. Bengali: Stream directly via <audio> element
        const streamUrl = this.getTTSStreamUrl(text, "bn");
        const played = await this.playAudioUrl(streamUrl);

        if (played) {
            // Background cache attempt
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

            // Safety timeout (4s) so drill loop never hangs
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
    async speakNative(text, lang = "en", voiceGender = "female") {
        if (!('speechSynthesis' in window)) return false;

        // Ensure voices are loaded before picking
        let voices = this.getVoices();
        if (!voices || voices.length === 0) {
            voices = await this.voicesReady;
        }

        return new Promise((resolve) => {
            const utterance = new SpeechSynthesisUtterance(text);
            this.currentUtterance = utterance; // Prevent garbage collection dropping speech
            utterance.rate = this.playSpeed;

            const isEnglish = lang === "en" || lang.startsWith("en");
            utterance.lang = isEnglish ? "en-US" : "bn-BD";

            // Find best matching high-quality voice
            if (voices && voices.length > 0) {
                const targetCode = isEnglish ? "en" : "bn";
                const langVoices = voices.filter(v => v.lang && v.lang.toLowerCase().includes(targetCode));

                if (langVoices.length > 0) {
                    let bestVoice = null;

                    if (isEnglish) {
                        if (voiceGender === "female") {
                            // High quality female voices: Samantha (Mac/iOS), Jenny/Aria (Edge), Google US English, Zira, Karen
                            bestVoice = langVoices.find(v => /samantha|karen|victoria|zira|jenny|aria|female|google us english/i.test(v.name));
                        } else {
                            // High quality male voices: Daniel/Alex/Oliver (Mac), Guy/David (Edge), Google UK English Male, George
                            bestVoice = langVoices.find(v => /guy|daniel|david|alex|oliver|george|male|google uk english male/i.test(v.name));
                        }
                    } else {
                        // Bengali voices (e.g. Google বাংলা in Chrome, Lekha in macOS)
                        bestVoice = langVoices.find(v => /bangla|bengali|lekha/i.test(v.name));
                    }

                    utterance.voice = bestVoice || langVoices[0];
                }
            }

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
                    resolve(success);
                }
            };

            // If speech synthesis doesn't start within 400ms (e.g. Chrome silent drop), abort and report failure
            startTimer = setTimeout(() => {
                if (!started) {
                    console.warn("SpeechSynthesis did not start within 400ms");
                    try { window.speechSynthesis.cancel(); } catch (e) {}
                    finish(false);
                }
            }, 400);

            // Safety max duration (4.5s)
            safetyTimer = setTimeout(() => finish(true), 4500);

            utterance.onstart = () => {
                started = true;
                if (startTimer) clearTimeout(startTimer);
            };

            utterance.onend = () => finish(true);
            utterance.onerror = (err) => {
                console.warn("SpeechSynthesis error:", err);
                finish(false);
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
