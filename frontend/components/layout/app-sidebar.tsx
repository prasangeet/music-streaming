"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Search,
  Library,
  BarChart3,
  Disc3,
  LogOut,
  ChevronsUpDown,
} from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import { CurrentUserResponse } from "@/types";

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  user: CurrentUserResponse | null;
  onLogout?: () => void;
}

const navItems = [
  {
    title: "Overview",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Explore Catalog",
    url: "/dashboard/explore",
    icon: Search,
  },
  {
    title: "Saved Library",
    url: "/dashboard/saved",
    icon: Library,
  },
  {
    title: "Analytics",
    url: "/dashboard/analytics",
    icon: BarChart3,
  },
];

export function AppSidebar({ user, onLogout, ...props }: AppSidebarProps) {
  const pathname = usePathname();
  const { isMobile } = useSidebar();

  const userInitial = user?.username ? user.username[0].toUpperCase() : "U";

  return (
    <Sidebar collapsible="icon" className="border-r-2 border-border" {...props}>
      {/* Header / Brand Logo */}
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/dashboard">
                <div className="flex aspect-square size-8 items-center justify-center rounded-base bg-main text-main-foreground border-2 border-border shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] shrink-0">
                  <Disc3 className="size-4 animate-spin-slow" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-heading text-base uppercase">
                    TrackIQ
                  </span>
                  <span className="truncate text-xs font-base text-muted-foreground">
                    Music Vault
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* Main Content / Navigation */}
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="font-heading uppercase text-xs">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const isActive =
                  item.url === "/dashboard"
                    ? pathname === "/dashboard"
                    : pathname.startsWith(item.url);

                return (
                  <SidebarMenuItem
                    key={item.title}
                    className="*:data-[slot=tooltip-trigger]:w-full"
                  >
                    <SidebarMenuButton
                      asChild
                      tooltip={item.title}
                      className={`w-full justify-start font-heading uppercase text-sm transition-all border-2 ${
                        isActive
                          ? "bg-main text-main-foreground border-border shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                          : "border-transparent hover:bg-main/20"
                      }`}
                    >
                      <Link href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer / User Profile Dropdown */}
      <SidebarFooter className="border-t border-border p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground group-data-[collapsible=icon]:p-0"
                >
                  <Avatar className="h-8 w-8 rounded-full border border-border shrink-0">
                    <AvatarFallback className="bg-secondary-background font-heading text-xs uppercase">
                      {userInitial}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-xs leading-tight group-data-[collapsible=icon]:hidden">
                    <span className="truncate font-heading">
                      {user?.username ?? "User"}
                    </span>
                    <span className="truncate text-muted-foreground">
                      {user?.email ?? ""}
                    </span>
                  </div>
                  <ChevronsUpDown className="ml-auto size-4 group-data-[collapsible=icon]:hidden shrink-0" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-base"
                side={isMobile ? "bottom" : "right"}
                align="end"
                sideOffset={4}
              >
                <DropdownMenuLabel className="p-0 font-normal">
                  <div className="flex items-center gap-2 px-2 py-1.5 text-left text-sm">
                    <Avatar className="h-8 w-8 border border-border shrink-0">
                      <AvatarFallback className="bg-secondary-background font-heading text-xs uppercase">
                        {userInitial}
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-xs leading-tight">
                      <span className="truncate font-heading">
                        {user?.username ?? "User"}
                      </span>
                      <span className="truncate text-muted-foreground">
                        {user?.email ?? ""}
                      </span>
                    </div>
                  </div>
                </DropdownMenuLabel>
                {onLogout && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={onLogout}
                      className="gap-2 text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer"
                    >
                      <LogOut className="size-4 shrink-0" />
                      Log out
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
