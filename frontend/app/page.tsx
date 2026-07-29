"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, ServerCrash } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { TopBanner } from "@/components/welcome/TopBanner";
import { WelcomeHeader } from "@/components/welcome/WelcomeHeader";
import { HeroSection } from "@/components/welcome/HeroSection";
import { FeaturesSection } from "@/components/welcome/FeaturesSection";
import { TechStackBanner } from "@/components/welcome/TechStackBanner";
import { Footer } from "@/components/layout/Footer";
import { checkBackendHealth, getCurrentUser } from "@/api";
import { CurrentUserResponse } from "@/types";

export default function WelcomePage() {
  const [user, setUser] = useState<CurrentUserResponse | null>(null);
  const [isBackendReady, setIsBackendReady] = useState(false);
  const [showBackendDialog, setShowBackendDialog] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const router = useRouter();

  useEffect(() => {
    let isMounted = true;
    let retryTimeout: ReturnType<typeof setTimeout> | null = null;

    // Show dialog only if server takes longer than 1s to respond (prevents popup flash)
    const dialogTimer = setTimeout(() => {
      if (isMounted && !isBackendReady) {
        setShowBackendDialog(true);
      }
    }, 1000);

    const pollBackendHealth = async () => {
      try {
        const isHealthy = await checkBackendHealth();

        if (!isMounted) return;

        if (isHealthy) {
          setIsBackendReady(true);
          setShowBackendDialog(false);
          clearTimeout(dialogTimer);
          return;
        }
      } catch {
        // Silent catch: server is spinning up or unreachable
      }

      if (isMounted) {
        retryTimeout = setTimeout(pollBackendHealth, 3000);
      }
    };

    pollBackendHealth();

    return () => {
      isMounted = false;
      clearTimeout(dialogTimer);
      if (retryTimeout) clearTimeout(retryTimeout);
    };
  }, []);

  // Timer for elapsed seconds display when dialog is active
  useEffect(() => {
    if (!showBackendDialog || isBackendReady) return;

    const interval = setInterval(() => {
      setElapsedSeconds((seconds) => seconds + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isBackendReady, showBackendDialog]);

  // Fetch active session once backend is healthy
  useEffect(() => {
    if (!isBackendReady) return;

    const fetchUser = async () => {
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
      } catch {
        setUser(null);
      }
    };

    fetchUser();
  }, [isBackendReady, router]);

  return (
    <div className="flex flex-col min-h-screen">
      <Dialog open={showBackendDialog && !isBackendReady}>
        <DialogContent className="max-w-md [&>button]:hidden">
          <div className="flex items-start gap-4">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-base border-2 border-border bg-main text-main-foreground shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <ServerCrash className="size-6" />
            </div>
            <div className="space-y-3 flex-1">
              <DialogHeader>
                <DialogTitle className="text-left font-heading uppercase text-lg">
                  Starting Backend
                </DialogTitle>
                <DialogDescription className="text-left leading-relaxed text-sm">
                  The Render backend may be waking up from sleep. We’re checking
                  <span className="font-heading text-foreground"> /health </span>
                  and this dialog will close automatically once the API is ready.
                </DialogDescription>
              </DialogHeader>

              <div className="flex items-center gap-2 rounded-base border-2 border-border bg-secondary-background px-3 py-2">
                <Loader2 className="size-4 animate-spin text-main shrink-0" />
                <span className="font-heading text-xs uppercase">
                  Waiting for server response... {elapsedSeconds}s
                </span>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <TopBanner />
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
