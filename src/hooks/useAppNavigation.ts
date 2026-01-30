import { useRouter } from "next/navigation";
import { AppView } from "@/types/view";

/**
 * アプリ内の画面移動（ナビゲーション）を管理するカスタムフックです。
 * 中学生でも分かるように言うと、「ボタンを押した時にどのページに行くか」を簡単に決めるための道具です。
 */
export function useAppNavigation() {
  // Next.jsが用意している、ページを移動させるための機能（ルーター）を使えるようにします。
  const router = useRouter();

  /**
   * 指定した画面（view）に移動するための関数です。
   * @param view 移動先の画面名（例: "home", "learn" など）
   * @param params URLに付け加えたい追加情報（オプション）
   */
  const setView = (view: AppView, params?: Record<string, string | number>) => {
    // 画面名と、実際のURL（住所のようなもの）の対応表です。
    const routes: Record<AppView, string> = {
      home: "/", // ホーム画面
      "learn-settings": "/learn/settings", // 学習設定画面
      learn: "/learn", // 学習画面
      "quiz-menu": "/quiz", // クイズのメニュー画面
      "quiz-4-choice": "/quiz/4-choice", // 4択クイズ
      "quiz-listening": "/quiz/listening", // リスニングクイズ
      "quiz-spelling": "/quiz/spelling", // スペリングクイズ
      "quiz-image-choice": "/quiz/image-choice", // 画像選択クイズ
    };

    // 対応表から、移動先のURLを取り出します。
    let path = routes[view];

    // もし追加情報（params）がある場合は、URLの最後に「?key=value」という形で付け足します。
    // これは「どの単語から始めるか」などの細かい指示をページに伝えるために使います。
    if (path && params) {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        searchParams.append(key, String(value));
      });
      path += `?${searchParams.toString()}`;
    }

    // URLが正しく見つかったら、そのページに画面を切り替えます。
    if (path) {
      router.push(path);
    }
  };

  // このフックを使う人は、setView関数（画面移動用）と router（元々の移動機能）を使えるようになります。
  return { setView, router };
}
