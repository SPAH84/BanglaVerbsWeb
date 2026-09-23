// app.js - Main Application Controller for BanglaVerbsWeb
// Powered by Live Cloud Neural TTS + On-Demand IndexedDB Caching

import { VERBS, VERB_SETS, getVerbForms } from "./data/verbs.js";
import { TENSES, DEFAULT_TENSE } from "./data/tenses.js";
import { tts } from "./tts.js?v=32";
import { audioCache } from "./cache.js?v=32";

// --- STATE MANAGEMENT ---
let selectedTense = DEFAULT_TENSE;
let selectedLevel = "1"; // "1" (Foundation - 19), "2" (Extended - 40), or "all" (59)
let selectedGender = "female"; // "female" or "male"
let playSpeed = 1.0;
let isPlaying = false;
let currentDrillIndex = 0;
let drillTimeout = null;
let currentPartIndex = 0;

// Timing parameters (in seconds)
let pauseRecall = 1.5;
let pauseRepeat = 1.0;
let pauseGap = 2.0;

// Quiz State
let quizQuestions = [];
let currentQuizIndex = 0;
let quizScore = 0;

// --- DOM ELEMENTS ---
const themeToggle = document.getElementById("theme-toggle");
const tenseRadios = document.querySelectorAll('input[name="tense-select"]');
const levelRadios = document.querySelectorAll('input[name="level-select"]');
const genderRadios = document.querySelectorAll('input[name="voice-gender"]');
const navItems = document.querySelectorAll(".nav-item");
const screens = document.querySelectorAll(".app-screen");

// Player Elements
const drillProgressText = document.getElementById("drill-progress-text");
const drillProgressBar = document.getElementById("drill-progress-bar");
const drillDisplayEng = document.getElementById("drill-display-eng");
const drillDisplayBnInf = document.getElementById("drill-display-bn-inf");
const drillValAmi = document.getElementById("drill-val-ami");
const drillValTumi = document.getElementById("drill-val-tumi");
const drillValApni = document.getElementById("drill-val-apni");
const drillValSe = document.getElementById("drill-val-se");

const btnPrev = document.getElementById("btn-prev");
const btnPlay = document.getElementById("btn-play");
const btnNext = document.getElementById("btn-next");
const playIcon = btnPlay.querySelector(".play-icon");
const pauseIcon = btnPlay.querySelector(".pause-icon");

// Settings Elements
const settingsHeader = document.querySelector(".settings-header");
const settingsContent = document.querySelector(".settings-content");
const settingsCard = document.querySelector(".settings-card");
const speedButtons = document.querySelectorAll(".speed-btn");
const sliderPauseRecall = document.getElementById("param-pause-recall");
const sliderPauseRepeat = document.getElementById("param-pause-repeat");
const sliderPauseGap = document.getElementById("param-pause-gap");
const valPauseRecall = document.getElementById("val-pause-recall");
const valPauseRepeat = document.getElementById("val-pause-repeat");
const valPauseGap = document.getElementById("val-pause-gap");

// Search & Grid Elements
const verbSearch = document.getElementById("verb-search");
const verbsList = document.getElementById("verbs-list");

// Quiz Elements
const quizProgressText = document.getElementById("quiz-progress-text");
const quizScoreText = document.getElementById("quiz-score-text");
const quizPrompt = document.getElementById("quiz-question-prompt");
const quizAudioBtn = document.getElementById("quiz-audio-btn");
const quizOptionsContainer = document.getElementById("quiz-options-container");
const btnQuizNext = document.getElementById("btn-quiz-next");

// --- HELPER: GET CURRENT ACTIVE VERBS LIST ---
function getActiveVerbs() {
    if (selectedLevel === "all") {
        return VERBS;
    }
    const setNum = parseInt(selectedLevel, 10);
    return VERBS.filter(v => v.set === setNum);
}

