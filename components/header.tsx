"use client";

import { ThemeToggle } from "@/components/theme-toggle";
import { FileText } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <FileText className="h-6 w-6 text-primary" />
          <span className="font-semibold text-foreground">
            广西现代物流集团有限公司公文智能起草助手
          </span>
        </div>
        <ThemeToggle />
      </div>
    </header>
  );
}
