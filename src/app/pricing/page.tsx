'use client';

import React, { useState } from 'react';
import { Check, Crown, Sparkles, ArrowLeft, BookOpen, Loader2 } from 'lucide-react';
import Link from 'next/link';

const SUB_PLANS = [
  {
    id: 'monthly',
    name: 'プレミアム（月額）',
    description: 'すべての機能を無制限で利用',
    price: 980,
    interval: '月',
    popular: true,
    features: [
      '全単語パック無制限',
      'すべてのクイズ形式',
      '間隔反復システム',
      'マイ単語帳',
      '学習統計の詳細分析',
      '広告非表示',
    ],
  },
  {
    id: 'annual',
    name: 'プレミアム（年額）',
    description: '年間プランで2ヶ月分お得',
    price: 9800,
    interval: '年',
    popular: false,
    features: [
      '全単語パック無制限',
      'すべてのクイズ形式',
      '間隔反復システム',
      'マイ単語帳',
      '学習統計の詳細分析',
      '広告非表示',
      '年間で2ヶ月分お得',
    ],
  },
];

const WORD_PACKS = [
  {
    id: 'business',
    name: 'ビジネス英語パック',
    description: 'ビジネスシーンで使える実践的な単語集',
    price: 500,
    features: [
      'ビジネス英語 100語',
      '実践的な例文付き',
      '永久アクセス',
    ],
  },
  {
    id: 'travel',
    name: '旅行英語パック',
    description: '海外旅行で役立つ必須フレーズ',
    price: 500,
    features: [
      '旅行英語 100語',
      'シーン別フレーズ',
      '永久アクセス',
    ],
  },
  {
    id: 'toeic',
    name: 'TOEIC対策パック',
    description: 'TOEIC頻出単語を効率的に学習',
    price: 800,
    features: [
      'TOEIC頻出 200語',
      'スコア別レベル分け',
      '永久アクセス',
    ],
  },
];

const FAQS = [
  {
    question: '無料プランと有料プランの違いは？',
    answer: '無料プランでは基本的な単語パックと4択クイズのみ利用できます。有料プランでは全単語パック、すべてのクイズ形式、間隔反復システム、詳細な学習統計が利用でき、広告も非表示になります。',
  },
  {
    question: 'いつでもキャンセルできますか？',
    answer: 'はい、いつでもキャンセル可能です。キャンセル後も、現在の請求期間の終了まで有料機能をご利用いただけます。',
  },
  {
    question: '支払い方法は？',
    answer: 'クレジットカード（Visa、Mastercard、American Express、JCB）でのお支払いが可能です。決済はStripeを通じて安全に処理されます。',
  },
  {
    question: '単語パックの買い切りとサブスクリプションの違いは？',
    answer: '単語パックは一度購入すれば永久にアクセスできます。サブスクリプションは月額または年額で、すべての単語パックと機能が利用できます。',
  },
];

export default function PricingPage() {
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleCheckout = async (item: any) => {
    setLoadingId(item.id);
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          planId: item.id,
          price: item.price,
          name: item.name,
          interval: item.interval,
        }),
      });

      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert('エラーが発生しました: ' + (data.error || '不明なエラー'));
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('通信エラーが発生しました');
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border/40 backdrop-blur-md bg-background/80 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link href="/" className="flex items-center gap-2 text-foreground/70 hover:text-primary transition-colors font-medium">
              <ArrowLeft size={20} /> ホームに戻る
            </Link>
            <div className="flex items-center space-x-3">
              <BookOpen className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold text-gradient font-serif">Imavo</span>
            </div>
            <div className="w-24 hidden md:block"></div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16 animate-fade-in">
          <h1 className="text-5xl font-bold font-serif mb-4">料金プラン</h1>
          <p className="text-xl text-muted-foreground">あなたに最適な学習スタイルをお選びください</p>
        </div>

        {/* Subscription Plans */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-24">
          {SUB_PLANS.map((plan) => (
            <div 
              key={plan.id}
              className={`relative bg-white rounded-3xl p-8 shadow-xl border-2 transition-all hover:shadow-2xl ${plan.popular ? 'border-primary' : 'border-border/50'}`}
            >
              {plan.popular && (
                <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-primary text-white px-6 py-2 rounded-full text-sm font-bold flex items-center gap-2 shadow-lg">
                  <span className="shrink-0"><Crown size={18} /></span> 人気
                </div>
              )}
              
              <div className="text-center mb-8 pt-4">
                <h3 className="text-3xl font-bold font-serif mb-2">{plan.name}</h3>
                <p className="text-muted-foreground mb-6">{plan.description}</p>
                <div className="text-5xl font-bold text-gradient">
                  ¥{plan.price.toLocaleString()}
                  <span className="text-xl text-muted-foreground font-normal ml-1">/{plan.interval}</span>
                </div>
              </div>

              <ul className="space-y-4 mb-10">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <Check className="text-primary mt-1 shrink-0" size={20} />
                    <span className="text-foreground/80 font-medium">{feature}</span>
                  </li>
                ))}
              </ul>

              <button 
                onClick={() => handleCheckout(plan)}
                disabled={loadingId !== null}
                className={`w-full py-4 rounded-2xl font-bold text-xl flex items-center justify-center gap-2 transition-all ${plan.popular ? 'gradient-primary text-white shadow-lg hover:shadow-xl disabled:opacity-70' : 'bg-primary text-white hover:opacity-90 disabled:opacity-70'}`}
              >
                {loadingId === plan.id ? (
                  <Loader2 className="animate-spin" size={24} />
                ) : (
                  <>
                    {plan.popular && <Sparkles size={24} />} 今すぐ始める
                  </>
                )}
              </button>
            </div>
          ))}
        </div>

        {/* Word Packs */}
        <div className="mb-24">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold font-serif mb-4">追加単語パック</h2>
            <p className="text-lg text-muted-foreground">特定のテーマに特化した単語パックを個別に購入できます</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {WORD_PACKS.map((pack) => (
              <div key={pack.id} className="bg-white rounded-3xl p-8 shadow-lg border border-border/50 hover:shadow-xl transition-all">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold font-serif mb-2">{pack.name}</h3>
                  <p className="text-sm text-muted-foreground mb-6">{pack.description}</p>
                  <div className="text-4xl font-bold text-gradient">
                    ¥{pack.price.toLocaleString()}
                  </div>
                </div>

                <ul className="space-y-3 mb-10">
                  {pack.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <Check className="text-primary mt-1 shrink-0" size={18} />
                      <span className="text-sm text-foreground/80">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button 
                  onClick={() => handleCheckout(pack)}
                  disabled={loadingId !== null}
                  className="w-full py-3 border-2 border-border rounded-xl font-bold text-lg hover:bg-muted/50 transition-all flex items-center justify-center disabled:opacity-70"
                >
                  {loadingId === pack.id ? (
                    <Loader2 className="animate-spin" size={20} />
                  ) : (
                    '購入する'
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-3xl p-10 shadow-xl border border-border/50">
            <h2 className="text-3xl font-bold font-serif text-center mb-10">よくある質問</h2>
            <div className="space-y-8">
              {FAQS.map((faq, i) => (
                <div key={i} className="space-y-3">
                  <h4 className="text-2xl font-bold font-serif">{faq.question}</h4>
                  <p className="text-lg text-muted-foreground leading-relaxed">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
