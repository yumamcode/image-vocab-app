import { useRouter } from "next/navigation";
import { AppView } from "@/types/view";

export function useAppNavigation() {
  const router = useRouter();

  const setView = (view: AppView, params?: Record<string, string | number>) => {
    const routes: Record<AppView, string> = {
      home: "/",
      "learn-settings": "/learn/settings",
      learn: "/learn",
      "quiz-menu": "/quiz",
      "quiz-4-choice": "/quiz/4-choice",
      "quiz-listening": "/quiz/listening",
      "quiz-spelling": "/quiz/spelling",
      "quiz-image-choice": "/quiz/image-choice",
    };

    let path = routes[view];

    if (path && params) {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        searchParams.append(key, String(value));
      });
      path += `?${searchParams.toString()}`;
    }

    if (path) {
      router.push(path);
    }
  };

  return { setView, router };
}
