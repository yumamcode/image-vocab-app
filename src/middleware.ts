// Next.js Middleware - ルート保護とセッション管理
import { type NextRequest, NextResponse } from 'next/server'
import { updateSession } from '@/lib/supabase-middleware'

// 認証が必要なパス
const protectedPaths = ['/learn']

// 管理者のみアクセス可能なパス
const adminPaths = ['/admin']

// 認証済みユーザーがアクセスできないパス（ログインページなど）
const authPaths = ['/login', '/signup']

// 管理者メールアドレスのリストを取得
function getAdminEmails(): string[] {
  const adminEmailsEnv = process.env.ADMIN_EMAILS || ''
  return adminEmailsEnv
    .split(',')
    .map(email => email.trim().toLowerCase())
    .filter(email => email.length > 0)
}

// ユーザーが管理者かどうかをチェック
function isAdminUser(userEmail: string | undefined): boolean {
  if (!userEmail) return false
  const adminEmails = getAdminEmails()
  return adminEmails.includes(userEmail.toLowerCase())
}

export async function middleware(request: NextRequest) {
  const { supabaseResponse, user } = await updateSession(request)
  const pathname = request.nextUrl.pathname

  // 保護されたパスへのアクセスチェック
  const isProtectedPath = protectedPaths.some(path => pathname.startsWith(path))
  const isAdminPath = adminPaths.some(path => pathname.startsWith(path))
  const isAuthPath = authPaths.some(path => pathname.startsWith(path))

  // 未認証ユーザーが保護されたページにアクセスしようとした場合
  if (isProtectedPath && !user) {
    const redirectUrl = new URL('/login', request.url)
    redirectUrl.searchParams.set('redirectTo', pathname)
    return NextResponse.redirect(redirectUrl)
  }

  // 管理者ページへのアクセスチェック
  if (isAdminPath) {
    // 未認証の場合はログインページへ
    if (!user) {
      const redirectUrl = new URL('/login', request.url)
      redirectUrl.searchParams.set('redirectTo', pathname)
      return NextResponse.redirect(redirectUrl)
    }
    // 認証済みだが管理者でない場合はホームへリダイレクト
    if (!isAdminUser(user.email)) {
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  // 認証済みユーザーがログイン/サインアップページにアクセスしようとした場合
  if (isAuthPath && user) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    /*
     * 以下を除くすべてのリクエストパスにマッチ:
     * - _next/static (静的ファイル)
     * - _next/image (画像最適化ファイル)
     * - favicon.ico (ファビコン)
     * - 画像ファイル (.svg, .png, .jpg, .jpeg, .gif, .webp)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
