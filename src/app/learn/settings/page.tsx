"use client";

import { LearnSettingsView } from "@/components/learn/LearnSettingsView";
import { useAppNavigation } from "@/hooks/useAppNavigation";
import { LearnSettingsNavigation } from "@/components/navigation/LearnSettingsNavigation";

export default function LearnSettingsPage() {
  const { setView } = useAppNavigation();

  return (
    <div className="min-h-screen bg-background">
      <LearnSettingsNavigation
        view="learn-settings"
        onBack={() => setView("home")}
      />
      <LearnSettingsView />
    </div>
  );
}
