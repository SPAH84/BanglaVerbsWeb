// verbs.js - Modular Verb Dataset for Bangla Verb Drills
// Supports modular Learning Sets: Set 1 (Foundation - 20 verbs), Set 2 (Extended - 40 verbs)
// Total 60 verbs across 4 tenses: Present Simple, Present Perfect, Past Simple, Past Perfect

export const VERB_SETS = {
    "1": {
        "id": 1,
        "name": "Foundation",
        "count": 20,
        "description": "Essential daily verbs"
    },
    "2": {
        "id": 2,
        "name": "Extended",
        "count": 40,
        "description": "Everyday actions & communication"
    },
    "3": {
        "id": 3,
        "name": "Advanced",
        "count": 40,
        "description": "Conversational & abstract verbs (Upcoming)"
    },
    "4": {
        "id": 4,
        "name": "Mastery",
        "count": 40,
        "description": "Specialized & literary verbs (Upcoming)"
    }
};

export const VERBS = [
    {
        id: "v001", set: 1, eng: "To do", inf: "করা",
        tenses: {
            present_simple: {"ami":"করি","tumi":"করো","apni":"করেন","se":"করে"},
            present_perfect: {"ami":"করেছি","tumi":"করেছো","apni":"করেছেন","se":"করেছে"},
            past_simple: {"ami":"করলাম","tumi":"করলে","apni":"করলেন","se":"করলো"},
            past_perfect: {"ami":"করেছিলাম","tumi":"করেছিলে","apni":"করেছিলেন","se":"করেছিল"}
        }
    },
    {
        id: "v002", set: 1, eng: "To go", inf: "যাওয়া",
        tenses: {
            present_simple: {"ami":"যাই","tumi":"যাও","apni":"যান","se":"যায়"},
            present_perfect: {"ami":"গিয়েছি","tumi":"গিয়েছো","apni":"গিয়েছেন","se":"গিয়েছে"},
            past_simple: {"ami":"গেলাম","tumi":"গেলে","apni":"গেলেন","se":"গেলো"},
            past_perfect: {"ami":"গিয়েছিলাম","tumi":"গিয়েছিলে","apni":"গিয়েছিলেন","se":"গিয়েছিল"}
        }
    },
    {
        id: "v003", set: 1, eng: "To come", inf: "আসা",
        tenses: {
            present_simple: {"ami":"আসি","tumi":"আসো","apni":"আসেন","se":"আসে"},
            present_perfect: {"ami":"এসেছি","tumi":"এসেছো","apni":"এসেছেন","se":"এসেছে"},
            past_simple: {"ami":"আসলাম","tumi":"আসলে","apni":"আসলেন","se":"আসলো"},
            past_perfect: {"ami":"এসেছিলাম","tumi":"এসেছিলে","apni":"এসেছিলেন","se":"এসেছিল"}
        }
    },
    {
        id: "v004", set: 1, eng: "To eat", inf: "খাওয়া",
        tenses: {
            present_simple: {"ami":"খাই","tumi":"খাও","apni":"খান","se":"খায়"},
            present_perfect: {"ami":"খেয়েছি","tumi":"খেয়েছো","apni":"খেয়েছেন","se":"খেয়েছে"},
            past_simple: {"ami":"খেলাম","tumi":"খেলে","apni":"খেলেন","se":"খেলো"},
            past_perfect: {"ami":"খেয়েছিলাম","tumi":"খেয়েছিলে","apni":"খেয়েছিলেন","se":"খেয়েছিল"}
        }
    },
    {
        id: "v005", set: 1, eng: "To give", inf: "দেওয়া",
        tenses: {
            present_simple: {"ami":"দিই","tumi":"দাও","apni":"দেন","se":"দেয়"},
            present_perfect: {"ami":"দিয়েছি","tumi":"দিয়েছো","apni":"দিয়েছেন","se":"দিয়েছে"},
            past_simple: {"ami":"দিলাম","tumi":"দিলে","apni":"দিলেন","se":"দিলো"},
            past_perfect: {"ami":"দিয়েছিলাম","tumi":"দিয়েছিলে","apni":"দিয়েছিলেন","se":"দিয়েছিল"}
        }
    },
    {
        id: "v006", set: 1, eng: "To take", inf: "নেওয়া",
        tenses: {
            present_simple: {"ami":"নিই","tumi":"নাও","apni":"নেন","se":"নেয়"},
            present_perfect: {"ami":"নিয়েছি","tumi":"নিয়েছো","apni":"নিয়েছেন","se":"নিয়েছে"},
            past_simple: {"ami":"নিলাম","tumi":"নিলে","apni":"নিলেন","se":"নিলো"},
            past_perfect: {"ami":"নিয়েছিলাম","tumi":"নিয়েছিলে","apni":"নিয়েছিলেন","se":"নিয়েছিল"}
        }
    },
    {
        id: "v007", set: 1, eng: "To see", inf: "দেখা",
        tenses: {
            present_simple: {"ami":"দেখি","tumi":"দেখো","apni":"দেখেন","se":"দেখে"},
            present_perfect: {"ami":"দেখেছি","tumi":"দেখেছো","apni":"দেখেছেন","se":"দেখেছে"},
            past_simple: {"ami":"দেখলাম","tumi":"দেখলে","apni":"দেখলেন","se":"দেখলো"},
            past_perfect: {"ami":"দেখেছিলাম","tumi":"দেখেছিলে","apni":"দেখেছিলেন","se":"দেখেছিল"}
        }
    },
    {
        id: "v008", set: 1, eng: "To say", inf: "বলা",
        tenses: {
            present_simple: {"ami":"বলি","tumi":"বলো","apni":"বলেন","se":"বলে"},
            present_perfect: {"ami":"বলেছি","tumi":"বলেছো","apni":"বলেছেন","se":"বলেছে"},
            past_simple: {"ami":"বললাম","tumi":"বললে","apni":"বললেন","se":"বললো"},
            past_perfect: {"ami":"বলেছিলাম","tumi":"বলেছিলে","apni":"বলেছিলেন","se":"বলেছিল"}
        }
    },
    {
        id: "v009", set: 1, eng: "To hear", inf: "শোনা",
        tenses: {
            present_simple: {"ami":"শুনি","tumi":"শোনো","apni":"শোনেন","se":"শোনে"},
            present_perfect: {"ami":"শুনেছি","tumi":"শুনেছো","apni":"শুনেছেন","se":"শুনেছে"},
            past_simple: {"ami":"শুনলাম","tumi":"শুনলে","apni":"শুনলেন","se":"শুনলো"},
            past_perfect: {"ami":"শুনেছিলাম","tumi":"শুনেছিলে","apni":"শুনেছিলেন","se":"শুনেছিল"}
        }
    },
    {
        id: "v010", set: 1, eng: "To know", inf: "জানা",
        tenses: {
            present_simple: {"ami":"জানি","tumi":"জানো","apni":"জানেন","se":"জানে"},
            present_perfect: {"ami":"জেনেছি","tumi":"জেনেছো","apni":"জেনেছেন","se":"জেনেছে"},
            past_simple: {"ami":"জানলাম","tumi":"জানলে","apni":"জানলেন","se":"জানলো"},
            past_perfect: {"ami":"জেনেছিলাম","tumi":"জেনেছিলে","apni":"জেনেছিলেন","se":"জেনেছিল"}
        }
    },
    {
        id: "v011", set: 1, eng: "To understand", inf: "বোঝা",
        tenses: {
            present_simple: {"ami":"বুঝি","tumi":"বোঝো","apni":"বোঝেন","se":"বোঝে"},
            present_perfect: {"ami":"বুঝেছি","tumi":"বুঝেছো","apni":"বুঝেছেন","se":"বুঝেছে"},
            past_simple: {"ami":"বুঝলাম","tumi":"বুঝলে","apni":"বুঝলেন","se":"বুঝলো"},
            past_perfect: {"ami":"বুঝেছিলাম","tumi":"বুঝেছিলে","apni":"বুঝেছিলেন","se":"বুঝেছিল"}
        }
    },
    {
        id: "v012", set: 1, eng: "To read", inf: "পড়া",
        tenses: {
            present_simple: {"ami":"পড়ি","tumi":"পড়ো","apni":"পড়েন","se":"পড়ে"},
            present_perfect: {"ami":"পড়েছি","tumi":"পড়েছো","apni":"পড়েছেন","se":"পড়েছে"},
            past_simple: {"ami":"পড়লাম","tumi":"পড়লে","apni":"পড়লেন","se":"পড়লো"},
            past_perfect: {"ami":"পড়েছিলাম","tumi":"পড়েছিলে","apni":"পড়েছিলেন","se":"পড়েছিল"}
        }
    },
    {
        id: "v013", set: 1, eng: "To write", inf: "লেখা",
        tenses: {
            present_simple: {"ami":"লিখি","tumi":"লেখো","apni":"লেখেন","se":"লেখে"},
            present_perfect: {"ami":"লিখেছি","tumi":"লিখেছো","apni":"লিখেছেন","se":"লিখেছে"},
            past_simple: {"ami":"লিখলাম","tumi":"লিখলে","apni":"লিখলেন","se":"লিখলো"},
            past_perfect: {"ami":"লিখেছিলাম","tumi":"লিখেছিলে","apni":"লিখেছিলেন","se":"লিখেছিল"}
        }
    },
    {
        id: "v014", set: 1, eng: "To sit", inf: "বসা",
        tenses: {
            present_simple: {"ami":"বসি","tumi":"বসো","apni":"বসেন","se":"বসে"},
            present_perfect: {"ami":"বসেছি","tumi":"বসেছো","apni":"বসেছেন","se":"বসেছে"},
            past_simple: {"ami":"বসলাম","tumi":"বসলে","apni":"বসলেন","se":"বসলো"},
            past_perfect: {"ami":"বসেছিলাম","tumi":"বসেছিলে","apni":"বসেছিলেন","se":"বসেছিল"}
        }
    },
    {
        id: "v015", set: 1, eng: "To stand", inf: "দাঁড়ানো",
        tenses: {
            present_simple: {"ami":"দাঁড়াই","tumi":"দাঁড়াও","apni":"দাঁড়ান","se":"দাঁড়ায়"},
            present_perfect: {"ami":"দাঁড়িয়েছি","tumi":"দাঁড়িয়েছো","apni":"দাঁড়িয়েছেন","se":"দাঁড়িয়েছে"},
            past_simple: {"ami":"দাঁড়ালাম","tumi":"দাঁড়ালে","apni":"দাঁড়ালেন","se":"দাঁড়ালো"},
            past_perfect: {"ami":"দাঁড়িয়েছিলাম","tumi":"দাঁড়িয়েছিলে","apni":"দাঁড়িয়েছিলেন","se":"দাঁড়িয়েছিল"}
        }
    },
    {
        id: "v016", set: 1, eng: "To sleep", inf: "ঘুমানো",
        tenses: {
            present_simple: {"ami":"ঘুমাই","tumi":"ঘুমাও","apni":"ঘুমান","se":"ঘুমায়"},
            present_perfect: {"ami":"ঘুমিয়েছি","tumi":"ঘুমিয়েছো","apni":"ঘুমিয়েছেন","se":"ঘুমিয়েছে"},
            past_simple: {"ami":"ঘুমালাম","tumi":"ঘুমালে","apni":"ঘুমালেন","se":"ঘুমালো"},
            past_perfect: {"ami":"ঘুমিয়েছিলাম","tumi":"ঘুমিয়েছিলে","apni":"ঘুমিয়েছিলেন","se":"ঘুমিয়েছিল"}
        }
    },
    {
        id: "v017", set: 1, eng: "To stay", inf: "থাকা",
        tenses: {
            present_simple: {"ami":"থাকি","tumi":"থাকো","apni":"থাকেন","se":"থাকে"},
            present_perfect: {"ami":"থেকেছি","tumi":"থেকেছো","apni":"থেকেছেন","se":"থেকেছে"},
            past_simple: {"ami":"থাকলাম","tumi":"থাকলে","apni":"থাকলেন","se":"থাকলো"},
            past_perfect: {"ami":"থেকেছিলাম","tumi":"থেকেছিলে","apni":"থেকেছিলেন","se":"থেকেছিল"}
        }
    },
    {
        id: "v018", set: 1, eng: "To learn", inf: "শেখা",
        tenses: {
            present_simple: {"ami":"শিখি","tumi":"শেখো","apni":"শেখেন","se":"শেখে"},
            present_perfect: {"ami":"শিখেছি","tumi":"শিখেছো","apni":"শিখেছেন","se":"শিখেছে"},
            past_simple: {"ami":"শিখলাম","tumi":"শিখলে","apni":"শিখলেন","se":"শিখলো"},
            past_perfect: {"ami":"শিখেছিলাম","tumi":"শিখেছিলে","apni":"শিখেছিলেন","se":"শিখেছিল"}
        }
    },
    {
        id: "v019", set: 1, eng: "To love", inf: "ভালোবাসা",
        tenses: {
            present_simple: {"ami":"ভালোবাসি","tumi":"ভালোবাসো","apni":"ভালোবাসেন","se":"ভালোবাসে"},
            present_perfect: {"ami":"ভালোবেসেছি","tumi":"ভালোবেসেছো","apni":"ভালোবেসেছেন","se":"ভালোবেসেছে"},
            past_simple: {"ami":"ভালোবাসলাম","tumi":"ভালোবাসলে","apni":"ভালোবাসলেন","se":"ভালোবাসলো"},
            past_perfect: {"ami":"ভালোবেসেছিলাম","tumi":"ভালোবেসেছিলে","apni":"ভালোবেসেছিলেন","se":"ভালোবেসেছিল"}
        }
    },
    {
        id: "v020", set: 1, eng: "To make", inf: "বানানো",
        tenses: {
            present_simple: {"ami":"বানাই","tumi":"বানাও","apni":"বানান","se":"বানায়"},
            present_perfect: {"ami":"বানিয়েছি","tumi":"বানিয়েছো","apni":"বানিয়েছেন","se":"বানিয়েছে"},
            past_simple: {"ami":"বানালাম","tumi":"বানালে","apni":"বানালেন","se":"বানালো"},
            past_perfect: {"ami":"বানিয়েছিলাম","tumi":"বানিয়েছিলে","apni":"বানিয়েছিলেন","se":"বানিয়েছিল"}
        }
    },
    {
        id: "v021", set: 2, eng: "To open", inf: "খোলা",
        tenses: {
            present_simple: {"ami":"খুলি","tumi":"খোলো","apni":"খোলেন","se":"খোলে"},
            present_perfect: {"ami":"খুলেছি","tumi":"খুলেছো","apni":"খুলেছেন","se":"খুলেছে"},
            past_simple: {"ami":"খুললাম","tumi":"খুললে","apni":"খুললেন","se":"খুললো"},
            past_perfect: {"ami":"খুলেছিলাম","tumi":"খুলেছিলে","apni":"খুলেছিলেন","se":"খুলেছিল"}
        }
    },
    {
        id: "v022", set: 2, eng: "To close", inf: "বন্ধ করা",
        tenses: {
            present_simple: {"ami":"বন্ধ করি","tumi":"বন্ধ করো","apni":"বন্ধ করেন","se":"বন্ধ করে"},
            present_perfect: {"ami":"বন্ধ করেছি","tumi":"বন্ধ করেছো","apni":"বন্ধ করেছেন","se":"বন্ধ করেছে"},
            past_simple: {"ami":"বন্ধ করলাম","tumi":"বন্ধ করলে","apni":"বন্ধ করলেন","se":"বন্ধ করলো"},
            past_perfect: {"ami":"বন্ধ করেছিলাম","tumi":"বন্ধ করেছিলে","apni":"বন্ধ করেছিলেন","se":"বন্ধ করেছিল"}
        }
    },
    {
        id: "v023", set: 2, eng: "To buy", inf: "কেনা",
        tenses: {
            present_simple: {"ami":"কিনি","tumi":"কেনো","apni":"কেনেন","se":"কেনে"},
            present_perfect: {"ami":"কিনেছি","tumi":"কিনেছো","apni":"কিনেছেন","se":"কিনেছে"},
            past_simple: {"ami":"কিনলাম","tumi":"কিনলে","apni":"কিনলেন","se":"কিনলো"},
            past_perfect: {"ami":"কিনেছিলাম","tumi":"কিনেছিলে","apni":"কিনেছিলেন","se":"কিনেছিল"}
        }
    },
    {
        id: "v024", set: 2, eng: "To sell", inf: "বেচা",
        tenses: {
            present_simple: {"ami":"বেচি","tumi":"বেচো","apni":"বেচেন","se":"বেচে"},
            present_perfect: {"ami":"বেচেছি","tumi":"বেচেছো","apni":"বেচেছেন","se":"বেচেছে"},
            past_simple: {"ami":"বেচলাম","tumi":"বেচলে","apni":"বেচলেন","se":"বেচলো"},
            past_perfect: {"ami":"বেচেছিলাম","tumi":"বেচেছিলে","apni":"বেচেছিলেন","se":"বেচেছিল"}
        }
    },
    {
        id: "v025", set: 2, eng: "To bring", inf: "আনা",
        tenses: {
            present_simple: {"ami":"আনি","tumi":"আনো","apni":"আনেন","se":"আনে"},
            present_perfect: {"ami":"এনেছি","tumi":"এনেছো","apni":"এনেছেন","se":"এনেছে"},
            past_simple: {"ami":"আনলাম","tumi":"আনলে","apni":"আনলেন","se":"আনলো"},
            past_perfect: {"ami":"এনেছিলাম","tumi":"এনেছিলে","apni":"এনেছিলেন","se":"এনেছিল"}
        }
    },
    {
        id: "v026", set: 2, eng: "To send", inf: "পাঠানো",
        tenses: {
            present_simple: {"ami":"পাঠাই","tumi":"পাঠাও","apni":"পাঠান","se":"পাঠায়"},
            present_perfect: {"ami":"পাঠিয়েছি","tumi":"পাঠিয়েছো","apni":"পাঠিয়েছেন","se":"পাঠিয়েছে"},
            past_simple: {"ami":"পাঠালাম","tumi":"পাঠালে","apni":"পাঠালেন","se":"পাঠালো"},
            past_perfect: {"ami":"পাঠিয়েছিলাম","tumi":"পাঠিয়েছিলে","apni":"পাঠিয়েছিলেন","se":"পাঠিয়েছিল"}
        }
    },
    {
        id: "v027", set: 2, eng: "To call", inf: "ডাকা",
        tenses: {
            present_simple: {"ami":"ডাকি","tumi":"ডাকো","apni":"ডাকেন","se":"ডাকে"},
            present_perfect: {"ami":"ডেকেছি","tumi":"ডেকেছো","apni":"ডেকেছেন","se":"ডেকেছে"},
            past_simple: {"ami":"ডাকলাম","tumi":"ডাকলে","apni":"ডাকলেন","se":"ডাকলো"},
            past_perfect: {"ami":"ডেকেছিলাম","tumi":"ডেকেছিলে","apni":"ডেকেছিলেন","se":"ডেকেছিল"}
        }
    },
    {
        id: "v028", set: 2, eng: "To ask", inf: "জিজ্ঞাসা করা",
        tenses: {
            present_simple: {"ami":"জিজ্ঞাসা করি","tumi":"জিজ্ঞাসা করো","apni":"জিজ্ঞাসা করেন","se":"জিজ্ঞাসা করে"},
            present_perfect: {"ami":"জিজ্ঞাসা করেছি","tumi":"জিজ্ঞাসা করেছো","apni":"জিজ্ঞাসা করেছেন","se":"জিজ্ঞাসা করেছে"},
            past_simple: {"ami":"জিজ্ঞাসা করলাম","tumi":"জিজ্ঞাসা করলে","apni":"জিজ্ঞাসা করলেন","se":"জিজ্ঞাসা করলো"},
            past_perfect: {"ami":"জিজ্ঞাসা করেছিলাম","tumi":"জিজ্ঞাসা করেছিলে","apni":"জিজ্ঞাসা করেছিলেন","se":"জিজ্ঞাসা করেছিল"}
        }
    },
    {
        id: "v029", set: 2, eng: "To answer", inf: "উত্তর দেওয়া",
        tenses: {
            present_simple: {"ami":"উত্তর দিই","tumi":"উত্তর দাও","apni":"উত্তর দেন","se":"উত্তর দেয়"},
            present_perfect: {"ami":"উত্তর দিয়েছি","tumi":"উত্তর দিয়েছো","apni":"উত্তর দিয়েছেন","se":"উত্তর দিয়েছে"},
            past_simple: {"ami":"উত্তর দিলাম","tumi":"উত্তর দিলে","apni":"উত্তর দিলেন","se":"উত্তর দিলো"},
            past_perfect: {"ami":"উত্তর দিয়েছিলাম","tumi":"উত্তর দিয়েছিলে","apni":"উত্তর দিয়েছিলেন","se":"উত্তর দিয়েছিল"}
        }
    },
    {
        id: "v030", set: 2, eng: "To work", inf: "কাজ করা",
        tenses: {
            present_simple: {"ami":"কাজ করি","tumi":"কাজ করো","apni":"কাজ করেন","se":"কাজ করে"},
            present_perfect: {"ami":"কাজ করেছি","tumi":"কাজ করেছো","apni":"কাজ করেছেন","se":"কাজ করেছে"},
            past_simple: {"ami":"কাজ করলাম","tumi":"কাজ করলে","apni":"কাজ করলেন","se":"কাজ করলো"},
            past_perfect: {"ami":"কাজ করেছিলাম","tumi":"কাজ করেছিলে","apni":"কাজ করেছিলেন","se":"কাজ করেছিল"}
        }
    },
    {
        id: "v031", set: 2, eng: "To play", inf: "খেলা",
        tenses: {
            present_simple: {"ami":"খেলি","tumi":"খেলো","apni":"খেলেন","se":"খেলে"},
            present_perfect: {"ami":"খেলেছি","tumi":"খেলেছো","apni":"খেলেছেন","se":"খেলেছে"},
            past_simple: {"ami":"খেললাম","tumi":"খেললে","apni":"খেললেন","se":"খেললো"},
            past_perfect: {"ami":"খেলেছিলাম","tumi":"খেলেছিলে","apni":"খেলেছিলেন","se":"খেলেছিল"}
        }
    },
    {
        id: "v032", set: 2, eng: "To run", inf: "দৌড়ানো",
        tenses: {
            present_simple: {"ami":"দৌড়াই","tumi":"দৌড়াও","apni":"দৌড়ান","se":"দৌড়ায়"},
            present_perfect: {"ami":"দৌড়েছি","tumi":"দৌড়েছো","apni":"দৌড়েছেন","se":"দৌড়েছে"},
            past_simple: {"ami":"দৌড়ালাম","tumi":"দৌড়ালে","apni":"দৌড়ালেন","se":"দৌড়ালো"},
            past_perfect: {"ami":"দৌড়েছিলাম","tumi":"দৌড়েছিলে","apni":"দৌড়েছিলেন","se":"দৌড়েছিল"}
        }
    },
    {
        id: "v033", set: 2, eng: "To walk", inf: "হাঁটা",
        tenses: {
            present_simple: {"ami":"হাঁটি","tumi":"হাঁটো","apni":"হাঁটেন","se":"হাঁটে"},
            present_perfect: {"ami":"হেঁটেছি","tumi":"হেঁটেছো","apni":"হেঁটেছেন","se":"হেঁটেছে"},
            past_simple: {"ami":"হাঁটলাম","tumi":"হাঁটলে","apni":"হাঁটলেন","se":"হাঁটলো"},
            past_perfect: {"ami":"হেঁটেছিলাম","tumi":"হেঁটেছিলে","apni":"হেঁটেছিলেন","se":"হেঁটেছিল"}
        }
    },
    {
        id: "v034", set: 2, eng: "To swim", inf: "সাঁতার কাটা",
        tenses: {
            present_simple: {"ami":"সাঁতার কাটি","tumi":"সাঁতার কাটো","apni":"সাঁতার কাটেন","se":"সাঁতার কাটে"},
            present_perfect: {"ami":"সাঁতার কেটেছি","tumi":"সাঁতার কেটেছো","apni":"সাঁতার কেটেছেন","se":"সাঁতার কেটেছে"},
            past_simple: {"ami":"সাঁতার কাটলাম","tumi":"সাঁতার কাটলে","apni":"সাঁতার কাটলেন","se":"সাঁতার কাটলো"},
            past_perfect: {"ami":"সাঁতার কেটেছিলাম","tumi":"সাঁতার কেটেছিলে","apni":"সাঁতার কেটেছিলেন","se":"সাঁতার কেটেছিল"}
        }
    },
    {
        id: "v035", set: 2, eng: "To smile", inf: "হাসা",
        tenses: {
            present_simple: {"ami":"হাসি","tumi":"হাসো","apni":"হাসেন","se":"হাসে"},
            present_perfect: {"ami":"হেসেছি","tumi":"হেসেছো","apni":"হেসেছেন","se":"হেসেছে"},
            past_simple: {"ami":"হাসলাম","tumi":"হাসলে","apni":"হাসলেন","se":"হাসলো"},
            past_perfect: {"ami":"হেসেছিলাম","tumi":"হেসেছিলে","apni":"হেসেছিলেন","se":"হেসেছিল"}
        }
    },
    {
        id: "v036", set: 2, eng: "To cry", inf: "কাঁদা",
        tenses: {
            present_simple: {"ami":"কাঁদি","tumi":"কাঁদো","apni":"কাঁদেন","se":"কাঁদে"},
            present_perfect: {"ami":"কেঁদেছি","tumi":"কেঁদেছো","apni":"কেঁদেছেন","se":"কেঁদেছে"},
            past_simple: {"ami":"কাঁদলাম","tumi":"কাঁদলে","apni":"কাঁদলেন","se":"কাঁদলো"},
            past_perfect: {"ami":"কেঁদেছিলাম","tumi":"কেঁদেছিলে","apni":"কেঁদেছিলেন","se":"কেঁদেছিল"}
        }
    },
    {
        id: "v037", set: 2, eng: "To think", inf: "ভাবা",
        tenses: {
            present_simple: {"ami":"ভাবি","tumi":"ভাবো","apni":"ভাবেন","se":"ভাবে"},
            present_perfect: {"ami":"ভেবেছি","tumi":"ভেবেছো","apni":"ভেবেছেন","se":"ভেবেছে"},
            past_simple: {"ami":"ভাবলাম","tumi":"ভাবলে","apni":"ভাবলেন","se":"ভাবলো"},
            past_perfect: {"ami":"ভেবেছিলাম","tumi":"ভেবেছিলে","apni":"ভেবেছিলেন","se":"ভেবেছিল"}
        }
    },
    {
        id: "v038", set: 2, eng: "To remember", inf: "মনে রাখা",
        tenses: {
            present_simple: {"ami":"মনে রাখি","tumi":"মনে রাখো","apni":"মনে রাখেন","se":"মনে রাখে"},
            present_perfect: {"ami":"মনে রেখেছি","tumi":"মনে রেখেছো","apni":"মনে রেখেছেন","se":"মনে রেখেছে"},
            past_simple: {"ami":"মনে রাখলাম","tumi":"মনে রাখলে","apni":"মনে রাখলেন","se":"মনে রাখলো"},
            past_perfect: {"ami":"মনে রেখেছিলাম","tumi":"মনে রেখেছিলে","apni":"মনে রেখেছিলেন","se":"মনে রেখেছিল"}
        }
    },
    {
        id: "v039", set: 2, eng: "To forget", inf: "ভুলে যাওয়া",
        tenses: {
            present_simple: {"ami":"ভুলে যাই","tumi":"ভুলে যাও","apni":"ভুলে যান","se":"ভুলে যায়"},
            present_perfect: {"ami":"ভুলে গিয়েছি","tumi":"ভুলে গিয়েছো","apni":"ভুলে গিয়েছেন","se":"ভুলে গিয়েছে"},
            past_simple: {"ami":"ভুলে গেলাম","tumi":"ভুলে গেলে","apni":"ভুলে গেলেন","se":"ভুলে গেলো"},
            past_perfect: {"ami":"ভুলে গিয়েছিলাম","tumi":"ভুলে গিয়েছিলে","apni":"ভুলে গিয়েছিলেন","se":"ভুলে গিয়েছিল"}
        }
    },
    {
        id: "v040", set: 2, eng: "To wait", inf: "অপেক্ষা করা",
        tenses: {
            present_simple: {"ami":"অপেক্ষা করি","tumi":"অপেক্ষা করো","apni":"অপেক্ষা করেন","se":"অপেক্ষা করে"},
            present_perfect: {"ami":"অপেক্ষা করেছি","tumi":"অপেক্ষা করেছো","apni":"অপেক্ষা করেছেন","se":"অপেক্ষা করেছে"},
            past_simple: {"ami":"অপেক্ষা করলাম","tumi":"অপেক্ষা করলে","apni":"অপেক্ষা করলেন","se":"অপেক্ষা করলো"},
            past_perfect: {"ami":"অপেক্ষা করেছিলাম","tumi":"অপেক্ষা করেছিলে","apni":"অপেক্ষা করেছিলেন","se":"অপেক্ষা করেছিল"}
        }
    },
    {
        id: "v041", set: 2, eng: "To help", inf: "সাহায্য করা",
        tenses: {
            present_simple: {"ami":"সাহায্য করি","tumi":"সাহায্য করো","apni":"সাহায্য করেন","se":"সাহায্য করে"},
            present_perfect: {"ami":"সাহায্য করেছি","tumi":"সাহায্য করেছো","apni":"সাহায্য করেছেন","se":"সাহায্য করেছে"},
            past_simple: {"ami":"সাহায্য করলাম","tumi":"সাহায্য করলে","apni":"সাহায্য করলেন","se":"সাহায্য করলো"},
            past_perfect: {"ami":"সাহায্য করেছিলাম","tumi":"সাহায্য করেছিলে","apni":"সাহায্য করেছিলেন","se":"সাহায্য করেছিল"}
        }
    },
    {
        id: "v042", set: 2, eng: "To teach", inf: "শেখানো",
        tenses: {
            present_simple: {"ami":"শেখাই","tumi":"শেখাও","apni":"শেখান","se":"শেখায়"},
            present_perfect: {"ami":"শিখিয়েছি","tumi":"শিখিয়েছো","apni":"শিখিয়েছেন","se":"শিখিয়েছে"},
            past_simple: {"ami":"শেখালাম","tumi":"শেখালে","apni":"শেখালেন","se":"শেখালো"},
            past_perfect: {"ami":"শিখিয়েছিলাম","tumi":"শিখিয়েছিলে","apni":"শিখিয়েছিলেন","se":"শিখিয়েছিল"}
        }
    },
    {
        id: "v043", set: 2, eng: "To begin", inf: "শুরু করা",
        tenses: {
            present_simple: {"ami":"শুরু করি","tumi":"শুরু করো","apni":"শুরু করেন","se":"শুরু করে"},
            present_perfect: {"ami":"শুরু করেছি","tumi":"শুরু করেছো","apni":"শুরু করেছেন","se":"শুরু করেছে"},
            past_simple: {"ami":"শুরু করলাম","tumi":"শুরু করলে","apni":"শুরু করলেন","se":"শুরু করলো"},
            past_perfect: {"ami":"শুরু করেছিলাম","tumi":"শুরু করেছিলে","apni":"শুরু করেছিলেন","se":"শুরু করেছিল"}
        }
    },
    {
        id: "v044", set: 2, eng: "To finish", inf: "শেষ করা",
        tenses: {
            present_simple: {"ami":"শেষ করি","tumi":"শেষ করো","apni":"শেষ করেন","se":"শেষ করে"},
            present_perfect: {"ami":"শেষ করেছি","tumi":"শেষ করেছো","apni":"শেষ করেছেন","se":"শেষ করেছে"},
            past_simple: {"ami":"শেষ করলাম","tumi":"শেষ করলে","apni":"শেষ করলেন","se":"শেষ করলো"},
            past_perfect: {"ami":"শেষ করেছিলাম","tumi":"শেষ করেছিলে","apni":"শেষ করেছিলেন","se":"শেষ করেছিল"}
        }
    },
    {
        id: "v045", set: 2, eng: "To cook", inf: "রান্না করা",
        tenses: {
            present_simple: {"ami":"রান্না করি","tumi":"রান্না করো","apni":"রান্না করেন","se":"রান্না করে"},
            present_perfect: {"ami":"রান্না করেছি","tumi":"রান্না করেছো","apni":"রান্না করেছেন","se":"রান্না করেছে"},
            past_simple: {"ami":"রান্না করলাম","tumi":"রান্না করলে","apni":"রান্না করলেন","se":"রান্না করলো"},
            past_perfect: {"ami":"রান্না করেছিলাম","tumi":"রান্না করেছিলে","apni":"রান্না করেছিলেন","se":"রান্না করেছিল"}
        }
    },
    {
        id: "v046", set: 2, eng: "To clean", inf: "পরিষ্কার করা",
        tenses: {
            present_simple: {"ami":"পরিষ্কার করি","tumi":"পরিষ্কার করো","apni":"পরিষ্কার করেন","se":"পরিষ্কার করে"},
            present_perfect: {"ami":"পরিষ্কার করেছি","tumi":"পরিষ্কার করেছো","apni":"পরিষ্কার করেছেন","se":"পরিষ্কার করেছে"},
            past_simple: {"ami":"পরিষ্কার করলাম","tumi":"পরিষ্কার করলে","apni":"পরিষ্কার করলেন","se":"পরিষ্কার করলো"},
            past_perfect: {"ami":"পরিষ্কার করেছিলাম","tumi":"পরিষ্কার করেছিলে","apni":"পরিষ্কার করেছিলেন","se":"পরিষ্কার করেছিল"}
        }
    },
    {
        id: "v047", set: 2, eng: "To wash", inf: "ধোয়া",
        tenses: {
            present_simple: {"ami":"ধুই","tumi":"ধোও","apni":"ধোন","se":"ধোয়"},
            present_perfect: {"ami":"ধুয়েছি","tumi":"ধুয়েছো","apni":"ধুয়েছেন","se":"ধুয়েছে"},
            past_simple: {"ami":"ধুলাম","tumi":"ধুলে","apni":"ধুলেন","se":"ধুলো"},
            past_perfect: {"ami":"ধুয়েছিলাম","tumi":"ধুয়েছিলে","apni":"ধুয়েছিলেন","se":"ধুয়েছিল"}
        }
    },
    {
        id: "v048", set: 2, eng: "To wear", inf: "পরা",
        tenses: {
            present_simple: {"ami":"পরি","tumi":"পরো","apni":"পরেন","se":"পরে"},
            present_perfect: {"ami":"পরেছি","tumi":"পরেছো","apni":"পরেছেন","se":"পরেছে"},
            past_simple: {"ami":"পরলাম","tumi":"পরলে","apni":"পরলেন","se":"পরলো"},
            past_perfect: {"ami":"পরেছিলাম","tumi":"পরেছিলে","apni":"পরেছিলেন","se":"পরেছিল"}
        }
    },
    {
        id: "v049", set: 2, eng: "To live", inf: "বাস করা",
        tenses: {
            present_simple: {"ami":"বাস করি","tumi":"বাস করো","apni":"বাস করেন","se":"বাস করে"},
            present_perfect: {"ami":"বাস করেছি","tumi":"বাস করেছো","apni":"বাস করেছেন","se":"বাস করেছে"},
            past_simple: {"ami":"বাস করলাম","tumi":"বাস করলে","apni":"বাস করলেন","se":"বাস করলো"},
            past_perfect: {"ami":"বাস করেছিলাম","tumi":"বাস করেছিলে","apni":"বাস করেছিলেন","se":"বাস করেছিল"}
        }
    },
    {
        id: "v050", set: 2, eng: "To arrive", inf: "পৌঁছানো",
        tenses: {
            present_simple: {"ami":"পৌঁছাই","tumi":"পৌঁছাও","apni":"পৌঁছান","se":"পৌঁছায়"},
            present_perfect: {"ami":"পৌঁছেছি","tumi":"পৌঁছেছো","apni":"পৌঁছেছেন","se":"পৌঁছেছে"},
            past_simple: {"ami":"পৌঁছালাম","tumi":"পৌঁছালে","apni":"পৌঁছালেন","se":"পৌঁছালো"},
            past_perfect: {"ami":"পৌঁছেছিলাম","tumi":"পৌঁছেছিলে","apni":"পৌঁছেছিলেন","se":"পৌঁছেছিল"}
        }
    },
    {
        id: "v051", set: 2, eng: "To leave", inf: "ছাড়া",
        tenses: {
            present_simple: {"ami":"ছাড়ি","tumi":"ছাড়ো","apni":"ছাড়েন","se":"ছাড়ে"},
            present_perfect: {"ami":"ছেড়েছি","tumi":"ছেড়েছো","apni":"ছেড়েছেন","se":"ছেড়েছে"},
            past_simple: {"ami":"ছাড়লাম","tumi":"ছাড়লে","apni":"ছাড়লেন","se":"ছাড়লো"},
            past_perfect: {"ami":"ছেড়েছিলাম","tumi":"ছেড়েছিলে","apni":"ছেড়েছিলেন","se":"ছেড়েছিল"}
        }
    },
    {
        id: "v052", set: 2, eng: "To meet", inf: "দেখা করা",
        tenses: {
            present_simple: {"ami":"দেখা করি","tumi":"দেখা করো","apni":"দেখা করেন","se":"দেখা করে"},
            present_perfect: {"ami":"দেখা করেছি","tumi":"দেখা করেছো","apni":"দেখা করেছেন","se":"দেখা করেছে"},
            past_simple: {"ami":"দেখা করলাম","tumi":"দেখা করলে","apni":"দেখা করলেন","se":"দেখা করলো"},
            past_perfect: {"ami":"দেখা করেছিলাম","tumi":"দেখা করেছিলে","apni":"দেখা করেছিলেন","se":"দেখা করেছিল"}
        }
    },
    {
        id: "v053", set: 2, eng: "To travel", inf: "ভ্রমণ করা",
        tenses: {
            present_simple: {"ami":"ভ্রমণ করি","tumi":"ভ্রমণ করো","apni":"ভ্রমণ করেন","se":"ভ্রমণ করে"},
            present_perfect: {"ami":"ভ্রমণ করেছি","tumi":"ভ্রমণ করেছো","apni":"ভ্রমণ করেছেন","se":"ভ্রমণ করেছে"},
            past_simple: {"ami":"ভ্রমণ করলাম","tumi":"ভ্রমণ করলে","apni":"ভ্রমণ করলেন","se":"ভ্রমণ করলো"},
            past_perfect: {"ami":"ভ্রমণ করেছিলাম","tumi":"ভ্রমণ করেছিলে","apni":"ভ্রমণ করেছিলেন","se":"ভ্রমণ করেছিল"}
        }
    },
    {
        id: "v054", set: 2, eng: "To pay", inf: "পরিশোধ করা",
        tenses: {
            present_simple: {"ami":"পরিশোধ করি","tumi":"পরিশোধ করো","apni":"পরিশোধ করেন","se":"পরিশোধ করে"},
            present_perfect: {"ami":"পরিশোধ করেছি","tumi":"পরিশোধ করেছো","apni":"পরিশোধ করেছেন","se":"পরিশোধ করেছে"},
            past_simple: {"ami":"পরিশোধ করলাম","tumi":"পরিশোধ করলে","apni":"পরিশোধ করলেন","se":"পরিশোধ করলো"},
            past_perfect: {"ami":"পরিশোধ করেছিলাম","tumi":"পরিশোধ করেছিলে","apni":"পরিশোধ করেছিলেন","se":"পরিশোধ করেছিল"}
        }
    },
    {
        id: "v055", set: 2, eng: "To win", inf: "জেতা",
        tenses: {
            present_simple: {"ami":"জিতি","tumi":"জেতো","apni":"জেতেন","se":"জেতে"},
            present_perfect: {"ami":"জিতেছি","tumi":"জিতেছো","apni":"জিতেছেন","se":"জিতেছে"},
            past_simple: {"ami":"জিতলাম","tumi":"জিতলে","apni":"জিতলেন","se":"জিতলো"},
            past_perfect: {"ami":"জিতেছিলাম","tumi":"জিতেছিলে","apni":"জিতেছিলেন","se":"জিতেছিল"}
        }
    },
    {
        id: "v056", set: 2, eng: "To lose", inf: "হারানো",
        tenses: {
            present_simple: {"ami":"হারাই","tumi":"হারাও","apni":"হারান","se":"হারায়"},
            present_perfect: {"ami":"হারিয়েছি","tumi":"হারিয়েছো","apni":"হারিয়েছেন","se":"হারিয়েছে"},
            past_simple: {"ami":"হারালাম","tumi":"হারালে","apni":"হারালেন","se":"হারালো"},
            past_perfect: {"ami":"হারিয়েছিলাম","tumi":"হারিয়েছিলে","apni":"হারিয়েছিলেন","se":"হারিয়েছিল"}
        }
    },
    {
        id: "v057", set: 2, eng: "To show", inf: "দেখানো",
        tenses: {
            present_simple: {"ami":"দেখাই","tumi":"দেখাও","apni":"দেখান","se":"দেখায়"},
            present_perfect: {"ami":"দেখিয়েছি","tumi":"দেখিয়েছো","apni":"দেখিয়েছেন","se":"দেখিয়েছে"},
            past_simple: {"ami":"দেখালাম","tumi":"দেখালে","apni":"দেখালেন","se":"দেখালো"},
            past_perfect: {"ami":"দেখিয়েছিলাম","tumi":"দেখিয়েছিলে","apni":"দেখিয়েছিলেন","se":"দেখিয়েছিল"}
        }
    },
    {
        id: "v058", set: 2, eng: "To touch", inf: "ছোঁয়া",
        tenses: {
            present_simple: {"ami":"ছুঁই","tumi":"ছোঁও","apni":"ছোঁন","se":"ছোঁয়"},
            present_perfect: {"ami":"ছুঁয়েছি","tumi":"ছুঁয়েছো","apni":"ছুঁয়েছেন","se":"ছুঁয়েছে"},
            past_simple: {"ami":"ছুঁলাম","tumi":"ছুঁলে","apni":"ছুঁলেন","se":"ছুঁলো"},
            past_perfect: {"ami":"ছুঁয়েছিলাম","tumi":"ছুঁয়েছিলে","apni":"ছুঁয়েছিলেন","se":"ছুঁয়েছিল"}
        }
    },
    {
        id: "v059", set: 2, eng: "To carry", inf: "বহন করা",
        tenses: {
            present_simple: {"ami":"বহন করি","tumi":"বহন করো","apni":"বহন করেন","se":"বহন করে"},
            present_perfect: {"ami":"বহন করেছি","tumi":"বহন করেছো","apni":"বহন করেছেন","se":"বহন করেছে"},
            past_simple: {"ami":"বহন করলাম","tumi":"বহন করলে","apni":"বহন করলেন","se":"বহন করলো"},
            past_perfect: {"ami":"বহন করেছিলাম","tumi":"বহন করেছিলে","apni":"বহন করেছিলেন","se":"বহন করেছিল"}
        }
    },
    {
        id: "v060", set: 2, eng: "To use", inf: "ব্যবহার করা",
        tenses: {
            present_simple: {"ami":"ব্যবহার করি","tumi":"ব্যবহার করো","apni":"ব্যবহার করেন","se":"ব্যবহার করে"},
            present_perfect: {"ami":"ব্যবহার করেছি","tumi":"ব্যবহার করেছো","apni":"ব্যবহার করেছেন","se":"ব্যবহার করেছে"},
            past_simple: {"ami":"ব্যবহার করলাম","tumi":"ব্যবহার করলে","apni":"ব্যবহার করলেন","se":"ব্যবহার করলো"},
            past_perfect: {"ami":"ব্যবহার করেছিলাম","tumi":"ব্যবহার করেছিলে","apni":"ব্যবহার করেছিলেন","se":"ব্যবহার করেছিল"}
        }
    }
];

export function getVerbForms(verb, tense = "present_simple") {
    if (verb && verb.tenses && verb.tenses[tense]) {
        return verb.tenses[tense];
    }
    return {
        ami: "",
        tumi: "",
        apni: "",
        se: ""
    };
}
