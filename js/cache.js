// cache.js - IndexedDB Audio Cache Manager for Bangla Verb Drills
// Stores live synthesized audio blobs locally for instant playback and 100% offline support.

const DB_NAME = "BanglaVerbDrills_AudioCache";
const DB_VERSION = 1;
const STORE_NAME = "audio_blobs";

class AudioCacheManager {
    constructor() {
        this.db = null;
        this.initPromise = this.initDB();
    }

    async initDB() {
        if (!('indexedDB' in window)) {
            console.warn("IndexedDB not supported in this environment; caching disabled.");
            return null;
        }

        return new Promise((resolve, reject) => {
            const request = indexedDB.open(DB_NAME, DB_VERSION);

            request.onupgradeneeded = (e) => {
                const db = e.target.result;
                if (!db.objectStoreNames.contains(STORE_NAME)) {
                    db.createObjectStore(STORE_NAME, { keyPath: "key" });
                }
            };

            request.onsuccess = (e) => {
                this.db = e.target.result;
                resolve(this.db);
            };

            request.onerror = (e) => {
                console.error("IndexedDB open error:", e);
                reject(e);
            };
        });
    }

    // Generate a unique cache key for a voice + text combination
    generateKey(lang, voiceGender, text) {
        return `${lang}_${voiceGender}_${encodeURIComponent(text.trim())}`;
    }

    // Retrieve cached audio blob URL if it exists
    async getAudio(lang, voiceGender, text) {
        await this.initPromise;
        if (!this.db) return null;

        const key = this.generateKey(lang, voiceGender, text);

        return new Promise((resolve) => {
            const transaction = this.db.transaction([STORE_NAME], "readonly");
            const store = transaction.objectStore(STORE_NAME);
            const request = store.get(key);

            request.onsuccess = () => {
                if (request.result && request.result.blob) {
                    const objectUrl = URL.createObjectURL(request.result.blob);
                    resolve(objectUrl);
                } else {
                    resolve(null);
                }
            };

            request.onerror = () => resolve(null);
        });
    }

    // Store audio blob into IndexedDB
    async saveAudio(lang, voiceGender, text, blob) {
        await this.initPromise;
        if (!this.db) return;

        const key = this.generateKey(lang, voiceGender, text);

        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([STORE_NAME], "readwrite");
            const store = transaction.objectStore(STORE_NAME);
            const request = store.put({
                key: key,
                blob: blob,
                timestamp: Date.now()
            });

            request.onsuccess = () => resolve(true);
            request.onerror = (e) => {
                console.warn("Failed to cache audio blob:", e);
                reject(e);
            };
        });
    }

    // Get total number of cached audio clips
    async getCacheCount() {
        await this.initPromise;
        if (!this.db) return 0;

        return new Promise((resolve) => {
            const transaction = this.db.transaction([STORE_NAME], "readonly");
            const store = transaction.objectStore(STORE_NAME);
            const request = store.count();

            request.onsuccess = () => resolve(request.result || 0);
            request.onerror = () => resolve(0);
        });
    }

    // Clear all cached audio
    async clearCache() {
        await this.initPromise;
        if (!this.db) return;

        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([STORE_NAME], "readwrite");
            const store = transaction.objectStore(STORE_NAME);
            const request = store.clear();

            request.onsuccess = () => resolve(true);
            request.onerror = (e) => reject(e);
        });
    }
}

export const audioCache = new AudioCacheManager();
