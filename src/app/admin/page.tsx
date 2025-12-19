"use client";
// 管理者向けダッシュボード（単語管理・画像アップロード）
import React, { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase-browser";
import { Loader2, Upload, Search, Check, X } from "lucide-react";
import Link from "next/link";

interface Word {
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

export default function AdminPage() {
  const [words, setWords] = useState<Word[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [uploadingId, setUploadingId] = useState<number | null>(null);
  const [uploadingBulk, setUploadingBulk] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [bulkStatus, setBulkStatus] = useState<{
    current: number;
    total: number;
  } | null>(null);
  const [newWord, setNewWord] = useState({
    word: "",
    meaning: "",
    pronunciation: "",
    category: "general",
    part_of_speech: "noun",
    difficulty: "beginner" as Word["difficulty"],
  });
  const [isAdding, setIsAdding] = useState(false);
  const [dragOverId, setDragOverId] = useState<number | null>(null);
  const [editingWord, setEditingWord] = useState<Word | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const supabase = createClient();

  const fetchWords = React.useCallback(async () => {
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

  const handleEditClick = (word: Word) => {
    setEditingWord({ ...word });
    setIsEditModalOpen(true);
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

  const handleRowDragOver = (e: React.DragEvent, id: number) => {
    e.preventDefault();
    setDragOverId(id);
  };

  const handleRowDragLeave = () => {
    setDragOverId(null);
  };

  const handleRowDrop = async (e: React.DragEvent, id: number) => {
    e.preventDefault();
    setDragOverId(null);
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      uploadIndividualImage(files[0], id);
    }
  };

  const uploadIndividualImage = async (file: File, wordId: number) => {
    if (!file.type.startsWith("image/")) return;

    setUploadingId(wordId);
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${wordId}_${Date.now()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from("word-images")
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const {
        data: { publicUrl },
      } = supabase.storage.from("word-images").getPublicUrl(fileName);

      const { error: updateError } = await supabase
        .from("words")
        .update({ image_url: publicUrl })
        .eq("id", wordId);

      if (updateError) throw updateError;

      setWords(
        words.map((w) => (w.id === wordId ? { ...w, image_url: publicUrl } : w))
      );
    } catch (err: unknown) {
      console.error(err);
      alert(
        "画像のアップロードに失敗しました: " +
          (err instanceof Error ? err.message : "不明なエラー")
      );
    } finally {
      setUploadingId(null);
    }
  };

  const handleBulkImageUpload = async () => {
    setUploadingBulk(true);
    try {
      const res = await fetch("/api/admin/upload-bulk-images", {
        method: "POST",
      });
      const data = await res.json();
      if (res.ok) {
        alert(
          `一括登録が完了しました。\n成功: ${data.success}\n失敗: ${
            data.failed
          }\n\nログ:\n${data.logs.join("\n")}`
        );
        fetchWords();
      } else {
        alert("エラーが発生しました: " + data.error);
      }
    } catch (err: unknown) {
      console.error(err);
      alert("エラーが発生しました");
    } finally {
      setUploadingBulk(false);
    }
  };

  const handleFiles = async (files: FileList | File[]) => {
    const fileArray = Array.from(files).filter((f) =>
      f.type.startsWith("image/")
    );
    if (fileArray.length === 0) return;

    setUploadingBulk(true);
    setBulkStatus({ current: 0, total: fileArray.length });

    let successCount = 0;
    let failCount = 0;

    for (let i = 0; i < fileArray.length; i++) {
      const file = fileArray[i];
      setBulkStatus({ current: i + 1, total: fileArray.length });

      const wordName = file.name.split(".")[0].toLowerCase();

      try {
        // 1. 単語を検索 (大文字小文字を区別しない)
        const { data: wordData, error: findError } = await supabase
          .from("words")
          .select("id")
          .ilike("word", wordName)
          .maybeSingle();

        if (findError) throw findError;

        if (!wordData) {
          console.warn(`Word not found in DB: ${wordName}`);
          failCount++;
          continue;
        }

        // 2. アップロード
        const fileExt = file.name.split(".").pop();
        const fileName = `drop_${wordData.id}_${Date.now()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from("word-images")
          .upload(fileName, file, {
            cacheControl: "3600",
            upsert: true,
          });

        if (uploadError) throw uploadError;

        // 3. URL取得
        const {
          data: { publicUrl },
        } = supabase.storage.from("word-images").getPublicUrl(fileName);

        // 4. DB更新
        const { error: updateError } = await supabase
          .from("words")
          .update({ image_url: publicUrl })
          .eq("id", wordData.id);

        if (updateError) throw updateError;

        successCount++;
      } catch (err) {
        console.error(`Error uploading ${wordName}:`, err);
        failCount++;
      }
    }

    alert(`一括アップロード完了\n成功: ${successCount}\n失敗: ${failCount}`);
    setUploadingBulk(false);
    setBulkStatus(null);
    fetchWords();
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    wordId: number
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingId(wordId);
    try {
      // 1. Upload to Supabase Storage
      const fileExt = file.name.split(".").pop();
      const fileName = `${wordId}_${Math.random()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from("word-images")
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // 2. Get Public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from("word-images").getPublicUrl(fileName);

      // 3. Update database
      const { error: updateError } = await supabase
        .from("words")
        .update({ image_url: publicUrl })
        .eq("id", wordId);

      if (updateError) throw updateError;

      // 4. Refresh local state
      setWords(
        words.map((w) => (w.id === wordId ? { ...w, image_url: publicUrl } : w))
      );
      alert("画像をアップロードしました");
    } catch (err: unknown) {
      console.error(err);
      alert(
        "アップロード失敗: " +
          (err instanceof Error ? err.message : "不明なエラー")
      );
    } finally {
      setUploadingId(null);
    }
  };

  const filteredWords = words.filter(
    (w) =>
      w.word.toLowerCase().includes(search.toLowerCase()) ||
      w.meaning.includes(search)
  );

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold font-serif text-gray-900">
              管理者ダッシュボード
            </h1>
            <p className="text-gray-500">単語データ管理と画像登録</p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => setIsAdding(!isAdding)}
              className="bg-green-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-green-700 transition-all flex items-center gap-2"
            >
              {isAdding ? "フォームを閉じる" : "＋ 新規単語登録"}
            </button>
            <button
              onClick={handleBulkImageUpload}
              disabled={uploadingBulk}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700 transition-all disabled:opacity-50 flex items-center gap-2"
            >
              {uploadingBulk ? (
                <Loader2 className="animate-spin" />
              ) : (
                <Upload size={20} />
              )}
              フォルダから一括登録
            </button>
            <Link
              href="/"
              className="bg-gray-800 text-white px-6 py-2 rounded-lg font-bold hover:bg-gray-700 transition-all"
            >
              ホームへ
            </Link>
          </div>
        </header>

        {isAdding && (
          <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-200 mb-8 animate-fade-in text-gray-900">
            <h2 className="text-2xl font-bold mb-6">新規単語登録</h2>
            <form
              onSubmit={handleAddWord}
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  英単語 *
                </label>
                <input
                  type="text"
                  required
                  value={newWord.word}
                  onChange={(e) =>
                    setNewWord({ ...newWord, word: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 outline-none transition-all"
                  placeholder="apple"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  意味 *
                </label>
                <input
                  type="text"
                  required
                  value={newWord.meaning}
                  onChange={(e) =>
                    setNewWord({ ...newWord, meaning: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 outline-none transition-all"
                  placeholder="りんご"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  発音記号
                </label>
                <input
                  type="text"
                  value={newWord.pronunciation}
                  onChange={(e) =>
                    setNewWord({ ...newWord, pronunciation: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 outline-none transition-all"
                  placeholder="/ˈæp.əl/"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  品詞
                </label>
                <select
                  value={newWord.part_of_speech}
                  onChange={(e) =>
                    setNewWord({ ...newWord, part_of_speech: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 outline-none transition-all"
                >
                  <option value="noun">名詞 (noun)</option>
                  <option value="verb">動詞 (verb)</option>
                  <option value="adj">形容詞 (adj)</option>
                  <option value="adv">副詞 (adv)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  難易度
                </label>
                <select
                  value={newWord.difficulty}
                  onChange={(e) =>
                    setNewWord({
                      ...newWord,
                      difficulty: e.target.value as Word["difficulty"],
                    })
                  }
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 outline-none transition-all"
                >
                  <option value="beginner">初級 (beginner)</option>
                  <option value="intermediate">中級 (intermediate)</option>
                  <option value="advanced">上級 (advanced)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  カテゴリー
                </label>
                <input
                  type="text"
                  value={newWord.category}
                  onChange={(e) =>
                    setNewWord({ ...newWord, category: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 outline-none transition-all"
                  placeholder="fruit"
                />
              </div>
              <div className="md:col-span-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-green-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-green-700 transition-all disabled:opacity-50"
                >
                  {loading ? (
                    <Loader2 className="animate-spin mx-auto" />
                  ) : (
                    "単語を登録する"
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Drag & Drop Zone */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`mb-8 p-12 border-4 border-dashed rounded-3xl transition-all flex flex-col items-center justify-center text-center ${
            isDragging
              ? "border-primary bg-primary/5 scale-[1.01]"
              : "border-gray-200 bg-white hover:border-gray-300"
          }`}
        >
          {uploadingBulk ? (
            <div className="space-y-4">
              <Loader2
                className="animate-spin text-primary mx-auto"
                size={48}
              />
              <div className="text-xl font-bold text-gray-900">
                アップロード中...
              </div>
              {bulkStatus && (
                <div className="text-gray-500">
                  {bulkStatus.current} / {bulkStatus.total} 枚を処理中
                </div>
              )}
            </div>
          ) : (
            <>
              <div className="bg-primary/10 p-4 rounded-full mb-4">
                <Upload className="text-primary" size={40} />
              </div>
              <h2 className="text-2xl font-bold mb-2 text-gray-900">
                画像をここにドラッグ＆ドロップ
              </h2>
              <p className="text-gray-500 mb-6">
                ファイル名を「単語名.jpg/png」にしてドロップすると、自動的に紐付けて一括登録します。
              </p>
              <label className="cursor-pointer bg-gray-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-gray-800 transition-all">
                ファイルを選択
                <input
                  type="file"
                  className="hidden"
                  multiple
                  accept="image/*"
                  onChange={(e) =>
                    e.target.files && handleFiles(e.target.files)
                  }
                />
              </label>
            </>
          )}
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-100 bg-gray-50/50">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="単語や意味で検索..."
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-gray-900"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                    単語
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                    意味
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                    カテゴリー
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                    画像
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center">
                      <Loader2
                        className="animate-spin mx-auto text-primary mb-2"
                        size={32}
                      />
                      <p className="text-gray-500">単語を読み込み中...</p>
                    </td>
                  </tr>
                ) : filteredWords.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-12 text-center text-gray-500"
                    >
                      単語が見つかりません
                    </td>
                  </tr>
                ) : (
                  filteredWords.map((word) => (
                    <tr
                      key={word.id}
                      onClick={() => handleEditClick(word)}
                      onDragOver={(e) => handleRowDragOver(e, word.id)}
                      onDragLeave={handleRowDragLeave}
                      onDrop={(e) => handleRowDrop(e, word.id)}
                      className={`hover:bg-gray-50 transition-all cursor-pointer ${
                        dragOverId === word.id
                          ? "bg-blue-50 ring-2 ring-blue-400 ring-inset scale-[1.01]"
                          : ""
                      }`}
                    >
                      <td className="px-6 py-4">
                        <div className="font-bold text-gray-900">
                          {word.word}
                        </div>
                        <div className="text-xs text-gray-400 font-mono">
                          {word.pronunciation}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {word.meaning}
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 bg-blue-50 text-blue-600 rounded text-xs font-bold uppercase">
                          {word.category}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {word.image_url ? (
                          <div className="relative w-16 h-16 rounded-lg overflow-hidden border border-gray-200">
                            <img
                              src={word.image_url}
                              alt=""
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute top-0 right-0 bg-green-500 text-white p-0.5 rounded-bl">
                              <Check size={10} />
                            </div>
                          </div>
                        ) : (
                          <div className="w-16 h-16 rounded-lg bg-gray-100 border-2 border-dashed border-gray-200 flex items-center justify-center text-gray-400">
                            なし
                          </div>
                        )}
                      </td>
                      <td
                        className="px-6 py-4"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <label
                          className={`cursor-pointer flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm transition-all ${
                            uploadingId === word.id
                              ? "bg-gray-100 text-gray-400"
                              : "bg-primary/10 text-primary hover:bg-primary/20"
                          }`}
                        >
                          {uploadingId === word.id ? (
                            <Loader2 size={16} className="animate-spin" />
                          ) : (
                            <Upload size={16} />
                          )}
                          {word.image_url ? "変更" : "登録"}
                          <input
                            type="file"
                            className="hidden"
                            accept="image/*"
                            disabled={uploadingId !== null}
                            onChange={(e) => handleImageUpload(e, word.id)}
                          />
                        </label>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 編集モーダル */}
      {isEditModalOpen && editingWord && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in text-gray-900">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden animate-scale-in">
            <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h2 className="text-2xl font-bold">単語情報を編集</h2>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleUpdateWord} className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    英単語
                  </label>
                  <input
                    type="text"
                    required
                    value={editingWord.word}
                    onChange={(e) =>
                      setEditingWord({ ...editingWord, word: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    意味
                  </label>
                  <input
                    type="text"
                    required
                    value={editingWord.meaning}
                    onChange={(e) =>
                      setEditingWord({
                        ...editingWord,
                        meaning: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    発音記号
                  </label>
                  <input
                    type="text"
                    value={editingWord.pronunciation || ""}
                    onChange={(e) =>
                      setEditingWord({
                        ...editingWord,
                        pronunciation: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    品詞
                  </label>
                  <select
                    value={editingWord.part_of_speech || "noun"}
                    onChange={(e) =>
                      setEditingWord({
                        ...editingWord,
                        part_of_speech: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary outline-none transition-all"
                  >
                    <option value="noun">名詞 (noun)</option>
                    <option value="verb">動詞 (verb)</option>
                    <option value="adj">形容詞 (adj)</option>
                    <option value="adv">副詞 (adv)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    難易度
                  </label>
                  <select
                    value={editingWord.difficulty || "beginner"}
                    onChange={(e) =>
                      setEditingWord({
                        ...editingWord,
                        difficulty: e.target.value as Word["difficulty"],
                      })
                    }
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary outline-none transition-all"
                  >
                    <option value="beginner">初級 (beginner)</option>
                    <option value="intermediate">中級 (intermediate)</option>
                    <option value="advanced">上級 (advanced)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    カテゴリー
                  </label>
                  <input
                    type="text"
                    value={editingWord.category || ""}
                    onChange={(e) =>
                      setEditingWord({
                        ...editingWord,
                        category: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary outline-none transition-all"
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="flex-1 px-6 py-4 border-2 border-gray-200 rounded-xl font-bold text-gray-600 hover:bg-gray-50 transition-all"
                >
                  キャンセル
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-6 py-4 bg-primary text-white rounded-xl font-bold hover:opacity-90 transition-all disabled:opacity-50 flex items-center justify-center"
                >
                  {loading ? (
                    <Loader2 className="animate-spin mx-auto" />
                  ) : (
                    "保存する"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
