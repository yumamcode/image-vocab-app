import { useRouter } from "next/navigation";
import { AppView } from "@/types/view";
import { APP_ROUTES } from "./useAppRoutes";

/**
 * ボタンを押したときに、指定したページへ画面を切り替えるための道具です。
 */
export function useAppNavigation() {
  const router = useRouter();

  const setView = (view: AppView, params?: Record<string, string | number>) => {
    let path = APP_ROUTES[view];
    if (path && params) {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([k, v]) => searchParams.append(k, String(v)));
      path += `?${searchParams.toString()}`;
    }
    if (path) router.push(path);
  };

  return { setView, router };
}
