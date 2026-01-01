import { useState, useEffect, useCallback, useMemo } from "react";
import { createClient } from "@/lib/supabase-browser";
import { Word, NewWord } from "@/types/word";

export function useAdminWords() {
  const [words, setWords] = useState<Word[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [editingWord, setEditingWord] = useState<Word | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [newWord, setNewWord] = useState<NewWord>({
    word: "",
    meaning: "",
    pronunciation: "",
    category: "general",
    part_of_speech: "noun",
    difficulty: "beginner",
  });

  const supabase = createClient();

  const fetchWords = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("words")
      .select("*")
      .order("word", { ascending: true });

    if (data) setWords(data as Word[]);
    if (error) console.error("Error fetching words:", error);
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    fetchWords();
  }, [fetchWords]);

  const handleAddWord = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWord.word || !newWord.meaning) return;

    setLoading(true);
    const { error } = await supabase.from("words").insert([newWord]);
    if (error) {
      alert("単語の登録に失敗しました: " + error.message);
    } else {
      setNewWord({
        word: "",
        meaning: "",
        pronunciation: "",
        category: "general",
        part_of_speech: "noun",
        difficulty: "beginner",
      });
      setIsAdding(false);
      fetchWords();
    }
    setLoading(false);
  };

  const handleUpdateWord = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingWord) return;

    setLoading(true);
    const { error } = await supabase
      .from("words")
      .update({
        word: editingWord.word,
        meaning: editingWord.meaning,
        pronunciation: editingWord.pronunciation,
        part_of_speech: editingWord.part_of_speech,
        difficulty: editingWord.difficulty,
        category: editingWord.category,
      })
      .eq("id", editingWord.id);

    if (error) {
      alert("更新に失敗しました: " + error.message);
    } else {
      setIsEditModalOpen(false);
      setEditingWord(null);
      fetchWords();
    }
    setLoading(false);
  };

  const handleEditClick = (word: Word) => {
    setEditingWord({ ...word });
    setIsEditModalOpen(true);
  };

  const filteredWords = useMemo(() => {
    return words.filter(
      (w) =>
        w.word.toLowerCase().includes(search.toLowerCase()) ||
        w.meaning.includes(search)
    );
  }, [words, search]);

  return {
    words,
    setWords,
    loading,
    search,
    setSearch,
    isAdding,
    setIsAdding,
    newWord,
    setNewWord,
    editingWord,
    setEditingWord,
    isEditModalOpen,
    setIsEditModalOpen,
    filteredWords,
    fetchWords,
    handleAddWord,
    handleUpdateWord,
    handleEditClick,
  };
}

