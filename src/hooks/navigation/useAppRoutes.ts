import { AppView } from "@/types/view";

/**
 * 画面の名前（view）から、実際のURL（住所）を教えてくれる辞書のようなものです。
 */
export const APP_ROUTES: Record<AppView, string> = {
  home: "/",
  "learn-settings": "/learn/settings",
  learn: "/learn",
  "quiz-menu": "/quiz",
  "quiz-4-choice": "/quiz/4-choice",
  "quiz-listening": "/quiz/listening",
  "quiz-spelling": "/quiz/spelling",
  "quiz-image-choice": "/quiz/image-choice",
};
