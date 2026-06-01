'use client';

import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { useFeatureStore } from '@/lib/store';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { FeatureCard } from '@/components/features/feature-card';
import { CategoryFilter } from '@/components/features/category-filter';
import { RefreshCw, BookOpen, TrendingUp, Sparkles } from 'lucide-react';
import { SOURCE_CONFIG } from '@/lib/utils';
import type { FeatureCategory } from '@/types';
import { compareVersions } from '@/lib/utils';

export default function DashboardPage() {
  const { features, isLoading, lastFetched, loadFeatures, refreshFromChangelog, markAsLearned, currentSource } = useFeatureStore();
  const [selectedCategory, setSelectedCategory] = useState<FeatureCategory | 'all'>('all');

  const sourceConfig = SOURCE_CONFIG[currentSource];

  useEffect(() => {
    loadFeatures();
  }, [loadFeatures]);

  // Filter by source and category
  const sourceFeatures = useMemo(() => features.filter(f => f.source === currentSource), [features, currentSource]);

  const filteredFeatures = selectedCategory === 'all'
    ? sourceFeatures
    : sourceFeatures.filter(f => f.category === selectedCategory);

  const learnedCount = filteredFeatures.filter((f) => f.isLearned).length;
  const unlearnedCount = filteredFeatures.length - learnedCount;
  const totalCount = filteredFeatures.length;
  const progressPercent = totalCount > 0 ? (learnedCount / totalCount) * 100 : 0;

  const unlearnedFeatures = useMemo(
    () => filteredFeatures
      .filter((f) => !f.isLearned)
      .sort((a, b) => compareVersions(a.version, b.version))
      .slice(0, 5),
    [filteredFeatures]
  );

  const recentlyLearned = filteredFeatures
    .filter((f) => f.isLearned && f.learnedAt)
    .sort((a, b) => new Date(b.learnedAt!).getTime() - new Date(a.learnedAt!).getTime())
    .slice(0, 5);

  const recentlyAdded = useMemo(
    () => filteredFeatures
      .sort((a, b) => compareVersions(a.version, b.version))
      .slice(0, 5),
    [filteredFeatures]
  );

  const formatDate = (date: Date) => {
    const d = new Date(date);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (d.toDateString() === today.toDateString()) return '今日';
    if (d.toDateString() === yesterday.toDateString()) return '昨日';
    return d.toLocaleDateString('ja-JP');
  };

  return (
    <div className="min-h-screen font-sans">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          {sourceConfig.icon} {sourceConfig.label} 機能ラーナー
        </h1>
        <p className="text-muted-foreground mt-1">
          リリースされる新機能を追跡して学習しましょう
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">総機能数</p>
            <p className="text-3xl font-bold tabular-nums">{totalCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">学習済み</p>
            <p className="text-3xl font-bold text-green-500 tabular-nums">{learnedCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">未学習</p>
            <p className="text-3xl font-bold text-orange-500 tabular-nums">{unlearnedCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">進捗</p>
            <p className="text-3xl font-bold tabular-nums">{progressPercent.toFixed(0)}%</p>
            <Progress value={progressPercent} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* Category Filter */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-muted-foreground mb-2">カテゴリで絞り込み</h3>
        <CategoryFilter selectedCategory={selectedCategory} onCategoryChange={setSelectedCategory} />
      </div>

      {/* Refresh Button */}
      <div className="mb-6 flex items-center justify-between">
        <Button
          onClick={refreshFromChangelog}
          disabled={isLoading}
          variant="outline"
          className="gap-2"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          {isLoading ? '読み込み中...' : `${sourceConfig.changelogLabel}`}
        </Button>
        {lastFetched && (
          <p className="text-sm text-muted-foreground">
            最終更新: {lastFetched.toLocaleString('ja-JP')}
          </p>
        )}
      </div>

      {/* New Features Section */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            学習すべき新機能
          </h2>
          {unlearnedFeatures.length >= 5 && (
            <Link href="/features">
              <Button variant="link" className="text-sm">
                すべて表示 →
              </Button>
            </Link>
          )}
        </div>
        {unlearnedFeatures.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">
                {totalCount === 0
                  ? '機能がまだありません。「Changelog を取得」をクリックしてください。'
                  : 'すべての機能を学習しました！ 🎉'}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {unlearnedFeatures.map((feature) => (
              <FeatureCard
                key={feature.id}
                feature={feature}
                onToggleLearned={markAsLearned}
              />
            ))}
          </div>
        )}
      </section>

      {/* Recently Added Section */}
      {recentlyAdded.length > 0 && (
        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-500" />
              最近追加された機能
            </h2>
            <Link href="/features">
              <Button variant="link" className="text-sm">
                すべて表示 →
              </Button>
            </Link>
          </div>
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-3">
                {recentlyAdded.map((feature) => (
                  <div
                    key={feature.id}
                    className="flex items-center justify-between pb-3 border-b last:border-0 last:pb-0"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{feature.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge className="text-xs bg-zinc-500/10 text-zinc-500 border-zinc-500/20">
                          {feature.category}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          v{feature.version}
                        </Badge>
                      </div>
                    </div>
                    {feature.isLearned ? (
                      <Badge className="text-xs bg-green-500/10 text-green-500 border-green-500/20">
                        学習済み
                      </Badge>
                    ) : (
                      <Badge className="text-xs bg-orange-500/10 text-orange-500 border-orange-500/20">
                        新規
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>
      )}

      {/* Recent Learning Activity */}
      {recentlyLearned.length > 0 && (
        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              最近学習した機能
            </h2>
            {learnedCount >= 5 && (
              <Link href="/features?filter=learned">
                <Button variant="link" className="text-sm">
                  すべて表示 →
                </Button>
              </Link>
            )}
          </div>
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-3">
                {recentlyLearned.map((feature) => (
                  <div
                    key={feature.id}
                    className="flex items-center justify-between pb-3 border-b last:border-0 last:pb-0"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{feature.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge className="text-xs bg-zinc-500/10 text-zinc-500 border-zinc-500/20">
                          {feature.category}
                        </Badge>
                        {feature.learnedAt && (
                          <p className="text-xs text-muted-foreground">
                            {formatDate(feature.learnedAt)}
                          </p>
                        )}
                      </div>
                    </div>
                    <Badge className="text-xs bg-green-500/10 text-green-500 border-green-500/20">
                      学習済み
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>
      )}
    </div>
  );
}
