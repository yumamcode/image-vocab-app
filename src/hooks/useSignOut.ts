import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { SupabaseClient } from "@supabase/supabase-js";

/**
 * ログアウト（アプリを終了して外に出る）するための機能です。
 */
export function useSignOut(supabase: SupabaseClient) {
  const router = useRouter();
  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }, [supabase, router]);

  return signOut;
}
