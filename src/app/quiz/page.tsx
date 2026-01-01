"use client";

import { QuizMenuView } from "@/components/home/QuizMenuView";
import { Navigation } from "@/components/home/Navigation";
import { QUIZ_MODES } from "@/constants/navigation";
import { useWords } from "@/hooks/useWords";
import { useLearningSession } from "@/hooks/useLearningSession";
import { useAppNavigation } from "@/hooks/useAppNavigation";

export default function QuizMenuPage() {
  const { setView } = useAppNavigation();
  const { words } = useWords();
  const { sessionWords, currentIndex } = useLearningSession(words);

  return (
    <div className="min-h-screen bg-background">
      <Navigation
        view="quiz-menu"
        startLearning={() => setView("learn-settings")}
        currentIndex={currentIndex}
        totalWords={sessionWords.length}
      />
      <QuizMenuView
        quizModes={QUIZ_MODES}
        start4ChoiceQuiz={() => setView("quiz-4-choice")}
        startListeningQuiz={() => setView("quiz-listening")}
        startSpellingQuiz={() => setView("quiz-spelling")}
        startImageChoiceQuiz={() => setView("quiz-image-choice")}
        startLearning={() => setView("learn-settings")}
      />
    </div>
  );
}
