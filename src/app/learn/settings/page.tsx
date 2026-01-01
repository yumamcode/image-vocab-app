"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LearnSettingsView } from "@/components/home/LearnSettingsView";
import { Navigation } from "@/components/home/Navigation";
import { useWords } from "@/hooks/useWords";
import { useLearningSession } from "@/hooks/useLearningSession";

export default function LearnSettingsPage() {
  const router = useRouter();
  const [questionCount, setQuestionCount] = useState(10);
  const { words } = useWords();
  const { sessionWords, currentIndex } = useLearningSession(words);

  const beginLearning = (count: number) => {
    router.push(`/learn?count=${count}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation
        view="learn-settings"
        startLearning={() => router.push("/learn/settings")}
        currentIndex={currentIndex}
        totalWords={sessionWords.length}
      />
      <LearnSettingsView
        questionCount={questionCount}
        setQuestionCount={setQuestionCount}
        beginLearning={beginLearning}
        setView={(v) => {
          if (v === "home") router.push("/");
          else if (v === "quiz-menu") router.push("/quiz");
          else if (v === "learn-settings") router.push("/learn/settings");
          else router.push(`/${v}`);
        }}
      />
    </div>
  );
}

