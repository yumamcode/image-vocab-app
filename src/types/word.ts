export interface Word {
  id: number;
  word: string;
  meaning: string;
  pronunciation: string | null;
  part_of_speech: string | null;
  category: string | null;
  difficulty: "beginner" | "intermediate" | "advanced";
  image_url: string | null;
  audio_url: string | null;
  created_at: string;
}

export type NewWord = Omit<
  Word,
  "id" | "image_url" | "audio_url" | "created_at"
>;