// --- INITIALIZATION ---
document.addEventListener("DOMContentLoaded", () => {
    // 1. Theme Toggle
    themeToggle.addEventListener("click", () => {
        document.body.classList.toggle("dark-mode");
        document.body.classList.toggle("light-mode");
    });

    // 2. Navigation
    const mainContent = document.querySelector('.app-main-content');
    const resetScrollToTop = () => {
        if (mainContent) mainContent.scrollTop = 0;
        window.scrollTo(0, 0);
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
    };

    navItems.forEach(item => {
        item.addEventListener("click", () => {
            const targetScreen = item.getAttribute("data-screen");

            navItems.forEach(nav => nav.classList.remove("active"));
            item.classList.add("active");

            screens.forEach(screen => {
                screen.classList.remove("active");
                if (screen.id === targetScreen) {
                    screen.classList.add("active");
                }
            });

            resetScrollToTop();

            if (targetScreen !== "screen-drills" && isPlaying) {
                pauseDrill();
            }

            if (targetScreen === "screen-quiz") {
                startQuiz();
                resetScrollToTop();
            }
        });
    });

    // 3. Tense Selector
    tenseRadios.forEach(radio => {
        radio.addEventListener("change", (e) => {
            selectedTense = e.target.value;
            if (isPlaying) {
                pauseDrill();
            }
            updatePlayerView();
            renderVerbsGrid();
            if (document.getElementById("screen-quiz").classList.contains("active")) {
                startQuiz();
            }
        });
    });

    // 4. Level / Set Selector
    levelRadios.forEach(radio => {
        radio.addEventListener("change", (e) => {
            selectedLevel = e.target.value;
            currentDrillIndex = 0;
            if (isPlaying) {
                pauseDrill();
            }
            updatePlayerView();
            renderVerbsGrid();
            if (document.getElementById("screen-quiz").classList.contains("active")) {
                startQuiz();
            }
        });
    });

    // 5. Voice Gender Selector
    genderRadios.forEach(radio => {
        radio.addEventListener("change", (e) => {
            selectedGender = e.target.value;
        });
    });

    // 6. Player Controls
    btnPlay.addEventListener("click", togglePlay);
    btnPrev.addEventListener("click", () => navigateDrill(-1));
    btnNext.addEventListener("click", () => navigateDrill(1));

    // 7. Settings Card Toggle
    settingsHeader.addEventListener("click", () => {
        settingsCard.classList.toggle("expanded");
        settingsContent.classList.toggle("hidden");
    });

    // 8. Speed Buttons
    speedButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            speedButtons.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            playSpeed = parseFloat(btn.getAttribute("data-speed"));
            tts.setSpeed(playSpeed);
        });
    });

    // 9. Timing Sliders
    sliderPauseRecall.addEventListener("input", (e) => {
        pauseRecall = parseFloat(e.target.value);
        valPauseRecall.textContent = `${pauseRecall.toFixed(1)}s`;
    });
    sliderPauseRepeat.addEventListener("input", (e) => {
        pauseRepeat = parseFloat(e.target.value);
        valPauseRepeat.textContent = `${pauseRepeat.toFixed(1)}s`;
    });
    sliderPauseGap.addEventListener("input", (e) => {
        pauseGap = parseFloat(e.target.value);
        valPauseGap.textContent = `${pauseGap.toFixed(1)}s`;
    });

    // 10. Search & Grid
    renderVerbsGrid();
    verbSearch.addEventListener("input", filterVerbs);

    // 11. Quiz Controls
    quizAudioBtn.addEventListener("click", playQuizPromptAudio);
    btnQuizNext.addEventListener("click", loadNextQuizQuestion);

    // Initial View
    updatePlayerView();
});

// --- AUDIO UTILITIES & TIMING ---
function wait(seconds) {
    return new Promise(resolve => {
        if (!isPlaying) {
            resolve();
            return;
        }
        drillTimeout = setTimeout(resolve, seconds * 1000);
    });
}

function stopCurrentAudio() {
    tts.stop();
    if (drillTimeout) {
        clearTimeout(drillTimeout);
        drillTimeout = null;
    }
}

// --- DRILL PLAYER CONTROLS ---
function togglePlay() {
    if (isPlaying) {
        pauseDrill();
    } else {
        startDrill();
    }
}

function startDrill() {
    isPlaying = true;
    tts.startKeepAlive();
    playIcon.classList.add("hidden");
    pauseIcon.classList.remove("hidden");
    playDrillLoop();
}

function pauseDrill() {
    isPlaying = false;
    tts.stopKeepAlive();
    playIcon.classList.remove("hidden");
    pauseIcon.classList.add("hidden");
    stopCurrentAudio();

    document.querySelectorAll(".drill-conj-item").forEach(item => {
        item.classList.remove("active-speaking");
    });
}

