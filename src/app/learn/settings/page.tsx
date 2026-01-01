"use client";

import { useState } from "react";
import { LearnSettingsView } from "@/components/learn/LearnSettingsView";
import { useAppNavigation } from "@/hooks/useAppNavigation";
import { LearnSettingsNavigation } from "@/components/navigation/LearnSettingsNavigation";

export default function LearnSettingsPage() {
  const { setView } = useAppNavigation();
  const [questionCount, setQuestionCount] = useState(10);

  const beginLearning = (count: number) => {
    setView("learn", { count });
  };

  return (
    <div className="min-h-screen bg-background">
      <LearnSettingsNavigation
        view="learn-settings"
        onBack={() => setView("home")}
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
