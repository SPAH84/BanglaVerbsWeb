// tts.js v47 — High-Quality Audio Engine for Bangla Verb Drills
// Pure Google Neural Audio Stream + IndexedDB Caching + Locked Masculine Register at All Speeds

import { audioCache } from "./cache.js?v=47";

class TTSEngine {
    constructor() {
        this.audioPlayer = new Audio();
        this.audioPlayer.preload = "auto";
        this.audioPlayer.referrerPolicy = "no-referrer";
        this.audioCtx = null;
        this.keepAliveNode = null;
        this.isUnlocked = false;
        this._isEnforcing = false;
        this.playSpeed = 1.0;
        this.currentSpeechId = 0;

        // Auto-unlock audio session on first user interaction (iOS / Safari / Chrome autoplay policy)
        ['click', 'touchstart', 'keydown'].forEach(evt => {
            document.addEventListener(evt, () => this.unlockAudioSession(), { once: true, passive: true });
        });
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
            this.audioCtx.resume().catch(() => {});
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
                gain.gain.value = 0.00001; // Inaudible keep-alive signal to prevent hardware sleep on mobile
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

    // Immediately aborts any ongoing or pending speech without resetting audio engine
    stop() {
        this.currentSpeechId++; // Invalidate any running speak() promises immediately
        if (this.audioPlayer) {
            this.audioPlayer.pause();
            try {
                this.audioPlayer.currentTime = 0;
            } catch (e) {}
            this.audioPlayer.onended = null;
            this.audioPlayer.onerror = null;
        }
    }

    getTTSStreamUrl(text, lang = "bn") {
        const encodedText = encodeURIComponent(text.trim());
        const tl = (lang === "en" || lang.startsWith("en")) ? "en" : "bn";
        return `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodedText}&tl=${tl}&client=tw-ob`;
    }

    // Calculates and applies pitch preservation flags and playback rates
    _applyVoicePitchAndRate(voiceGender) {
        const isMale = (voiceGender === "male");
        const targetPreserves = !isMale;

        let targetRate;
        if (isMale) {
            // Continuous masculine speed scaling:
            // 0.8x -> 0.63 (slow, deep male)
            // 1.0x -> 0.70 (standard speed, rich baritone male)
            // 1.2x -> 0.77 (brisk speed, distinct masculine register)
            // 1.4x -> 0.84 (fast speed, strictly locked in male register)
            // Target rate is strictly capped at 0.84 so pitch NEVER reverts to female or chipmunk!
            targetRate = Math.min(0.84, Math.max(0.58, 0.70 + (this.playSpeed - 1.0) * 0.35));
        } else {
            // Female voice: keep natural pitch intact and scale directly to playSpeed
            targetRate = this.playSpeed;
        }

        // 1. Pitch preservation flags (must be false for male to lower pitch; true for female)
        if (this.audioPlayer.preservesPitch !== targetPreserves) {
            this.audioPlayer.preservesPitch = targetPreserves;
        }
        if ('webkitPreservesPitch' in this.audioPlayer && this.audioPlayer.webkitPreservesPitch !== targetPreserves) {
            this.audioPlayer.webkitPreservesPitch = targetPreserves;
        }
        if ('mozPreservesPitch' in this.audioPlayer && this.audioPlayer.mozPreservesPitch !== targetPreserves) {
            this.audioPlayer.mozPreservesPitch = targetPreserves;
        }

        // 2. Playback rates (only update if changed to avoid triggering unnecessary ratechange events)
        if (Math.abs(this.audioPlayer.playbackRate - targetRate) > 0.005) {
            this.audioPlayer.playbackRate = targetRate;
        }
        if (Math.abs(this.audioPlayer.defaultPlaybackRate - targetRate) > 0.005) {
            this.audioPlayer.defaultPlaybackRate = targetRate;
        }
    }

    // Primary audio playback engine
    playAudioUrl(url, voiceGender = "female", speechId) {
        return new Promise((resolve) => {
            if (this.currentSpeechId !== speechId) {
                resolve(false);
                return;
            }

            this.audioPlayer.referrerPolicy = "no-referrer";
            this.audioPlayer.src = url;

            // Apply immediately upon setting src
            this._applyVoicePitchAndRate(voiceGender);

            // Chrome and Safari can reset preservesPitch or playbackRate during media initialization.
            // Re-enforce across critical lifecycle events:
            const enforce = () => {
                if (this._isEnforcing) return;
                this._isEnforcing = true;
                try {
                    if (this.currentSpeechId === speechId) {
                        this._applyVoicePitchAndRate(voiceGender);
                    }
                } finally {
                    this._isEnforcing = false;
                }
            };

            const events = ["loadstart", "loadedmetadata", "loadeddata", "canplay", "play", "playing", "ratechange"];
            events.forEach(evt => this.audioPlayer.addEventListener(evt, enforce));

            let resolved = false;
            let timeoutId = null;

            const finish = (success) => {
                if (!resolved) {
                    resolved = true;
                    if (timeoutId) clearTimeout(timeoutId);
                    events.forEach(evt => this.audioPlayer.removeEventListener(evt, enforce));
                    this.audioPlayer.onended = null;
                    this.audioPlayer.onerror = null;
                    resolve(success && this.currentSpeechId === speechId);
                }
            };

            // Safety timeout (6s) so drill loop never hangs
            timeoutId = setTimeout(() => {
                finish(false);
            }, 6000);

            this.audioPlayer.onended = () => finish(true);
            this.audioPlayer.onerror = () => finish(false);

            const p = this.audioPlayer.play();
            if (p !== undefined) {
                p.catch(() => finish(false));
            }
        });
    }

    // Main speech controller — Uses Online Neural Stream & IndexedDB Audio Cache
    async speak(text, lang = "bn-BD", voiceGender = "female") {
        this.stop();
        this.unlockAudioSession();

        const speechId = this.currentSpeechId;

        if (!text || !text.trim()) return false;

        const isEnglish = lang === "en" || lang.startsWith("en");
        const langCode = isEnglish ? "en" : "bn";

        // Step 1: Check local IndexedDB cache (instant playback of previously streamed audio)
        try {
            const cachedUrl = await audioCache.getAudio(langCode, voiceGender, text);
            if (this.currentSpeechId !== speechId) return false; // Aborted by user pause

            if (cachedUrl) {
                const cachedOk = await this.playAudioUrl(cachedUrl, voiceGender, speechId);
                if (cachedOk || this.currentSpeechId !== speechId) return cachedOk;
            }
        } catch (err) {
            console.warn("Audio cache read error:", err);
        }

        if (this.currentSpeechId !== speechId) return false;

        // Step 2: Primary — Stream high-fidelity online neural audio
        const streamUrl = this.getTTSStreamUrl(text, langCode);
        const streamPlayed = await this.playAudioUrl(streamUrl, voiceGender, speechId);

        if (this.currentSpeechId !== speechId) return false; // Aborted by user pause

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

        console.warn(`Online audio stream could not play for "${text}" (${langCode}).`);
        return false;
    }
}

export const tts = new TTSEngine();
