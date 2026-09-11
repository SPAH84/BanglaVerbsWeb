// verbs.js - Modular Verb Dataset for Bangla Verb Drills
// Supports modular Learning Sets: Set 1 (Foundation), Set 2 (Extended), Set 3 (Advanced), Set 4 (Mastery)

export const VERB_SETS = {
    1: { id: 1, name: "Foundation", count: 19, description: "Essential daily verbs" },
    2: { id: 2, name: "Extended", count: 40, description: "Everyday actions & communication" },
    3: { id: 3, name: "Advanced", count: 40, description: "Conversational & abstract verbs (Upcoming)" },
    4: { id: 4, name: "Mastery", count: 40, description: "Specialized & literary verbs (Upcoming)" }
};

export const VERBS = [
    // --- SET 1: FOUNDATION (19 VERBS) ---
    {
        id: "v001", set: 1, eng: "To do", inf: "করা",
        tenses: {
            present_simple: { ami: "করি", tumi: "করো", apni: "করেন", se: "করে" },
            present_perfect: { ami: "করেছি", tumi: "করেছো", apni: "করেছেন", se: "করেছে" }
        }
    },
    {
        id: "v002", set: 1, eng: "To go", inf: "যাওয়া",
        tenses: {
            present_simple: { ami: "যাই", tumi: "যাও", apni: "যান", se: "যায়" },
            present_perfect: { ami: "গিয়েছি", tumi: "গিয়েছো", apni: "গিয়েছেন", se: "গিয়েছে" }
        }
    },
    {
        id: "v003", set: 1, eng: "To come", inf: "আসা",
        tenses: {
            present_simple: { ami: "আসি", tumi: "আসো", apni: "আসেন", se: "আসে" },
            present_perfect: { ami: "এসেছি", tumi: "এসেছো", apni: "এসেছেন", se: "এসেছে" }
        }
    },
    {
        id: "v004", set: 1, eng: "To eat", inf: "খাওয়া",
        tenses: {
            present_simple: { ami: "খাই", tumi: "খাও", apni: "খান", se: "খায়" },
            present_perfect: { ami: "খেয়েছি", tumi: "খেয়েছো", apni: "খেয়েছেন", se: "খেয়েছে" }
        }
    },
    {
        id: "v005", set: 1, eng: "To give", inf: "দেওয়া",
        tenses: {
            present_simple: { ami: "দিই", tumi: "দাও", apni: "দেন", se: "দেয়" },
            present_perfect: { ami: "দিয়েছি", tumi: "দিয়েছো", apni: "দিয়েছেন", se: "দিয়েছে" }
        }
    },
    {
        id: "v006", set: 1, eng: "To take", inf: "নেওয়া",
        tenses: {
            present_simple: { ami: "নিই", tumi: "নাও", apni: "নেন", se: "নেয়" },
            present_perfect: { ami: "নিয়েছি", tumi: "নিয়েছো", apni: "নিয়েছেন", se: "নিয়েছে" }
        }
    },
    {
        id: "v007", set: 1, eng: "To see", inf: "দেখা",
        tenses: {
            present_simple: { ami: "দেখি", tumi: "দেখো", apni: "দেখেন", se: "দেখে" },
            present_perfect: { ami: "দেখেছি", tumi: "দেখেছো", apni: "দেখেছেন", se: "দেখেছে" }
        }
    },
    {
        id: "v008", set: 1, eng: "To say", inf: "বলা",
        tenses: {
            present_simple: { ami: "বলি", tumi: "বলো", apni: "বলেন", se: "বলে" },
            present_perfect: { ami: "বলেছি", tumi: "বলেছো", apni: "বলেছেন", se: "বলেছে" }
        }
    },
    {
        id: "v009", set: 1, eng: "To hear", inf: "শোনা",
        tenses: {
            present_simple: { ami: "শুনি", tumi: "শোনো", apni: "শোনেন", se: "শোনে" },
            present_perfect: { ami: "শুনেছি", tumi: "শুনেছো", apni: "শুনেছেন", se: "শুনেছে" }
        }
    },
    {
        id: "v010", set: 1, eng: "To know", inf: "জানা",
        tenses: {
            present_simple: { ami: "জানি", tumi: "জানো", apni: "জানেন", se: "জানে" },
            present_perfect: { ami: "জেনেছি", tumi: "জেনেছো", apni: "জেনেছেন", se: "জেনেছে" }
        }
    },
    {
        id: "v011", set: 1, eng: "To understand", inf: "বোঝা",
        tenses: {
            present_simple: { ami: "বুঝি", tumi: "বোঝো", apni: "বোঝেন", se: "বোঝে" },
            present_perfect: { ami: "বুঝেছি", tumi: "বুঝেছো", apni: "বুঝেছেন", se: "বুঝেছে" }
        }
    },
    {
        id: "v012", set: 1, eng: "To read", inf: "পড়া",
        tenses: {
            present_simple: { ami: "পড়ি", tumi: "পড়ো", apni: "পড়েন", se: "পড়ে" },
            present_perfect: { ami: "পড়েছি", tumi: "পড়েছো", apni: "পড়েছেন", se: "পড়েছে" }
        }
    },
    {
        id: "v013", set: 1, eng: "To write", inf: "লেখা",
        tenses: {
            present_simple: { ami: "লিখি", tumi: "লেখো", apni: "লেখেন", se: "লেখে" },
            present_perfect: { ami: "লিখেছি", tumi: "লিখেছো", apni: "লিখেছেন", se: "লিখেছে" }
        }
    },
    {
        id: "v014", set: 1, eng: "To sit", inf: "বসা",
        tenses: {
            present_simple: { ami: "বসি", tumi: "বসো", apni: "বসেন", se: "বসে" },
            present_perfect: { ami: "বসেছি", tumi: "বসেছো", apni: "বসেছেন", se: "বসেছে" }
        }
    },
    {
        id: "v015", set: 1, eng: "To stand", inf: "দাঁড়ানো",
        tenses: {
            present_simple: { ami: "দাঁড়াই", tumi: "দাঁড়াও", apni: "দাঁড়ান", se: "দাঁড়ায়" },
            present_perfect: { ami: "দাঁড়িয়েছি", tumi: "দাঁড়িয়েছো", apni: "দাঁড়িয়েছেন", se: "দাঁড়িয়েছে" }
        }
    },
    {
        id: "v016", set: 1, eng: "To sleep", inf: "ঘুমানো",
        tenses: {
            present_simple: { ami: "ঘুমাই", tumi: "ঘুমাও", apni: "ঘুমান", se: "ঘুমায়" },
            present_perfect: { ami: "ঘুমিয়েছি", tumi: "ঘুমিয়েছো", apni: "ঘুমিয়েছেন", se: "ঘুমিয়েছে" }
        }
    },
    {
        id: "v017", set: 1, eng: "To stay", inf: "থাকা",
        tenses: {
            present_simple: { ami: "থাকি", tumi: "থাকো", apni: "থাকেন", se: "থাকে" },
            present_perfect: { ami: "থেকেছি", tumi: "থেকেছো", apni: "থেকেছেন", se: "থেকেছে" }
        }
    },
    {
        id: "v018", set: 1, eng: "To learn", inf: "শেখা",
        tenses: {
            present_simple: { ami: "শিখি", tumi: "শেখো", apni: "শেখেন", se: "শেখে" },
            present_perfect: { ami: "শিখেছি", tumi: "শিখেছো", apni: "শিখেছেন", se: "শিখেছে" }
        }
    },
    {
        id: "v019", set: 1, eng: "To love", inf: "ভালোবাসা",
        tenses: {
            present_simple: { ami: "ভালোবাসি", tumi: "ভালোবাসো", apni: "ভালোবাসেন", se: "ভালোবাসে" },
            present_perfect: { ami: "ভালোবেসেছি", tumi: "ভালোবেসেছো", apni: "ভালোবেসেছেন", se: "ভালোবেসেছে" }
        }
    },

    // --- SET 2: EXTENDED (40 VERBS) ---
    {
        id: "v020", set: 2, eng: "To open", inf: "খোলা",
        tenses: {
            present_simple: { ami: "খুলি", tumi: "খোলো", apni: "খোলেন", se: "খোলে" },
            present_perfect: { ami: "খুলেছি", tumi: "খুলেছো", apni: "খুলেছেন", se: "খুলেছে" }
        }
    },
    {
        id: "v021", set: 2, eng: "To close", inf: "বন্ধ করা",
        tenses: {
            present_simple: { ami: "বন্ধ করি", tumi: "বন্ধ করো", apni: "বন্ধ করেন", se: "বন্ধ করে" },
            present_perfect: { ami: "বন্ধ করেছি", tumi: "বন্ধ করেছো", apni: "বন্ধ করেছেন", se: "বন্ধ করেছে" }
        }
    },
    {
        id: "v022", set: 2, eng: "To buy", inf: "কেনা",
        tenses: {
            present_simple: { ami: "কিনি", tumi: "কেনো", apni: "কেনেন", se: "কেনে" },
            present_perfect: { ami: "কিনেছি", tumi: "কিনেছো", apni: "কিনেছেন", se: "কিনেছে" }
        }
    },
    {
        id: "v023", set: 2, eng: "To sell", inf: "বেচা",
        tenses: {
            present_simple: { ami: "বেচি", tumi: "বেচো", apni: "বেচেন", se: "বেচে" },
            present_perfect: { ami: "বেচেছি", tumi: "বেচেছো", apni: "বেচেছেন", se: "বেচেছে" }
        }
    },
    {
        id: "v024", set: 2, eng: "To bring", inf: "আনা",
        tenses: {
            present_simple: { ami: "আনি", tumi: "আনো", apni: "আনেন", se: "আনে" },
            present_perfect: { ami: "এনেছি", tumi: "এনেছো", apni: "এনেছেন", se: "এনেছে" }
        }
    },
    {
        id: "v025", set: 2, eng: "To send", inf: "পাঠানো",
        tenses: {
            present_simple: { ami: "পাঠাই", tumi: "পাঠাও", apni: "পাঠান", se: "পাঠায়" },
            present_perfect: { ami: "পাঠিয়েছি", tumi: "পাঠিয়েছো", apni: "পাঠিয়েছেন", se: "পাঠিয়েছে" }
        }
    },
    {
        id: "v026", set: 2, eng: "To call", inf: "ডাকা",
        tenses: {
            present_simple: { ami: "ডাকি", tumi: "ডাকো", apni: "ডাকেন", se: "ডাকে" },
            present_perfect: { ami: "ডেকেছি", tumi: "ডেকেছো", apni: "ডেকেছেন", se: "ডেকেছে" }
        }
    },
    {
        id: "v027", set: 2, eng: "To ask", inf: "জিজ্ঞাসা করা",
        tenses: {
            present_simple: { ami: "জিজ্ঞাসা করি", tumi: "জিজ্ঞাসা করো", apni: "জিজ্ঞাসা করেন", se: "জিজ্ঞাসা করে" },
            present_perfect: { ami: "জিজ্ঞাসা করেছি", tumi: "জিজ্ঞাসা করেছো", apni: "জিজ্ঞাসা করেছেন", se: "জিজ্ঞাসা করেছে" }
        }
    },
    {
        id: "v028", set: 2, eng: "To answer", inf: "উত্তর দেওয়া",
        tenses: {
            present_simple: { ami: "উত্তর দিই", tumi: "উত্তর দাও", apni: "উত্তর দেন", se: "উত্তর দেয়" },
            present_perfect: { ami: "উত্তর দিয়েছি", tumi: "উত্তর দিয়েছো", apni: "উত্তর দিয়েছেন", se: "উত্তর দিয়েছে" }
        }
    },
    {
        id: "v029", set: 2, eng: "To work", inf: "কাজ করা",
        tenses: {
            present_simple: { ami: "কাজ করি", tumi: "কাজ করো", apni: "কাজ করেন", se: "কাজ করে" },
            present_perfect: { ami: "কাজ করেছি", tumi: "কাজ করেছো", apni: "কাজ করেছেন", se: "কাজ করেছে" }
        }
    },
    {
        id: "v030", set: 2, eng: "To play", inf: "খেলা",
        tenses: {
            present_simple: { ami: "খেলি", tumi: "খেলো", apni: "খেলেন", se: "খেলে" },
            present_perfect: { ami: "খেলেছি", tumi: "খেলেছো", apni: "খেলেছেন", se: "খেলেছে" }
        }
    },
    {
        id: "v031", set: 2, eng: "To run", inf: "দৌড়ানো",
        tenses: {
            present_simple: { ami: "দৌড়াই", tumi: "দৌড়াও", apni: "দৌড়ান", se: "দৌড়ায়" },
            present_perfect: { ami: "দৌড়েছি", tumi: "দৌড়েছো", apni: "দৌড়েছেন", se: "দৌড়েছে" }
        }
    },
    {
        id: "v032", set: 2, eng: "To walk", inf: "হাঁটা",
        tenses: {
            present_simple: { ami: "হাঁটি", tumi: "হাঁটো", apni: "হাঁটেন", se: "হাঁটে" },
            present_perfect: { ami: "হেঁটেছি", tumi: "হেঁটেছো", apni: "হেঁটেছেন", se: "হেঁটেছে" }
        }
    },
    {
        id: "v033", set: 2, eng: "To swim", inf: "সাঁতার কাটা",
        tenses: {
            present_simple: { ami: "সাঁতার কাটি", tumi: "সাঁতার কাটো", apni: "সাঁতার কাটেন", se: "সাঁতার কাটে" },
            present_perfect: { ami: "সাঁতার কেটেছি", tumi: "সাঁতার কেটেছো", apni: "সাঁতার কেটেছেন", se: "সাঁতার কেটেছে" }
        }
    },
    {
        id: "v034", set: 2, eng: "To smile", inf: "হাসা",
        tenses: {
            present_simple: { ami: "হাসি", tumi: "হাসো", apni: "হাসেন", se: "হাসে" },
            present_perfect: { ami: "হেসেছি", tumi: "হেসেছো", apni: "হেসেছেন", se: "হেসেছে" }
        }
    },
    {
        id: "v035", set: 2, eng: "To cry", inf: "কাঁদা",
        tenses: {
            present_simple: { ami: "কাঁদি", tumi: "কাঁদো", apni: "কাঁদেন", se: "কাঁদে" },
            present_perfect: { ami: "কেঁদেছি", tumi: "কেঁদেছো", apni: "কেঁদেছেন", se: "কেঁদেছে" }
        }
    },
    {
        id: "v036", set: 2, eng: "To think", inf: "ভাবা",
        tenses: {
            present_simple: { ami: "ভাবি", tumi: "ভাবো", apni: "ভাবেন", se: "ভাবে" },
            present_perfect: { ami: "ভেবেছি", tumi: "ভেবেছো", apni: "ভেবেছেন", se: "ভেবেছে" }
        }
    },
    {
        id: "v037", set: 2, eng: "To remember", inf: "মনে রাখা",
        tenses: {
            present_simple: { ami: "মনে রাখি", tumi: "মনে রাখো", apni: "মনে রাখেন", se: "মনে রাখে" },
            present_perfect: { ami: "মনে রেখেছি", tumi: "মনে রেখেছো", apni: "মনে রেখেছেন", se: "মনে রেখেছে" }
        }
    },
    {
        id: "v038", set: 2, eng: "To forget", inf: "ভুলে যাওয়া",
        tenses: {
            present_simple: { ami: "ভুলে যাই", tumi: "ভুলে যাও", apni: "ভুলে যান", se: "ভুলে যায়" },
            present_perfect: { ami: "ভুলে গিয়েছি", tumi: "ভুলে গিয়েছো", apni: "ভুলে গিয়েছেন", se: "ভুলে গিয়েছে" }
        }
    },
    {
        id: "v039", set: 2, eng: "To wait", inf: "অপেক্ষা করা",
        tenses: {
            present_simple: { ami: "অপেক্ষা করি", tumi: "অপেক্ষা করো", apni: "অপেক্ষা করেন", se: "অপেক্ষা করে" },
            present_perfect: { ami: "অপেক্ষা করেছি", tumi: "অপেক্ষা করেছো", apni: "অপেক্ষা করেছেন", se: "অপেক্ষা করেছে" }
        }
    },
    {
        id: "v040", set: 2, eng: "To help", inf: "সাহায্য করা",
        tenses: {
            present_simple: { ami: "সাহায্য করি", tumi: "সাহায্য করো", apni: "সাহায্য করেন", se: "সাহায্য করে" },
            present_perfect: { ami: "সাহায্য করেছি", tumi: "সাহায্য করেছো", apni: "সাহায্য করেছেন", se: "সাহায্য করেছে" }
        }
    },
    {
        id: "v041", set: 2, eng: "To teach", inf: "শেখানো",
        tenses: {
            present_simple: { ami: "শেখাই", tumi: "শেখাও", apni: "শেখান", se: "শেখায়" },
            present_perfect: { ami: "শিখিয়েছি", tumi: "শিখিয়েছো", apni: "শিখিয়েছেন", se: "শিখিয়েছে" }
        }
    },
    {
        id: "v042", set: 2, eng: "To begin", inf: "শুরু করা",
        tenses: {
            present_simple: { ami: "শুরু করি", tumi: "শুরু করো", apni: "শুরু করেন", se: "শুরু করে" },
            present_perfect: { ami: "শুরু করেছি", tumi: "শুরু করেছো", apni: "শুরু করেছেন", se: "শুরু করেছে" }
        }
    },
    {
        id: "v043", set: 2, eng: "To finish", inf: "শেষ করা",
        tenses: {
            present_simple: { ami: "শেষ করি", tumi: "শেষ করো", apni: "শেষ করেন", se: "শেষ করে" },
            present_perfect: { ami: "শেষ করেছি", tumi: "শেষ করেছো", apni: "শেষ করেছেন", se: "শেষ করেছে" }
        }
    },
    {
        id: "v044", set: 2, eng: "To cook", inf: "রান্না করা",
        tenses: {
            present_simple: { ami: "রান্না করি", tumi: "রান্না করো", apni: "রান্না করেন", se: "রান্না করে" },
            present_perfect: { ami: "রান্না করেছি", tumi: "রান্না করেছো", apni: "রান্না করেছেন", se: "রান্না করেছে" }
        }
    },
    {
        id: "v045", set: 2, eng: "To clean", inf: "পরিষ্কার করা",
        tenses: {
            present_simple: { ami: "পরিষ্কার করি", tumi: "পরিষ্কার করো", apni: "পরিষ্কার করেন", se: "পরিষ্কার করে" },
            present_perfect: { ami: "পরিষ্কার করেছি", tumi: "পরিষ্কার করেছো", apni: "পরিষ্কার করেছেন", se: "পরিষ্কার করেছে" }
        }
    },
    {
        id: "v046", set: 2, eng: "To wash", inf: "ধোয়া",
        tenses: {
            present_simple: { ami: "ধুই", tumi: "ধোও", apni: "ধোন", se: "ধোয়" },
            present_perfect: { ami: "ধুয়েছি", tumi: "ধুয়েছো", apni: "ধুয়েছেন", se: "ধুয়েছে" }
        }
    },
    {
        id: "v047", set: 2, eng: "To wear", inf: "পরা",
        tenses: {
            present_simple: { ami: "পরি", tumi: "পরো", apni: "পরেন", se: "পরে" },
            present_perfect: { ami: "পরেছি", tumi: "পরেছো", apni: "পরেছেন", se: "পরেছে" }
        }
    },
    {
        id: "v048", set: 2, eng: "To live", inf: "বাস করা",
        tenses: {
            present_simple: { ami: "বাস করি", tumi: "বাস করো", apni: "বাস করেন", se: "বাস করে" },
            present_perfect: { ami: "বাস করেছি", tumi: "বাস করেছো", apni: "বাস করেছেন", se: "বাস করেছে" }
        }
    },
    {
        id: "v049", set: 2, eng: "To arrive", inf: "পৌঁছানো",
        tenses: {
            present_simple: { ami: "পৌঁছাই", tumi: "পৌঁছাও", apni: "পৌঁছান", se: "পৌঁছায়" },
            present_perfect: { ami: "পৌঁছেছি", tumi: "পৌঁছেছো", apni: "পৌঁছেছেন", se: "পৌঁছেছে" }
        }
    },
    {
        id: "v050", set: 2, eng: "To leave", inf: "ছাড়া",
        tenses: {
            present_simple: { ami: "ছাড়ি", tumi: "ছাড়ো", apni: "ছাড়েন", se: "ছাড়ে" },
            present_perfect: { ami: "ছেড়েছি", tumi: "ছেড়েছো", apni: "ছেড়েছেন", se: "ছেড়েছে" }
        }
    },
    {
        id: "v051", set: 2, eng: "To meet", inf: "দেখা করা",
        tenses: {
            present_simple: { ami: "দেখা করি", tumi: "দেখা করো", apni: "দেখা করেন", se: "দেখা করে" },
            present_perfect: { ami: "দেখা করেছি", tumi: "দেখা করেছো", apni: "দেখা করেছেন", se: "দেখা করেছে" }
        }
    },
    {
        id: "v052", set: 2, eng: "To travel", inf: "ভ্রমণ করা",
        tenses: {
            present_simple: { ami: "ভ্রমণ করি", tumi: "ভ্রমণ করো", apni: "ভ্রমণ করেন", se: "ভ্রমণ করে" },
            present_perfect: { ami: "ভ্রমণ করেছি", tumi: "ভ্রমণ করেছো", apni: "ভ্রমণ করেছেন", se: "ভ্রমণ করেছে" }
        }
    },
    {
        id: "v053", set: 2, eng: "To pay", inf: "পরিশোধ করা",
        tenses: {
            present_simple: { ami: "পরিশোধ করি", tumi: "পরিশোধ করো", apni: "পরিশোধ করেন", se: "পরিশোধ করে" },
            present_perfect: { ami: "পরিশোধ করেছি", tumi: "পরিশোধ করেছো", apni: "পরিশোধ করেছেন", se: "পরিশোধ করেছে" }
        }
    },
    {
        id: "v054", set: 2, eng: "To win", inf: "জেতা",
        tenses: {
            present_simple: { ami: "জিতি", tumi: "জেতো", apni: "জেতেন", se: "জেতে" },
            present_perfect: { ami: "জিতেছি", tumi: "জিতেছো", apni: "জিতেছেন", se: "জিতেছে" }
        }
    },
    {
        id: "v055", set: 2, eng: "To lose", inf: "হারানো",
        tenses: {
            present_simple: { ami: "হারাই", tumi: "হারাও", apni: "হারান", se: "হারায়" },
            present_perfect: { ami: "হারিয়েছি", tumi: "হারিয়েছো", apni: "হারিয়েছেন", se: "হারিয়েছে" }
        }
    },
    {
        id: "v056", set: 2, eng: "To show", inf: "দেখানো",
        tenses: {
            present_simple: { ami: "দেখাই", tumi: "দেখাও", apni: "দেখান", se: "দেখায়" },
            present_perfect: { ami: "দেখিয়েছি", tumi: "দেখিয়েছো", apni: "দেখিয়েছেন", se: "দেখিয়েছে" }
        }
    },
    {
        id: "v057", set: 2, eng: "To touch", inf: "ছোঁয়া",
        tenses: {
            present_simple: { ami: "ছুঁই", tumi: "ছোঁও", apni: "ছোঁন", se: "ছোঁয়" },
            present_perfect: { ami: "ছুঁয়েছি", tumi: "ছুঁয়েছো", apni: "ছুঁয়েছেন", se: "ছুঁয়েছে" }
        }
    },
    {
        id: "v058", set: 2, eng: "To carry", inf: "বহন করা",
        tenses: {
            present_simple: { ami: "বহন করি", tumi: "বহন করো", apni: "বহন করেন", se: "বহন করে" },
            present_perfect: { ami: "বহন করেছি", tumi: "বহন করেছো", apni: "বহন করেছেন", se: "বহন করেছে" }
        }
    },
    {
        id: "v059", set: 2, eng: "To use", inf: "ব্যবহার করা",
        tenses: {
            present_simple: { ami: "ব্যবহার করি", tumi: "ব্যবহার করো", apni: "ব্যবহার করেন", se: "ব্যবহার করে" },
            present_perfect: { ami: "ব্যবহার করেছি", tumi: "ব্যবহার করেছো", apni: "ব্যবহার করেছেন", se: "ব্যবহার করেছে" }
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
