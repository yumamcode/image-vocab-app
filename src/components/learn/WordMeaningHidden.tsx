import React from "react";
import { Eye } from "lucide-react";

interface WordMeaningHiddenProps {
  onShow: () => void;
}

/**
 * 意味が隠れている時の表示コンポーネント
 */
export const WordMeaningHidden: React.FC<WordMeaningHiddenProps> = ({ onShow }) => (
  <div className="space-y-6">
    <div className="flex justify-between items-center">
      <h3 className="text-xl font-bold font-serif text-foreground">意味</h3>
      <button
        onClick={onShow}
        className="flex items-center gap-2 text-primary font-semibold hover:opacity-80 transition-opacity"
      >
        <Eye size={20} /> 表示
      </button>
    </div>
    <div className="h-24 flex items-center justify-center border-2 border-dashed border-border rounded-2xl bg-muted/20">
      <p className="text-muted-foreground italic">「表示」を押して意味を確認</p>
    </div>
  </div>
);

