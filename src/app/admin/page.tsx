"use client";

import React from "react";
import { useAdminWords } from "@/hooks/useAdminWords";
import { useImageUpload } from "@/hooks/useImageUpload";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { AddWordForm } from "@/components/admin/AddWordForm";
import { BulkUploadZone } from "@/components/admin/BulkUploadZone";
import { WordTable } from "@/components/admin/WordTable";
import { EditWordModal } from "@/components/admin/EditWordModal";

export default function AdminPage() {
  const {
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
  } = useAdminWords();

  const {
    uploadingId,
    uploadingBulk,
    isDragging,
    setIsDragging,
    dragOverId,
    setDragOverId,
    bulkStatus,
    handleBulkImageUpload,
    handleFiles,
    handleImageUpload,
    uploadIndividualImage,
  } = useImageUpload(words, setWords, fetchWords);

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

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <AdminHeader
          isAdding={isAdding}
          setIsAdding={setIsAdding}
          uploadingBulk={uploadingBulk}
          onBulkUpload={handleBulkImageUpload}
        />

        {isAdding && (
          <AddWordForm
            newWord={newWord}
            setNewWord={setNewWord}
            onSubmit={handleAddWord}
            loading={loading}
          />
        )}

        <BulkUploadZone
          isDragging={isDragging}
          setIsDragging={setIsDragging}
          uploadingBulk={uploadingBulk}
          bulkStatus={bulkStatus}
          onFilesDrop={handleFiles}
        />

        <WordTable
          words={filteredWords}
          loading={loading}
          search={search}
          setSearch={setSearch}
          onEditClick={handleEditClick}
          uploadingId={uploadingId}
          dragOverId={dragOverId}
          onRowDragOver={handleRowDragOver}
          onRowDragLeave={handleRowDragLeave}
          onRowDrop={handleRowDrop}
          onImageUpload={handleImageUpload}
        />
      </div>

      {isEditModalOpen && editingWord && (
        <EditWordModal
          word={editingWord}
          setWord={setEditingWord}
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onSubmit={handleUpdateWord}
          loading={loading}
        />
      )}
    </div>
  );
}
