"use client";
import { useAuthState } from "./useAuthState";
import { useAdminCheck } from "../admin/useAdminCheck";
import { useSignOut } from "./useSignOut";

/**
 * ログインやログアウト、管理者かどうかなど、ユーザーの認証に関する機能をまとめました。
 */
export function useAuth() {
  const { user, loading, supabase } = useAuthState();
  const isAdmin = useAdminCheck(user);
  const signOut = useSignOut(supabase);

  return { user, loading, signOut, isAdmin, isAuthenticated: !!user };
}