function navigateDrill(direction) {
    const wasPlaying = isPlaying;
    pauseDrill();

    const activeList = getActiveVerbs();
    currentDrillIndex = (currentDrillIndex + direction + activeList.length) % activeList.length;
    currentPartIndex = 0;
    updatePlayerView();

    if (wasPlaying) {
        startDrill();
    }
}

function updatePlayerView() {
    const activeList = getActiveVerbs();
    if (activeList.length === 0) return;

    if (currentDrillIndex >= activeList.length) {
        currentDrillIndex = 0;
    }

    const verb = activeList[currentDrillIndex];
    const forms = getVerbForms(verb, selectedTense);

    // Progress
    drillProgressText.textContent = `Verb ${currentDrillIndex + 1} of ${activeList.length}`;
    drillProgressBar.style.width = `${((currentDrillIndex + 1) / activeList.length) * 100}%`;

    // Display values
    drillDisplayEng.textContent = verb.eng;
    drillDisplayBnInf.textContent = verb.inf;
    drillValAmi.textContent = forms.ami;
    drillValTumi.textContent = forms.tumi;
    drillValApni.textContent = forms.apni;
    drillValSe.textContent = forms.se;

    // Clear active speaking highlights
    document.querySelectorAll(".drill-conj-item").forEach(item => {
        item.classList.remove("active-speaking");
    });
}

async function playDrillLoop() {
    while (isPlaying) {
        const activeList = getActiveVerbs();
        if (activeList.length === 0) break;

        const verb = activeList[currentDrillIndex];
        const forms = getVerbForms(verb, selectedTense);
        const gender = selectedGender;

        // 0. Speak English prompt
        currentPartIndex = 0;
        await tts.speak(verb.eng, "en", gender);
        if (!isPlaying) break;

        // 1. Recall Pause
        currentPartIndex = 1;
        await wait(pauseRecall);
        if (!isPlaying) break;

        // 2. Speak Bangla Infinitive
        currentPartIndex = 2;
        await tts.speak(verb.inf, "bn-BD", gender);
        if (!isPlaying) break;

        // 3. Ami
        currentPartIndex = 3;
        await wait(pauseRepeat);
        if (!isPlaying) break;
        highlightSpeakingBox("conj-ami");
        currentPartIndex = 4;
        await tts.speak(`আমি ${forms.ami}`, "bn-BD", gender);
        if (!isPlaying) break;

        // 4. Tumi
        currentPartIndex = 5;
        await wait(pauseRepeat);
        if (!isPlaying) break;
        highlightSpeakingBox("conj-tumi");
        currentPartIndex = 6;
        await tts.speak(`তুমি ${forms.tumi}`, "bn-BD", gender);
        if (!isPlaying) break;

        // 5. Apni
        currentPartIndex = 7;
        await wait(pauseRepeat);
        if (!isPlaying) break;
        highlightSpeakingBox("conj-apni");
        currentPartIndex = 8;
        await tts.speak(`আপনি ${forms.apni}`, "bn-BD", gender);
        if (!isPlaying) break;

        // 6. Se
        currentPartIndex = 9;
        await wait(pauseRepeat);
        if (!isPlaying) break;
        highlightSpeakingBox("conj-se");
        currentPartIndex = 10;
        await tts.speak(`সে ${forms.se}`, "bn-BD", gender);
        if (!isPlaying) break;

        // 7. Gap Pause & advance to next verb
        currentPartIndex = 11;
        await wait(pauseGap);
        if (!isPlaying) break;

        currentPartIndex = 0;
        currentDrillIndex = (currentDrillIndex + 1) % activeList.length;
        updatePlayerView();
    }
}

function highlightSpeakingBox(boxId) {
    document.querySelectorAll(".drill-conj-item").forEach(item => {
        item.classList.remove("active-speaking");
    });
    if (boxId) {
        const el = document.getElementById(boxId);
        if (el) el.classList.add("active-speaking");
    }
}

