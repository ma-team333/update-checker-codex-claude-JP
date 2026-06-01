'use client';

import { useParams, useRouter } from 'next/navigation';
import { useFeatureStore } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Check, ExternalLink, Calendar, Tag, Clock } from 'lucide-react';
import { CATEGORY_CONFIG, SOURCE_CONFIG } from '@/lib/utils';

export default function FeatureDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { features, markAsLearned, unmarkAsLearned } = useFeatureStore();

  const feature = features.find(f => f.id === params.id);

  if (!feature) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">機能が見つかりません</h1>
          <Button onClick={() => router.push('/features')} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            機能一覧に戻る
          </Button>
        </div>
      </div>
    );
  }

  const categoryConfig = CATEGORY_CONFIG[feature.category] || CATEGORY_CONFIG.other;
  const sourceConfig = SOURCE_CONFIG[feature.source];

  const handleToggleLearned = async () => {
    if (feature.isLearned) {
      await unmarkAsLearned(feature.id);
    } else {
      await markAsLearned(feature.id);
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Back button */}
      <Button
        onClick={() => router.push('/features')}
        variant="ghost"
        className="mb-6 text-muted-foreground"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        機能一覧に戻る
      </Button>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-sm font-medium">{sourceConfig.icon} {sourceConfig.label}</span>
          <Badge className={`text-sm text-white ${categoryConfig.color}`}>
            {categoryConfig.label}
          </Badge>
          <Badge variant="outline" className="text-sm">
            v{feature.version}
          </Badge>
          {feature.isLearned && (
            <Badge className="text-sm bg-green-500/10 text-green-500 border-green-500/20">
              <Check className="w-3 h-3 mr-1" />
              学習済み
            </Badge>
          )}
        </div>

        <h1 className="text-3xl font-bold mb-2">{feature.name}</h1>

        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            リリース: {formatDate(feature.releaseDate)}
          </div>
          <div className="flex items-center gap-1">
            <Tag className="w-4 h-4" />
            {categoryConfig.label}
          </div>
        </div>
      </div>

      {/* Description */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>説明</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground whitespace-pre-wrap">
            {feature.description || '説明はありません。'}
          </p>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex gap-4">
        <Button
          onClick={handleToggleLearned}
          className={feature.isLearned ? 'bg-orange-500 hover:bg-orange-600' : 'bg-green-500 hover:bg-green-600'}
        >
          {feature.isLearned ? (
            <>
              <Check className="w-4 h-4 mr-2" />
              未学習に戻す
            </>
          ) : (
            <>
              <Check className="w-4 h-4 mr-2" />
              学習済みにする
            </>
          )}
        </Button>

        {feature.changelogUrl && (
          <Button variant="outline" asChild>
            <a href={feature.changelogUrl} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="w-4 h-4 mr-2" />
              Changelog で見る
            </a>
          </Button>
        )}
      </div>

      {/* Learning status */}
      {feature.isLearned && feature.learnedAt && (
        <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
          <div className="flex items-center gap-2 text-green-700 dark:text-green-400">
            <Clock className="w-4 h-4" />
            <span className="text-sm">
              学習完了: {formatDate(feature.learnedAt)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
