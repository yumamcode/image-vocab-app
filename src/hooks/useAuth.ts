"use client";
// 認証状態を管理するカスタムフック
import { useState, useEffect, useCallback, useMemo } from "react";
import { createClient } from "@/lib/supabase-browser";
import { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";

// 管理者メールアドレスのリストを取得
function getAdminEmails(): string[] {
  const adminEmailsEnv = process.env.NEXT_PUBLIC_ADMIN_EMAILS || '';
  return adminEmailsEnv
    .split(',')
    .map(email => email.trim().toLowerCase())
    .filter(email => email.length > 0);
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    // 初期ユーザー状態を取得
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    };
    getUser();

    // 認証状態の変更を監視
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase]);

  // ログアウト関数
  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }, [supabase, router]);

  // 管理者かどうかを判定
  const isAdmin = useMemo(() => {
    if (!user?.email) return false;
    const adminEmails = getAdminEmails();
    return adminEmails.includes(user.email.toLowerCase());
  }, [user]);

  return {
    user,
    loading,
    signOut,
    isAuthenticated: !!user,
    isAdmin,
  };
}
