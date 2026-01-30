import { describe, it, expect, vi, beforeEach } from 'vitest'
import { middleware } from './middleware'
import { NextRequest, NextResponse } from 'next/server'
import { updateSession } from '@/lib/supabase-middleware'

// updateSessionのモック
vi.mock('@/lib/supabase-middleware', () => ({
  updateSession: vi.fn(),
}))

// NextResponse.redirectのモック
vi.mock('next/server', async () => {
  const actual = await vi.importActual('next/server')
  return {
    ...actual as any,
    NextResponse: {
      ...actual.NextResponse,
      redirect: vi.fn((url) => ({
        status: 307,
        headers: { get: () => url.toString() },
        url: url.toString(),
      })),
      next: vi.fn(() => ({
        status: 200,
        headers: { get: () => null },
      })),
    },
  }
})

describe('Middleware', () => {
  const baseUrl = 'http://localhost:3000'

  beforeEach(() => {
    vi.clearAllMocks()
    process.env.ADMIN_EMAILS = 'admin@example.com'
  })

  const createRequest = (pathname: string) => {
    return new NextRequest(new URL(pathname, baseUrl))
  }

  it('未認証ユーザーが保護されたページ (/learn) にアクセスした場合、ログインページにリダイレクトされること', async () => {
    vi.mocked(updateSession).mockResolvedValue({
      supabaseResponse: {} as any,
      user: null,
    })

    const req = createRequest('/learn')
    const res = await middleware(req)

    expect(NextResponse.redirect).toHaveBeenCalledWith(
      expect.objectContaining({
        pathname: '/login',
        searchParams: expect.any(URLSearchParams),
      })
    )
    const redirectUrl = vi.mocked(NextResponse.redirect).mock.calls[0][0] as URL
    expect(redirectUrl.searchParams.get('redirectTo')).toBe('/learn')
  })

  it('未認証ユーザーが管理者ページ (/admin) にアクセスした場合、ログインページにリダイレクトされること', async () => {
    vi.mocked(updateSession).mockResolvedValue({
      supabaseResponse: {} as any,
      user: null,
    })

    const req = createRequest('/admin')
    const res = await middleware(req)

    expect(NextResponse.redirect).toHaveBeenCalledWith(
      expect.objectContaining({
        pathname: '/login',
        searchParams: expect.any(URLSearchParams),
      })
    )
  })

  it('一般ユーザーが管理者ページ (/admin) にアクセスした場合、ホームにリダイレクトされること', async () => {
    vi.mocked(updateSession).mockResolvedValue({
      supabaseResponse: {} as any,
      user: { email: 'user@example.com' } as any,
    })

    const req = createRequest('/admin')
    const res = await middleware(req)

    expect(NextResponse.redirect).toHaveBeenCalledWith(
      expect.objectContaining({
        pathname: '/',
      })
    )
  })

  it('管理者が管理者ページ (/admin) にアクセスした場合、アクセスが許可されること', async () => {
    const mockResponse = { status: 200 } as any
    vi.mocked(updateSession).mockResolvedValue({
      supabaseResponse: mockResponse,
      user: { email: 'admin@example.com' } as any,
    })

    const req = createRequest('/admin')
    const res = await middleware(req)

    expect(res).toBe(mockResponse)
    expect(NextResponse.redirect).not.toHaveBeenCalled()
  })

  it('認証済みユーザーがログインページ (/login) にアクセスした場合、ホームにリダイレクトされること', async () => {
    vi.mocked(updateSession).mockResolvedValue({
      supabaseResponse: {} as any,
      user: { email: 'user@example.com' } as any,
    })

    const req = createRequest('/login')
    const res = await middleware(req)

    expect(NextResponse.redirect).toHaveBeenCalledWith(
      expect.objectContaining({
        pathname: '/',
      })
    )
  })

  it('未認証ユーザーが公開ページ (/) にアクセスした場合、アクセスが許可されること', async () => {
    const mockResponse = { status: 200 } as any
    vi.mocked(updateSession).mockResolvedValue({
      supabaseResponse: mockResponse,
      user: null,
    })

    const req = createRequest('/')
    const res = await middleware(req)

    expect(res).toBe(mockResponse)
    expect(NextResponse.redirect).not.toHaveBeenCalled()
  })
})
