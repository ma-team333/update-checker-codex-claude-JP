"use client";

import type { LearningSession } from "@/types";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface LearningHistoryProps {
  sessions: LearningSession[];
}

export function LearningHistory({ sessions }: LearningHistoryProps) {
  if (sessions.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">学習履歴がまだありません。機能の探索を始めましょう！</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {sessions.map((session) => (
        <Card key={session.id}>
          <CardHeader>
            <CardTitle className="text-lg">機能 ID: {session.featureId}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>開始: {format(new Date(session.startedAt), "PPP")}</span>
              {session.completedAt && (
                <span>完了: {format(new Date(session.completedAt), "PPP")}</span>
              )}
            </div>
            {session.notes && (
              <p className="mt-2 text-sm">{session.notes}</p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
