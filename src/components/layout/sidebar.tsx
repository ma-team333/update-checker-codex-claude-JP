"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Sparkles,
  Clock,
  BarChart3,
} from "lucide-react";
import { cn, SOURCE_CONFIG } from "@/lib/utils";
import { useFeatureStore } from "@/lib/store";
import type { FeatureSource } from "@/types";

const navItems = [
  { href: "/", label: "ダッシュボード", icon: LayoutDashboard },
  { href: "/features", label: "機能一覧", icon: Sparkles },
  { href: "/history", label: "履歴", icon: Clock },
  { href: "/progress", label: "進捗", icon: BarChart3 },
];

const sources: { value: FeatureSource; label: string; icon: string; color: string }[] = [
  { value: "codex", label: "Codex CLI", icon: "🟢", color: "border-green-500 bg-green-500/10 text-green-700 dark:text-green-400" },
  { value: "claude-code", label: "Claude Code", icon: "🟣", color: "border-purple-500 bg-purple-500/10 text-purple-700 dark:text-purple-400" },
];

export function Sidebar() {
  const pathname = usePathname();
  const { currentSource, setSource } = useFeatureStore();

  return (
    <aside className="flex h-screen w-64 flex-col border-r bg-background">
      <div className="flex h-14 items-center border-b px-6">
        <h1 className="text-lg font-semibold">📋 更新チェッカー</h1>
      </div>

      {/* Source Switcher */}
      <div className="px-3 pt-4 pb-2">
        <p className="text-xs font-medium text-muted-foreground mb-2 px-2">ツール切替</p>
        <div className="flex flex-col gap-1">
          {sources.map((s) => (
            <button
              key={s.value}
              onClick={() => setSource(s.value)}
              className={cn(
                "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-all duration-150 border",
                currentSource === s.value
                  ? cn(s.color, "border-current")
                  : "border-transparent text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground"
              )}
            >
              <span className="text-base">{s.icon}</span>
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <div className="px-3 py-2">
        <div className="h-px bg-border" />
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-3">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-all duration-150",
                isActive
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground"
              )}
            >
              <Icon className="size-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t p-3">
        <p className="text-xs text-muted-foreground px-2">
          {SOURCE_CONFIG[currentSource].icon} {SOURCE_CONFIG[currentSource].label}
        </p>
      </div>
    </aside>
  );
}
