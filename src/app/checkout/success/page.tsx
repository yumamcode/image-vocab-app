import React from 'react';
import Link from 'next/link';
import { CheckCircle2, Home, ArrowRight } from 'lucide-react';

export default function CheckoutSuccessPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-10 border border-border/50 text-center animate-scale-in">
        <div className="flex justify-center mb-8">
          <div className="p-4 bg-green-100 rounded-full">
            <CheckCircle2 size={64} className="text-green-600" />
          </div>
        </div>
        
        <h1 className="text-3xl font-bold font-serif text-gradient mb-4">お支払いが完了しました！</h1>
        <p className="text-lg text-muted-foreground mb-10 leading-relaxed">
          プレミアム機能のご利用ありがとうございます。<br />
          さっそく英単語の学習を続けましょう。
        </p>

        <div className="space-y-4">
          <Link 
            href="/"
            className="w-full py-4 gradient-primary text-white rounded-2xl font-bold text-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
          >
            学習を再開する <ArrowRight size={20} />
          </Link>
          
          <Link 
            href="/"
            className="w-full py-4 bg-muted text-foreground rounded-2xl font-bold text-xl hover:bg-muted/80 transition-all flex items-center justify-center gap-2"
          >
            <Home size={20} /> ホームに戻る
          </Link>
        </div>
      </div>
    </div>
  );
}

