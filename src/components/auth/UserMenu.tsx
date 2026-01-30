"use client";
// ユーザーメニューコンポーネント（ログイン/ログアウトボタン）
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { User, LogOut, Settings, ChevronDown, LogIn } from "lucide-react";

export function UserMenu() {
  const { user, loading, signOut, isAuthenticated, isAdmin } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // メニュー外クリックで閉じる
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (loading) {
    return (
      <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse" />
    );
  }

  if (!isAuthenticated) {
    return (
      <Link
        href="/login"
        className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl font-bold hover:opacity-90 transition-all"
      >
        <LogIn size={18} />
        ログイン
      </Link>
    );
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-gray-100 transition-all"
      >
        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
          <User size={18} className="text-primary" />
        </div>
        <span className="hidden sm:block text-sm font-medium text-foreground max-w-[120px] truncate">
          {user?.email?.split("@")[0]}
        </span>
        <ChevronDown
          size={16}
          className={`text-muted-foreground transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-border/50 py-2 z-50 animate-fade-in">
          <div className="px-4 py-2 border-b border-border/50">
            <p className="text-sm font-medium text-foreground truncate">
              {user?.email}
            </p>
          </div>
          
          {isAdmin && (
            <Link
              href="/admin"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-2 text-foreground hover:bg-gray-50 transition-colors"
            >
              <Settings size={18} />
              管理者画面
            </Link>
          )}
          
          <button
            onClick={() => {
              setIsOpen(false);
              signOut();
            }}
            className="flex items-center gap-3 px-4 py-2 w-full text-left text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut size={18} />
            ログアウト
          </button>
        </div>
      )}
    </div>
  );
}
