import { useMemo } from "react";
import { User } from "@supabase/supabase-js";

/**
 * ログインしている人が「管理者（特別な権限を持つ人）」かどうかを判定します。
 */
export function useAdminCheck(user: User | null) {
  return useMemo(() => {
    if (!user?.email) return false;
    const adminEmailsEnv = process.env.NEXT_PUBLIC_ADMIN_EMAILS || '';
    const adminEmails = adminEmailsEnv.split(',').map(e => e.trim().toLowerCase()).filter(e => e.length > 0);
    return adminEmails.includes(user.email.toLowerCase());
  }, [user]);
}
