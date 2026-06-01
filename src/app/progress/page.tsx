"use client";

import { useEffect, useMemo } from "react";
import { useFeatureStore } from "@/lib/store";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ProgressChart } from "@/components/features/progress-chart";
import { SOURCE_CONFIG } from "@/lib/utils";

export default function ProgressPage() {
  const { features, loadFeatures, currentSource } = useFeatureStore();
  const sourceConfig = SOURCE_CONFIG[currentSource];

  useEffect(() => {
    loadFeatures();
  }, [loadFeatures]);

  const sourceFeatures = useMemo(
    () => features.filter(f => f.source === currentSource),
    [features, currentSource]
  );

  const stats = useMemo(() => {
    const total = sourceFeatures.length;
    const learned = sourceFeatures.filter(f => f.isLearned).length;
    const byCategory = sourceFeatures.reduce((acc, f) => {
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
  }, [sourceFeatures]);

  return (
    <div className="container mx-auto max-w-6xl p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          {sourceConfig.icon} 進捗状況
        </h1>
        <p className="text-muted-foreground">
          {sourceConfig.label} の学習進捗と達成状況を確認
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3 mb-8">
        <Card>
          <CardHeader>
            <CardDescription>総機能数</CardDescription>
            <CardTitle className="text-3xl">{stats.total}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {sourceConfig.label} の学習対象機能
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardDescription>学習済み</CardDescription>
            <CardTitle className="text-3xl">{stats.learned}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              マスターした機能数
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardDescription>進捗率</CardDescription>
            <CardTitle className="text-3xl">{stats.percentage}%</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              全体の達成率
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>学習進捗グラフ</CardTitle>
            <CardDescription>機能の学習状況を時系列で表示</CardDescription>
          </CardHeader>
          <CardContent>
            <ProgressChart features={sourceFeatures} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
