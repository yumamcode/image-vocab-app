"use client";

import { useCallback } from "react";
import { Word } from "@/types/word";

/**
 * 学習セッションの「動き（ロジック）」を担当する特別な道具（フック）です。
 * 勉強を始めたり、次の問題に進んだりするための仕組みが入っています。
 */
export function useSessionLogic(words: Word[], state: any) {
  /**
   * 学習をスタートさせるための関数です。
   * 指定された枚数（デフォルトは10枚）の単語を選んで準備します。
   */
  const startSession = useCallback(
    (count: number = 10) => {
      // 1. 全部の単語をバラバラに混ぜます（シャッフル）
      const shuffled = [...words].sort(() => Math.random() - 0.5);
      
      // 2. 決めた枚数だけ単語を選び出します。-1なら全部選びます
      const selected = shuffled.slice(0, count === -1 ? words.length : count);

      // 3. 状態（state）をリセットして、学習の準備を整えます
      state.setSessionWords(selected); // 勉強する単語をセット
      state.setCurrentIndex(0);        // 1番目の単語からスタート
      state.setIsFinished(false);      // 「終わったよ」をリセット
    },
    [words, state]
  );

  /**
   * 次の単語（問題）に進むための関数です。
   */
  const goToNextWord = useCallback(() => {
    // まだ次の問題があるかどうかをチェックします
    if (state.currentIndex < state.sessionWords.length - 1) {
      // 次の問題へ進む（番号を1つ増やす）
      state.setCurrentIndex(state.currentIndex + 1);
    } else {
      // もう問題がなければ、終了フラグを立てます
      state.setIsFinished(true);
    }
  }, [state]);

  /**
   * 答え合わせをした時に動く関数です。
   * 今はコンソールに正解・不正解を表示するだけです。
   */
  const handleAnswer = useCallback(async (_isCorrect: boolean) => {
    console.log(`答えました: ${_isCorrect ? "正解！" : "残念！"}`);
  }, []);

  // 外で使えるように、これらの機能をセットにして返します
  return { startSession, goToNextWord, handleAnswer };
}