// --- CONJUGATION GRID ---
function renderVerbsGrid() {
    verbsList.innerHTML = "";
    const activeList = getActiveVerbs();

    activeList.forEach((verb, idx) => {
        const forms = getVerbForms(verb, selectedTense);
        const card = document.createElement("div");
        card.className = "verb-card";

        card.innerHTML = `
            <div class="verb-card-header">
                <span class="eng-title">${verb.eng}</span>
                <span class="bn-inf" data-action="inf">${verb.inf}</span>
            </div>
            <div class="verb-card-details">
                <div class="card-conj-grid">
                    <div class="card-conj-item" data-pronoun="ami">
                        <span class="pronoun">আমি</span>
                        <span class="form">${forms.ami}</span>
                        <svg class="play-small-icon" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"></path></svg>
                    </div>
                    <div class="card-conj-item" data-pronoun="tumi">
                        <span class="pronoun">তুমি</span>
                        <span class="form">${forms.tumi}</span>
                        <svg class="play-small-icon" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"></path></svg>
                    </div>
                    <div class="card-conj-item" data-pronoun="apni">
                        <span class="pronoun">আপনি</span>
                        <span class="form">${forms.apni}</span>
                        <svg class="play-small-icon" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"></path></svg>
                    </div>
                    <div class="card-conj-item" data-pronoun="se">
                        <span class="pronoun">সে</span>
                        <span class="form">${forms.se}</span>
                        <svg class="play-small-icon" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"></path></svg>
                    </div>
                </div>
            </div>
        `;

        // Click on Infinitive -> speak infinitive
        const infBtn = card.querySelector(".bn-inf");
        infBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            if (isPlaying) pauseDrill();
            tts.speak(verb.inf, "bn-BD", selectedGender);
        });

        // Click on Conjugation Cells -> speak cell
        const conjItems = card.querySelectorAll(".card-conj-item");
        conjItems.forEach(item => {
            item.addEventListener("click", (e) => {
                e.stopPropagation();
                if (isPlaying) pauseDrill();
                const pronoun = item.getAttribute("data-pronoun");
                const phraseMap = {
                    ami: `আমি ${forms.ami}`,
                    tumi: `তুমি ${forms.tumi}`,
                    apni: `আপনি ${forms.apni}`,
                    se: `সে ${forms.se}`
                };
                tts.speak(phraseMap[pronoun], "bn-BD", selectedGender);
            });
        });

        // Click on Card Header -> expand / collapse
        card.addEventListener("click", (e) => {
            if (e.target.classList.contains("bn-inf") || e.target.closest(".card-conj-item")) {
                return;
            }
            const isExpanded = card.classList.contains("expanded");
            document.querySelectorAll(".verb-card").forEach(c => c.classList.remove("expanded"));
            if (!isExpanded) {
                card.classList.add("expanded");
            }
        });

        verbsList.appendChild(card);
    });
}

function filterVerbs(e) {
    const query = e.target.value.toLowerCase().trim();
    const cards = document.querySelectorAll(".verb-card");

    cards.forEach(card => {
        const eng = card.querySelector(".eng-title").textContent.toLowerCase();
        const bn = card.querySelector(".bn-inf").textContent.toLowerCase();

        if (eng.includes(query) || bn.includes(query)) {
            card.style.display = "flex";
        } else {
            card.style.display = "none";
        }
    });
}

// --- INTERACTIVE QUIZ ---
function startQuiz() {
    quizScore = 0;
    currentQuizIndex = 0;
    quizQuestions = generateQuizQuestions();
    loadQuizQuestion();
}

function generateQuizQuestions() {
    const activeList = getActiveVerbs();
    const list = [];
    const pronouns = [
        { label: "আমি (I)", key: "ami", prefix: "আমি" },
        { label: "তুমি (You - familiar)", key: "tumi", prefix: "তুমি" },
        { label: "আপনি (You - formal)", key: "apni", prefix: "আপনি" },
        { label: "সে (He/She)", key: "se", prefix: "সে" }
    ];

    if (activeList.length === 0) return list;

    // Pick 10 random pairings
    const totalQuestions = Math.min(10, activeList.length);
    const indices = Array.from({ length: activeList.length }, (_, i) => i);
    indices.sort(() => Math.random() - 0.5);

    const selectedIndices = indices.slice(0, totalQuestions);

    selectedIndices.forEach((verbIdx) => {
        const randomPronoun = pronouns[Math.floor(Math.random() * pronouns.length)];
        const verb = activeList[verbIdx];
        const forms = getVerbForms(verb, selectedTense);

        const correctVal = forms[randomPronoun.key];
        const correctPhrase = `${randomPronoun.prefix} ${correctVal}`;

        // Generate distractors
        const options = [correctPhrase];
        while (options.length < 4) {
            const randVerb = activeList[Math.floor(Math.random() * activeList.length)];
            const randForms = getVerbForms(randVerb, selectedTense);
            const distractor = `${randomPronoun.prefix} ${randForms[randomPronoun.key]}`;
            if (!options.includes(distractor)) {
                options.push(distractor);
            }
        }

        options.sort(() => Math.random() - 0.5);

        list.push({
            englishVerb: verb.eng,
            pronounPrefix: randomPronoun.prefix,
            correctPhrase: correctPhrase,
            options: options
        });
    });

    return list;
}

