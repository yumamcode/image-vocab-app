export const WORD_CATEGORIES = [
  { value: "general", label: "一般 (general)" },
  { value: "business", label: "ビジネス (business)" },
  { value: "travel", label: "旅行・交通 (travel)" },
  { value: "daily", label: "日常・生活 (daily)" },
  { value: "nature", label: "自然・環境 (nature)" },
  { value: "health", label: "健康・医療 (health)" },
  { value: "food", label: "食事・料理 (food)" },
  { value: "tech", label: "IT・技術 (tech)" },
] as const;

export type WordCategory = (typeof WORD_CATEGORIES)[number]["value"];

