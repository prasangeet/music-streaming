"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AppSidebar } from "@/components/layout/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { ThemeToggle } from "@/components/theme-toggle";
import { Loader2 } from "lucide-react";
import { CurrentUserResponse, ApiError } from "@/types";
import { getCurrentUser } from "@/api";
import { removeToken } from "@/lib/auth";
import { toast } from "sonner";
import { AxiosError } from "axios";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [user, setUser] = useState<CurrentUserResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
      } catch (error: unknown) {
        const err = error as AxiosError<ApiError>;
        if (err.response?.status === 401 || err.response?.status === 403) {
          removeToken();
          toast.error("Your session has expired. Please login again.");
          router.replace("/login");
          return;
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [router]);

  const handleLogout = () => {
    removeToken();
    setUser(null);
    toast.success("Logged out successfully");
    router.replace("/login");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-main" />
      </div>
    );
  }

  return (
    <SidebarProvider defaultOpen={true}>
      <AppSidebar user={user} onLogout={handleLogout} />
      <SidebarInset className="min-h-screen flex flex-col bg-background">
        {/* Sticky Top Navbar */}
        <header className="sticky top-0 z-40 flex items-center justify-between gap-4 px-6 py-3 w-full bg-background/95 backdrop-blur">
          <div className="flex items-center gap-3">
            <SidebarTrigger className="-ml-1 border-2 border-border" />
            <div className="h-4 w-[2px] bg-border hidden sm:block" />

            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbPage className="font-heading uppercase text-xs">
                    Dashboard
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>

          <ThemeToggle />
        </header>

        {/* Page Content */}
        <main className="flex-1 px-6 py-6 w-full space-y-6">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
