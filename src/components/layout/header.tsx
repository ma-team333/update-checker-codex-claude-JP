"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/theme-toggle";

interface HeaderProps {
  title?: string;
}

export function Header({ title }: HeaderProps) {
  const pathname = usePathname();

  const getPageTitle = (): string => {
    if (title) return title;
    switch (pathname) {
      case "/":
        return "Dashboard";
      case "/projects":
        return "Projects";
      case "/timeline":
        return "Timeline";
      case "/reports":
        return "Reports";
      default:
        return pathname.split("/").pop()?.replace("-", " ") || "Page";
    }
  };

  return (
    <header className="flex h-14 items-center justify-between border-b bg-background px-6">
      <h2 className="text-lg font-semibold capitalize">{getPageTitle()}</h2>
      <ThemeToggle />
    </header>
  );
}
