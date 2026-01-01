export interface Memory {
  id: string;
  question: string;
  answer: string;
  paintingUrl: string; // Base64 or URL
  title?: string; // AI generated poetic title
  timestamp: number;
}

export type Language = 'en' | 'zh';

export const TEXTS = {
  en: {
    landingTitle: ["The", "2025", "Gallery"],
    createBtn: "Create your gallery",
    viewOthersBtn: "See others' gallery",
    viewMyBtn: "Visit My Collection", // New
    curatedBy: "Curated by The Cat Curator",
    curatorQuote: "Turn your memories into a masterpiece.",
    seasonal: "Seasonal Offering",
    poweredBy: "Powered by Gemini AI",
    
    questionPrefix: "Collection No.",
    placeholder: "Draft your memory...",
    addPhoto: "Add Reference",
    generate: "Create Art",
    generatingTitle: "Creating your piece...",
    generatingSubtitle: "Interpreting memory...",
    curatorNote: "Curator's Note",
    next: "Next Memory",
    finish: "Finish Exhibition",
    imgNotAvailable: "Image not available",
    
    galleryTitle: "The 2025 Collection",
    gallerySubtitle: "Curated by You & The Cat Curator",
    exhibit: "Exhibit",
    endTitle: "End of Exhibition",
    endSubtitle: "Your 2025 has been immortalized.",
    restart: "Start New Exhibition",
    artworkTitle: "The Artwork",
    questionTitle: "The Question",
    memoryTitle: "The Memory",
    oilOnCanvas: "Oil on Canvas (Digital)",
  },
  zh: {
    landingTitle: ["2025", "记忆", "美术馆"],
    createBtn: "开启你的展览",
    viewOthersBtn: "参观他人展览",
    viewMyBtn: "进入我的展览", // New
    curatedBy: "策展人：猫咪馆长",
    curatorQuote: "“把你的记忆变为永恒的艺术。”",
    seasonal: "年度限定",
    poweredBy: "由 Gemini AI 驱动",

    questionPrefix: "藏品编号",
    placeholder: "写下你的回忆...",
    addPhoto: "添加参考图",
    generate: "生成画作",
    generatingTitle: "正在创作中...",
    generatingSubtitle: "解读记忆...",
    curatorNote: "馆长寄语",
    next: "下一个记忆",
    finish: "完成展览",
    imgNotAvailable: "图片不可用",

    galleryTitle: "2025 年度展",
    gallerySubtitle: "策展人：你 & 猫咪馆长",
    exhibit: "展品",
    endTitle: "展览结束",
    endSubtitle: "你的2025已被珍藏。",
    restart: "开启新展览",
    artworkTitle: "画作",
    questionTitle: "问题",
    memoryTitle: "记忆",
    oilOnCanvas: "布面油画 (数字版)",
  }
};

export const QUESTIONS = {
  en: [
    "If you had to describe 2025 in three words, which ones would you choose?",
    "Looking back at the year, do you feel fulfilled or is there a hint of regret?",
    "If you could say one thing to yourself from exactly one year ago, what would it be?",
    "New Experiences: Did you visit any new places? See any unforgettable scenery? Meet any new friends?",
    "Did you try anything this year that you had never done before? Any new skills or hobbies?",
    "Did you have a favorite song, book, movie, or TV series this year?",
    "Joy & Sorrow: What was one moment this year that made you feel truly happy or warm?",
    "Was there a moment that felt suffocating or incredibly difficult? Have you healed from it?",
    "Finally, what was your biggest lesson? If you could live this year over again, what would you do differently?"
  ],
  zh: [
    "如果让你用三个词语来形容2025？你会用哪三个词语？",
    "站在年末的视角回望这一年会觉得圆满还是有一点遗憾？",
    "假如可以给去年这个时候的自己说一句话会说什么呢？",
    "新的体验类：有没有去到一些新的地方？路上难忘的风景？有没有认识新的朋友以及如何成为朋友的？",
    "今年有没有尝试过之前没有做过的事情，体验如何？新技能和爱好？",
    "今年有没有特别喜欢的歌，书或者电影或者剧集？",
    "快乐 & 悲伤的时刻：今年让你感到幸福或者温暖的一个瞬间？",
    "有没有让你感觉很难受无法呼吸的时刻？现在走出来了吗？想和当时的自己说些什么吗？",
    "有收获的事情，如果再来一次会怎么做？"
  ]
};

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  imageUrl?: string; 
  isPainting?: boolean; 
}

export enum AppMode {
  LANDING = 'LANDING',
  INTERVIEW = 'INTERVIEW',
  GALLERY = 'GALLERY'
}

export const DEMO_MEMORIES = {
  en: [
    {
      id: 'demo1',
      question: "If you had to describe 2025 in three words, which ones would you choose?",
      answer: "Growth, Solitude, Resilience. It was a year of building foundations in the dark.",
      paintingUrl: "https://images.unsplash.com/photo-1507608616759-54f48f0af0ee?q=80&w=2787&auto=format&fit=crop",
      title: "Silent Foundations",
      timestamp: Date.now() - 10000000
    },
    {
      id: 'demo2',
      question: "Joy & Sorrow: What was one moment this year that made you feel truly happy or warm?",
      answer: "Watching the sunset over the city skyline with my best friend, sharing a cheap pizza. It felt infinite.",
      paintingUrl: "https://images.unsplash.com/photo-1514565131-fce0801e5785?q=80&w=2856&auto=format&fit=crop",
      title: "City Sunset",
      timestamp: Date.now() - 5000000
    },
    {
      id: 'demo3',
      question: "Finally, what was your biggest lesson? If you could live this year over again, what would you do differently?",
      answer: "Learning to let go of what I cannot control. If I could do it again, I would worry less.",
      paintingUrl: "https://images.unsplash.com/photo-1499781350541-7783f6c6a0c8?q=80&w=2915&auto=format&fit=crop",
      title: "Letting Go",
      timestamp: Date.now()
    }
  ],
  zh: [
    {
      id: 'demo1',
      question: "如果让你用三个词语来形容2025？你会用哪三个词语？",
      answer: "成长，孤独，韧性。这是在黑暗中打基础的一年。",
      paintingUrl: "https://images.unsplash.com/photo-1507608616759-54f48f0af0ee?q=80&w=2787&auto=format&fit=crop",
      title: "沉默的基石",
      timestamp: Date.now() - 10000000
    },
    {
      id: 'demo2',
      question: "快乐 & 悲伤的时刻：今年让你感到幸福或者温暖的一个瞬间？",
      answer: "和最好的朋友看着城市天际线的日落，分享着便宜的披萨。感觉时间无限。",
      paintingUrl: "https://images.unsplash.com/photo-1514565131-fce0801e5785?q=80&w=2856&auto=format&fit=crop",
      title: "城市落日",
      timestamp: Date.now() - 5000000
    },
    {
      id: 'demo3',
      question: "有收获的事情，如果再来一次会怎么做？",
      answer: "学会放手那些我无法控制的事情。如果重来一次，我会少一点焦虑。",
      paintingUrl: "https://images.unsplash.com/photo-1499781350541-7783f6c6a0c8?q=80&w=2915&auto=format&fit=crop",
      title: "放手",
      timestamp: Date.now()
    }
  ]
};
