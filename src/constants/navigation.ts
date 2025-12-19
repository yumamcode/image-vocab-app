import {
  Trophy,
  Type,
  ImageIcon,
  Volume2 as VolumeIcon,
  Brain,
} from "lucide-react";

export const QUIZ_MODES = [
  {
    id: "multiple-choice",
    title: "4択クイズ",
    description: "意味に合う単語を4つの選択肢から選びます",
    icon: Trophy,
    color: "bg-green-500",
  },
  {
    id: "spelling",
    title: "スペル入力",
    description: "音声や意味を聞いて正しいスペルを入力します",
    icon: Type,
    color: "bg-blue-500",
  },
  {
    id: "image-choice",
    title: "画像選択問題",
    description: "単語に最も適したイラストを選択します",
    icon: ImageIcon,
    color: "bg-purple-500",
  },
  {
    id: "listening",
    title: "リスニング問題",
    description: "発音を聞き取って単語や意味を当てます",
    icon: VolumeIcon,
    color: "bg-orange-500",
  },
];

export const FEATURES = [
  {
    title: "イラスト学習",
    description: "各単語に最適化されたイラストで視覚的記憶を強化",
    icon: Brain,
    color: "bg-blue-500",
  },
  {
    title: "多様なクイズ形式",
    description: "4択、スペル入力、画像・音声問題で多角的に学習",
    icon: Trophy,
    color: "bg-green-600",
  },
];

