"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { TopBanner } from "@/components/welcome/TopBanner";
import { WelcomeHeader } from "@/components/welcome/WelcomeHeader";
import { HeroSection } from "@/components/welcome/HeroSection";
import { FeaturesSection } from "@/components/welcome/FeaturesSection";
import { TechStackBanner } from "@/components/welcome/TechStackBanner";
import { Footer } from "@/components/layout/Footer";
import { getCurrentUser } from "@/api";
import { CurrentUserResponse } from "@/types";

export default function WelcomePage() {
  const [user, setUser] = useState<CurrentUserResponse | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
      } catch {
        setUser(null);
      }
    };

    fetchUser();
  }, [router]);

  return (
    <div className="flex flex-col min-h-screen">
      <TopBanner />
      {/* Pass user prop into WelcomeHeader */}
      <WelcomeHeader user={user} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-6 space-y-16 py-8">
        <HeroSection user={user} />
        <FeaturesSection />
        <TechStackBanner />
      </main>

      <Footer />
    </div>
  );
}
