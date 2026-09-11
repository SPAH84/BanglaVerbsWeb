// tenses.js - Extensible Tense Registry for Bangla Verb Drills

export const TENSES = {
    present_simple: {
        id: "present_simple",
        label: "Simple",
        fullLabel: "Present Simple",
        group: "Present",
        order: 1
    },
    present_perfect: {
        id: "present_perfect",
        label: "Perfect",
        fullLabel: "Present Perfect",
        group: "Present",
        order: 2
    },
    past_simple: {
        id: "past_simple",
        label: "Past Simple",
        fullLabel: "Past Simple",
        group: "Past",
        order: 3
    },
    past_continuous: {
        id: "past_continuous",
        label: "Past Cont.",
        fullLabel: "Past Continuous",
        group: "Past",
        order: 4
    },
    future_simple: {
        id: "future_simple",
        label: "Future",
        fullLabel: "Future Simple",
        group: "Future",
        order: 5
    }
};

export const DEFAULT_TENSE = "present_simple";
