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
import type { FeatureCategory } from '@/types';
import { compareVersions } from '@/lib/utils';

export default function DashboardPage() {
  const { features, isLoading, lastFetched, loadFeatures, refreshFromChangelog, markAsLearned } = useFeatureStore();
  const [selectedCategory, setSelectedCategory] = useState<FeatureCategory | 'all'>('all');

  useEffect(() => {
    loadFeatures();
  }, [loadFeatures]);

  // Filter features by selected category
  const filteredFeatures = selectedCategory === 'all'
    ? features
    : features.filter(f => f.category === selectedCategory);

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

  // Recently added features (by version descending, max 5)
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

    if (d.toDateString() === today.toDateString()) return 'Today';
    if (d.toDateString() === yesterday.toDateString()) return 'Yesterday';
    return d.toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black font-sans">
      <main className="max-w-4xl mx-auto py-12 px-4 sm:px-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
            Claude Code Feature Learner
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400 mt-1">
            Learn new Claude Code features as they&apos;re released
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-4 mb-6">
          <Card className="border-zinc-200 dark:border-zinc-800">
            <CardContent className="pt-6">
              <p className="text-sm text-zinc-600 dark:text-zinc-400">Total Features</p>
              <p className="text-3xl font-bold text-zinc-900 dark:text-zinc-50 tabular-nums">
                {totalCount}
              </p>
            </CardContent>
          </Card>
          <Card className="border-zinc-200 dark:border-zinc-800">
            <CardContent className="pt-6">
              <p className="text-sm text-zinc-600 dark:text-zinc-400">Learned</p>
              <p className="text-3xl font-bold text-green-500 tabular-nums">{learnedCount}</p>
            </CardContent>
          </Card>
          <Card className="border-zinc-200 dark:border-zinc-800">
            <CardContent className="pt-6">
              <p className="text-sm text-zinc-600 dark:text-zinc-400">To Learn</p>
              <p className="text-3xl font-bold text-orange-500 tabular-nums">{unlearnedCount}</p>
            </CardContent>
          </Card>
          <Card className="border-zinc-200 dark:border-zinc-800">
            <CardContent className="pt-6">
              <p className="text-sm text-zinc-600 dark:text-zinc-400">Progress</p>
              <p className="text-3xl font-bold text-zinc-900 dark:text-zinc-50 tabular-nums">
                {progressPercent.toFixed(0)}%
              </p>
              <Progress value={progressPercent} className="mt-2" />
            </CardContent>
          </Card>
        </div>

        {/* Category Filter */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-2">Filter by Category</h3>
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
            {isLoading ? 'Loading...' : 'Refresh from Changelog'}
          </Button>
          {lastFetched && (
            <p className="text-sm text-zinc-500 dark:text-zinc-500">
              Last updated: {lastFetched.toLocaleString()}
            </p>
          )}
        </div>

        {/* New Features Section */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              New Features to Learn
            </h2>
            {unlearnedFeatures.length >= 5 && (
              <Link href="/features">
                <Button variant="link" className="text-sm">
                  View All →
                </Button>
              </Link>
            )}
          </div>
          {unlearnedFeatures.length === 0 ? (
            <Card className="border-zinc-200 dark:border-zinc-800">
              <CardContent className="py-12 text-center">
                <p className="text-zinc-500 dark:text-zinc-400">
                  {totalCount === 0
                    ? 'No features yet. Click "Refresh from Changelog" to get started.'
                    : 'You&apos;ve learned all features! 🎉'}
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
              <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-500" />
                Recently Added
              </h2>
              <Link href="/features">
                <Button variant="link" className="text-sm">
                  View All →
                </Button>
              </Link>
            </div>
            <Card className="border-zinc-200 dark:border-zinc-800">
              <CardContent className="pt-6">
                <div className="space-y-3">
                  {recentlyAdded.map((feature) => (
                    <div
                      key={feature.id}
                      className="flex items-center justify-between pb-3 border-b border-zinc-200 dark:border-zinc-800 last:border-0 last:pb-0"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50 truncate">
                          {feature.name}
                        </p>
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
                          Learned
                        </Badge>
                      ) : (
                        <Badge className="text-xs bg-orange-500/10 text-orange-500 border-orange-500/20">
                          New
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
              <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Recently Learned
              </h2>
              {learnedCount >= 5 && (
                <Link href="/features?filter=learned">
                  <Button variant="link" className="text-sm">
                    View All →
                  </Button>
                </Link>
              )}
            </div>
            <Card className="border-zinc-200 dark:border-zinc-800">
              <CardContent className="pt-6">
                <div className="space-y-3">
                  {recentlyLearned.map((feature) => (
                    <div
                      key={feature.id}
                      className="flex items-center justify-between pb-3 border-b border-zinc-200 dark:border-zinc-800 last:border-0 last:pb-0"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50 truncate">
                          {feature.name}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge className="text-xs bg-zinc-500/10 text-zinc-500 border-zinc-500/20">
                            {feature.category}
                          </Badge>
                          {feature.learnedAt && (
                            <p className="text-xs text-zinc-500">
                              {formatDate(feature.learnedAt)}
                            </p>
                          )}
                        </div>
                      </div>
                      <Badge className="text-xs bg-green-500/10 text-green-500 border-green-500/20">
                        Learned
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </section>
        )}
      </main>
    </div>
  );
}
