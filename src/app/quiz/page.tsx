"use client";

import { QuizMenuView } from "@/components/home/QuizMenuView";
import { QuizNavigation } from "@/components/home/navigation/QuizNavigation";
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
      <QuizNavigation
        view="quiz-menu"
        onBack={() => setView("home")}
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
