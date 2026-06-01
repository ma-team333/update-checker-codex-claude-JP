"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/theme-toggle";
import { useFeatureStore } from "@/lib/store";
import { SOURCE_CONFIG } from "@/lib/utils";

const PAGE_TITLES: Record<string, string> = {
  "/": "ダッシュボード",
  "/features": "機能一覧",
  "/history": "学習履歴",
  "/progress": "進捗状況",
};

export function Header() {
  const pathname = usePathname();
  const { currentSource } = useFeatureStore();
  const sourceConfig = SOURCE_CONFIG[currentSource];

  const pageTitle = PAGE_TITLES[pathname] || pathname.split("/").pop()?.replace("-", " ") || "ページ";

  return (
    <header className="flex h-14 items-center justify-between border-b bg-background px-6">
      <div className="flex items-center gap-3">
        <h2 className="text-lg font-semibold">{pageTitle}</h2>
        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${sourceConfig.color}`}>
          {sourceConfig.icon} {sourceConfig.label}
        </span>
      </div>
      <ThemeToggle />
    </header>
  );
}