function loadQuizQuestion() {
    btnQuizNext.classList.add("hidden");

    if (quizQuestions.length === 0) return;

    const q = quizQuestions[currentQuizIndex];
    quizProgressText.textContent = `Question ${currentQuizIndex + 1} of ${quizQuestions.length}`;
    quizScoreText.textContent = `Score: ${quizScore}`;

    quizPrompt.textContent = `${q.englishVerb} (${q.pronounPrefix})`;

    quizOptionsContainer.innerHTML = "";
    q.options.forEach(opt => {
        const btn = document.createElement("button");
        btn.className = "quiz-option-btn";
        btn.innerHTML = `
            <span>${opt}</span>
            <svg class="play-small-icon hidden" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"></path></svg>
        `;

        btn.addEventListener("click", () => handleQuizAnswer(btn, opt));
        quizOptionsContainer.appendChild(btn);
    });
}

function handleQuizAnswer(selectedBtn, answerText) {
    const q = quizQuestions[currentQuizIndex];
    const optionButtons = quizOptionsContainer.querySelectorAll(".quiz-option-btn");

    tts.stop();

    optionButtons.forEach(btn => {
        btn.classList.add("disabled");
        const labelText = btn.querySelector("span").textContent;
        if (labelText === q.correctPhrase) {
            btn.classList.add("correct");
        }
    });

    // Speak correct answer aloud
    tts.speak(q.correctPhrase, "bn-BD", selectedGender);

    if (answerText === q.correctPhrase) {
        quizScore++;
        quizScoreText.textContent = `Score: ${quizScore}`;
        if (navigator.vibrate) navigator.vibrate(50);
    } else {
        selectedBtn.classList.add("incorrect");
        if (navigator.vibrate) navigator.vibrate([80, 50, 80]);
    }

    btnQuizNext.classList.remove("hidden");
}

function playQuizPromptAudio() {
    if (quizQuestions.length === 0) return;
    const q = quizQuestions[currentQuizIndex];
    tts.speak(q.englishVerb, "en", selectedGender);
}

function loadNextQuizQuestion() {
    tts.stop();
    currentQuizIndex++;
    if (currentQuizIndex < quizQuestions.length) {
        loadQuizQuestion();
    } else {
        showQuizResults();
    }
}

function showQuizResults() {
    quizProgressText.textContent = "Quiz Complete!";
    quizPrompt.textContent = `Final Score: ${quizScore}/${quizQuestions.length}`;
    quizOptionsContainer.innerHTML = "";

    const feedbackMsg = document.createElement("p");
    feedbackMsg.style.textAlign = "center";
    feedbackMsg.style.margin = "20px 0";
    feedbackMsg.style.fontSize = "18px";
    feedbackMsg.style.color = "var(--text-secondary)";

    if (quizScore === quizQuestions.length) {
        feedbackMsg.textContent = "অসাধারণ! (Amazing!) Perfect score!";
    } else if (quizScore >= Math.round(quizQuestions.length * 0.7)) {
        feedbackMsg.textContent = "খুব ভালো! (Very Good!) Great effort!";
    } else {
        feedbackMsg.textContent = "আবার চেষ্টা করুন। (Try again.) Practice makes perfect!";
    }

    quizOptionsContainer.appendChild(feedbackMsg);

    btnQuizNext.textContent = "Restart Quiz";
    btnQuizNext.classList.remove("hidden");

    const newBtn = btnQuizNext.cloneNode(true);
    btnQuizNext.parentNode.replaceChild(newBtn, btnQuizNext);

    const restoredBtn = document.getElementById("btn-quiz-next");
    restoredBtn.addEventListener("click", () => {
        restoredBtn.textContent = "Next Question";
        startQuiz();
    });
}
