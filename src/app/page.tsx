"use client";
// アプリケーションのトップページコンポーネント
import { HomeNavigation } from "@/components/navigation/HomeNavigation";
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
      <HomeNavigation startLearning={startLearning} />

      <div className="animate-fade-in">
        <HeroSection startLearning={startLearning} />
        <FeaturesSection features={FEATURES} setView={setView} />
      </div>
    </div>
  );
}
