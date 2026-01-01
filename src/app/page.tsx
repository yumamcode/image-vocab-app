"use client";
// アプリケーションのトップページコンポーネント
import { useRouter } from "next/navigation";
import { Navigation } from "@/components/home/Navigation";
import { HeroSection, FeaturesSection } from "@/components/home/HomeView";
import { FEATURES } from "@/constants/navigation";

export default function Home() {
  const router = useRouter();

  const startLearning = () => {
    router.push("/learn/settings");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation view="home" startLearning={startLearning} />

      <div className="animate-fade-in">
        <HeroSection startLearning={startLearning} />
        <FeaturesSection
          features={FEATURES}
          setView={(v) => {
            if (v === "home") router.push("/");
            else if (v === "quiz-menu") router.push("/quiz");
            else if (v === "learn-settings") router.push("/learn/settings");
            else router.push(`/${v}`);
          }}
          startLearning={startLearning}
        />
      </div>
    </div>
  );
}
