"use client";

import { useEffect, useMemo } from "react";
import { useFeatureStore } from "@/lib/store";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ProgressChart } from "@/components/features/progress-chart";

export default function ProgressPage() {
  const { features, loadFeatures } = useFeatureStore();

  useEffect(() => {
    loadFeatures();
  }, [loadFeatures]);

  // Calculate progress statistics
  const stats = useMemo(() => {
    const total = features.length;
    const learned = features.filter(f => f.isLearned).length;
    const byCategory = features.reduce((acc, f) => {
      acc[f.category] = (acc[f.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      total,
      learned,
      unlearned: total - learned,
      percentage: total > 0 ? Math.round((learned / total) * 100) : 0,
      byCategory,
    };
  }, [features]);

  return (
    <div className="container mx-auto max-w-6xl p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Progress</h1>
        <p className="text-muted-foreground">Track your learning progress and achievements</p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3 mb-8">
        <Card>
          <CardHeader>
            <CardDescription>Total Features</CardDescription>
            <CardTitle className="text-3xl">{stats.total}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Claude Code features to learn
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardDescription>Learned</CardDescription>
            <CardTitle className="text-3xl">{stats.learned}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Features you have mastered
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardDescription>Progress</CardDescription>
            <CardTitle className="text-3xl">{stats.percentage}%</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Overall completion rate
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Learning Progress</CardTitle>
            <CardDescription>Features learned over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ProgressChart features={features} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
