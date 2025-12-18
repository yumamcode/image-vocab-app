'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase-browser';
import { Loader2, Upload, Search, Check, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function AdminPage() {
  const [words, setWords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [uploadingId, setUploadingId] = useState<number | null>(null);
  const [seeding, setSeeding] = useState(false);
  const [uploadingBulk, setUploadingBulk] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [bulkStatus, setBulkStatus] = useState<{current: number, total: number} | null>(null);
  const supabase = createClient();

  const fetchWords = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('words')
      .select('*')
      .order('word', { ascending: true });
    
    if (data) setWords(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchWords();
  }, []);

  const handleSeed = async () => {
    if (!confirm('既存の単語データをすべて削除してTOEIC 100単語を再投入しますか？')) return;
    setSeeding(true);
    try {
      const res = await fetch('/api/admin/seed', { method: 'POST' });
      if (res.ok) {
        alert('シーディングが完了しました');
        fetchWords();
      }
    } catch (err) {
      console.error(err);
      alert('エラーが発生しました');
    } finally {
      setSeeding(false);
    }
  };

  const handleBulkImageUpload = async () => {
    setUploadingBulk(true);
    try {
      const res = await fetch('/api/admin/upload-bulk-images', { method: 'POST' });
      const data = await res.json();
      if (res.ok) {
        alert(`一括登録が完了しました。\n成功: ${data.success}\n失敗: ${data.failed}\n\nログ:\n${data.logs.join('\n')}`);
        fetchWords();
      } else {
        alert('エラーが発生しました: ' + data.error);
      }
    } catch (err: any) {
      console.error(err);
      alert('エラーが発生しました');
    } finally {
      setUploadingBulk(false);
    }
  };

  const handleFiles = async (files: FileList | File[]) => {
    const fileArray = Array.from(files).filter(f => f.type.startsWith('image/'));
    if (fileArray.length === 0) return;

    setUploadingBulk(true);
    setBulkStatus({ current: 0, total: fileArray.length });
    
    let successCount = 0;
    let failCount = 0;

    for (let i = 0; i < fileArray.length; i++) {
      const file = fileArray[i];
      setBulkStatus({ current: i + 1, total: fileArray.length });
      
      const wordName = file.name.split('.')[0].toLowerCase();
      
      try {
        // 1. 単語を検索 (大文字小文字を区別しない)
        const { data: wordData, error: findError } = await supabase
          .from('words')
          .select('id')
          .ilike('word', wordName)
          .maybeSingle();

        if (findError) throw findError;

        if (!wordData) {
          console.warn(`Word not found in DB: ${wordName}`);
          failCount++;
          continue;
        }

        // 2. アップロード
        const fileExt = file.name.split('.').pop();
        const fileName = `drop_${wordData.id}_${Date.now()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from('word-images')
          .upload(fileName, file, {
            cacheControl: '3600',
            upsert: true
          });

        if (uploadError) throw uploadError;

        // 3. URL取得
        const { data: { publicUrl } } = supabase.storage
          .from('word-images')
          .getPublicUrl(fileName);

        // 4. DB更新
        const { error: updateError } = await supabase
          .from('words')
          .update({ image_url: publicUrl })
          .eq('id', wordData.id);

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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, wordId: number) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingId(wordId);
    try {
      // 1. Upload to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${wordId}_${Math.random()}.${fileExt}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('word-images')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // 2. Get Public URL
      const { data: { publicUrl } } = supabase.storage
        .from('word-images')
        .getPublicUrl(fileName);

      // 3. Update database
      const { error: updateError } = await supabase
        .from('words')
        .update({ image_url: publicUrl })
        .eq('id', wordId);

      if (updateError) throw updateError;

      // 4. Refresh local state
      setWords(words.map(w => w.id === wordId ? { ...w, image_url: publicUrl } : w));
      alert('画像をアップロードしました');
    } catch (err: any) {
      console.error(err);
      alert('アップロード失敗: ' + err.message);
    } finally {
      setUploadingId(null);
    }
  };

  const filteredWords = words.filter(w => 
    w.word.toLowerCase().includes(search.toLowerCase()) || 
    w.meaning.includes(search)
  );

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold font-serif text-gray-900">管理者ダッシュボード</h1>
            <p className="text-gray-500">単語データ管理と画像登録</p>
          </div>
          <div className="flex gap-4">
            <button 
              onClick={handleBulkImageUpload}
              disabled={uploadingBulk}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700 transition-all disabled:opacity-50 flex items-center gap-2"
            >
              {uploadingBulk ? <Loader2 className="animate-spin" /> : <Upload size={20} />}
              フォルダから画像を一括登録
            </button>
            <button 
              onClick={handleSeed}
              disabled={seeding}
              className="bg-amber-500 text-white px-6 py-2 rounded-lg font-bold hover:bg-amber-600 transition-all disabled:opacity-50 flex items-center gap-2"
            >
              {seeding ? <Loader2 className="animate-spin" /> : <AlertCircle size={20} />}
              TOEIC 100単語を投入
            </button>
            <Link href="/" className="bg-gray-800 text-white px-6 py-2 rounded-lg font-bold hover:bg-gray-700 transition-all">
              ホームに戻る
            </Link>
          </div>
        </header>

        {/* Drag & Drop Zone */}
        <div 
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`mb-8 p-12 border-4 border-dashed rounded-3xl transition-all flex flex-col items-center justify-center text-center ${
            isDragging 
              ? 'border-primary bg-primary/5 scale-[1.01]' 
              : 'border-gray-200 bg-white hover:border-gray-300'
          }`}
        >
          {uploadingBulk ? (
            <div className="space-y-4">
              <Loader2 className="animate-spin text-primary mx-auto" size={48} />
              <div className="text-xl font-bold">アップロード中...</div>
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
              <h2 className="text-2xl font-bold mb-2">画像をここにドラッグ＆ドロップ</h2>
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
                  onChange={(e) => e.target.files && handleFiles(e.target.files)}
                />
              </label>
            </>
          )}
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-100 bg-gray-50/50">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input 
                type="text" 
                placeholder="単語や意味で検索..." 
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">単語</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">意味</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">カテゴリー</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">画像</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center">
                      <Loader2 className="animate-spin mx-auto text-primary mb-2" size={32} />
                      <p className="text-gray-500">単語を読み込み中...</p>
                    </td>
                  </tr>
                ) : filteredWords.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                      単語が見つかりません
                    </td>
                  </tr>
                ) : (
                  filteredWords.map((word) => (
                    <tr key={word.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-bold text-gray-900">{word.word}</div>
                        <div className="text-xs text-gray-400 font-mono">{word.pronunciation}</div>
                      </td>
                      <td className="px-6 py-4 text-gray-600">{word.meaning}</td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 bg-blue-50 text-blue-600 rounded text-xs font-bold uppercase">
                          {word.category}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {word.image_url ? (
                          <div className="relative w-16 h-16 rounded-lg overflow-hidden border border-gray-200">
                            <img src={word.image_url} alt="" className="w-full h-full object-cover" />
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
                      <td className="px-6 py-4">
                        <label className={`cursor-pointer flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm transition-all ${uploadingId === word.id ? 'bg-gray-100 text-gray-400' : 'bg-primary/10 text-primary hover:bg-primary/20'}`}>
                          {uploadingId === word.id ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
                          {word.image_url ? '変更' : '登録'}
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
    </div>
  );
}

