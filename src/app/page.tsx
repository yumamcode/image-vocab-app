"use client";
// アプリケーションのトップページコンポーネント
import { Navigation } from "@/components/home/Navigation";
import { HeroSection } from "@/components/home/HeroSection";
import { FeaturesSection } from "@/components/home/FeaturesSection";
import { FEATURES } from "@/constants/navigation";
import { useAppNavigation } from "@/hooks/useAppNavigation";

export default function Home() {
  const { setView } = useAppNavigation();

  const startLearning = () => {
    setView("learn-settings");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation view="home" startLearning={startLearning} />

      <div className="animate-fade-in">
        <HeroSection startLearning={startLearning} />
        <FeaturesSection features={FEATURES} setView={setView} />
      </div>
    </div>
  );
}
