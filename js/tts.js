// tts.js v48-azure — Dual-Engine Audio Architecture for Bangla Verb Drills
// Supports Microsoft Azure Neural Voices (bn-BD-PradeepNeural / bn-BD-NabanitaNeural) + Google Neural Fallback + IndexedDB Caching

import { audioCache } from "./cache.js?v=48-azure";

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

        // Engine & Azure Configuration (Persisted in localStorage)
        this.currentEngine = localStorage.getItem("bangla_tts_engine") || "google";
        this.azureKey = localStorage.getItem("azure_speech_key") || "";
        this.azureRegion = localStorage.getItem("azure_speech_region") || "eastus";

        // Auto-unlock audio session on first user interaction (iOS / Safari / Chrome autoplay policy)
        ['click', 'touchstart', 'keydown'].forEach(evt => {
            document.addEventListener(evt, () => this.unlockAudioSession(), { once: true, passive: true });
        });
    }

    setSpeed(speed) {
        this.playSpeed = speed;
    }

    setEngine(engine) {
        this.currentEngine = (engine === "azure") ? "azure" : "google";
        localStorage.setItem("bangla_tts_engine", this.currentEngine);
    }

    getEngine() {
        return this.currentEngine;
    }

    setAzureConfig(key, region) {
        this.azureKey = (key || "").trim();
        this.azureRegion = (region || "eastus").trim();
        localStorage.setItem("azure_speech_key", this.azureKey);
        localStorage.setItem("azure_speech_region", this.azureRegion);
    }

    getAzureConfig() {
        return {
            key: this.azureKey,
            region: this.azureRegion,
            isConfigured: !!(this.azureKey && this.azureKey.length >= 20)
        };
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

    // Synthesizes speech using Microsoft Azure Speech REST API (Bangla & English Neural Voices)
    async synthesizeAzure(text, langCode = "bn", voiceGender = "female") {
        if (!this.azureKey) {
            throw new Error("Azure Speech Key not configured");
        }

        const region = this.azureRegion || "eastus";
        const isEnglish = (langCode === "en" || langCode.startsWith("en"));

        // Authentic Native Azure Neural Voices:
        // bn-BD-PradeepNeural: Rich Bangladeshi Male Neural Voice
        // bn-BD-NabanitaNeural: Warm Bangladeshi Female Neural Voice
        // en-US-GuyNeural / en-US-JennyNeural for English prompt
        let voiceName;
        let xmlLang;
        if (isEnglish) {
            xmlLang = "en-US";
            voiceName = (voiceGender === "male") ? "en-US-GuyNeural" : "en-US-JennyNeural";
        } else {
            xmlLang = "bn-BD";
            voiceName = (voiceGender === "male") ? "bn-BD-PradeepNeural" : "bn-BD-NabanitaNeural";
        }

        // Prosody speaking rate calculation (relative to 1.0)
        // 0.8x -> -20%, 1.0x -> 0%, 1.2x -> +20%, 1.4x -> +40%
        const ratePercent = Math.round((this.playSpeed - 1.0) * 100);
        const rateStr = ratePercent >= 0 ? `+${ratePercent}%` : `${ratePercent}%`;

        const escapedText = text.trim()
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');

        const ssml = `
<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="${xmlLang}">
    <voice name="${voiceName}">
        <prosody rate="${rateStr}">
            ${escapedText}
        </prosody>
    </voice>
</speak>`.trim();

        const endpoint = `https://${region}.tts.speech.microsoft.com/cognitiveservices/v1`;
        const response = await fetch(endpoint, {
            method: "POST",
            headers: {
                "Ocp-Apim-Subscription-Key": this.azureKey,
                "Content-Type": "application/ssml+xml",
                "X-Microsoft-OutputFormat": "audio-16khz-128kbitrate-mono-mp3",
                "User-Agent": "BanglaVerbsWeb"
            },
            body: ssml
        });

        if (!response.ok) {
            const errBody = await response.text().catch(() => "");
            throw new Error(`Azure TTS Error (HTTP ${response.status}): ${errBody || response.statusText}`);
        }

        return await response.blob();
    }

    // Calculates and applies pitch preservation flags and playback rates for Google fallback audio
    _applyVoicePitchAndRate(voiceGender) {
        const isMale = (voiceGender === "male");
        const targetPreserves = !isMale;

        let targetRate;
        if (isMale) {
            // Continuous masculine speed scaling (strictly clamped at 0.84 to preserve male pitch)
            targetRate = Math.min(0.84, Math.max(0.58, 0.70 + (this.playSpeed - 1.0) * 0.35));
        } else {
            targetRate = this.playSpeed;
        }

        if (this.audioPlayer.preservesPitch !== targetPreserves) {
            this.audioPlayer.preservesPitch = targetPreserves;
        }
        if ('webkitPreservesPitch' in this.audioPlayer && this.audioPlayer.webkitPreservesPitch !== targetPreserves) {
            this.audioPlayer.webkitPreservesPitch = targetPreserves;
        }
        if ('mozPreservesPitch' in this.audioPlayer && this.audioPlayer.mozPreservesPitch !== targetPreserves) {
            this.audioPlayer.mozPreservesPitch = targetPreserves;
        }

        if (Math.abs(this.audioPlayer.playbackRate - targetRate) > 0.005) {
            this.audioPlayer.playbackRate = targetRate;
        }
        if (Math.abs(this.audioPlayer.defaultPlaybackRate - targetRate) > 0.005) {
            this.audioPlayer.defaultPlaybackRate = targetRate;
        }
    }

    // Primary audio playback engine
    playAudioUrl(url, voiceGender = "female", speechId, engine = "google") {
        return new Promise((resolve) => {
            if (this.currentSpeechId !== speechId) {
                resolve(false);
                return;
            }

            this.audioPlayer.referrerPolicy = "no-referrer";
            this.audioPlayer.src = url;

            const isAzure = (engine === "azure");

            // For Azure: audio already has true gender & prosody speed baked in natively!
            const applyConfig = () => {
                if (isAzure) {
                    this.audioPlayer.preservesPitch = true;
                    if ('webkitPreservesPitch' in this.audioPlayer) this.audioPlayer.webkitPreservesPitch = true;
                    if ('mozPreservesPitch' in this.audioPlayer) this.audioPlayer.mozPreservesPitch = true;
                    this.audioPlayer.playbackRate = 1.0;
                    this.audioPlayer.defaultPlaybackRate = 1.0;
                } else {
                    this._applyVoicePitchAndRate(voiceGender);
                }
            };

            applyConfig();

            // Guard against Chrome media pipeline resets
            const enforce = () => {
                if (this._isEnforcing) return;
                this._isEnforcing = true;
                try {
                    if (this.currentSpeechId === speechId) {
                        applyConfig();
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

    // Main speech controller — Seamless Dual-Engine Orchestrator
    async speak(text, lang = "bn-BD", voiceGender = "female") {
        this.stop();
        this.unlockAudioSession();

        const speechId = this.currentSpeechId;

        if (!text || !text.trim()) return false;

        const isEnglish = lang === "en" || lang.startsWith("en");
        const langCode = isEnglish ? "en" : "bn";

        // ==========================================
        // STRATEGY 1: Microsoft Azure Speech (Primary if selected & configured)
        // ==========================================
        if (this.currentEngine === "azure" && this.azureKey) {
            try {
                // Step 1a: Check IndexedDB Cache for Azure audio
                const cachedUrl = await audioCache.getAudio(langCode, voiceGender, text, "azure", this.playSpeed);
                if (this.currentSpeechId !== speechId) return false;

                if (cachedUrl) {
                    const ok = await this.playAudioUrl(cachedUrl, voiceGender, speechId, "azure");
                    if (ok || this.currentSpeechId !== speechId) return ok;
                }

                // Step 1b: Fetch from Azure REST API
                const blob = await this.synthesizeAzure(text, langCode, voiceGender);
                if (this.currentSpeechId !== speechId) return false;

                if (blob) {
                    const blobUrl = URL.createObjectURL(blob);
                    // Cache in background for zero-latency replay
                    audioCache.saveAudio(langCode, voiceGender, text, blob, "azure", this.playSpeed).catch(() => {});
                    
                    const played = await this.playAudioUrl(blobUrl, voiceGender, speechId, "azure");
                    if (played || this.currentSpeechId !== speechId) return played;
                }
            } catch (azureErr) {
                console.warn("Azure TTS synthesis failed; falling back to Google Neural:", azureErr);
                // Graceful fallback to Google stream below
            }
        }

        if (this.currentSpeechId !== speechId) return false;

        // ==========================================
        // STRATEGY 2: Google Neural Stream (Default & Reliable Fallback)
        // ==========================================
        try {
            // Check Google audio cache
            const cachedUrl = await audioCache.getAudio(langCode, voiceGender, text, "google", 1.0);
            if (this.currentSpeechId !== speechId) return false;

            if (cachedUrl) {
                const cachedOk = await this.playAudioUrl(cachedUrl, voiceGender, speechId, "google");
                if (cachedOk || this.currentSpeechId !== speechId) return cachedOk;
            }
        } catch (err) {
            console.warn("Audio cache read error:", err);
        }

        if (this.currentSpeechId !== speechId) return false;

        // Stream from Google Translate endpoint
        const streamUrl = this.getTTSStreamUrl(text, langCode);
        const streamPlayed = await this.playAudioUrl(streamUrl, voiceGender, speechId, "google");

        if (this.currentSpeechId !== speechId) return false;

        if (streamPlayed) {
            // Cache successful stream in background
            try {
                fetch(streamUrl, { referrerPolicy: 'no-referrer' })
                    .then(r => r.ok ? r.blob() : null)
                    .then(blob => {
                        if (blob) audioCache.saveAudio(langCode, voiceGender, text, blob, "google", 1.0).catch(() => {});
                    })
                    .catch(() => {});
            } catch (e) {}
            return true;
        }

        console.warn(`Audio could not be played for "${text}" (${langCode}).`);
        return false;
    }
}

export const tts = new TTSEngine();
