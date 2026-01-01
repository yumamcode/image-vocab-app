"use client";

import { useState } from "react";
import { LearnSettingsView } from "@/components/home/LearnSettingsView";
import { LearnNavigation } from "@/components/home/navigation/LearnNavigation";
import { useWords } from "@/hooks/useWords";
import { useLearningSession } from "@/hooks/useLearningSession";
import { useAppNavigation } from "@/hooks/useAppNavigation";

export default function LearnSettingsPage() {
  const { setView } = useAppNavigation();
  const [questionCount, setQuestionCount] = useState(10);
  const { words } = useWords();
  const { sessionWords, currentIndex } = useLearningSession(words);

  const beginLearning = (count: number) => {
    setView("learn", { count });
  };

  return (
    <div className="min-h-screen bg-background">
      <LearnNavigation
        view="learn-settings"
        onBack={() => setView("home")}
        currentIndex={currentIndex}
        totalWords={sessionWords.length}
      />
      <LearnSettingsView
        questionCount={questionCount}
        setQuestionCount={setQuestionCount}
        beginLearning={beginLearning}
        setView={setView}
      />
    </div>
  );
}
