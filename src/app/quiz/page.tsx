"use client";

import { useRouter } from "next/navigation";
import { QuizMenuView } from "@/components/home/QuizMenuView";
import { Navigation } from "@/components/home/Navigation";
import { QUIZ_MODES } from "@/constants/navigation";
import { useWords } from "@/hooks/useWords";
import { useLearningSession } from "@/hooks/useLearningSession";

export default function QuizMenuPage() {
  const router = useRouter();
  const { words } = useWords();
  const { sessionWords, currentIndex } = useLearningSession(words);

  return (
    <div className="min-h-screen bg-background">
      <Navigation
        view="quiz-menu"
        startLearning={() => router.push("/learn/settings")}
        currentIndex={currentIndex}
        totalWords={sessionWords.length}
      />
      <QuizMenuView
        quizModes={QUIZ_MODES}
        start4ChoiceQuiz={() => router.push("/quiz/4-choice")}
        startListeningQuiz={() => router.push("/quiz/listening")}
        startSpellingQuiz={() => router.push("/quiz/spelling")}
        startImageChoiceQuiz={() => router.push("/quiz/image-choice")}
        startLearning={() => router.push("/learn/settings")}
      />
    </div>
  );
}

