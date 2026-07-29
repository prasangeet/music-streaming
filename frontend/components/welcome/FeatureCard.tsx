import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface FeatureCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  iconBgClass: string;
}

export function FeatureCard({ title, description, icon: Icon, iconBgClass }: FeatureCardProps) {
  return (
    <Card className="hover:-translate-y-1 transition-transform">
      <CardHeader>
        <div className={`${iconBgClass} w-12 h-12 rounded-md border border-border flex items-center justify-center mb-2`}>
          <Icon className="w-6 h-6" />
        </div>
        <CardTitle className="font-heading uppercase">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className="font-base text-foreground/80">
          {description}
        </CardDescription>
      </CardContent>
    </Card>
  );
}
